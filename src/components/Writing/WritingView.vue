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

import QuestionBankSelector from '../Common/QuestionBankSelector.vue';

const props = defineProps<{
  profile: UserProfile;
  selectedTaskId?: string;
}>();

const emit = defineEmits<{
  (e: 'openSearch'): void;
  (e: 'openSmartRandom'): void;
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
    <!-- Top Question Bank Selector Bar -->
    <div class="bg-white rounded-3xl p-3.5 sm:px-6 sm:py-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <QuestionBankSelector
        module="writing"
        v-model="selectedTaskId"
        @openSmartRandom="emit('openSmartRandom')"
        @openSearch="emit('openSearch')"
      />
    </div>

    <!-- Top Header & Task Switcher (Apple Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-1.5 text-xs text-[#0071e3] font-medium mb-1">
          <PenTool class="w-3.5 h-3.5" />
          <span>IELTS Academic Writing Studio · {{ currentTask.type.toUpperCase() }}</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
          {{ currentTask.title }}
        </h1>
        <span class="text-xs text-[#86868b] mt-0.5 inline-block">
          {{ currentTask.category }} · 要求字数至少 {{ currentTask.minWords }} 词 · 建议耗时 {{ currentTask.recommendedMinutes }} 分钟
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs px-3 py-1 rounded-full bg-black/[0.04] text-[#1d1d1f] font-medium">
          {{ currentTask.source || 'Official IELTS Bank' }}
        </span>
      </div>
    </div>

    <!-- Main Split Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Prompt & Visual -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div class="flex items-center justify-between border-b border-black/[0.04] pb-2.5">
            <span class="font-semibold text-[#1d1d1f] text-xs uppercase tracking-wider">
              Writing Prompt (试题要求)
            </span>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-black/[0.04] font-medium text-[#1d1d1f]">
              {{ currentTask.type.toUpperCase() }}
            </span>
          </div>

          <p class="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed whitespace-pre-line font-normal">
            {{ currentTask.prompt }}
          </p>

          <!-- Task 1 SVG Chart render if applicable -->
          <div v-if="currentTask.chartSvg" class="pt-2">
            <div 
              class="overflow-hidden rounded-2xl bg-[#fbfbfd] p-3 border border-black/[0.04]"
              v-html="currentTask.chartSvg"
            />
          </div>

          <!-- Key Vocabulary Hints -->
          <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02] text-xs space-y-2">
            <span class="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-[#ff9500]" />
              推荐高分学术表达:
            </span>
            <ul class="grid grid-cols-1 gap-1.5 pl-4 list-disc text-[#86868b]">
              <li v-for="(v, i) in currentTask.keyVocabulary" :key="i">{{ v }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Column: Writing Pad, Word Count, Model & Feedback -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Navigation Bar inside Right Pane -->
        <div class="flex items-center justify-between bg-white rounded-2xl p-2 border border-black/[0.04] shadow-2xs">
          <div class="flex items-center gap-1 p-0.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
            <button
              @click="activeTab = 'write'"
              :class="[
                'px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
                activeTab === 'write' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
              ]"
            >
              写作实战
            </button>
            <button
              @click="activeTab = 'model'"
              :class="[
                'px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
                activeTab === 'model' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
              ]"
            >
              Band 9 官方范文
            </button>
            <button
              v-if="evaluationResult"
              @click="activeTab = 'feedback'"
              :class="[
                'px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
                activeTab === 'feedback' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
              ]"
            >
              评分报告 (Band {{ evaluationResult.scores.overall.toFixed(1) }})
            </button>
          </div>

          <!-- Timer Controller -->
          <div class="flex items-center gap-2 pr-1">
            <div class="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1 rounded-full border border-black/[0.04] tabular-nums">
              <Clock class="w-3.5 h-3.5 text-[#86868b]" />
              <span>{{ formatTimer(secondsLeft) }}</span>
            </div>
            <button
              @click="isTimerRunning = !isTimerRunning"
              class="text-xs px-3 py-1 bg-[#1d1d1f] text-white rounded-full hover:bg-black transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              {{ isTimerRunning ? '暂停' : '开始计时' }}
            </button>
          </div>
        </div>

        <!-- TAB 1: Real-time Writing Canvas -->
        <div v-if="activeTab === 'write'" class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <!-- Word Count Indicator Bar -->
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-[#86868b]">字数统计:</span>
              <span :class="['font-semibold text-sm tabular-nums', isWordTargetMet ? 'text-[#34c759]' : 'text-[#ff9500]']">
                {{ wordCount }} 词
              </span>
              <span class="text-[#86868b]">/ 最低要求 {{ currentTask.minWords }} 词</span>
            </div>

            <span v-if="isWordTargetMet" class="inline-flex items-center gap-1 text-[#34c759] font-medium">
              <CheckCircle2 class="w-4 h-4" /> 已达标
            </span>
            <span v-else class="inline-flex items-center gap-1 text-[#ff9500] font-medium">
              <AlertTriangle class="w-4 h-4" /> 还差 {{ currentTask.minWords - wordCount }} 词
            </span>
          </div>

          <!-- Progress bar -->
          <div class="w-full bg-[#f5f5f7] rounded-full h-1.5 overflow-hidden border border-black/[0.02]">
            <div 
              :class="['h-full rounded-full transition-all duration-300', isWordTargetMet ? 'bg-[#34c759]' : 'bg-[#ff9500]']"
              :style="{ width: `${Math.min(100, Math.round((wordCount / currentTask.minWords) * 100))}%` }"
            />
          </div>

          <!-- Textarea -->
          <textarea
            v-model="essayContent"
            placeholder="在此输入您的学术英语作文... 请注意分段，使用标准学术词汇，避免口语缩写 (如 don't, can't)。"
            rows="16"
            class="w-full p-4 text-xs sm:text-sm font-sans border border-black/[0.06] rounded-2xl focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 leading-relaxed bg-[#fbfbfd] text-[#1d1d1f]"
          />

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-2">
            <button
              @click="essayContent = ''"
              class="px-3.5 py-1.5 text-xs font-normal text-[#86868b] hover:text-[#ff3b30] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>清空重写</span>
            </button>

            <button
              @click="handleEvaluate"
              :disabled="aiLoading"
              class="px-5 py-2 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium rounded-full shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Sparkles class="w-3.5 h-3.5 text-white/90" />
              <span>{{ aiLoading ? '正在进行考官标准批改...' : '智能考官评卷' }}</span>
            </button>
          </div>
        </div>

        <!-- TAB 2: Band 9 Model Essay -->
        <div v-if="activeTab === 'model'" class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-black/[0.04]">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#1d1d1f] font-semibold text-xs border border-black/[0.06]">
                Band 9.0 满分范文
              </span>
              <span class="text-xs text-[#86868b]">剑桥考官示范作答</span>
            </div>

            <button
              @click="handleCopyModel"
              class="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-[#34c759]" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copied ? '已复制范文' : '一键复制' }}</span>
            </button>
          </div>

          <div class="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.02] text-xs sm:text-sm font-serif leading-[1.8] text-[#1d1d1f] whitespace-pre-line">
            {{ currentTask.sampleBand9 }}
          </div>

          <div class="bg-[#fbfbfd] p-4 rounded-2xl border border-black/[0.04] text-xs space-y-2">
            <span class="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <BookOpen class="w-4 h-4 text-[#0071e3]" />
              考官范文深度架构点评:
            </span>
            <p class="text-[#86868b] leading-relaxed whitespace-pre-line">
              {{ currentTask.sampleAnalysis }}
            </p>
          </div>
        </div>

        <!-- TAB 3: AI / Heuristic Feedback Report -->
        <div v-if="activeTab === 'feedback' && evaluationResult" class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
          <!-- Score summary 4 dimensions -->
          <div class="bg-[#1d1d1f] text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <span class="text-xs text-white/70 font-medium">四维官方评测结果</span>
              <div class="text-3xl font-semibold tracking-tight mt-0.5 tabular-nums">
                Band {{ evaluationResult.scores.overall.toFixed(1) }}
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2.5 text-center">
              <div class="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <div class="text-sm font-semibold tabular-nums text-white">{{ evaluationResult.scores.tr.toFixed(1) }}</div>
                <div class="text-[10px] text-white/70 uppercase">TR</div>
              </div>
              <div class="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <div class="text-sm font-semibold tabular-nums text-white">{{ evaluationResult.scores.cc.toFixed(1) }}</div>
                <div class="text-[10px] text-white/70 uppercase">CC</div>
              </div>
              <div class="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <div class="text-sm font-semibold tabular-nums text-white">{{ evaluationResult.scores.lr.toFixed(1) }}</div>
                <div class="text-[10px] text-white/70 uppercase">LR</div>
              </div>
              <div class="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <div class="text-sm font-semibold tabular-nums text-white">{{ evaluationResult.scores.gra.toFixed(1) }}</div>
                <div class="text-[10px] text-white/70 uppercase">GRA</div>
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
