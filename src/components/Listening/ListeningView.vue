<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Headphones, 
  BookOpen
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { LISTENING_TESTS } from '../../data/listeningTests';
import { calculateListeningBand } from '../../services/scoring';
import { saveTestResult, saveMistake } from '../../services/storage';

import QuestionBankSelector from '../Common/QuestionBankSelector.vue';

const props = defineProps<{
  selectedTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'refreshMistakes'): void;
  (e: 'openSearch'): void;
  (e: 'openDictionary', word?: string): void;
  (e: 'openSmartRandom'): void;
}>();

const currentTestId = ref(props.selectedTestId || LISTENING_TESTS[0].id);

watch(() => props.selectedTestId, (newId) => {
  if (newId) {
    currentTestId.value = newId;
  }
});

const currentTest = computed(() => LISTENING_TESTS.find(t => t.id === currentTestId.value) || LISTENING_TESTS[0]);
const activeSectionIndex = ref(0);
const isPlaying = ref(false);
const playbackRate = ref(1.0);
const showTranscript = ref(false);

// Answers state
const answers = ref<Record<number, string>>({});
const isSubmitted = ref(false);
const resultSummary = ref<{ rawScore: number; total: number; band: number } | null>(null);

const synthRef = ref<SpeechSynthesis | null>(null);
const utteranceRef = ref<SpeechSynthesisUtterance | null>(null);

const activeSection = computed(() => currentTest.value.sections[activeSectionIndex.value]);
const allQuestions = computed(() => currentTest.value.sections.flatMap(s => s.questions));
const totalQuestions = computed(() => allQuestions.value.length);

watch(currentTestId, () => {
  activeSectionIndex.value = 0;
  isPlaying.value = false;
  showTranscript.value = false;
  answers.value = {};
  isSubmitted.value = false;
  resultSummary.value = null;
  if (synthRef.value) synthRef.value.cancel();
});

onMounted(() => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synthRef.value = window.speechSynthesis;
  }
});

onUnmounted(() => {
  if (synthRef.value) {
    synthRef.value.cancel();
  }
});

// Handle Playback with Web Speech API
const togglePlayAudio = () => {
  if (!synthRef.value) return;

  if (isPlaying.value) {
    synthRef.value.cancel();
    isPlaying.value = false;
  } else {
    synthRef.value.cancel();
    const textToRead = activeSection.value.transcript
      .map(t => `${t.speaker}: ${t.text}`)
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = playbackRate.value;
    utterance.lang = 'en-GB';

    const voices = synthRef.value.getVoices();
    const britishVoice = voices.find(v => v.lang.includes('GB') || v.lang.includes('en-AU') || v.name.includes('UK') || v.name.includes('British'));
    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.onend = () => {
      isPlaying.value = false;
    };

    utterance.onerror = () => {
      isPlaying.value = false;
    };

    utteranceRef.value = utterance;
    synthRef.value.speak(utterance);
    isPlaying.value = true;
  }
};

const playSingleSentence = (text: string) => {
  if (!synthRef.value) return;
  synthRef.value.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = playbackRate.value;
  utterance.lang = 'en-GB';
  synthRef.value.speak(utterance);
};

const handleRateChange = (rate: number) => {
  playbackRate.value = rate;
  if (isPlaying.value) {
    togglePlayAudio();
    setTimeout(() => togglePlayAudio(), 100);
  }
};

const handleAnswerChange = (questionId: number, val: string) => {
  answers.value = {
    ...answers.value,
    [questionId]: val
  };
};

