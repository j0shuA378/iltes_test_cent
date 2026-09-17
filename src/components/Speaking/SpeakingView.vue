<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  Mic, 
  Square, 
  Clock, 
  Sparkles, 
  Award, 
  Volume2
} from 'lucide-vue-next';
import { SPEAKING_TOPICS } from '../../data/speakingTopics';
import { saveSpeakingRecording, getSpeakingRecordings } from '../../services/storage';
import type { SpeakingRecording } from '../../types/ielts';

import QuestionBankSelector from '../Common/QuestionBankSelector.vue';

const props = defineProps<{
  selectedTopicId?: string;
}>();

const emit = defineEmits<{
  (e: 'openSearch'): void;
  (e: 'openSmartRandom'): void;
}>();

const selectedTopicId = ref(props.selectedTopicId || SPEAKING_TOPICS[0].id);

watch(() => props.selectedTopicId, (newId) => {
  if (newId) {
    selectedTopicId.value = newId;
  }
});

watch(selectedTopicId, () => {
  isPrepping.value = false;
  isSpeaking.value = false;
  prepSeconds.value = 60;
  speechSeconds.value = 120;
  audioUrl.value = null;
});

const currentTopic = computed(() => SPEAKING_TOPICS.find(t => t.id === selectedTopicId.value) || SPEAKING_TOPICS[1]);

// Part 2 Prep & Speech Timers
const prepSeconds = ref(60);
const isPrepping = ref(false);
const scratchNotes = ref('');

const speechSeconds = ref(120);
const isSpeaking = ref(false);

// Audio Recording states
const isRecording = ref(false);
const audioUrl = ref<string | null>(null);
const savedRecordings = ref<SpeakingRecording[]>([]);

const mediaRecorderRef = ref<MediaRecorder | null>(null);
const audioChunksRef = ref<Blob[]>([]);

onMounted(() => {
  savedRecordings.value = getSpeakingRecordings();
});

const playNotificationBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch {
    // ignore
  }
};

let prepInterval: any = null;
watch(isPrepping, (val) => {
  if (val) {
    prepInterval = setInterval(() => {
      if (prepSeconds.value <= 1) {
        clearInterval(prepInterval);
        isPrepping.value = false;
        playNotificationBeep();
        prepSeconds.value = 0;
      } else {
        prepSeconds.value--;
      }
    }, 1000);
  } else if (prepInterval) {
    clearInterval(prepInterval);
  }
});

let speechInterval: any = null;
watch(isSpeaking, (val) => {
  if (val) {
    speechInterval = setInterval(() => {
      if (speechSeconds.value <= 1) {
        clearInterval(speechInterval);
        isSpeaking.value = false;
        stopRecording();
        speechSeconds.value = 0;
      } else {
        speechSeconds.value--;
      }
    }, 1000);
  } else if (speechInterval) {
    clearInterval(speechInterval);
  }
});

onUnmounted(() => {
  if (prepInterval) clearInterval(prepInterval);
  if (speechInterval) clearInterval(speechInterval);
});

const startPrep = () => {
  prepSeconds.value = 60;
  isPrepping.value = true;
};

// Start native audio recording
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.value = mediaRecorder;
    audioChunksRef.value = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.value.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.value, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      audioUrl.value = url;

      const newRec: SpeakingRecording = {
        id: `sp_rec_${Date.now()}`,
        topicId: currentTopic.value.id,
        topicTitle: currentTopic.value.title,
        part: currentTopic.value.part,
        createdAt: new Date().toISOString(),
        durationSeconds: 120 - speechSeconds.value,
        audioBlobUrl: url
      };
      saveSpeakingRecording(newRec);
      savedRecordings.value = [newRec, ...savedRecordings.value];

      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    isRecording.value = true;
    isSpeaking.value = true;
    speechSeconds.value = 120;
  } catch {
    alert('请允许浏览器麦克风权限以录制口语答题。');
  }
};

const stopRecording = () => {
  if (mediaRecorderRef.value && mediaRecorderRef.value.state !== 'inactive') {
    mediaRecorderRef.value.stop();
  }
  isRecording.value = false;
  isSpeaking.value = false;
};
</script>

