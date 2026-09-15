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
  Sparkles
} from 'lucide-vue-next';
import type { UserProfile, TestResult } from '../../types/ielts';
import type { UserAccount } from '../../types/auth';
import PersonalStudyPlanCard from './PersonalStudyPlanCard.vue';
import EbbinghausWidget from './EbbinghausWidget.vue';
import { getStudyPlanConfig } from '../../services/storage';

const props = defineProps<{
  profile: UserProfile;
  results: TestResult[];
  mistakesCount: number;
  activeUser?: UserAccount;
}>();

const emit = defineEmits<{
  (e: 'navigate', tab: string): void;
  (e: 'openPlacementTest'): void;
}>();

const planConfig = computed(() => {
  return getStudyPlanConfig() || {
    currentBand: props.activeUser?.currentBand ?? 0.0,
    targetBand: 7.0,
    targetListening: 7.5,
    targetReading: 7.5,
    targetWriting: 6.5,
    targetSpeaking: 6.5,
    totalDays: 178
  };
});

const skills = computed(() => [
  { 
    name: '听力 Listening', 
    current: props.results.filter(r => r.module === 'listening')[0]?.band ?? planConfig.value.currentBand, 
    target: planConfig.value.targetListening, 
    icon: Headphones, 
    color: 'text-[#1d1d1f]', 
    bg: 'bg-black/[0.04]', 
    barColor: 'bg-[#1d1d1f]',
    note: '核心拉分项 · 目标 32/40 题'
  },
  { 
    name: '阅读 Reading', 
    current: props.results.filter(r => r.module === 'reading')[0]?.band ?? planConfig.value.currentBand, 
    target: planConfig.value.targetReading, 
    icon: BookOpen, 
    color: 'text-[#1d1d1f]', 
    bg: 'bg-black/[0.04]', 
    barColor: 'bg-[#1d1d1f]',
    note: '核心拉分项 · 目标 33/40 题'
  },
  { 
    name: '写作 Writing', 
    current: planConfig.value.currentBand, 
    target: planConfig.value.targetWriting, 
    icon: PenTool, 
    color: 'text-[#1d1d1f]', 
    bg: 'bg-black/[0.04]', 
    barColor: 'bg-[#1d1d1f]',
    note: '稳健输出项 · 论证严密不跑题'
  },
  { 
    name: '口语 Speaking', 
    current: planConfig.value.currentBand, 
    target: planConfig.value.targetSpeaking, 
    icon: Mic, 
    color: 'text-[#1d1d1f]', 
    bg: 'bg-black/[0.04]', 
    barColor: 'bg-[#1d1d1f]',
    note: '流畅沟通项 · 万能故事串题'
  },
]);
</script>

