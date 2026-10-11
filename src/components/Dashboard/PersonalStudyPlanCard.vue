<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Sliders, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ShieldCheck
} from 'lucide-vue-next';
import { 
  type PersonalizedPlanConfig, 
  getStudyPhases, 
  type StudyPlanPhase, 
  getDailyTasksForPhase, 
  type DailyPlanTask, 
  DEFAULT_PLAN_CONFIG 
} from '../../data/studyPlanData';
import { 
  getStudyPlanConfig, 
  saveStudyPlanConfig, 
  getCompletedPlanTasks, 
  togglePlanTask 
} from '../../services/storage';
import type { UserAccount } from '../../types/auth';
import AdaptationConfigModal from './AdaptationConfigModal.vue';
import { useModals } from '../../composables/useModals';
import { MapPin, BrainCircuit } from 'lucide-vue-next';

const props = defineProps<{
  activeUser?: UserAccount;
}>();

const emit = defineEmits<{
  (e: 'navigate', tab: string): void;
  (e: 'openPlacementTest'): void;
}>();

const isUntested = computed(() => {
  if (!props.activeUser) return true;
  return !props.activeUser.hasCompletedPlacement || props.activeUser.currentBand === 0;
});

const loadPlanConfig = (): PersonalizedPlanConfig => {
  const saved = getStudyPlanConfig(props.activeUser?.id);
  const baseBand = (!isUntested.value && (props.activeUser?.currentBand ?? 0) > 0)
    ? (props.activeUser?.currentBand ?? 0.0)
    : 0.0;

  // Calculate dynamic days remaining if examDate exists
  let dynamicDays = 60;
  if (props.activeUser?.examDate) {
    const today = new Date();
    const exam = new Date(props.activeUser.examDate);
    dynamicDays = Math.max(1, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }

  if (saved) {
    return {
      ...DEFAULT_PLAN_CONFIG,
      ...saved,
      currentBand: isUntested.value ? 0.0 : (saved.currentBand || baseBand),
      targetBand: saved.targetBand || props.activeUser?.targetBand || 7.0,
      totalDays: saved.totalDays || dynamicDays,
      targetCenter: saved.targetCenter || props.activeUser?.targetCenter,
      targetSession: saved.targetSession || props.activeUser?.targetSession,
      examDate: saved.examDate || props.activeUser?.examDate
    };
  }

  return {
    ...DEFAULT_PLAN_CONFIG,
    currentBand: baseBand,
    targetBand: props.activeUser?.targetBand || 7.0,
    totalDays: dynamicDays,
    targetCenter: props.activeUser?.targetCenter,
    targetSession: props.activeUser?.targetSession,
    examDate: props.activeUser?.examDate
  };
};

const config = ref<PersonalizedPlanConfig>(loadPlanConfig());
const activePhaseIndex = ref(0);
const isConfigModalOpen = ref(false);
const { openGoalSetting } = useModals();
const completedTasks = ref<Record<string, boolean>>(getCompletedPlanTasks(props.activeUser?.id));

watch(() => props.activeUser, () => {
  config.value = loadPlanConfig();
  completedTasks.value = getCompletedPlanTasks(props.activeUser?.id);
}, { deep: true });

const phases = computed(() => getStudyPhases(config.value.currentBand, config.value.targetBand));
const currentPhase = computed<StudyPlanPhase>(() => phases.value[activePhaseIndex.value] || phases.value[0]);
const dailyTasks = computed<DailyPlanTask[]>(() => getDailyTasksForPhase(currentPhase.value.id));

const completedCount = computed(() => dailyTasks.value.filter(t => completedTasks.value[t.id]).length);
const progressPercent = computed(() => Math.round((completedCount.value / dailyTasks.value.length) * 100));

// Overall timeline progress
const timelinePct = computed(() => Math.min(100, Math.max(1, Math.round((config.value.currentDay / config.value.totalDays) * 100))));

const handleToggleTask = (taskId: string) => {
  const nowDone = togglePlanTask(taskId, props.activeUser?.id);
  completedTasks.value = {
    ...completedTasks.value,
    [taskId]: nowDone
  };
};

const handleSaveConfig = (newConfig: PersonalizedPlanConfig) => {
  config.value = newConfig;
  saveStudyPlanConfig(newConfig, props.activeUser?.id);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Hero Adaptation Banner (Apple Clean Card Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card-subtle relative overflow-hidden transition-all">
      <div class="space-y-6">
        <!-- Top Tag & Settings Button -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-semibold select-none">
            <Sparkles class="w-3.5 h-3.5 text-amber-500" />
            <span>个人专属适配方案 · {{ config.targetCenter ? `${config.targetCenter} · ` : '' }}{{ config.totalDays }}天进阶跃迁</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!isUntested"
              @click="openGoalSetting"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <BrainCircuit class="w-3.5 h-3.5 text-amber-400" />
              <span>AI 定制考期与学时</span>
            </button>

            <button
              v-if="isUntested"
              @click="emit('openPlacementTest')"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Sparkles class="w-3.5 h-3.5 text-amber-400" />
              <span>参加定级测验</span>
            </button>

            <button
              @click="isConfigModalOpen = true"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200 transition-all duration-150 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Sliders class="w-3.5 h-3.5 text-slate-500" />
              <span>个性化参数调优</span>
            </button>
          </div>
        </div>

        <!-- Core Title & Band Progression -->
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
                当前水平 <span class="text-slate-900">{{ isUntested ? '待测定 (无初始成绩)' : `Band ${config.currentBand.toFixed(1)} (实测)` }}</span>
                <span class="mx-2.5 text-slate-400 font-normal">➔</span>
                目标总分 <span class="text-sky-600">Band {{ config.targetBand.toFixed(1) }}</span>
              </h1>
            </div>

            <!-- Target Center & Session Badge -->
            <div v-if="config.targetCenter || config.examDate" class="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 text-xs text-slate-800 border border-slate-200/80">
              <MapPin class="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span class="font-semibold">{{ config.targetCenter || '已选官方考点' }}</span>
              <span class="text-slate-300">·</span>
              <Calendar class="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span class="tabular-nums">{{ config.examDate }} {{ config.targetSession || '' }}</span>
              <button 
                @click="openGoalSetting" 
                class="text-sky-600 hover:text-sky-800 hover:underline font-semibold text-[11px] ml-1 cursor-pointer"
              >
                修改场次
              </button>
            </div>

            <p v-if="isUntested" class="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              新学员档案尚未测定初始成绩，一切需经测验后定论。完成 3 分钟学术定级测验后，系统将依据实测分数精准重构四科专属方案。目标分解：
              <span class="font-semibold text-slate-900"> 听力 {{ config.targetListening.toFixed(1) }}</span>、
              <span class="font-semibold text-slate-900"> 阅读 {{ config.targetReading.toFixed(1) }}</span>、
              <span class="font-semibold text-slate-900"> 写作 {{ config.targetWriting.toFixed(1) }}</span>、
              <span class="font-semibold text-slate-900"> 口语 {{ config.targetSpeaking.toFixed(1) }}</span>。
            </p>
            <p v-else class="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              基于学术测验定级（Band {{ config.currentBand.toFixed(1) }}）量身定制。{{ config.totalDays }}天 4 阶段平稳爬坡，四科目标分解：
              <span class="font-semibold text-slate-900"> 听力 {{ config.targetListening.toFixed(1) }}</span>、
              <span class="font-semibold text-slate-900"> 阅读 {{ config.targetReading.toFixed(1) }}</span>、
              <span class="font-semibold text-slate-900"> 写作 {{ config.targetWriting.toFixed(1) }}</span>、
              <span class="font-semibold text-slate-900"> 口语 {{ config.targetSpeaking.toFixed(1) }}</span>。
            </p>
          </div>

          <!-- Key Metrics Counter (Clickable to trigger AI calculation) -->
          <div 
            @click="openGoalSetting" 
            class="flex items-center gap-3 sm:gap-4 bg-slate-50 hover:bg-slate-100 p-3 sm:p-4 rounded-2xl border border-slate-200/80 shrink-0 cursor-pointer transition-all duration-150 active:scale-[0.98] group shadow-card-subtle"
            title="点击使用 AI 重新测算考期与每日投入"
          >
            <div class="text-center px-2 sm:px-3">
              <div class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ config.totalDays }}</div>
              <div class="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-normal">备考周期 (天)</div>
            </div>
            <div class="h-8 w-px bg-slate-200" />
            <div class="text-center px-2 sm:px-3">
              <div class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {{ isUntested ? '待测定' : `+${(config.targetBand - config.currentBand).toFixed(1)}` }}
              </div>
              <div class="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-normal">{{ isUntested ? '初始未定级' : '净提分幅度' }}</div>
            </div>
            <div class="h-8 w-px bg-slate-200" />
            <div class="text-center px-2 sm:px-3">
              <div class="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-600 tabular-nums group-hover:scale-105 transition-transform flex items-center justify-center gap-0.5">
                <span>{{ config.dailyHours }}h</span>
              </div>
              <div class="text-[10px] sm:text-xs text-sky-600 mt-0.5 font-semibold flex items-center justify-center gap-0.5 select-none">
                <Sparkles class="w-3 h-3 text-amber-500" />
                <span>AI每日投入</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Bar -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-normal flex items-center gap-1.5 select-none">
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              备考进程：第 <strong class="text-slate-900 font-semibold tabular-nums">{{ config.currentDay }}</strong> 天 / 剩余 <span class="tabular-nums">{{ config.totalDays - config.currentDay }}</span> 天
            </span>
            <span class="text-xs font-semibold text-sky-600 select-none">
              当前阶段：Phase {{ currentPhase.phaseNumber }} ({{ currentPhase.dayRange }})
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div 
              class="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
              :style="{ width: `${timelinePct}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Progressive Phases Interactive Tabs -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card-subtle space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 font-sans">
            <TrendingUp class="w-4 h-4 text-sky-600" />
            {{ config.totalDays }} 天 4 阶段进阶路线图
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">循序渐进：从词汇语法脱敏，到真题题型技巧，再到同义替换与全真模考</p>
        </div>
        <span class="text-xs font-semibold px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-200/70 shrink-0 self-start sm:self-auto tabular-nums select-none">
          阶段 {{ activePhaseIndex + 1 }} / 4
        </span>
      </div>

      <!-- Phase Pill Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="(phase, idx) in phases"
          :key="phase.id"
          @click="activePhaseIndex = idx"
          :class="[
            'p-4 rounded-2xl text-left border transition-all duration-150 relative overflow-hidden cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500',
            activePhaseIndex === idx 
              ? 'bg-slate-900 text-white border-transparent shadow-md' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200/80 hover:border-slate-300'
          ]"
        >
          <span 
            v-if="idx === 0"
            :class="[
              'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold select-none',
              activePhaseIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
            ]"
          >
            进行中
          </span>
          <div :class="['text-[11px] font-semibold uppercase tracking-wider', activePhaseIndex === idx ? 'text-slate-300' : 'text-slate-500']">
            Phase {{ phase.phaseNumber }} · {{ phase.dayRange }}
          </div>
          <div class="font-bold text-sm mt-1 line-clamp-1 font-sans">
            {{ phase.name.split('·')[0] }}
          </div>
          <div :class="[
            'text-xs font-semibold mt-2 inline-block px-2.5 py-0.5 rounded-full tabular-nums',
            activePhaseIndex === idx ? 'bg-white/20 text-white' : 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
          ]">
            {{ phase.targetBand }}
          </div>
        </button>
      </div>

      <!-- Active Phase Deep Dive Card -->
      <div class="bg-slate-50/70 rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Phase {{ currentPhase.phaseNumber }} 规划细节
            </span>
            <h3 class="text-lg font-bold text-slate-900 mt-0.5 font-sans">
              {{ currentPhase.name }}
            </h3>
            <p class="text-xs text-slate-600 mt-0.5">
              {{ currentPhase.subtitle }}
            </p>
          </div>
          <div class="px-3 py-1 rounded-full bg-white text-slate-800 font-semibold text-xs shrink-0 self-start sm:self-auto border border-slate-200 shadow-2xs flex items-center gap-1.5 select-none">
            <Target class="w-3.5 h-3.5 text-sky-600" />
            <span>目标：{{ currentPhase.targetBand }}</span>
          </div>
        </div>

        <!-- 4 Skills Strategy Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-card-subtle">
            <div class="flex items-center gap-2 font-semibold text-xs text-slate-900 font-sans">
              <Headphones class="w-4 h-4 text-blue-600" />
              <span>听力精听攻坚</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ currentPhase.listeningStrategy }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-card-subtle">
            <div class="flex items-center gap-2 font-semibold text-xs text-slate-900 font-sans">
              <BookOpen class="w-4 h-4 text-teal-600" />
              <span>阅读结构化定位</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ currentPhase.readingStrategy }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-card-subtle">
            <div class="flex items-center gap-2 font-semibold text-xs text-slate-900 font-sans">
              <PenTool class="w-4 h-4 text-purple-600" />
              <span>写作结构规范</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ currentPhase.writingStrategy }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-card-subtle">
            <div class="flex items-center gap-2 font-semibold text-xs text-slate-900 font-sans">
              <Mic class="w-4 h-4 text-amber-600" />
              <span>口语流利串题</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ currentPhase.speakingStrategy }}
            </p>
          </div>
        </div>

        <!-- Core Objectives Checklist -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card-subtle">
          <h4 class="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5 font-sans">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            阶段攻坚验收目标 (Core Objectives)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="(obj, i) in currentPhase.coreObjectives" :key="i" class="flex items-start gap-2 text-xs text-slate-600">
              <div class="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
              <span>{{ obj }}</span>
            </div>
          </div>
        </div>

        <!-- Key Milestone -->
        <div class="bg-sky-50 p-3.5 rounded-xl border border-sky-200/70 flex items-center justify-between text-xs">
          <span class="font-semibold text-slate-900 flex items-center gap-2">
            <Award class="w-4 h-4 text-sky-600 shrink-0" />
            <span>阶段考核验收：{{ currentPhase.keyMilestone }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Today's Action Checklist -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card-subtle space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
        <div>
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 font-sans">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            今日阶段定制任务打卡 (Phase {{ currentPhase.phaseNumber }} · Day {{ config.currentDay }})
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">保质完成每日量化目标，点击「去练习」直达实战训练模块</p>
        </div>
        
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/80 select-none tabular-nums">
            达成度 {{ progressPercent }}% ({{ completedCount }}/{{ dailyTasks.length }} 项)
          </span>
        </div>
      </div>

      <!-- Task List -->
      <div class="space-y-2.5">
        <div 
          v-for="task in dailyTasks"
          :key="task.id"
          :class="[
            'p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3',
            completedTasks[task.id] 
              ? 'bg-emerald-50/40 border-emerald-200/80' 
              : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-card-subtle'
          ]"
        >
          <!-- Left checkbox & text -->
          <div 
            @click="handleToggleTask(task.id)"
            class="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0"
          >
            <div class="mt-0.5 shrink-0">
              <CheckCircle2 v-if="completedTasks[task.id]" class="w-5 h-5 text-emerald-600" />
              <Circle v-else class="w-5 h-5 text-slate-400 hover:text-sky-600 transition-colors" />
            </div>
            <div>
              <div :class="['text-sm font-semibold font-sans', completedTasks[task.id] ? 'line-through text-slate-400' : 'text-slate-900']">
                {{ task.title }}
              </div>
              <div class="text-xs text-slate-500 mt-0.5">
                {{ task.description }} · <span class="text-sky-600 font-medium tabular-nums">{{ task.durationMinutes }} 分钟</span>
              </div>
            </div>
          </div>

          <!-- Right Direct Action Link -->
          <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              @click="emit('navigate', task.targetModule)"
              :class="[
                'px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500',
                completedTasks[task.id] 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              ]"
            >
              <span>{{ completedTasks[task.id] ? '重温' : '去练习' }}</span>
              <ArrowRight class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Adaptation Configuration Modal -->
    <AdaptationConfigModal
      :isOpen="isConfigModalOpen"
      :config="config"
      @close="isConfigModalOpen = false"
      @save="handleSaveConfig"
      @openAiWizard="() => {
        isConfigModalOpen = false;
        openGoalSetting();
      }"
    />
  </div>
</template>