<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-12">
    <!-- Top Question Bank Selector Bar -->
    <div class="bg-white rounded-3xl p-3.5 sm:px-6 sm:py-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <QuestionBankSelector
        module="speaking"
        v-model="selectedTopicId"
        @openSmartRandom="emit('openSmartRandom')"
        @openSearch="emit('openSearch')"
      />
    </div>

    <!-- Header & Topic Switcher (Apple Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-1.5 text-xs text-[#0071e3] font-medium mb-1">
          <Mic class="w-3.5 h-3.5" />
          <span>IELTS Speaking Examination Studio</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
          Part {{ currentTopic.part }}: {{ currentTopic.title }}
        </h1>
        <span class="text-xs text-[#86868b] mt-0.5 inline-block">
          {{ currentTopic.category }} · 真实考官 1 对 1 仿真互动体验
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs px-3 py-1 rounded-full bg-black/[0.04] text-[#1d1d1f] font-medium">
          {{ currentTopic.source || 'Official Speaking Pool' }}
        </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Cue Card / Questions & Preparation -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Part 2 Cue Card Mode -->
        <div v-if="currentTopic.part === 2 && currentTopic.cueCard" class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
          <div class="border-b border-black/[0.04] pb-3 flex items-center justify-between">
            <span class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
              CANDIDATE CUE CARD (考生命题卡)
            </span>
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#1d1d1f]">
              Part 2 独白陈述
            </span>
          </div>

          <div class="space-y-3">
            <h2 class="text-base font-semibold text-[#1d1d1f]">
              {{ currentTopic.cueCard.topic }}
            </h2>
            <p class="text-xs text-[#86868b] italic">
              You should say:
            </p>
            <ul class="space-y-2 pl-5 list-disc text-xs sm:text-sm text-[#1d1d1f] font-normal leading-relaxed">
              <li v-for="(pt, i) in currentTopic.cueCard.points" :key="i">{{ pt }}</li>
            </ul>
          </div>

          <!-- 1-Minute Prep Section -->
          <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.04] space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Clock class="w-3.5 h-3.5 text-[#86868b]" />
                <span class="text-xs font-medium text-[#1d1d1f]">
                  1 分钟备考草稿时间:
                </span>
                <span class="font-mono font-semibold text-xs text-[#1d1d1f] tabular-nums">
                  {{ prepSeconds }} 秒
                </span>
              </div>

              <button
                v-if="!isPrepping && prepSeconds === 60"
                @click="startPrep"
                class="px-3.5 py-1 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium rounded-full shadow-xs transition-all cursor-pointer active:scale-95"
              >
                开始 1 分钟准备
              </button>
              <span v-else :class="['text-xs font-medium', isPrepping ? 'text-[#ff9500] animate-pulse' : 'text-[#86868b]']">
                {{ isPrepping ? '正在计时中...' : '准备时间已结束' }}
              </span>
            </div>

            <textarea
              v-model="scratchNotes"
              placeholder="在此草稿区快速写下 3-4 个答题关键词（如 device name, features, benefit 等）..."
              rows="3"
              class="w-full p-3 text-xs font-mono bg-white border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] text-[#1d1d1f]"
            />
          </div>

          <!-- 2-Minute Speech Recording Bar -->
          <div class="bg-[#1d1d1f] text-white rounded-2xl p-5 space-y-4 shadow-xs">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs text-white/70 font-normal">Part 2 答题录音</span>
                <div class="text-base font-semibold">2 分钟个人陈述</div>
              </div>

              <div class="flex items-center gap-2 font-mono text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full border border-white/10 tabular-nums">
                <Clock class="w-3.5 h-3.5 text-white/70" />
                <span>{{ speechSeconds }}s / 120s</span>
              </div>
            </div>

            <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-full bg-white transition-all duration-1000 rounded-full"
                :style="{ width: `${((120 - speechSeconds) / 120) * 100}%` }"
              />
            </div>

            <div class="flex items-center gap-3 pt-1">
              <button
                v-if="!isRecording"
                @click="startRecording"
                class="px-5 py-2 bg-[#ff3b30] hover:bg-[#ff453a] text-white font-medium text-xs rounded-full shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Mic class="w-3.5 h-3.5" />
                <span>开始录音作答</span>
              </button>
              <button
                v-else
                @click="stopRecording"
                class="px-5 py-2 bg-[#ff3b30] hover:bg-[#ff453a] text-white font-medium text-xs rounded-full shadow-xs flex items-center gap-2 transition-all animate-pulse cursor-pointer"
              >
                <div class="w-3.5 h-3.5 bg-white rounded-xs" />
                <span>停止录音并保存</span>
              </button>

              <div v-if="audioUrl && !isRecording" class="flex-1 flex items-center gap-2 bg-white/10 p-1.5 rounded-full border border-white/10">
                <audio :src="audioUrl" controls class="w-full h-7" />
              </div>
            </div>
          </div>
        </div>

        <!-- Part 1 & Part 3 Questions View -->
        <div v-else-if="(currentTopic.part === 1 || currentTopic.part === 3) && currentTopic.questions" class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div class="border-b border-black/[0.04] pb-2 flex items-center justify-between">
            <span class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
              考官问题列表 (Examiner Questions)
            </span>
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#1d1d1f]">
              Part {{ currentTopic.part }}
            </span>
          </div>

          <div class="space-y-3">
            <div 
              v-for="(q, idx) in currentTopic.questions"
              :key="idx"
              class="p-4 rounded-2xl bg-[#fbfbfd] border border-black/[0.04] flex items-start gap-3"
            >
              <span class="w-6 h-6 rounded-lg bg-[#1d1d1f] text-white font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {{ idx + 1 }}
              </span>
              <p class="text-xs sm:text-sm text-[#1d1d1f] font-normal leading-relaxed">
                {{ q }}
              </p>
            </div>
          </div>

          <!-- Part 1/3 Quick Recorder -->
          <div class="pt-2 flex items-center gap-3">
            <button
              v-if="!isRecording"
              @click="startRecording"
              class="px-5 py-2 bg-[#ff3b30] hover:bg-[#ff453a] text-white font-medium text-xs rounded-full shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Mic class="w-3.5 h-3.5" />
              <span>录制我的作答</span>
            </button>
            <button
              v-else
              @click="stopRecording"
              class="px-5 py-2 bg-[#ff3b30] hover:bg-[#ff453a] text-white font-medium text-xs rounded-full shadow-xs flex items-center gap-1.5 transition-all animate-pulse cursor-pointer"
            >
              <div class="w-3.5 h-3.5 bg-white rounded-xs" />
              <span>结束录音</span>
            </button>

            <div v-if="audioUrl && !isRecording" class="flex-1">
              <audio :src="audioUrl" controls class="w-full h-8" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Band 8+ Sample & Vocabulary Highlights -->
      <div class="lg:col-span-5 space-y-6">
        <!-- Model Answer Showcase -->
        <div class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-black/[0.04]">
            <span class="font-semibold text-[#1d1d1f] text-xs flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-[#ff9500]" />
              Band 8.5+ 考官推荐高分示范
            </span>
            <span class="text-[11px] text-[#0071e3] font-medium">Native Flow</span>
          </div>

          <p class="text-xs sm:text-sm text-[#1d1d1f] leading-[1.8] font-serif bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.02] whitespace-pre-line">
            {{ currentTopic.highBandSample }}
          </p>

          <!-- High-Scoring Collocations -->
          <div class="space-y-2 pt-1">
            <span class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Award class="w-3.5 h-3.5 text-[#0071e3]" />
              高分地道句型与习语积累:
            </span>
            <div class="space-y-2">
              <div 
                v-for="(item, idx) in currentTopic.vocabularyAndIdioms" 
                :key="idx" 
                class="p-3.5 rounded-2xl bg-[#fbfbfd] border border-black/[0.04] text-xs space-y-1"
              >
                <div class="font-semibold text-[#1d1d1f]">{{ item.term }}</div>
                <div class="text-[11px] text-[#86868b]">{{ item.definition }}</div>
                <div class="text-[11px] text-[#1d1d1f] font-serif italic">例: "{{ item.example }}"</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Recordings List -->
        <div v-if="savedRecordings.length > 0" class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <span class="font-semibold text-[#1d1d1f] text-xs flex items-center gap-1.5">
            <Volume2 class="w-3.5 h-3.5 text-[#86868b]" />
            我的录音复盘记录 ({{ savedRecordings.length }})
          </span>
          <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div 
              v-for="rec in savedRecordings.slice(0, 5)" 
              :key="rec.id" 
              class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] flex items-center justify-between text-xs"
            >
              <div>
                <div class="font-medium text-[#1d1d1f]">Part {{ rec.part }} - {{ rec.topicTitle.slice(0, 18) }}...</div>
                <div class="text-[10px] text-[#86868b] mt-0.5">{{ new Date(rec.createdAt).toLocaleString() }}</div>
              </div>
              <audio v-if="rec.audioBlobUrl" :src="rec.audioBlobUrl" controls class="h-6 w-32 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
