<script setup lang="ts">
import { computed } from 'vue';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  Dice5,
  Layers,
  CheckCircle2
} from 'lucide-vue-next';
import type { UserProfile, TestResult, ModuleType } from '../../types/ielts';
import type { UserAccount } from '../../types/auth';
import PersonalStudyPlanCard from './PersonalStudyPlanCard.vue';
import EbbinghausWidget from './EbbinghausWidget.vue';
import { getStudyPlanConfig } from '../../services/storage';
import { BANK_COLLECTIONS, getBankStatistics, getBankInfo } from '../../services/questionBankService';

const props = defineProps<{
  profile: UserProfile;
  results: TestResult[];
  mistakesCount: number;
  activeUser?: UserAccount;
}>();

const emit = defineEmits<{
  (e: 'navigate', tab: string): void;
  (e: 'openPlacementTest'): void;
  (e: 'openSmartRandom', mod?: ModuleType): void;
}>();

const bankStats = computed(() => getBankStatistics());
const nonAllBanks = computed(() => BANK_COLLECTIONS.filter(b => b.id !== 'all'));

const isUntestedUser = computed(() => {
  if (!props.activeUser) return true;
  return !props.activeUser.hasCompletedPlacement || props.activeUser.currentBand === 0;
});

const planConfig = computed(() => {
  return getStudyPlanConfig(props.activeUser?.id) || {
    currentBand: isUntestedUser.value ? 0.0 : (props.activeUser?.currentBand ?? 0.0),
    targetBand: props.activeUser?.targetBand ?? 7.0,
    targetListening: 7.5,
    targetReading: 7.5,
    targetWriting: 6.5,
    targetSpeaking: 6.5,
    totalDays: 178
  };
});

