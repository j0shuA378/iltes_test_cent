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

const props = defineProps<{
  selectedTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'refreshMistakes'): void;
  (e: 'openSearch'): void;
  (e: 'openDictionary', word?: string): void;
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
    <!-- Submitted Screen -->
    <div v-if="isSubmitted && resultSummary" class="space-y-6 max-w-4xl mx-auto pb-12">
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
          <Award class="w-4 h-4 text-sky-600" />
          听力机考阅卷完成 · 换算标准
        </div>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {{ currentTest.title }}
        </h2>

        <div class="flex items-center justify-center gap-8 py-4">
          <div class="text-center">
            <div class="text-5xl font-black text-sky-600">Band {{ resultSummary.band.toFixed(1) }}</div>
            <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">雅思听力等级分</div>
          </div>
          <div class="h-14 w-px bg-slate-200" />
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-800">{{ resultSummary.rawScore }} / {{ resultSummary.total }}</div>
            <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">原始正确题数</div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="resetTest"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw class="w-4 h-4" />
            重新训练
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

    <!-- Active Listening Exam -->
    <div v-else class="space-y-6">
      <!-- Listening Header & Player Bar -->
      <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
              <Headphones class="w-4 h-4" />
              <span>IELTS Official Listening Simulation</span>
            </div>
            <h1 class="text-xl font-extrabold text-white">
              {{ activeSection.title }}
            </h1>
            <p class="text-xs text-slate-400 mt-1 max-w-xl">
              {{ activeSection.description }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <select
              v-model="currentTestId"
              class="bg-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 max-w-[220px] truncate"
            >
              <option v-for="t in LISTENING_TESTS" :key="t.id" :value="t.id">
                {{ t.title }}
              </option>
            </select>

            <button
              @click="emit('openSearch')"
              class="px-2.5 py-1.5 bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-amber-800/40 rounded-lg text-xs font-semibold cursor-pointer"
            >
              搜题库
            </button>

            <button
              @click="emit('openDictionary')"
              class="px-2.5 py-1.5 bg-teal-950/40 text-teal-300 hover:text-teal-200 border border-teal-800/40 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <BookOpen class="w-3 h-3 text-teal-400" />
              <span>词典</span>
            </button>

            <button
              @click="handleSubmitTest"
              class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              交卷评分
            </button>
          </div>
        </div>

        <!-- Audio Controls Bar -->
        <div class="bg-slate-800/90 rounded-xl p-4 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <!-- Play / Pause -->
          <div class="flex items-center gap-3">
            <button
              @click="togglePlayAudio"
              :class="[
                'w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer',
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20'
              ]"
            >
              <Pause v-if="isPlaying" class="w-5 h-5" />
              <Play v-else class="w-5 h-5 ml-0.5" />
            </button>

            <div>
              <div class="text-xs font-bold text-white flex items-center gap-2">
                <span>{{ isPlaying ? '正在播放考场听力录音' : '点击播放音频' }}</span>
                <span v-if="isPlaying" class="flex gap-0.5 items-end h-3">
                  <span class="w-1 h-2 bg-sky-400 animate-pulse" />
                  <span class="w-1 h-3 bg-sky-400 animate-pulse delay-75" />
                  <span class="w-1 h-1.5 bg-sky-400 animate-pulse delay-150" />
                </span>
              </div>
              <span class="text-[11px] text-slate-400">英式/澳式原生语音合成播放</span>
            </div>
          </div>

          <!-- Speed Selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">播放语速:</span>
            <div class="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                v-for="rate in [0.8, 1.0, 1.2, 1.5]"
                :key="rate"
                @click="handleRateChange(rate)"
                :class="[
                  'px-2 py-1 rounded font-medium transition-colors cursor-pointer',
                  playbackRate === rate ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
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
              'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer',
              showTranscript 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            ]"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span>{{ showTranscript ? '隐藏听力原文' : '展开精听原文 (精听跟读)' }}</span>
          </button>
        </div>

        <!-- Section Tabs -->
        <div class="flex space-x-2 pt-1 border-t border-slate-800">
          <button
            v-for="(sec, idx) in currentTest.sections"
            :key="sec.sectionNumber"
            @click="() => {
              if (synthRef) synthRef.cancel();
              isPlaying = false;
              activeSectionIndex = idx;
            }"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              activeSectionIndex === idx 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            ]"
          >
            Section {{ sec.sectionNumber }}
          </button>
        </div>
      </div>

      <!-- Optional Transcript / Dictation Panel -->
      <div v-if="showTranscript" class="bg-white rounded-xl p-5 border border-indigo-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Headphones class="w-4 h-4 text-indigo-600" />
            Section {{ activeSection.sectionNumber }} 精听逐句跟读与点播
          </span>
          <span class="text-[11px] text-slate-400">点击单句扬声器图标可单句复读</span>
        </div>
        <div class="space-y-2 max-h-72 overflow-y-auto pr-2">
          <div 
            v-for="(line, idx) in activeSection.transcript" 
            :key="idx" 
            class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-xs"
          >
            <button
              @click="playSingleSentence(line.text)"
              class="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shrink-0 mt-0.5 cursor-pointer"
              title="单句复读"
            >
              <Volume2 class="w-3.5 h-3.5" />
            </button>
            <div class="flex-1">
              <span class="font-bold text-slate-700">{{ line.speaker }}: </span>
              <span class="text-slate-600 leading-relaxed">{{ line.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions Form Area -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900">
            Section {{ activeSection.sectionNumber }} 答题卡 (Questions {{ activeSection.questions[0].id }} - {{ activeSection.questions[activeSection.questions.length - 1].id }})
          </h2>
          <span class="text-xs text-slate-500">
            共 {{ activeSection.questions.length }} 题
          </span>
        </div>

        <div class="space-y-5">
          <div 
            v-for="q in activeSection.questions"
            :key="q.id"
            class="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition-all bg-slate-50/50 space-y-2.5"
          >
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {{ q.id }}
              </span>
              <span class="text-xs font-semibold text-slate-500 uppercase">
                {{ q.type.replace(/_/g, ' ') }}
              </span>
            </div>

            <p class="text-sm font-medium text-slate-800">
              {{ q.prompt }}
            </p>

            <input
              v-if="q.type === 'sentence_completion'"
              type="text"
              placeholder="输入听到的一到两个单词或数字..."
              :value="answers[q.id] || ''"
              @input="handleAnswerChange(q.id, ($event.target as HTMLInputElement).value)"
              class="w-full sm:w-80 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
            />

            <div v-else-if="q.type === 'multiple_choice' && q.options" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div
                v-for="opt in q.options"
                :key="opt"
                @click="handleAnswerChange(q.id, opt)"
                :class="[
                  'p-3 rounded-lg border text-xs cursor-pointer transition-all',
                  answers[q.id] === opt
                    ? 'bg-sky-50 border-sky-500 font-semibold text-sky-900 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                ]"
              >
                {{ opt }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