const handleSubmitTest = () => {
  if (synthRef.value) {
    synthRef.value.cancel();
    isPlaying.value = false;
  }

  let score = 0;
  allQuestions.value.forEach(q => {
    const userAns = (answers.value[q.id] || '').trim().toLowerCase();
    const correctAns = Array.isArray(q.correctAnswer)
      ? q.correctAnswer.map(a => a.toLowerCase().trim())
      : [q.correctAnswer.toLowerCase().trim()];

    const isMatch = correctAns.some(ca => userAns === ca);
    if (isMatch) {
      score++;
    } else {
      saveMistake({
        id: `mistake_l_${q.id}_${Date.now()}`,
        module: 'listening',
        testTitle: currentTest.value.title,
        questionNumber: q.id,
        questionText: q.prompt,
        questionType: q.type,
        userAnswer: answers.value[q.id] || '(未作答)',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        createdAt: new Date().toISOString(),
        reviewedCount: 0,
        isResolved: false
      });
    }
  });

  const band = calculateListeningBand(score);
  resultSummary.value = { rawScore: score, total: totalQuestions.value, band };
  isSubmitted.value = true;

  saveTestResult({
    id: `res_l_${Date.now()}`,
    module: 'listening',
    testId: currentTest.value.id,
    testTitle: currentTest.value.title,
    score,
    band,
    completedAt: new Date().toISOString(),
    timeSpentSeconds: 1800,
    answers: answers.value
  });

  emit('refreshMistakes');

  if (band >= 7.0) {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }
};