const skills = computed(() => {
  const untested = isUntestedUser.value;
  return [
    { 
      name: '听力 Listening', 
      current: props.results.filter(r => r.module === 'listening')[0]?.band ?? (untested ? 0 : planConfig.value.currentBand), 
      target: planConfig.value.targetListening, 
      icon: Headphones, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      barColor: 'bg-blue-600',
      note: '核心拉分项 · 目标 32/40 题'
    },
    { 
      name: '阅读 Reading', 
      current: props.results.filter(r => r.module === 'reading')[0]?.band ?? (untested ? 0 : planConfig.value.currentBand), 
      target: planConfig.value.targetReading, 
      icon: BookOpen, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50', 
      barColor: 'bg-teal-600',
      note: '核心拉分项 · 目标 33/40 题'
    },
    { 
      name: '写作 Writing', 
      current: untested ? 0 : planConfig.value.currentBand, 
      target: planConfig.value.targetWriting, 
      icon: PenTool, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      barColor: 'bg-purple-600',
      note: '稳健输出项 · 论证严密不跑题'
    },
    { 
      name: '口语 Speaking', 
      current: untested ? 0 : planConfig.value.currentBand, 
      target: planConfig.value.targetSpeaking, 
      icon: Mic, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      barColor: 'bg-amber-500',
      note: '流畅沟通项 · 万能故事串题'
    },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <!-- 0. Diagnostic Placement Test Hero Banner (Appears when activeUser is untested) -->
    <div 
      v-if="isUntestedUser"
      class="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-card-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-xs shrink-0">
          <Sparkles class="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-base text-slate-900">新学员无初始成绩 · 需经测验后定级</h3>
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200/60 select-none">
              待学术定级
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
            新注册学员暂无预设成绩。完成 3 分钟极速摸底（6 道精选核心题），测定真实学术基础并生成专属提分路线图。
          </p>
        </div>
      </div>
      <button
        @click="emit('openPlacementTest')"
        class="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <span>开始 3 分钟学术定级</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>

    <!-- 1. Personalized Adaptation Study Plan -->
    <PersonalStudyPlanCard 
      :activeUser="activeUser"
      @navigate="emit('navigate', $event)" 
      @openPlacementTest="emit('openPlacementTest')" 
    />

    <!-- 2. Ebbinghaus Spaced Repetition Memory Engine -->
    <EbbinghausWidget @navigate="emit('navigate', $event)" />

    <!-- 4 Skills Target Progress Grid (Apple Inset Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="skill in skills" 
        :key="skill.name" 
        class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-card-subtle hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div :class="['p-2 rounded-xl', skill.bg, skill.color]">
              <component :is="skill.icon" class="w-4 h-4" />
            </div>
            <span class="font-bold text-slate-900 text-sm font-sans">{{ skill.name }}</span>
          </div>
          <span class="text-xs font-semibold text-slate-500 tabular-nums">目标 {{ skill.target.toFixed(1) }}</span>
        </div>
        
        <div class="flex items-baseline justify-between mb-2.5">
          <span class="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {{ skill.current === 0 ? '待测定' : `Band ${skill.current.toFixed(1)}` }}
          </span>
          <span class="text-xs font-medium text-slate-500 tabular-nums">
            {{ skill.current === 0 ? '无初始成绩' : `达标度 ${Math.min(100, Math.round((skill.current / skill.target) * 100))}%` }}
          </span>
        </div>

        <!-- Rounded Pill Progress Bar -->
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
          <div 
            :class="['h-full rounded-full transition-all duration-500', skill.barColor]" 
            :style="{ width: `${skill.current === 0 ? 0 : Math.min(100, Math.round((skill.current / skill.target) * 100))}%` }"
          />
        </div>
        <div class="mt-2.5 text-[11px] text-slate-400 font-normal">
          {{ skill.note }}
        </div>
      </div>
    </div>

    <!-- Multi-Bank Matrix & Smart Random Drill (Apple Studio Card) -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card-subtle space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
            <Layers class="w-3.5 h-3.5" />
            <span>雅思全真题库矩阵 · 官方真题与换题季机考</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            四大真题库全景 & 智能随机抽题
          </h2>
          <p class="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            涵盖剑桥雅思 17-19 官方全真卷与 2025/2026 机考回忆，累计收录 {{ bankStats.all.readingCount }} 套学术阅读、{{ bankStats.all.listeningCount }} 套机考听力、{{ bankStats.all.writingCount }} 篇高分写作与 {{ bankStats.all.speakingCount }} 组当季口语卡。
          </p>
        </div>

        <button
          @click="emit('openSmartRandom')"
          class="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] flex items-center gap-2 self-start sm:self-center focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <Dice5 class="w-4 h-4 text-amber-400" />
          <span>智能随机抽题模考</span>
        </button>
      </div>

      <!-- 4 Bank Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        <div
          v-for="bank in nonAllBanks"
          :key="bank.id"
          class="p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-3"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-xs font-bold text-slate-900 font-sans">{{ bank.shortName }}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-semibold tabular-nums select-none">
                {{ bank.year }}
              </span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {{ bank.subtitle }}
            </p>
          </div>

          <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium tabular-nums">
            <span>听读 {{ (bankStats[bank.id]?.readingCount || 0) + (bankStats[bank.id]?.listeningCount || 0) }} 卷</span>
            <span>写说 {{ (bankStats[bank.id]?.writingCount || 0) + (bankStats[bank.id]?.speakingCount || 0) }} 题</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Two-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Quick Practice Shortcuts -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card-subtle">
          <h2 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-sans">
            <Flame class="w-4 h-4 text-amber-500" />
            快速开启备考实战
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div 
              @click="emit('navigate', 'reading')"
              class="group p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-slate-900 font-semibold text-sm font-sans">
                  <BookOpen class="w-4 h-4 text-teal-600" />
                  <span>学术类阅读机考</span>
                </div>
                <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">左右分屏、划线高亮笔记、Headings & TFNG 真实机考体验。</p>
            </div>

            <div 
              @click="emit('navigate', 'listening')"
              class="group p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-slate-900 font-semibold text-sm font-sans">
                  <Headphones class="w-4 h-4 text-blue-600" />
                  <span>听力真题与精听</span>
                </div>
                <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">倍速播放、快退 5 秒、S1-S4 答题卡与原文定位对照。</p>
            </div>

            <div 
              @click="emit('navigate', 'writing')"
              class="group p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-slate-900 font-semibold text-sm font-sans">
                  <PenTool class="w-4 h-4 text-purple-600" />
                  <span>写作限时与智能批改</span>
                </div>
                <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">Task 1/2 题库、实时字数统计、Band 9 范文与 4 维机考评分。</p>
            </div>

            <div 
              @click="emit('navigate', 'speaking')"
              class="group p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-slate-900 font-semibold text-sm font-sans">
                  <Mic class="w-4 h-4 text-amber-600" />
                  <span>口语仿真考场</span>
                </div>
                <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">Part 2 准备 1 分钟 + 作答 2 分钟提示音，原生高清录音复盘。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Mistake Alert & Test History -->
      <div class="space-y-6">
        <!-- Mistake Notebook Card -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card-subtle space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-sans">
              <Award class="w-4 h-4 text-amber-500" />
              错题本与弱项突破
            </span>
            <span class="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full tabular-nums border border-slate-200 select-none">
              {{ mistakesCount }} 题待温习
            </span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            雅思考试提分的核心在于“错题归因”。分析是定位失误、同义替换遗漏还是时间分配不均。
          </p>
          <button
            @click="emit('navigate', 'mistakes')"
            class="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-medium text-xs rounded-full transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <span>查看我的错题本</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Vocabulary Flashcard Shortcut -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card-subtle space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-sans">
              <Sparkles class="w-4 h-4 text-sky-500" />
              同义替换与核心词库
            </span>
            <span class="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full tabular-nums border border-slate-200 select-none">
              100+ 核心组
            </span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            掌握 substantial = considerable、mitigate = alleviate 等 500 组听读同义替换词对。
          </p>
          <button
            @click="emit('navigate', 'vocabulary')"
            class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <span>开始刷词闪卡</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Recent Test History -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card-subtle">
          <h3 class="font-bold text-slate-900 text-sm mb-3.5 flex items-center gap-1.5 font-sans">
            <TrendingUp class="w-4 h-4 text-emerald-600" />
            模考成绩记录
          </h3>

          <div v-if="results.length === 0" class="text-center py-6 text-slate-400 text-xs font-normal">
            暂无模考记录，完成一套阅读或听力后自动沉淀在此。
          </div>
          <div v-else class="space-y-2">
            <div 
              v-for="res in results.slice(0, 4)" 
              :key="res.id" 
              class="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs"
            >
              <div>
                <div class="font-semibold text-slate-900 line-clamp-1">{{ res.testTitle }}</div>
                <div class="text-slate-500 text-[11px] mt-0.5 tabular-nums">
                  {{ new Date(res.completedAt).toLocaleDateString() }} · 正确 {{ res.score }}/40
                </div>
              </div>
              <div class="font-bold text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 tabular-nums">
                Band {{ res.band.toFixed(1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
