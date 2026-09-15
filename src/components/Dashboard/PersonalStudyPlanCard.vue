<script setup lang="ts">
import { ref, computed } from 'vue';
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
  STUDY_PHASES, 
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
import AdaptationConfigModal from './AdaptationConfigModal.vue';

const emit = defineEmits<{
  (e: 'navigate', tab: string): void;
  (e: 'openPlacementTest'): void;
}>();

const config = ref<PersonalizedPlanConfig>(getStudyPlanConfig() || DEFAULT_PLAN_CONFIG);
const activePhaseIndex = ref(0);
const isConfigModalOpen = ref(false);
const completedTasks = ref<Record<string, boolean>>(getCompletedPlanTasks());

const currentPhase = computed<StudyPlanPhase>(() => STUDY_PHASES[activePhaseIndex.value] || STUDY_PHASES[0]);
const dailyTasks = computed<DailyPlanTask[]>(() => getDailyTasksForPhase(currentPhase.value.id));

const completedCount = computed(() => dailyTasks.value.filter(t => completedTasks.value[t.id]).length);
const progressPercent = computed(() => Math.round((completedCount.value / dailyTasks.value.length) * 100));

// Overall timeline progress (Day 1 / 178)
const timelinePct = computed(() => Math.min(100, Math.max(1, Math.round((config.value.currentDay / config.value.totalDays) * 100))));

const handleToggleTask = (taskId: string) => {
  const nowDone = togglePlanTask(taskId);
  completedTasks.value = {
    ...completedTasks.value,
    [taskId]: nowDone
  };
};

