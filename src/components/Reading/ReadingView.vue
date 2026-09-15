<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  Clock, 
  Flag, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Award
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { READING_TESTS } from '../../data/readingTests';
import { calculateReadingBand } from '../../services/scoring';
import { saveTestResult, saveMistake } from '../../services/storage';
import type { Question } from '../../types/ielts';
import QuickWordPopover from '../Dictionary/QuickWordPopover.vue';

const props = defineProps<{
  selectedTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'refreshMistakes'): void;
  (e: 'openSearch'): void;
  (e: 'openDictionary', word?: string): void;
}>();

const currentTestId = ref(props.selectedTestId || READING_TESTS[0].id);

watch(() => props.selectedTestId, (newId) => {
  if (newId) {
    currentTestId.value = newId;
  }
});

const currentTest = computed(() => READING_TESTS.find(t => t.id === currentTestId.value) || READING_TESTS[0]);
const activePassageIndex = ref(0);
const answers = ref<Record<number, string>>({});
const flagged = ref<Record<number, boolean>>({});
const currentQuestionId = ref(1);

// Highlights & Notes state
const highlights = ref<{ id: string; text: string; color: string; note?: string }[]>([]);
const selectedText = ref('');
const showHighlightMenu = ref<{ 
  x: number; 
  y: number; 
  rectCenter?: number; 
  rectTop?: number; 
  rectBottom?: number; 
} | null>(null);
const inlineQuickDef = ref<{
  word: string;
  x: number;
  y: number;
} | null>(null);

// Timer (60 mins = 3600 seconds)
const secondsRemaining = ref(60 * 60);
const isTimerPaused = ref(false);

// Result state
const isSubmitted = ref(false);
const resultSummary = ref<{ rawScore: number; total: number; band: number } | null>(null);
const filterMode = ref<'all' | 'wrong' | 'correct'>('all');

const currentPassage = computed(() => currentTest.value.passages[activePassageIndex.value]);
const allQuestions = computed<Question[]>(() => currentTest.value.passages.flatMap(p => p.questions));
const totalQuestions = computed(() => allQuestions.value.length);

watch(currentTestId, () => {
  activePassageIndex.value = 0;
  answers.value = {};
  flagged.value = {};
  isSubmitted.value = false;
  resultSummary.value = null;
  secondsRemaining.value = 60 * 60;
  currentQuestionId.value = 1;
});