const resetTest = () => {
  answers.value = {};
  isSubmitted.value = false;
  resultSummary.value = null;
  showTranscript.value = false;
};
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12">
    <!-- Top Question Bank Selector Bar -->
    <div class="bg-white rounded-3xl p-3.5 sm:px-6 sm:py-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <QuestionBankSelector
        module="listening"
        v-model="currentTestId"
        @openSmartRandom="emit('openSmartRandom')"
        @openSearch="emit('openSearch')"
      />
    </div>

    <!-- Submitted Screen (Apple Clean Style) -->
    <div v-if="isSubmitted && resultSummary" class="space-y-6 max-w-4xl mx-auto pb-12">
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1d1d1f] text-xs font-medium">
          <Award class="w-3.5 h-3.5 text-[#86868b]" />
          <span>听力机考阅卷完成 · 官方换算评分</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          {{ currentTest.title }}
        </h2>

        <div class="flex items-center justify-center gap-6 sm:gap-10 py-4">
          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">Band {{ resultSummary.band.toFixed(1) }}</div>
            <div class="text-xs text-[#86868b] font-normal mt-1">雅思听力等级分</div>
          </div>
          <div class="h-12 w-px bg-black/[0.08]" />
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">{{ resultSummary.rawScore }} / {{ resultSummary.total }}</div>
            <div class="text-xs text-[#86868b] font-normal mt-1">原始正确题数</div>
          </div>
          <div class="h-12 w-px bg-black/[0.08]" />
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">{{ Math.round((resultSummary.rawScore / resultSummary.total) * 100) }}%</div>
            <div class="text-xs text-[#86868b] font-normal mt-1">综合准确率</div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="resetTest"
            class="px-5 py-2 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>重新训练测验</span>
          </button>
        </div>
      </div>

      <!-- Detailed Question Review -->
      <div class="space-y-4">
        <div 
          v-for="q in allQuestions"
          :key="q.id"
          :class="[
            'bg-white rounded-xl p-5 border shadow-sm',
            (Array.isArray(q.correctAnswer)
              ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
              : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
              ? 'border-emerald-200 bg-emerald-50/20' 
              : 'border-red-200 bg-red-50/20'
          ]"
        >
          <div class="flex items-start justify-between gap-4 mb-2">
            <div class="flex items-center gap-2">
              <span :class="[
                'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs',
                (Array.isArray(q.correctAnswer)
                  ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
                  : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              ]">
                {{ q.id }}
              </span>
              <span class="text-xs font-semibold text-slate-500 uppercase">
                {{ q.type.replace(/_/g, ' ') }}
              </span>
            </div>

            <span 
              v-if="(Array.isArray(q.correctAnswer)
                ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
                : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())"
              class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"
            >
              <CheckCircle class="w-4 h-4" /> 正确
            </span>
            <span v-else class="inline-flex items-center gap-1 text-xs font-bold text-red-600">
              <XCircle class="w-4 h-4" /> 错误
            </span>
          </div>

          <p class="text-sm font-semibold text-slate-800 mb-3">{{ q.prompt }}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
            <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span class="text-slate-500 font-medium">您的作答: </span>
              <span :class="[
                'font-bold',
                (Array.isArray(q.correctAnswer)
                  ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
                  : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
                  ? 'text-emerald-700' 
                  : 'text-red-600'
              ]">
                {{ answers[q.id] || '(未作答)' }}
              </span>
            </div>
            <div class="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <span class="text-emerald-800 font-medium">官方正解: </span>
              <span class="font-bold text-emerald-900">{{ Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer }}</span>
            </div>
          </div>

          <div class="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1">
            <div class="flex items-center gap-1.5 text-slate-700 font-bold">
              <HelpCircle class="w-3.5 h-3.5 text-sky-500" />
              <span>听力定位与考点解析 ({{ q.paragraphReference }}):</span>
            </div>
            <p class="text-slate-600 pl-5">{{ q.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Listening Exam (Apple Clean Station) -->
    <div v-else class="space-y-6">
      <!-- Listening Header & Player Bar -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-1.5 text-xs text-[#0071e3] font-medium mb-1">
              <Headphones class="w-3.5 h-3.5" />
              <span>IELTS Official Listening Simulation</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              {{ activeSection.title }}
            </h1>
            <p class="text-xs text-[#86868b] mt-1 max-w-xl leading-relaxed">
              {{ activeSection.description }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="emit('openDictionary')"
              class="text-xs text-[#0071e3] px-3 py-1.5 bg-[#0071e3]/10 hover:bg-[#0071e3]/15 rounded-full border border-[#0071e3]/15 flex items-center gap-1 font-medium cursor-pointer transition-colors"
            >
              <BookOpen class="w-3.5 h-3.5 text-[#0071e3]" />
              <span>即时词典</span>
            </button>

            <button
              @click="handleSubmitTest"
              class="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium rounded-full shadow-xs hover:shadow transition-all active:scale-98 cursor-pointer"
            >
              交卷评分
            </button>
          </div>
        </div>

        <!-- Audio Controls Bar (Apple Style) -->
        <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.04] flex flex-wrap items-center justify-between gap-4">
          <!-- Play / Pause -->
          <div class="flex items-center gap-3">
            <button
              @click="togglePlayAudio"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95',
                isPlaying 
                  ? 'bg-[#ff9500] text-white hover:bg-[#ff9500]/90' 
                  : 'bg-[#1d1d1f] hover:bg-black text-white'
              ]"
            >
              <Pause v-if="isPlaying" class="w-4 h-4" />
              <Play v-else class="w-4 h-4 ml-0.5" />
            </button>

            <div>
              <div class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
                <span>{{ isPlaying ? '正在播放考场真实录音' : '轻点开始播放音频' }}</span>
                <span v-if="isPlaying" class="flex gap-0.5 items-end h-3">
                  <span class="w-1 h-2 bg-[#0071e3] animate-pulse" />
                  <span class="w-1 h-3 bg-[#0071e3] animate-pulse delay-75" />
                  <span class="w-1 h-1.5 bg-[#0071e3] animate-pulse delay-150" />
                </span>
              </div>
              <span class="text-[11px] text-[#86868b]">英式/澳式原生语音合成播放</span>
            </div>
          </div>

          <!-- Speed Selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-[#86868b]">语速:</span>
            <div class="flex items-center gap-1 bg-white p-0.5 rounded-full border border-black/[0.06] text-xs">
              <button
                v-for="rate in [0.8, 1.0, 1.2, 1.5]"
                :key="rate"
                @click="handleRateChange(rate)"
                :class="[
                  'px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer text-xs',
                  playbackRate === rate ? 'bg-[#1d1d1f] text-white shadow-2xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
                ]"
              >
                {{ rate }}x
              </button>
            </div>
          </div>

          <!-- Dictation / Transcript Toggle -->
          <button
            @click="showTranscript = !showTranscript"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer',
              showTranscript 
                ? 'bg-[#1d1d1f] text-white shadow-xs' 
                : 'bg-white border border-black/[0.06] text-[#1d1d1f] hover:bg-black/[0.02]'
            ]"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span>{{ showTranscript ? '隐藏听力原文' : '展开精听原文 (精听跟读)' }}</span>
          </button>
        </div>

        <!-- Section Tabs -->
        <div class="flex items-center gap-1.5 pt-1 border-t border-black/[0.04] overflow-x-auto">
          <button
            v-for="(sec, idx) in currentTest.sections"
            :key="sec.sectionNumber"
            @click="() => {
              if (synthRef) synthRef.cancel();
              isPlaying = false;
              activeSectionIndex = idx;
            }"
            :class="[
              'px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
              activeSectionIndex === idx 
                ? 'bg-[#1d1d1f] text-white shadow-xs' 
                : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]'
            ]"
          >
            Section {{ sec.sectionNumber }}
          </button>
        </div>
      </div>

      <!-- Optional Transcript / Dictation Panel (Apple Style) -->
      <div v-if="showTranscript" class="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-black/[0.04]">
          <span class="font-semibold text-[#1d1d1f] text-xs flex items-center gap-1.5">
            <Headphones class="w-4 h-4 text-[#0071e3]" />
            Section {{ activeSection.sectionNumber }} 精听逐句跟读与点播
          </span>
          <span class="text-[11px] text-[#86868b]">点击单句扬声器图标可单句复读</span>
        </div>
        <div class="space-y-2 max-h-72 overflow-y-auto pr-2">
          <div 
            v-for="(line, idx) in activeSection.transcript" 
            :key="idx" 
            class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f5f5f7] text-xs"
          >
            <button
              @click="playSingleSentence(line.text)"
              class="p-1.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/20 shrink-0 mt-0.5 cursor-pointer"
              title="单句复读"
            >
              <Volume2 class="w-3.5 h-3.5" />
            </button>
            <div class="flex-1">
              <span class="font-medium text-[#1d1d1f]">{{ line.speaker }}: </span>
              <span class="text-[#86868b] leading-relaxed">{{ line.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions Form Area (Apple Style) -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div class="border-b border-black/[0.04] pb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-[#1d1d1f]">
            Section {{ activeSection.sectionNumber }} 答题卡 (Questions {{ activeSection.questions[0].id }} - {{ activeSection.questions[activeSection.questions.length - 1].id }})
          </h2>
          <span class="text-xs text-[#86868b]">
            共 {{ activeSection.questions.length }} 题
          </span>
        </div>

        <div class="space-y-4">
          <div 
            v-for="q in activeSection.questions"
            :key="q.id"
            class="p-5 rounded-2xl border border-black/[0.06] hover:border-black/[0.12] transition-all bg-[#fbfbfd] space-y-3"
          >
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-[#1d1d1f] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                {{ q.id }}
              </span>
              <span class="text-xs font-medium text-[#86868b] uppercase tracking-wide">
                {{ q.type.replace(/_/g, ' ') }}
              </span>
            </div>

            <p class="text-sm font-normal text-[#1d1d1f] leading-relaxed">
              {{ q.prompt }}
            </p>

            <input
              v-if="q.type === 'sentence_completion'"
              type="text"
              placeholder="输入听到的一到两个单词或数字..."
              :value="answers[q.id] || ''"
              @input="handleAnswerChange(q.id, ($event.target as HTMLInputElement).value)"
              class="w-full sm:w-80 px-3.5 py-2 text-xs border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-white text-[#1d1d1f]"
            />

            <div v-else-if="q.type === 'multiple_choice' && q.options" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div
                v-for="opt in q.options"
                :key="opt"
                @click="handleAnswerChange(q.id, opt)"
                :class="[
                  'p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between',
                  answers[q.id] === opt
                    ? 'bg-[#0071e3]/10 border-[#0071e3] font-medium text-[#0071e3] shadow-2xs'
                    : 'bg-white border-black/[0.06] hover:bg-[#f5f5f7] text-[#1d1d1f]'
                ]"
              >
                <span>{{ opt }}</span>
                <div 
                  :class="[
                    'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
                    answers[q.id] === opt ? 'border-[#0071e3] bg-[#0071e3]' : 'border-black/[0.2]'
                  ]"
                >
                  <div v-if="answers[q.id] === opt" class="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
