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

const props = defineProps<{
  selectedTopicId?: string;
}>();

const emit = defineEmits<{
  (e: 'openSearch'): void;
}>();

const selectedTopicId = ref(props.selectedTopicId || SPEAKING_TOPICS[0].id);

watch(() => props.selectedTopicId, (newId) => {
  if (newId) {
    selectedTopicId.value = newId;
  }
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
    <!-- Header & Topic Switcher -->
    <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
          <Mic class="w-4 h-4" />
          <span>IELTS Speaking Examination Studio</span>
        </div>
        <h1 class="text-xl font-extrabold text-white">
          Part {{ currentTopic.part }}: {{ currentTopic.title }}
        </h1>
        <span class="text-xs text-slate-400 mt-0.5 inline-block">
          {{ currentTopic.category }} · 真实考官 1 对 1 仿真互动体验
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="emit('openSearch')"
          class="px-3 py-2 bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-800/40 rounded-lg text-xs font-semibold cursor-pointer"
        >
          搜题库
        </button>

        <select
          v-model="selectedTopicId"
          @change="() => {
            isPrepping = false;
            isSpeaking = false;
            prepSeconds = 60;
            speechSeconds = 120;
            audioUrl = null;
          }"
          class="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500"
        >
          <option v-for="t in SPEAKING_TOPICS" :key="t.id" :value="t.id">
            PART {{ t.part }}: {{ t.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Cue Card / Questions & Preparation -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Part 2 Cue Card Mode -->
        <div v-if="currentTopic.part === 2 && currentTopic.cueCard" class="bg-white rounded-2xl p-6 border-2 border-rose-100 shadow-sm space-y-5">
          <div class="border-b border-rose-100 pb-3 flex items-center justify-between">
            <span class="text-xs font-bold text-rose-600 uppercase tracking-wider">
              CANDIDATE CUE CARD (考生命题卡)
            </span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
              Part 2 独白陈述
            </span>
          </div>

          <div class="space-y-3">
            <h2 class="text-base font-bold text-slate-900">
              {{ currentTopic.cueCard.topic }}
            </h2>
            <p class="text-xs text-slate-500 italic">
              You should say:
            </p>
            <ul class="space-y-2 pl-5 list-disc text-xs text-slate-700 font-medium leading-relaxed">
              <li v-for="(pt, i) in currentTopic.cueCard.points" :key="i">{{ pt }}</li>
            </ul>
          </div>

          <!-- 1-Minute Prep Section -->
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Clock class="w-4 h-4 text-amber-500" />
                <span class="text-xs font-bold text-slate-800">
                  1 分钟备考草稿时间:
                </span>
                <span class="font-mono font-bold text-sm text-amber-600">
                  {{ prepSeconds }} 秒
                </span>
              </div>

              <button
                v-if="!isPrepping && prepSeconds === 60"
                @click="startPrep"
                class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
              >
                开始 1 分钟准备
              </button>
              <span v-else :class="['text-xs font-semibold', isPrepping ? 'text-amber-600 animate-pulse' : 'text-slate-400']">
                {{ isPrepping ? '正在计时中...' : '准备时间已结束' }}
              </span>
            </div>

            <textarea
              v-model="scratchNotes"
              placeholder="在此草稿区快速写下 3-4 个答题关键词（如 device name, features, benefit 等）..."
              rows="3"
              class="w-full p-2.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <!-- 2-Minute Speech Recording Bar -->
          <div class="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-xl p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs text-rose-300 font-medium">Part 2 答题录音</span>
                <div class="text-lg font-bold">2 分钟个人陈述</div>
              </div>

              <div class="flex items-center gap-2 font-mono text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Clock class="w-4 h-4 text-rose-400" />
                <span>{{ speechSeconds }}s / 120s</span>
              </div>
            </div>

            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-1.5 bg-rose-500 transition-all duration-1000"
                :style="{ width: `${((120 - speechSeconds) / 120) * 100}%` }"
              />
            </div>

            <div class="flex items-center gap-3 pt-1">
              <button
                v-if="!isRecording"
                @click="startRecording"
                class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Mic class="w-4 h-4" />
                <span>开始录音作答</span>
              </button>
              <button
                v-else
                @click="stopRecording"
                class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2 transition-all animate-pulse cursor-pointer"
              >
                <Square class="w-4 h-4 fill-white" />
                <span>停止录音并保存</span>
              </button>

              <div v-if="audioUrl && !isRecording" class="flex-1 flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                <audio :src="audioUrl" controls class="w-full h-8" />
              </div>
            </div>
          </div>
        </div>

        <!-- Part 1 & Part 3 Questions View -->
        <div v-else-if="(currentTopic.part === 1 || currentTopic.part === 3) && currentTopic.questions" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="border-b border-slate-100 pb-2 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
              考官问题列表 (Examiner Questions)
            </span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Part {{ currentTopic.part }}
            </span>
          </div>

          <div class="space-y-3">
            <div 
              v-for="(q, idx) in currentTopic.questions"
              :key="idx"
              class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {{ idx + 1 }}
              </span>
              <p class="text-xs text-slate-800 font-medium leading-relaxed">
                {{ q }}
              </p>
            </div>
          </div>

          <!-- Part 1/3 Quick Recorder -->
          <div class="pt-2 flex items-center gap-3">
            <button
              v-if="!isRecording"
              @click="startRecording"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all cursor-pointer"
            >
              <Mic class="w-4 h-4" />
              <span>录制我的作答</span>
            </button>
            <button
              v-else
              @click="stopRecording"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all animate-pulse cursor-pointer"
            >
              <Square class="w-4 h-4 fill-white" />
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
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Sparkles class="w-4 h-4 text-amber-500" />
              Band 8.5+ 考官推荐高分示范
            </span>
            <span class="text-[11px] text-indigo-600 font-semibold">Native Flow</span>
          </div>

          <p class="text-xs text-slate-700 leading-relaxed font-serif bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line">
            {{ currentTopic.highBandSample }}
          </p>

          <!-- High-Scoring Collocations -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Award class="w-3.5 h-3.5 text-rose-500" />
              高分地道句型与习语积累:
            </span>
            <div class="space-y-2">
              <div 
                v-for="(item, idx) in currentTopic.vocabularyAndIdioms" 
                :key="idx" 
                class="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs space-y-0.5"
              >
                <div class="font-bold text-rose-900">{{ item.term }}</div>
                <div class="text-[11px] text-rose-700">{{ item.definition }}</div>
                <div class="text-[11px] text-slate-600 italic">例: "{{ item.example }}"</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Recordings List -->
        <div v-if="savedRecordings.length > 0" class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <span class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Volume2 class="w-4 h-4 text-slate-600" />
            我的录音复盘记录 ({{ savedRecordings.length }})
          </span>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div 
              v-for="rec in savedRecordings.slice(0, 5)" 
              :key="rec.id" 
              class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <div class="font-semibold text-slate-800">Part {{ rec.part }} - {{ rec.topicTitle.slice(0, 20) }}...</div>
                <div class="text-[10px] text-slate-400">{{ new Date(rec.createdAt).toLocaleString() }}</div>
              </div>
              <audio v-if="rec.audioBlobUrl" :src="rec.audioBlobUrl" controls class="h-6 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