// Timer countdown
let timerInterval: any = null;
onMounted(() => {
  timerInterval = setInterval(() => {
    if (isSubmitted.value || isTimerPaused.value) return;
    if (secondsRemaining.value <= 1) {
      handleSubmitTest();
      secondsRemaining.value = 0;
    } else {
      secondsRemaining.value--;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// Handle Text Selection for Highlighting
const handlePassageMouseUp = () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    const text = selection.toString().trim();
    selectedText.value = text;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    showHighlightMenu.value = {
      x: Math.min(window.innerWidth - 180, Math.max(10, rect.left + rect.width / 2 - 80)),
      y: Math.max(10, rect.top - 45),
      rectCenter: rect.left + rect.width / 2,
      rectTop: rect.top,
      rectBottom: rect.bottom
    };
    inlineQuickDef.value = null;
  } else {
    showHighlightMenu.value = null;
  }
};

const addHighlight = (color: string, skipPrompt = false) => {
  if (!selectedText.value) return;
  const note = skipPrompt ? undefined : prompt('添加笔记批注（可选）:');
  highlights.value.push({
    id: Date.now().toString(),
    text: selectedText.value,
    color,
    note: note || undefined
  });
  showHighlightMenu.value = null;
  inlineQuickDef.value = null;
  window.getSelection()?.removeAllRanges();
};

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const handleAnswerChange = (questionId: number, val: string) => {
  answers.value = {
    ...answers.value,
    [questionId]: val
  };
};

const toggleFlag = (questionId: number) => {
  flagged.value = {
    ...flagged.value,
    [questionId]: !flagged.value[questionId]
  };
};

// Submit test and grade
const handleSubmitTest = () => {
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
        id: `mistake_r_${q.id}_${Date.now()}`,
        module: 'reading',
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

  const band = calculateReadingBand(score);
  resultSummary.value = { rawScore: score, total: totalQuestions.value, band };
  isSubmitted.value = true;

  saveTestResult({
    id: `res_r_${Date.now()}`,
    module: 'reading',
    testId: currentTest.value.id,
    testTitle: currentTest.value.title,
    score,
    band,
    completedAt: new Date().toISOString(),
    timeSpentSeconds: 3600 - secondsRemaining.value,
    answers: answers.value
  });

  emit('refreshMistakes');

  if (band >= 7.0) {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }
};

const resetTest = () => {
  answers.value = {};
  flagged.value = {};
  isSubmitted.value = false;
  resultSummary.value = null;
  secondsRemaining.value = 60 * 60;
  currentQuestionId.value = 1;
  activePassageIndex.value = 0;
};

const questionsToDisplay = computed(() => {
  if (!isSubmitted.value || !resultSummary.value) return [];
  return allQuestions.value.filter(q => {
    const userAns = (answers.value[q.id] || '').trim().toLowerCase();
    const correctAns = Array.isArray(q.correctAnswer)
      ? q.correctAnswer.map(a => a.toLowerCase().trim())
      : [q.correctAnswer.toLowerCase().trim()];
    const isCorrect = correctAns.some(ca => userAns === ca);

    if (filterMode.value === 'wrong') return !isCorrect;
    if (filterMode.value === 'correct') return isCorrect;
    return true;
  });
});
</script>

<template>
  <div>
    <!-- If submitted, show the score report and review -->
    <div v-if="isSubmitted && resultSummary" class="space-y-6 max-w-5xl mx-auto pb-12">
      <!-- Score Hero -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Award class="w-4 h-4 text-indigo-600" />
          机考阅卷完成 · 官方换算
        </div>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {{ currentTest.title }}
        </h2>

        <div class="flex items-center justify-center gap-8 py-4">
          <div class="text-center">
            <div class="text-5xl font-black text-indigo-600">Band {{ resultSummary.band.toFixed(1) }}</div>
            <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">雅思阅读等级分</div>
          </div>
          <div class="h-14 w-px bg-slate-200" />
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-800">{{ resultSummary.rawScore }} / {{ resultSummary.total }}</div>
            <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">原始正确题数</div>
          </div>
          <div class="h-14 w-px bg-slate-200" />
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-800">{{ Math.round((resultSummary.rawScore / resultSummary.total) * 100) }}%</div>
            <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">综合准确率</div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="resetTest"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw class="w-4 h-4" />
            重新模考
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            @click="filterMode = 'all'"
            :class="[
              'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer',
              filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            全部题目 ({{ allQuestions.length }})
          </button>
          <button
            @click="filterMode = 'wrong'"
            :class="[
              'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer',
              filterMode === 'wrong' ? 'bg-red-500 text-white shadow-sm' : 'text-red-600 hover:text-red-700'
            ]"
          >
            错题精析 ({{ allQuestions.length - resultSummary.rawScore }})
          </button>
          <button
            @click="filterMode = 'correct'"
            :class="[
              'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer',
              filterMode === 'correct' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-600 hover:text-emerald-700'
            ]"
          >
            正确题目 ({{ resultSummary.rawScore }})
          </button>
        </div>
        <span class="text-xs text-slate-500">所有错题已自动收入「错题集」</span>
      </div>

      <!-- Detailed Question Review List -->
      <div class="space-y-4">
        <div 
          v-for="q in questionsToDisplay"
          :key="q.id"
          :class="[
            'bg-white rounded-xl p-5 border shadow-sm transition-all',
            (Array.isArray(q.correctAnswer)
              ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
              : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
              ? 'border-emerald-200 bg-emerald-50/20' 
              : 'border-red-200 bg-red-50/20'
          ]"
        >
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex items-center gap-2">
              <span :class="[
                'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs',
                (Array.isArray(q.correctAnswer)
                  ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
                  : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              ]">
                {{ q.id }}
              </span>
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">
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
              <span class="text-slate-500 font-medium">您的回答: </span>
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

          <!-- Explanation and Location -->
          <div class="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5">
            <div class="flex items-center gap-1.5 text-slate-700 font-bold">
              <HelpCircle class="w-3.5 h-3.5 text-indigo-500" />
              <span>原文定位与考点解析 ({{ q.paragraphReference || '文章相关段落' }}):</span>
            </div>
            <p class="text-slate-600 leading-relaxed pl-5">{{ q.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Exam Interface (CDI Layout) -->
    <div v-else class="flex flex-col h-[calc(100vh-8.5rem)] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      <!-- Top CDI Exam Control Bar -->
      <div class="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        <div class="flex items-center gap-3">
          <div class="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-2">
            <BookOpen class="w-4 h-4 text-red-500" />
            <span>IELTS Academic Reading</span>
          </div>

          <!-- Test Selector Dropdown -->
          <select
            v-model="currentTestId"
            class="bg-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-700 focus:outline-none focus:border-red-500 max-w-[220px] truncate"
          >
            <option v-for="t in READING_TESTS" :key="t.id" :value="t.id">
              {{ t.title }}
            </option>
          </select>

          <button
            @click="emit('openSearch')"
            class="text-xs text-amber-300 hover:text-amber-200 px-2 py-1 bg-amber-950/40 rounded border border-amber-800/40 flex items-center gap-1 font-medium cursor-pointer"
          >
            <Sparkles class="w-3 h-3 text-amber-400" />
            <span>搜题库</span>
          </button>

          <button
            @click="emit('openDictionary')"
            class="text-xs text-teal-300 hover:text-teal-200 px-2.5 py-1 bg-teal-950/40 rounded border border-teal-800/40 flex items-center gap-1 font-medium cursor-pointer"
          >
            <BookOpen class="w-3 h-3 text-teal-400" />
            <span>即时词典</span>
          </button>

          <!-- Passage Switcher Tabs -->
          <div class="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md text-xs">
            <button
              v-for="(p, idx) in currentTest.passages"
              :key="p.id"
              @click="activePassageIndex = idx"
              :class="[
                'px-3 py-1 rounded font-medium transition-all cursor-pointer',
                activePassageIndex === idx
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              ]"
            >
              Passage {{ p.id }}
            </button>
          </div>
        </div>

        <!-- Timer & Controls -->
        <div class="flex items-center gap-4">
          <div :class="[
            'flex items-center gap-2 px-3 py-1 rounded-md font-mono text-sm font-bold border',
            secondsRemaining < 600 
              ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
              : 'bg-slate-800 text-slate-200 border-slate-700'
          ]">
            <Clock class="w-4 h-4 text-amber-400" />
            <span>{{ formatTime(secondsRemaining) }}</span>
          </div>

          <button
            @click="isTimerPaused = !isTimerPaused"
            class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {{ isTimerPaused ? '继续计时' : '暂停计时' }}
          </button>

          <button
            @click="handleSubmitTest"
            class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            交卷评分
          </button>
        </div>
      </div>

      <!-- Main Split Body -->
      <div class="flex-1 flex overflow-hidden relative">
        <!-- Left Pane: Passage Text -->
        <div 
          @mouseup="handlePassageMouseUp"
          class="w-1/2 p-6 overflow-y-auto bg-white border-r border-slate-200 leading-relaxed font-serif text-[15px] text-slate-800 select-text"
        >
          <div class="max-w-2xl mx-auto space-y-4">
            <div class="pb-3 border-b border-slate-200">
              <span class="text-xs font-sans font-bold text-red-600 uppercase tracking-widest">
                READING PASSAGE {{ currentPassage.id }}
              </span>
              <h1 class="text-xl font-bold font-sans text-slate-900 mt-1">
                {{ currentPassage.title }}
              </h1>
              <p v-if="currentPassage.subtitle" class="text-xs font-sans text-slate-500 italic mt-0.5">
                {{ currentPassage.subtitle }}
              </p>
            </div>

            <!-- Note alert if any -->
            <div v-if="highlights.length > 0" class="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs font-sans text-amber-800 flex items-center justify-between">
              <span>已在本文中做记号/划线 {{ highlights.length }} 处</span>
              <button 
                @click="highlights = []"
                class="text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
              >
                清除所有高亮
              </button>
            </div>

            <!-- Paragraphs -->
            <div class="space-y-4 pt-2">
              <div v-for="p in currentPassage.paragraphs" :key="p.id" class="relative pl-6">
                <span class="absolute left-0 top-0 font-sans font-bold text-sm text-red-600 select-none">
                  [{{ p.id }}]
                </span>
                <p class="text-slate-800 text-justify">
                  {{ p.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Highlighting Toolbar -->
        <div 
          v-if="showHighlightMenu"
          :style="{ position: 'fixed', left: `${showHighlightMenu.x}px`, top: `${showHighlightMenu.y}px`, zIndex: 100 }"
          class="bg-slate-900 text-white shadow-xl rounded-lg px-2 py-1.5 flex items-center gap-1.5 border border-slate-700 text-xs select-none"
        >
          <button 
            @click="addHighlight('yellow')"
            class="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-amber-300 cursor-pointer"
            title="黄色高亮"
          >
            <div class="w-3.5 h-3.5 rounded bg-yellow-300" />
            <span>高亮</span>
          </button>
          <button 
            @click="addHighlight('green')"
            class="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-emerald-300 cursor-pointer"
            title="绿色高亮"
          >
            <div class="w-3.5 h-3.5 rounded bg-emerald-400" />
          </button>
          <button 
            @click="addHighlight('pink')"
            class="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-pink-300 cursor-pointer"
            title="粉色高亮"
          >
            <div class="w-3.5 h-3.5 rounded bg-pink-400" />
          </button>

          <div class="h-4 w-px bg-slate-700" />
          <button 
            @click="inlineQuickDef = {
              word: selectedText,
              x: showHighlightMenu.rectCenter || (showHighlightMenu.x + 80),
              y: showHighlightMenu.rectTop || showHighlightMenu.y
            }; showHighlightMenu = null;"
            class="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-teal-300 font-semibold transition-colors cursor-pointer"
            title="即时查词典释义（不打断阅读体验）"
          >
            <BookOpen class="w-3.5 h-3.5 text-teal-400" />
            <span>查词典</span>
          </button>
        </div>

        <!-- Inline Quick Definition Popover -->
        <QuickWordPopover
          v-if="inlineQuickDef"
          :word="inlineQuickDef.word"
          :position="{ x: inlineQuickDef.x, y: inlineQuickDef.y }"
          @close="inlineQuickDef = null"
          @openFull="(w) => { emit('openDictionary', w); inlineQuickDef = null; }"
          @highlight="(color) => { addHighlight(color, true); inlineQuickDef = null; }"
        />

        <!-- Right Pane: Questions -->
        <div class="w-1/2 p-6 overflow-y-auto bg-slate-50 space-y-6">
          <div class="max-w-xl mx-auto space-y-6">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 class="text-sm font-bold text-slate-800 font-sans uppercase tracking-wider">
                Questions for Passage {{ currentPassage.id }}
              </h2>
              <span class="text-xs text-slate-500">
                本篇包含 {{ currentPassage.questions.length }} 题
              </span>
            </div>

            <div 
              v-for="q in currentPassage.questions"
              :key="q.id"
              :id="`question-${q.id}`"
              :class="[
                'bg-white rounded-xl p-5 border transition-all',
                currentQuestionId === q.id 
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                  : 'border-slate-200 shadow-sm'
              ]"
              @click="currentQuestionId = q.id"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {{ q.id }}
                  </span>
                  <span class="text-xs font-semibold text-slate-500 uppercase">
                    {{ q.type.replace(/_/g, ' ') }}
                  </span>
                </div>

                <button
                  @click.stop="toggleFlag(q.id)"
                  :class="[
                    'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer',
                    flagged[q.id] ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  <Flag :class="['w-3.5 h-3.5', flagged[q.id] ? 'fill-amber-500 text-amber-500' : '']" />
                  <span>{{ flagged[q.id] ? '已标记' : '标记' }}</span>
                </button>
              </div>

              <p class="text-sm text-slate-800 font-medium mb-3">
                {{ q.prompt }}
              </p>

              <!-- Render based on Question Type -->
              <div v-if="q.type === 'true_false_not_given'" class="grid grid-cols-3 gap-2">
                <button
                  v-for="opt in ['TRUE', 'FALSE', 'NOT GIVEN']"
                  :key="opt"
                  @click="handleAnswerChange(q.id, opt)"
                  :class="[
                    'py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                    answers[q.id] === opt
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  ]"
                >
                  {{ opt }}
                </button>
              </div>

              <div v-else-if="q.type === 'multiple_choice' && q.options" class="space-y-2">
                <div
                  v-for="opt in q.options"
                  :key="opt"
                  @click="handleAnswerChange(q.id, opt)"
                  :class="[
                    'p-3 rounded-lg border text-xs cursor-pointer transition-all',
                    answers[q.id] === opt
                      ? 'bg-indigo-50/80 border-indigo-500 font-semibold text-indigo-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ opt }}
                </div>
              </div>

              <div v-else-if="q.type === 'matching_headings' && q.options" class="space-y-1.5">
                <select
                  :value="answers[q.id] || ''"
                  @change="handleAnswerChange(q.id, ($event.target as HTMLSelectElement).value)"
                  class="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- 选择对应段落标题 --</option>
                  <option v-for="opt in q.options" :key="opt" :value="opt">
                    {{ opt }}
                  </option>
                </select>
              </div>

              <div v-else-if="q.type === 'sentence_completion' || q.type === 'summary_completion'" class="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="在此输入答案（不区分大小写）..."
                  :value="answers[q.id] || ''"
                  @input="handleAnswerChange(q.id, ($event.target as HTMLInputElement).value)"
                  class="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CDI Question Navigator Ribbon -->
      <div class="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 select-none shadow-md">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-600 hidden sm:inline">答题进度:</span>
          <div class="flex items-center gap-1.5 overflow-x-auto max-w-xl py-1">
            <button
              v-for="q in allQuestions"
              :key="q.id"
              @click="currentQuestionId = q.id; $nextTick(() => {
                const el = document.getElementById(`question-${q.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              })"
              :class="[
                'w-7 h-7 rounded text-xs font-bold relative transition-all cursor-pointer',
                currentQuestionId === q.id ? 'ring-2 ring-indigo-600 ring-offset-1' : '',
                answers[q.id] 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
              ]"
            >
              {{ q.id }}
              <span v-if="flagged[q.id]" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500">
            已作答 {{ Object.keys(answers).length }} / {{ totalQuestions }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
