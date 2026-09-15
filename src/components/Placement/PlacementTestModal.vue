<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  Target, 
  Clock, 
  Award, 
  RotateCcw,
  Check
} from 'lucide-vue-next';
import { 
  PLACEMENT_QUESTIONS, 
  type PlacementQuestion, 
  evaluatePlacementScore, 
  type PlacementEvaluation 
} from '../../data/placementTestData';
import { updateUserPlacement } from '../../services/authService';
import type { UserAccount } from '../../types/auth';

const props = defineProps<{
  isOpen: boolean;
  activeUser: UserAccount;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'completed', resultBand: number): void;
}>();

const step = ref<'intro' | 'testing' | 'report'>('intro');
const currentIndex = ref(0);
const userAnswers = ref<Record<number, string>>({});
const evaluation = ref<PlacementEvaluation | null>(null);
const rawScore = ref(0);

watch(() => props.isOpen, (open) => {
  if (open) {
    step.value = 'intro';
    currentIndex.value = 0;
    userAnswers.value = {};
    evaluation.value = null;
    rawScore.value = 0;
  }
});

const currentQuestion = computed<PlacementQuestion>(() => PLACEMENT_QUESTIONS[currentIndex.value]);
const progressPercent = computed(() => Math.round(((currentIndex.value + 1) / PLACEMENT_QUESTIONS.length) * 100));

const handleSelectOption = (key: string) => {
  userAnswers.value = {
    ...userAnswers.value,
    [currentQuestion.value.id]: key
  };
};

const handleNext = () => {
  if (currentIndex.value < PLACEMENT_QUESTIONS.length - 1) {
    currentIndex.value++;
  } else {
    finishTest();
  }
};

