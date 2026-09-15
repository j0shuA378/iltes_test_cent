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
      <!-- Score Hero (Apple Clean Minimalist Style) -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1d1d1f] text-xs font-medium">
          <Award class="w-3.5 h-3.5 text-[#86868b]" />
          <span>机考阅卷完成 · 官方换算评分</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          {{ currentTest.title }}
        </h2>

        <div class="flex items-center justify-center gap-6 sm:gap-10 py-4">
          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">Band {{ resultSummary.band.toFixed(1) }}</div>
            <div class="text-xs text-[#86868b] font-normal mt-1">雅思阅读等级分</div>
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
            <span>重新模考测试</span>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <!-- Filter Tabs (Apple Pill Style) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
          <button
            @click="filterMode = 'all'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
              filterMode === 'all' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            全部题目 ({{ allQuestions.length }})
          </button>
          <button
            @click="filterMode = 'wrong'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
              filterMode === 'wrong' ? 'bg-white text-[#ff3b30] shadow-xs font-semibold' : 'text-[#86868b] hover:text-[#ff3b30]'
            ]"
          >
            错题精析 ({{ allQuestions.length - resultSummary.rawScore }})
          </button>
          <button
            @click="filterMode = 'correct'"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
              filterMode === 'correct' ? 'bg-white text-[#34c759] shadow-xs font-semibold' : 'text-[#86868b] hover:text-[#34c759]'
            ]"
          >
            正确题目 ({{ resultSummary.rawScore }})
          </button>
        </div>
        <span class="text-xs text-[#86868b] font-normal">所有错题已同步至「艾宾浩斯错题复盘流」</span>
      </div>

      <!-- Detailed Question Review List -->
      <div class="space-y-4">
        <div 
          v-for="q in questionsToDisplay"
          :key="q.id"
          :class="[
            'bg-white rounded-3xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all',
            (Array.isArray(q.correctAnswer)
              ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
              : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
              ? 'border-[#34c759]/30 bg-[#34c759]/[0.02]' 
              : 'border-[#ff3b30]/30 bg-[#ff3b30]/[0.02]'
          ]"
        >
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex items-center gap-2">
              <span :class="[
                'w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs',
                (Array.isArray(q.correctAnswer)
                  ? q.correctAnswer.some(a => a.toLowerCase().trim() === (answers[q.id] || '').trim().toLowerCase())
                  : (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase().trim())
                  ? 'bg-[#34c759]/10 text-[#34c759]' 
                  : 'bg-[#ff3b30]/10 text-[#ff3b30]'
              ]">
                {{ q.id }}
              </span>
              <span class="text-xs font-medium text-[#86868b] uppercase tracking-wider">
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

    <!-- Active Exam Interface (CDI Layout - Apple Style) -->
    <div v-else class="flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-3xl overflow-hidden border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <!-- Top CDI Exam Control Bar -->
      <div class="bg-white/95 backdrop-blur-xl text-[#1d1d1f] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none border-b border-black/[0.06]">
        <div class="flex items-center gap-3">
          <div class="font-semibold text-xs tracking-tight text-[#1d1d1f] flex items-center gap-2">
            <BookOpen class="w-4 h-4 text-[#0071e3]" />
            <span>IELTS Academic Reading</span>
          </div>

          <!-- Test Selector Dropdown -->
          <select
            v-model="currentTestId"
            class="bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium px-3 py-1.5 rounded-full border border-black/[0.06] focus:outline-none focus:border-[#0071e3] transition-all cursor-pointer max-w-[200px] truncate"
          >
            <option v-for="t in READING_TESTS" :key="t.id" :value="t.id">
              {{ t.title }}
            </option>
          </select>

          <button
            @click="emit('openSearch')"
            class="text-xs text-[#86868b] hover:text-[#1d1d1f] px-3 py-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-full border border-black/[0.04] flex items-center gap-1.5 font-normal cursor-pointer transition-colors"
          >
            <Sparkles class="w-3.5 h-3.5 text-[#86868b]" />
            <span>搜题库</span>
          </button>

          <button
            @click="emit('openDictionary')"
            class="text-xs text-[#0071e3] px-3 py-1.5 bg-[#0071e3]/10 hover:bg-[#0071e3]/15 rounded-full border border-[#0071e3]/15 flex items-center gap-1.5 font-medium cursor-pointer transition-colors"
          >
            <BookOpen class="w-3.5 h-3.5 text-[#0071e3]" />
            <span>即时词典</span>
          </button>

          <!-- Passage Switcher Tabs -->
          <div class="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04] text-xs">
            <button
              v-for="(p, idx) in currentTest.passages"
              :key="p.id"
              @click="activePassageIndex = idx"
              :class="[
                'px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer text-xs',
                activePassageIndex === idx
                  ? 'bg-[#1d1d1f] text-white shadow-xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              ]"
            >
              Passage {{ p.id }}
            </button>
          </div>
        </div>

        <!-- Timer & Controls -->
        <div class="flex items-center gap-3">
          <div :class="[
            'flex items-center gap-1.5 px-3.5 py-1 rounded-full font-mono text-xs font-semibold tabular-nums border',
            secondsRemaining < 600 
              ? 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20 animate-pulse' 
              : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/[0.04]'
          ]">
            <Clock class="w-3.5 h-3.5 text-[#86868b]" />
            <span>{{ formatTime(secondsRemaining) }}</span>
          </div>

          <button
            @click="isTimerPaused = !isTimerPaused"
            class="text-xs text-[#86868b] hover:text-[#1d1d1f] px-3 py-1 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] border border-black/[0.04] transition-colors cursor-pointer"
          >
            {{ isTimerPaused ? '继续计时' : '暂停计时' }}
          </button>

          <button
            @click="handleSubmitTest"
            class="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium rounded-full shadow-xs hover:shadow transition-all active:scale-98 cursor-pointer"
          >
            交卷评分
          </button>
        </div>
      </div>

      <!-- Main Split Body -->
      <div class="flex-1 flex overflow-hidden relative">
        <!-- Left Pane: Passage Text (Apple Clean Reading Typography) -->
        <div 
          @mouseup="handlePassageMouseUp"
          class="w-1/2 p-7 overflow-y-auto bg-white border-r border-black/[0.06] leading-[1.8] font-serif text-[15px] text-[#1d1d1f] select-text"
        >
          <div class="max-w-2xl mx-auto space-y-5">
            <div class="pb-3.5 border-b border-black/[0.06]">
              <span class="text-xs font-sans font-semibold text-[#86868b] uppercase tracking-widest">
                READING PASSAGE {{ currentPassage.id }}
              </span>
              <h1 class="text-xl sm:text-2xl font-semibold font-sans text-[#1d1d1f] mt-1 tracking-tight">
                {{ currentPassage.title }}
              </h1>
              <p v-if="currentPassage.subtitle" class="text-xs font-sans text-[#86868b] italic mt-0.5">
                {{ currentPassage.subtitle }}
              </p>
            </div>

            <!-- Note alert if any -->
            <div v-if="highlights.length > 0" class="bg-[#f5f5f7] p-3 rounded-2xl border border-black/[0.04] text-xs font-sans text-[#1d1d1f] flex items-center justify-between">
              <span>已在本文中做记号/划线 <strong class="text-[#1d1d1f] font-semibold">{{ highlights.length }}</strong> 处</span>
              <button 
                @click="highlights = []"
                class="text-[#ff3b30] hover:underline font-medium cursor-pointer"
              >
                清除所有高亮
              </button>
            </div>

            <!-- Paragraphs -->
            <div class="space-y-4 pt-1">
              <div v-for="p in currentPassage.paragraphs" :key="p.id" class="relative pl-7">
                <span class="absolute left-0 top-0.5 font-mono font-semibold text-[11px] text-[#86868b] bg-black/[0.04] px-1 rounded select-none">
                  [{{ p.id }}]
                </span>
                <p class="text-[#1d1d1f] text-justify leading-[1.8]">
                  {{ p.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Highlighting Toolbar (Apple Pill Style) -->
        <div 
          v-if="showHighlightMenu"
          :style="{ position: 'fixed', left: `${showHighlightMenu.x}px`, top: `${showHighlightMenu.y}px`, zIndex: 100 }"
          class="bg-[#1d1d1f]/95 backdrop-blur-xl text-white shadow-xl rounded-full px-2.5 py-1.5 flex items-center gap-1.5 border border-white/10 text-xs select-none animate-fadeIn"
        >
          <button 
            @click="addHighlight('yellow')"
            class="p-1.5 hover:bg-white/10 rounded-full flex items-center gap-1 text-white cursor-pointer"
            title="黄色高亮"
          >
            <div class="w-3.5 h-3.5 rounded-full bg-[#ffd60a]" />
            <span class="text-[11px]">高亮</span>
          </button>
          <button 
            @click="addHighlight('green')"
            class="p-1.5 hover:bg-white/10 rounded-full flex items-center gap-1 text-white cursor-pointer"
            title="绿色高亮"
          >
            <div class="w-3.5 h-3.5 rounded-full bg-[#34c759]" />
          </button>
          <button 
            @click="addHighlight('pink')"
            class="p-1.5 hover:bg-white/10 rounded-full flex items-center gap-1 text-white cursor-pointer"
            title="粉色高亮"
          >
            <div class="w-3.5 h-3.5 rounded-full bg-[#ff2d55]" />
          </button>

          <div class="h-4 w-px bg-white/20" />
          <button 
            @click="inlineQuickDef = {
              word: selectedText,
              x: showHighlightMenu.rectCenter || (showHighlightMenu.x + 80),
              y: showHighlightMenu.rectTop || showHighlightMenu.y
            }; showHighlightMenu = null;"
            class="p-1.5 hover:bg-white/10 rounded-full flex items-center gap-1 text-white font-medium transition-colors cursor-pointer text-[11px]"
            title="即时查词典释义（不打断阅读体验）"
          >
            <BookOpen class="w-3.5 h-3.5 text-[#0071e3]" />
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

        <!-- Right Pane: Questions (Apple Clean Form Layout) -->
        <div class="w-1/2 p-7 overflow-y-auto bg-[#fbfbfd] space-y-6">
          <div class="max-w-xl mx-auto space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <h2 class="text-xs font-semibold text-[#1d1d1f] font-sans uppercase tracking-wider">
                Questions for Passage {{ currentPassage.id }}
              </h2>
              <span class="text-xs text-[#86868b]">
                本篇包含 {{ currentPassage.questions.length }} 题
              </span>
            </div>

            <div 
              v-for="q in currentPassage.questions"
              :key="q.id"
              :id="`question-${q.id}`"
              :class="[
                'bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-2xs space-y-3.5',
                currentQuestionId === q.id 
                  ? 'border-[#0071e3] ring-2 ring-[#0071e3]/15 shadow-sm' 
                  : 'border-black/[0.06]'
              ]"
              @click="currentQuestionId = q.id"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-[#1d1d1f] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                    {{ q.id }}
                  </span>
                  <span class="text-xs font-medium text-[#86868b] uppercase tracking-wide">
                    {{ q.type.replace(/_/g, ' ') }}
                  </span>
                </div>

                <button
                  @click.stop="toggleFlag(q.id)"
                  :class="[
                    'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer',
                    flagged[q.id] ? 'bg-[#ff9500]/10 text-[#ff9500] font-medium border border-[#ff9500]/20' : 'text-[#86868b] hover:text-[#1d1d1f] bg-black/[0.02]'
                  ]"
                >
                  <Flag :class="['w-3.5 h-3.5', flagged[q.id] ? 'fill-[#ff9500] text-[#ff9500]' : '']" />
                  <span>{{ flagged[q.id] ? '已标记' : '标记' }}</span>
                </button>
              </div>

              <p class="text-sm text-[#1d1d1f] font-normal leading-relaxed">
                {{ q.prompt }}
              </p>

              <!-- Render based on Question Type -->
              <div v-if="q.type === 'true_false_not_given'" class="grid grid-cols-3 gap-2">
                <button
                  v-for="opt in ['TRUE', 'FALSE', 'NOT GIVEN']"
                  :key="opt"
                  @click="handleAnswerChange(q.id, opt)"
                  :class="[
                    'py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer',
                    answers[q.id] === opt
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                      : 'bg-white text-[#1d1d1f] border-black/[0.06] hover:bg-[#f5f5f7]'
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

              <div v-else-if="q.type === 'matching_headings' && q.options" class="space-y-1.5">
                <select
                  :value="answers[q.id] || ''"
                  @change="handleAnswerChange(q.id, ($event.target as HTMLSelectElement).value)"
                  class="w-full p-2.5 text-xs bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white"
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
                  class="flex-1 px-3.5 py-2 text-xs border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CDI Question Navigator Ribbon (Apple Style) -->
      <div class="bg-white/95 backdrop-blur-xl border-t border-black/[0.06] px-5 py-2.5 flex items-center justify-between shrink-0 select-none shadow-xs">
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold text-[#86868b] hidden sm:inline">答题进度:</span>
          <div class="flex items-center gap-1.5 overflow-x-auto max-w-xl py-1">
            <button
              v-for="q in allQuestions"
              :key="q.id"
              @click="currentQuestionId = q.id; $nextTick(() => {
                const el = document.getElementById(`question-${q.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              })"
              :class="[
                'w-7 h-7 rounded-lg text-xs font-semibold relative transition-all cursor-pointer',
                currentQuestionId === q.id ? 'ring-2 ring-[#0071e3] ring-offset-1' : '',
                answers[q.id] 
                  ? 'bg-[#1d1d1f] text-white shadow-2xs' 
                  : 'bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#e8e8ed] border border-black/[0.04]'
              ]"
            >
              {{ q.id }}
              <span v-if="flagged[q.id]" class="absolute -top-1 -right-1 w-2 h-2 bg-[#ff9500] rounded-full ring-2 ring-white" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-[#86868b] font-normal tabular-nums">
            已作答 <strong class="text-[#1d1d1f] font-semibold">{{ Object.keys(answers).length }}</strong> / {{ totalQuestions }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