const handleSaveConfig = (newConfig: PersonalizedPlanConfig) => {
  config.value = newConfig;
  saveStudyPlanConfig(newConfig);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Hero Adaptation Banner (Apple Clean Card Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all">
      <div class="space-y-6">
        <!-- Top Tag & Settings Button -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1d1d1f] text-xs font-medium">
            <Sparkles class="w-3.5 h-3.5 text-[#86868b]" />
            <span>个人专属适配方案 · 178天进阶跃迁</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="config.currentBand === 0"
              @click="emit('openPlacementTest')"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Sparkles class="w-3.5 h-3.5 text-white/80" />
              <span>参加定级测验</span>
            </button>

            <button
              @click="isConfigModalOpen = true"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium border border-black/[0.04] transition-all cursor-pointer"
            >
              <Sliders class="w-3.5 h-3.5 text-[#86868b]" />
              <span>个性化参数调优</span>
            </button>
          </div>
        </div>

        <!-- Core Title & Band Progression -->
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              当前水平 <span class="font-semibold text-[#1d1d1f]">{{ config.currentBand === 0 ? 'Band 0.0 (待定级)' : `Band ${config.currentBand.toFixed(1)}` }}</span>
              <span class="mx-2.5 text-[#86868b] font-normal">➔</span>
              目标总分 <span class="font-semibold text-[#1d1d1f]">Band {{ config.targetBand.toFixed(1) }}</span>
            </h1>
            <p class="text-xs sm:text-sm text-[#86868b] max-w-2xl leading-relaxed">
              针对 4.0 基础（词汇量较小、长难句结构薄弱、精听连读弱）定制。178天 4 阶段平稳爬坡，四科目标分解：
              <span class="font-medium text-[#1d1d1f]"> 听力 {{ config.targetListening.toFixed(1) }}</span>、
              <span class="font-medium text-[#1d1d1f]"> 阅读 {{ config.targetReading.toFixed(1) }}</span>、
              <span class="font-medium text-[#1d1d1f]"> 写作 {{ config.targetWriting.toFixed(1) }}</span>、
              <span class="font-medium text-[#1d1d1f]"> 口语 {{ config.targetSpeaking.toFixed(1) }}</span>。
            </p>
          </div>

          <!-- Key Metrics Counter (Apple Clean Editorial Style) -->
          <div class="flex items-center gap-3 sm:gap-4 bg-[#f5f5f7] p-3 sm:p-4 rounded-2xl border border-black/[0.02] shrink-0">
            <div class="text-center px-2 sm:px-3">
              <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">{{ config.totalDays }}</div>
              <div class="text-[10px] sm:text-xs text-[#86868b] mt-0.5 font-normal">备考周期 (天)</div>
            </div>
            <div class="h-8 w-px bg-black/[0.08]" />
            <div class="text-center px-2 sm:px-3">
              <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">
                {{ config.currentBand === 0 ? '待测定' : `+${(config.targetBand - config.currentBand).toFixed(1)}` }}
              </div>
              <div class="text-[10px] sm:text-xs text-[#86868b] mt-0.5 font-normal">净提分幅度</div>
            </div>
            <div class="h-8 w-px bg-black/[0.08]" />
            <div class="text-center px-2 sm:px-3">
              <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">{{ config.dailyHours }}h</div>
              <div class="text-[10px] sm:text-xs text-[#86868b] mt-0.5 font-normal">每日投入</div>
            </div>
          </div>
        </div>

        <!-- Timeline Bar -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between text-xs text-[#86868b]">
            <span class="font-normal flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-[#86868b]" />
              备考进程：第 <strong class="text-[#1d1d1f] font-semibold">{{ config.currentDay }}</strong> 天 / 剩余 {{ config.totalDays - config.currentDay }} 天
            </span>
            <span class="text-xs font-medium text-[#0071e3]">
              当前阶段：Phase {{ currentPhase.phaseNumber }} ({{ currentPhase.dayRange }})
            </span>
          </div>
          <div class="w-full bg-[#f5f5f7] rounded-full h-2 overflow-hidden border border-black/[0.04]">
            <div 
              class="h-full bg-gradient-to-r from-[#0071e3] to-[#34c759] rounded-full transition-all duration-500"
              :style="{ width: `${timelinePct}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Progressive Phases Interactive Tabs -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.04]">
        <div>
          <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
            <TrendingUp class="w-4 h-4 text-[#0071e3]" />
            178 天 4 阶段进阶路线图
          </h2>
          <p class="text-xs text-[#86868b] mt-0.5">循序渐进：从词汇语法脱敏，到真题题型技巧，再到同义替换与全真模考</p>
        </div>
        <span class="text-xs font-medium px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full border border-[#0071e3]/15 shrink-0 self-start sm:self-auto">
          阶段 {{ activePhaseIndex + 1 }} / 4
        </span>
      </div>

      <!-- Phase Pill Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="(phase, idx) in STUDY_PHASES"
          :key="phase.id"
          @click="activePhaseIndex = idx"
          :class="[
            'p-4 rounded-2xl text-left border transition-all relative overflow-hidden cursor-pointer',
            activePhaseIndex === idx 
              ? 'bg-[#1d1d1f] text-white border-transparent shadow-md' 
              : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border-transparent'
          ]"
        >
          <span 
            v-if="idx === 0"
            :class="[
              'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium',
              activePhaseIndex === idx ? 'bg-white/20 text-white' : 'bg-black/[0.05] text-[#1d1d1f]'
            ]"
          >
            进行中
          </span>
          <div :class="['text-[11px] font-medium uppercase tracking-wider', activePhaseIndex === idx ? 'text-slate-300' : 'text-[#86868b]']">
            Phase {{ phase.phaseNumber }} · {{ phase.dayRange }}
          </div>
          <div class="font-semibold text-sm mt-1 line-clamp-1">
            {{ phase.name.split('·')[0] }}
          </div>
          <div :class="[
            'text-xs font-medium mt-2 inline-block px-2.5 py-0.5 rounded-full',
            activePhaseIndex === idx ? 'bg-white/20 text-white' : 'bg-white text-[#1d1d1f] border border-black/[0.06]'
          ]">
            {{ phase.targetBand }}
          </div>
        </button>
      </div>

      <!-- Active Phase Deep Dive Card -->
      <div class="bg-[#fbfbfd] rounded-2xl p-5 sm:p-6 border border-black/[0.04] space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span class="text-xs font-medium text-[#86868b] uppercase tracking-wide">
              Phase {{ currentPhase.phaseNumber }} 规划细节
            </span>
            <h3 class="text-lg font-semibold text-[#1d1d1f] mt-0.5">
              {{ currentPhase.name }}
            </h3>
            <p class="text-xs text-[#86868b] mt-0.5">
              {{ currentPhase.subtitle }}
            </p>
          </div>
          <div class="px-3 py-1 rounded-full bg-black/[0.04] text-[#1d1d1f] font-medium text-xs shrink-0 self-start sm:self-auto border border-black/[0.06]">
            🎯 目标：{{ currentPhase.targetBand }}
          </div>
        </div>

        <!-- 4 Skills Strategy Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div class="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
            <div class="flex items-center gap-2 font-medium text-xs text-[#1d1d1f]">
              <Headphones class="w-4 h-4 text-[#86868b]" />
              <span>听力精听攻坚</span>
            </div>
            <p class="text-xs text-[#6e6e73] leading-relaxed">
              {{ currentPhase.listeningStrategy }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
            <div class="flex items-center gap-2 font-medium text-xs text-[#1d1d1f]">
              <BookOpen class="w-4 h-4 text-[#86868b]" />
              <span>阅读结构化定位</span>
            </div>
            <p class="text-xs text-[#6e6e73] leading-relaxed">
              {{ currentPhase.readingStrategy }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
            <div class="flex items-center gap-2 font-medium text-xs text-[#1d1d1f]">
              <PenTool class="w-4 h-4 text-[#86868b]" />
              <span>写作结构规范</span>
            </div>
            <p class="text-xs text-[#6e6e73] leading-relaxed">
              {{ currentPhase.writingStrategy }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
            <div class="flex items-center gap-2 font-medium text-xs text-[#1d1d1f]">
              <Mic class="w-4 h-4 text-[#86868b]" />
              <span>口语流利串题</span>
            </div>
            <p class="text-xs text-[#6e6e73] leading-relaxed">
              {{ currentPhase.speakingStrategy }}
            </p>
          </div>
        </div>

        <!-- Core Objectives Checklist -->
        <div class="bg-white p-4 rounded-2xl border border-black/[0.04] shadow-2xs">
          <h4 class="text-xs font-semibold text-[#1d1d1f] mb-2.5 flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-[#34c759]" />
            阶段攻坚验收目标 (Core Objectives)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="(obj, i) in currentPhase.coreObjectives" :key="i" class="flex items-start gap-2 text-xs text-[#6e6e73]">
              <div class="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0" />
              <span>{{ obj }}</span>
            </div>
          </div>
        </div>

        <!-- Key Milestone -->
        <div class="bg-[#0071e3]/5 p-3.5 rounded-xl border border-[#0071e3]/10 flex items-center justify-between text-xs">
          <span class="font-medium text-[#1d1d1f] flex items-center gap-2">
            <Award class="w-4 h-4 text-[#0071e3] shrink-0" />
            <span>阶段考核验收：{{ currentPhase.keyMilestone }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Today's Action Checklist -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.04]">
        <div>
          <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-[#34c759]" />
            今日阶段定制任务打卡 (Phase {{ currentPhase.phaseNumber }} · Day {{ config.currentDay }})
          </h2>
          <p class="text-xs text-[#86868b] mt-0.5">保质完成每日量化目标，点击「去练习」直达实战训练模块</p>
        </div>
        
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="text-xs font-medium px-3 py-1 bg-[#34c759]/10 text-[#34c759] rounded-full border border-[#34c759]/20">
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
            'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3',
            completedTasks[task.id] 
              ? 'bg-[#34c759]/5 border-[#34c759]/20' 
              : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/70 border-transparent'
          ]"
        >
          <!-- Left checkbox & text -->
          <div 
            @click="handleToggleTask(task.id)"
            class="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0"
          >
            <div class="mt-0.5 shrink-0">
              <CheckCircle2 v-if="completedTasks[task.id]" class="w-5 h-5 text-[#34c759]" />
              <Circle v-else class="w-5 h-5 text-[#86868b] hover:text-[#0071e3] transition-colors" />
            </div>
            <div>
              <div :class="['text-sm font-medium', completedTasks[task.id] ? 'line-through text-[#86868b]' : 'text-[#1d1d1f]']">
                {{ task.title }}
              </div>
              <div class="text-xs text-[#86868b] mt-0.5">
                {{ task.description }} · <span class="text-[#0071e3] font-medium">{{ task.durationMinutes }} 分钟</span>
              </div>
            </div>
          </div>

          <!-- Right Direct Action Link (Apple Pill) -->
          <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              @click="emit('navigate', task.targetModule)"
              :class="[
                'px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer',
                completedTasks[task.id] 
                  ? 'bg-[#e8e8ed] text-[#6e6e73] hover:bg-[#dcdce0]' 
                  : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm active:scale-98'
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
    />
  </div>
</template>