const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const finishTest = () => {
  let correctCount = 0;
  PLACEMENT_QUESTIONS.forEach(q => {
    if (userAnswers.value[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const evalResult = evaluatePlacementScore(correctCount);
  rawScore.value = correctCount;
  evaluation.value = evalResult;
  step.value = 'report';
};

const handleApplyPlacement = () => {
  if (!evaluation.value) return;

  updateUserPlacement(props.activeUser.id, {
    testedBand: evaluation.value.testedBand,
    rawScore: rawScore.value,
    totalQuestions: PLACEMENT_QUESTIONS.length,
    levelSummary: evaluation.value.levelTitle
  });

  emit('completed', evaluation.value.testedBand);
  emit('close');
};

const handleRestart = () => {
  userAnswers.value = {};
  currentIndex.value = 0;
  step.value = 'testing';
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none"
    @click.self="emit('close')"
  >
    <div 
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-2xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-black/[0.08] overflow-hidden flex flex-col animate-scaleUp max-h-[92vh]"
      @click.stop
    >
      <!-- Top Header Bar (Apple Sheet Style) -->
      <div class="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
            <Brain class="w-4 h-4" />
          </div>
          <div>
            <h2 class="font-semibold text-sm text-[#1d1d1f]">
              雅思初始学术水平摸底测验
            </h2>
            <span class="text-[11px] text-[#86868b] font-normal">
              3分钟极简定级 · 专属 178 天路线图基准校准
            </span>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
          title="关闭 (仍为 0.0 未定级状态)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- STEP 1: INTRO SCREEN -->
      <div v-if="step === 'intro'" class="p-6 sm:p-8 space-y-6 overflow-y-auto text-center">
        <div class="w-16 h-16 rounded-3xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mx-auto shadow-sm">
          <Sparkles class="w-8 h-8" />
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <h1 class="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            欢迎开启雅思备考之旅
          </h1>
          <p class="text-xs sm:text-sm text-[#86868b] leading-relaxed">
            所有新学员默认初始分为 <span class="font-semibold text-[#1d1d1f]">Band 0.0</span>。通过 6 道涵盖核心词汇、语法逻辑、长难句与真题题型的简易摸底题，精准测定您的起点基线。
          </p>
        </div>

        <!-- 3 Value Pillars -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-1">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-[#0071e3]">
              <Clock class="w-3.5 h-3.5" />
              <span>极速 3 分钟</span>
            </div>
            <p class="text-[11px] text-[#86868b]">无需整套长篇模考，6 道代表性小题快速定位。</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-1">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-[#34c759]">
              <Target class="w-3.5 h-3.5" />
              <span>精准阶梯定级</span>
            </div>
            <p class="text-[11px] text-[#86868b]">科学映射 Band 3.5 ~ 6.0 起始水平，不虚高、不盲目。</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-1">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-[#af52de]">
              <Award class="w-3.5 h-3.5" />
              <span>动态定制方案</span>
            </div>
            <p class="text-[11px] text-[#86868b]">即刻调优 178 天 4 阶段备考配额与艾宾浩斯突触复习。</p>
          </div>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            @click="step = 'testing'"
            class="w-full sm:w-auto px-8 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>立即开始 3 分钟定级测验</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>

          <button
            @click="emit('close')"
            class="w-full sm:w-auto px-6 py-3 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] text-xs font-medium rounded-full transition-colors cursor-pointer"
          >
            稍后测验 (保留 0.0 分)
          </button>
        </div>
      </div>

      <!-- STEP 2: TESTING QUESTION CAROUSEL -->
      <div v-if="step === 'testing'" class="flex-1 flex flex-col overflow-hidden">
        <!-- Progress Bar & Counter -->
        <div class="px-6 pt-4 pb-2 shrink-0">
          <div class="flex items-center justify-between text-xs text-[#86868b] mb-1.5">
            <span class="font-medium text-[#1d1d1f]">
              第 {{ currentIndex + 1 }} / {{ PLACEMENT_QUESTIONS.length }} 题
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-medium text-[11px]">
              {{ currentQuestion.category }}
            </span>
          </div>
          <div class="w-full bg-[#f5f5f7] rounded-full h-1.5 overflow-hidden">
            <div 
              class="h-full bg-[#0071e3] rounded-full transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>

        <!-- Question Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          <div class="space-y-2">
            <h3 class="text-base font-semibold text-[#1d1d1f] leading-snug">
              {{ currentQuestion.title }}
            </h3>

            <!-- Context snippet if any -->
            <div v-if="currentQuestion.context" class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.03] text-xs text-[#1d1d1f] font-serif leading-relaxed italic">
              "{{ currentQuestion.context }}"
            </div>

            <p class="text-xs sm:text-sm text-[#424245] leading-relaxed whitespace-pre-line font-normal">
              {{ currentQuestion.question }}
            </p>
          </div>

          <!-- Options -->
          <div class="space-y-2.5 pt-2">
            <div
              v-for="opt in currentQuestion.options"
              :key="opt.key"
              @click="handleSelectOption(opt.key)"
              :class="[
                'p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                userAnswers[currentQuestion.id] === opt.key
                  ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/15 shadow-sm'
                  : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border-transparent'
              ]"
            >
              <div class="flex items-center gap-3">
                <span :class="[
                  'w-7 h-7 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 transition-colors',
                  userAnswers[currentQuestion.id] === opt.key
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-white text-[#86868b] border border-black/[0.04]'
                ]">
                  {{ opt.key }}
                </span>
                <span :class="['text-xs sm:text-sm', userAnswers[currentQuestion.id] === opt.key ? 'font-medium text-[#1d1d1f]' : 'text-[#424245]']">
                  {{ opt.text }}
                </span>
              </div>

              <Check v-if="userAnswers[currentQuestion.id] === opt.key" class="w-4 h-4 text-[#0071e3] shrink-0" />
            </div>
          </div>
        </div>

        <!-- Action Bar Footer -->
        <div class="px-6 py-4 border-t border-black/[0.04] bg-[#fbfbfd] flex items-center justify-between shrink-0">
          <button
            @click="handlePrev"
            :disabled="currentIndex === 0"
            :class="[
              'px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors',
              currentIndex === 0 
                ? 'opacity-30 cursor-not-allowed text-[#86868b]' 
                : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] cursor-pointer'
            ]"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>上一题</span>
          </button>

          <button
            @click="handleNext"
            :disabled="!userAnswers[currentQuestion.id]"
            :class="[
              'px-6 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all',
              !userAnswers[currentQuestion.id]
                ? 'bg-black/[0.05] text-[#86868b] cursor-not-allowed'
                : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm cursor-pointer active:scale-98'
            ]"
          >
            <span>{{ currentIndex === PLACEMENT_QUESTIONS.length - 1 ? '提交并生成报告' : '下一题' }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- STEP 3: DIAGNOSTIC REPORT SCREEN -->
      <div v-if="step === 'report' && evaluation" class="p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-3xl bg-[#34c759]/10 text-[#34c759] flex items-center justify-center mx-auto shadow-sm">
            <Award class="w-7 h-7" />
          </div>
          <h2 class="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            初始水平定级报告已生成
          </h2>
          <p class="text-xs text-[#86868b]">
            恭喜完成入学会考！系统已测得您的起始水平基线
          </p>
        </div>

        <!-- Primary Score Badge Card (Apple Health style) -->
        <div class="p-6 rounded-3xl bg-[#f5f5f7] border border-black/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span class="text-xs font-medium text-[#86868b] uppercase tracking-wider block mb-1">
              经测定初始成绩 (Baseline Band)
            </span>
            <div class="flex items-baseline justify-center sm:justify-start gap-2">
              <span class="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
                Band {{ evaluation.testedBand.toFixed(1) }}
              </span>
              <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/[0.05] text-[#1d1d1f]">
                答对 {{ rawScore }}/6 题
              </span>
            </div>
            <div class="text-xs text-[#86868b] mt-1 font-medium">
              等级判定：{{ evaluation.levelTitle }}
            </div>
          </div>

          <div class="h-10 w-px bg-black/[0.08] hidden sm:block" />

          <div class="space-y-1">
            <div class="text-xs text-[#86868b]">冲刺目标分数</div>
            <div class="text-2xl font-semibold text-[#1d1d1f] tabular-nums">
              Band {{ activeUser.targetBand.toFixed(1) }}
            </div>
            <div class="text-xs text-[#86868b] font-normal">
              提分空间：<strong class="text-[#1d1d1f] font-medium">+{{ (activeUser.targetBand - evaluation.testedBand).toFixed(1) }}</strong> 分
            </div>
          </div>
        </div>

        <!-- Detailed Advice & Recommendation -->
        <div class="p-5 rounded-2xl bg-white border border-black/[0.06] space-y-2 shadow-2xs">
          <div class="flex items-center gap-2 text-xs font-semibold text-[#0071e3]">
            <Sparkles class="w-3.5 h-3.5" />
            <span>备考诊断与路线建议</span>
          </div>
          <p class="text-xs text-[#1d1d1f] leading-relaxed font-normal">
            {{ evaluation.summary }}
          </p>
          <p class="text-xs text-[#86868b] leading-relaxed font-normal pt-1 border-t border-black/[0.04]">
            💡 <strong>行动指南：</strong>{{ evaluation.advice }}
          </p>
        </div>

        <!-- Question Breakdown List -->
        <div class="space-y-2">
          <div class="text-xs font-semibold text-[#1d1d1f]">
            6 大维度作答与考点剖析
          </div>
          <div class="space-y-2">
            <div 
              v-for="q in PLACEMENT_QUESTIONS"
              :key="q.id"
              class="p-3.5 rounded-2xl bg-[#fbfbfd] border border-black/[0.04] text-xs space-y-1"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-[#1d1d1f]">
                  {{ q.id }}. {{ q.category }}
                </span>
                <span :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-medium',
                  userAnswers[q.id] === q.correctAnswer
                    ? 'bg-[#34c759]/10 text-[#34c759]' 
                    : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                ]">
                  {{ userAnswers[q.id] === q.correctAnswer ? '✓ 正确' : '✗ 需加强' }}
                </span>
              </div>
              <p class="text-[11px] text-[#86868b] leading-relaxed">
                考点：{{ q.explanation }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            @click="handleRestart"
            class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-black/[0.08] hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>重新摸底</span>
          </button>

          <button
            @click="handleApplyPlacement"
            class="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>保存定级并开启专属路线图</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