<template>
  <div class="space-y-6">
    <!-- 0. Diagnostic Placement Test Hero Banner (Appears when activeUser.currentBand === 0) -->
    <div 
      v-if="!activeUser || activeUser.currentBand === 0"
      class="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center shadow-xs shrink-0">
          <Sparkles class="w-5 h-5 text-white/90" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-base text-[#1d1d1f]">新学员初始水平待定级 (Band 0.0)</h3>
            <span class="px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#1d1d1f] text-[11px] font-medium border border-black/[0.04]">
              推荐完成
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#86868b] mt-0.5">
            只需 3 分钟（6 道精选核心题），快速摸底学术英语基础，生成专属个人的 178 天提分路线图。
          </p>
        </div>
      </div>
      <button
        @click="emit('openPlacementTest')"
        class="px-5 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs sm:text-sm font-medium shadow-xs hover:shadow transition-all shrink-0 cursor-pointer active:scale-98 flex items-center gap-1.5"
      >
        <span>开始 3 分钟简易测验</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>

    <!-- 1. Personalized Adaptation Study Plan -->
    <PersonalStudyPlanCard 
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
        class="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div :class="['p-2 rounded-xl', skill.bg, skill.color]">
              <component :is="skill.icon" class="w-4 h-4" />
            </div>
            <span class="font-semibold text-[#1d1d1f] text-sm">{{ skill.name }}</span>
          </div>
          <span class="text-xs font-medium text-[#86868b]">目标 {{ skill.target.toFixed(1) }}</span>
        </div>
        
        <div class="flex items-baseline justify-between mb-2.5">
          <span class="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {{ skill.current === 0 ? 'Band 0.0 (待定级)' : `Band ${skill.current.toFixed(1)}` }}
          </span>
          <span class="text-xs font-normal text-[#86868b]">
            {{ skill.current === 0 ? '未测定' : `达标度 ${Math.min(100, Math.round((skill.current / skill.target) * 100))}%` }}
          </span>
        </div>

        <!-- Apple Rounded Pill Progress Bar -->
        <div class="w-full bg-[#f5f5f7] rounded-full h-1.5 overflow-hidden border border-black/[0.02]">
          <div 
            :class="['h-full rounded-full transition-all duration-500', skill.barColor]" 
            :style="{ width: `${Math.min(100, Math.round((skill.current / skill.target) * 100))}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Main Two-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Quick Practice Shortcuts -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 class="text-base font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
            <Flame class="w-4 h-4 text-[#86868b]" />
            快速开启备考实战
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div 
              @click="emit('navigate', 'reading')"
              class="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-[#1d1d1f] font-medium text-sm">
                  <BookOpen class="w-4 h-4 text-[#86868b]" />
                  <span>学术类阅读机考</span>
                </div>
                <ArrowRight class="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
              </div>
              <p class="text-xs text-[#86868b] leading-relaxed">左右分屏、划线高亮笔记、Headings & TFNG 真实机考体验。</p>
            </div>

            <div 
              @click="emit('navigate', 'listening')"
              class="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-[#1d1d1f] font-medium text-sm">
                  <Headphones class="w-4 h-4 text-[#86868b]" />
                  <span>听力真题与精听</span>
                </div>
                <ArrowRight class="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
              </div>
              <p class="text-xs text-[#86868b] leading-relaxed">倍速播放、快退 5 秒、S1-S4 答题卡与原文定位对照。</p>
            </div>

            <div 
              @click="emit('navigate', 'writing')"
              class="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-[#1d1d1f] font-medium text-sm">
                  <PenTool class="w-4 h-4 text-[#86868b]" />
                  <span>写作限时与智能批改</span>
                </div>
                <ArrowRight class="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
              </div>
              <p class="text-xs text-[#86868b] leading-relaxed">Task 1/2 题库、实时字数统计、Band 9 范文与 4 维机考评分。</p>
            </div>

            <div 
              @click="emit('navigate', 'speaking')"
              class="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-[#1d1d1f] font-medium text-sm">
                  <Mic class="w-4 h-4 text-[#86868b]" />
                  <span>口语仿真考场</span>
                </div>
                <ArrowRight class="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
              </div>
              <p class="text-xs text-[#86868b] leading-relaxed">Part 2 准备 1 分钟 + 作答 2 分钟提示音，原生高清录音复盘。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Mistake Alert & Test History -->
      <div class="space-y-6">
        <!-- Mistake Notebook Card -->
        <div class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-[#1d1d1f] text-sm flex items-center gap-1.5">
              <Award class="w-4 h-4 text-[#86868b]" />
              错题本与弱项突破
            </span>
            <span class="px-2.5 py-0.5 bg-black/[0.04] text-[#1d1d1f] font-medium text-xs rounded-full">
              {{ mistakesCount }} 题待温习
            </span>
          </div>
          <p class="text-xs text-[#86868b] leading-relaxed">
            雅思考试提分的核心在于“错题归因”。分析是定位失误、同义替换遗漏还是时间分配不均。
          </p>
          <button
            @click="emit('navigate', 'mistakes')"
            class="w-full py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-black/[0.04]"
          >
            <span>查看我的错题本</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Vocabulary Flashcard Shortcut -->
        <div class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-[#1d1d1f] text-sm flex items-center gap-1.5">
              <Sparkles class="w-4 h-4 text-[#86868b]" />
              同义替换与核心词库
            </span>
            <span class="px-2.5 py-0.5 bg-black/[0.04] text-[#1d1d1f] font-medium text-xs rounded-full">
              100+ 核心组
            </span>
          </div>
          <p class="text-xs text-[#86868b] leading-relaxed">
            掌握 substantial = considerable、mitigate = alleviate 等 500 组听读同义替换词对。
          </p>
          <button
            @click="emit('navigate', 'vocabulary')"
            class="w-full py-2 bg-[#1d1d1f] hover:bg-black text-white font-medium text-xs rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>开始刷词闪卡</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Recent Test History -->
        <div class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h3 class="font-semibold text-[#1d1d1f] text-sm mb-3.5 flex items-center gap-1.5">
            <TrendingUp class="w-4 h-4 text-[#86868b]" />
            模考成绩记录
          </h3>

          <div v-if="results.length === 0" class="text-center py-6 text-[#86868b] text-xs font-normal">
            暂无模考记录，完成一套阅读或听力后自动沉淀在此。
          </div>
          <div v-else class="space-y-2">
            <div 
              v-for="res in results.slice(0, 4)" 
              :key="res.id" 
              class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] flex items-center justify-between text-xs"
            >
              <div>
                <div class="font-medium text-[#1d1d1f] line-clamp-1">{{ res.testTitle }}</div>
                <div class="text-[#86868b] text-[11px] mt-0.5">
                  {{ new Date(res.completedAt).toLocaleDateString() }} · 正确 {{ res.score }}/40
                </div>
              </div>
              <div class="font-semibold text-xs px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3]">
                Band {{ res.band.toFixed(1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
