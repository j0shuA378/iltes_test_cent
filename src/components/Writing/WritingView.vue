<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  PenTool, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Copy, 
  Check, 
  RotateCcw
} from 'lucide-vue-next';
import { WRITING_TASKS } from '../../data/writingTasks';
import { evaluateWritingOffline, type HeuristicEvaluationResult } from '../../services/scoring';
import { saveWritingSubmission } from '../../services/storage';
import type { UserProfile } from '../../types/ielts';

const props = defineProps<{
  profile: UserProfile;
  selectedTaskId?: string;
}>();

const emit = defineEmits<{
  (e: 'openSearch'): void;
}>();

const selectedTaskId = ref(props.selectedTaskId || WRITING_TASKS[0].id);

watch(() => props.selectedTaskId, (newId) => {
  if (newId) {
    selectedTaskId.value = newId;
  }
});

const currentTask = computed(() => WRITING_TASKS.find(t => t.id === selectedTaskId.value) || WRITING_TASKS[0]);
const essayContent = ref('');
const activeTab = ref<'write' | 'model' | 'feedback'>('write');

// Timer state
const secondsLeft = ref(currentTask.value.recommendedMinutes * 60);
const isTimerRunning = ref(false);

// Evaluation Result
const evaluationResult = ref<HeuristicEvaluationResult | null>(null);
const copied = ref(false);
const aiLoading = ref(false);

// Word count
const words = computed(() => essayContent.value.trim().split(/\s+/).filter(w => w.length > 0));
const wordCount = computed(() => words.value.length);
const isWordTargetMet = computed(() => wordCount.value >= currentTask.value.minWords);

watch(selectedTaskId, () => {
  secondsLeft.value = currentTask.value.recommendedMinutes * 60;
  isTimerRunning.value = false;
  evaluationResult.value = null;
  essayContent.value = '';
});

let timerInterval: any = null;
onMounted(() => {
  timerInterval = setInterval(() => {
    if (!isTimerRunning.value) return;
    if (secondsLeft.value <= 1) {
      isTimerRunning.value = false;
      secondsLeft.value = 0;
    } else {
      secondsLeft.value--;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const formatTimer = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const handleEvaluate = async () => {
  if (wordCount.value < 10) {
    alert('请先输入至少一段文字后再进行评分评估！');
    return;
  }

  aiLoading.value = true;

  const result = evaluateWritingOffline(essayContent.value, currentTask.value.minWords, currentTask.value.type);
  evaluationResult.value = result;
  activeTab.value = 'feedback';

  saveWritingSubmission({
    id: `write_${Date.now()}`,
    taskId: currentTask.value.id,
    taskType: currentTask.value.type,
    taskTitle: currentTask.value.title,
    content: essayContent.value,
    wordCount: wordCount.value,
    submittedAt: new Date().toISOString(),
    timeSpentSeconds: currentTask.value.recommendedMinutes * 60 - secondsLeft.value,
    scores: result.scores,
    feedback: {
      strengths: result.feedback.strengths,
      weaknesses: result.feedback.weaknesses,
      grammarSuggestions: result.feedback.grammarSuggestions
    }
  });

  aiLoading.value = false;
};

const handleCopyModel = () => {
  navigator.clipboard.writeText(currentTask.value.sampleBand9);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};
</script>

<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-12">
    <!-- Top Header & Task Switcher -->
    <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
          <PenTool class="w-4 h-4" />
          <span>IELTS Academic Writing Studio</span>
        </div>
        <h1 class="text-xl font-extrabold text-white">
          {{ currentTask.title }}
        </h1>
        <span class="text-xs text-slate-400 mt-0.5 inline-block">
          {{ currentTask.category }} · 要求字数至少 {{ currentTask.minWords }} 词 · 建议耗时 {{ currentTask.recommendedMinutes }} 分钟
        </span>
      </div>

      <!-- Task dropdown selector -->
      <div class="flex items-center gap-2">
        <button
          @click="emit('openSearch')"
          class="px-3 py-2 bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-amber-800/40 rounded-lg text-xs font-semibold cursor-pointer"
        >
          搜题库
        </button>

        <select
          v-model="selectedTaskId"
          class="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
        >
          <option v-for="t in WRITING_TASKS" :key="t.id" :value="t.id">
            {{ t.type.toUpperCase() }}: {{ t.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Split Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Prompt & Visual -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <span class="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Writing Prompt (试题要求)
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
              {{ currentTask.type.toUpperCase() }}
            </span>
          </div>

          <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
            {{ currentTask.prompt }}
          </p>

          <!-- Task 1 SVG Chart render if applicable -->
          <div v-if="currentTask.chartSvg" class="pt-2">
            <div 
              class="overflow-hidden"
              v-html="currentTask.chartSvg"
            />
          </div>

          <!-- Key Vocabulary Hints -->
          <div class="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs space-y-2">
            <span class="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-amber-500" />
              推荐高分学术表达:
            </span>
            <ul class="grid grid-cols-1 gap-1 pl-4 list-disc text-slate-600">
              <li v-for="(v, i) in currentTask.keyVocabulary" :key="i">{{ v }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Column: Writing Pad, Word Count, Model & Feedback -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Navigation Bar inside Right Pane -->
        <div class="flex items-center justify-between bg-white rounded-xl p-2 border border-slate-200 shadow-sm">
          <div class="flex items-center gap-1">
            <button
              @click="activeTab = 'write'"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'write' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              写作实战
            </button>
            <button
              @click="activeTab = 'model'"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'model' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Band 9 官方范文
            </button>
            <button
              v-if="evaluationResult"
              @click="activeTab = 'feedback'"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'feedback' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              评分报告 (Band {{ evaluationResult.scores.overall.toFixed(1) }})
            </button>
          </div>

          <!-- Timer Controller -->
          <div class="flex items-center gap-2 pr-2">
            <div class="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              <Clock class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ formatTimer(secondsLeft) }}</span>
            </div>
            <button
              @click="isTimerRunning = !isTimerRunning"
              class="text-xs px-2 py-1 bg-slate-800 text-white rounded hover:bg-slate-700 cursor-pointer"
            >
              {{ isTimerRunning ? '暂停' : '开始计时' }}
            </button>
          </div>
        </div>

        <!-- TAB 1: Real-time Writing Canvas -->
        <div v-if="activeTab === 'write'" class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <!-- Word Count Indicator Bar -->
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-500">字数统计:</span>
              <span :class="['font-bold text-sm', isWordTargetMet ? 'text-emerald-600' : 'text-amber-600']">
                {{ wordCount }} 词
              </span>
              <span class="text-slate-400">/ 最低要求 {{ currentTask.minWords }} 词</span>
            </div>

            <span v-if="isWordTargetMet" class="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 class="w-4 h-4" /> 已达标
            </span>
            <span v-else class="inline-flex items-center gap-1 text-amber-600 font-semibold">
              <AlertTriangle class="w-4 h-4" /> 还差 {{ currentTask.minWords - wordCount }} 词
            </span>
          </div>

          <!-- Progress bar -->
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              :class="['h-1.5 transition-all', isWordTargetMet ? 'bg-emerald-500' : 'bg-amber-400']"
              :style="{ width: `${Math.min(100, Math.round((wordCount / currentTask.minWords) * 100))}%` }"
            />
          </div>

          <!-- Textarea -->
          <textarea
            v-model="essayContent"
            placeholder="在此输入您的学术英语作文... 请注意分段，使用标准学术词汇，避免缩写 (如 don't, can't)。"
            rows="16"
            class="w-full p-4 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed bg-slate-50/50"
          />

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-2">
            <button
              @click="essayContent = ''"
              class="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              清空重写
            </button>

            <button
              @click="handleEvaluate"
              :disabled="aiLoading"
              class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles class="w-4 h-4" />
              <span>{{ aiLoading ? '正在进行考官标准批改...' : '智能考官评卷' }}</span>
            </button>
          </div>
        </div>

        <!-- TAB 2: Band 9 Model Essay -->
        <div v-if="activeTab === 'model'" class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-xs">
                Band 9.0 满分范文
              </span>
              <span class="text-xs text-slate-500">剑桥考官示范作答</span>
            </div>

            <button
              @click="handleCopyModel"
              class="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copied ? '已复制范文' : '一键复制' }}</span>
            </button>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-serif leading-relaxed text-slate-800 whitespace-pre-line">
            {{ currentTask.sampleBand9 }}
          </div>

          <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-xs space-y-2">
            <span class="font-bold text-indigo-900 flex items-center gap-1.5">
              <BookOpen class="w-4 h-4 text-indigo-600" />
              考官范文深度架构点评:
            </span>
            <p class="text-slate-700 leading-relaxed whitespace-pre-line">
              {{ currentTask.sampleAnalysis }}
            </p>
          </div>
        </div>

        <!-- TAB 3: AI / Heuristic Feedback Report -->
        <div v-if="activeTab === 'feedback' && evaluationResult" class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
          <!-- Score summary 4 dimensions -->
          <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <span class="text-xs text-amber-400 font-semibold">四维官方评测结果</span>
              <div class="text-3xl font-black mt-0.5">
                Band {{ evaluationResult.scores.overall.toFixed(1) }}
              </div>
            </div>

            <div class="grid grid-cols-4 gap-3 text-center">
              <div class="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <div class="text-sm font-bold text-amber-400">{{ evaluationResult.scores.tr.toFixed(1) }}</div>
                <div class="text-[10px] text-slate-300 uppercase">TR</div>
              </div>
              <div class="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <div class="text-sm font-bold text-sky-400">{{ evaluationResult.scores.cc.toFixed(1) }}</div>
                <div class="text-[10px] text-slate-300 uppercase">CC</div>
              </div>
              <div class="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <div class="text-sm font-bold text-emerald-400">{{ evaluationResult.scores.lr.toFixed(1) }}</div>
                <div class="text-[10px] text-slate-300 uppercase">LR</div>
              </div>
              <div class="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <div class="text-sm font-bold text-purple-400">{{ evaluationResult.scores.gra.toFixed(1) }}</div>
                <div class="text-[10px] text-slate-300 uppercase">GRA</div>
              </div>
            </div>
          </div>

          <!-- Strengths -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              作答亮点与达成项 (Strengths):
            </span>
            <div class="space-y-1.5 pl-5 text-xs text-slate-700">
              <div v-for="(s, idx) in evaluationResult.feedback.strengths" :key="idx" class="list-item">{{ s }}</div>
            </div>
          </div>

          <!-- Weaknesses -->
          <div v-if="evaluationResult.feedback.weaknesses.length > 0" class="space-y-2">
            <span class="text-xs font-bold text-amber-700 flex items-center gap-1.5">
              <AlertTriangle class="w-4 h-4 text-amber-600" />
              待提升维度 (Areas for Improvement):
            </span>
            <div class="space-y-1.5 pl-5 text-xs text-slate-700">
              <div v-for="(w, idx) in evaluationResult.feedback.weaknesses" :key="idx" class="list-item">{{ w }}</div>
            </div>
          </div>

          <!-- Grammar & Academic Style suggestions -->
          <div v-if="evaluationResult.feedback.grammarSuggestions.length > 0" class="bg-red-50/70 p-3.5 rounded-lg border border-red-200 text-xs space-y-1.5">
            <span class="font-bold text-red-800 flex items-center gap-1.5">
              <AlertTriangle class="w-3.5 h-3.5 text-red-600" />
              语法规范与学术习惯提醒:
            </span>
            <ul class="pl-4 list-disc text-red-700 space-y-1">
              <li v-for="(g, idx) in evaluationResult.feedback.grammarSuggestions" :key="idx">{{ g }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
