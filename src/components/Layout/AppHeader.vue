<script setup lang="ts">
import { 
  Search, 
  BookOpen, 
  Brain, 
  Calendar,
  Menu,
  ShieldCheck
} from 'lucide-vue-next';
import type { UserAccount } from '../../types/auth';

withDefaults(defineProps<{
  activeUser: UserAccount;
  dueVocabCount?: number;
  remainingDays?: number;
}>(), {
  dueVocabCount: 0,
  remainingDays: 178
});

const emit = defineEmits<{
  (e: 'openSearch'): void;
  (e: 'openDictionary'): void;
  (e: 'openAuthModal'): void;
  (e: 'navigateTab', tab: string): void;
  (e: 'openPlacementTest'): void;
  (e: 'toggleMobileMenu'): void;
  (e: 'openAdmin'): void;
}>();
</script>

<template>
  <header class="h-14 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 select-none shadow-2xs">
    <!-- Left: Mobile menu toggle, Quick Search & Dictionary Pill Triggers -->
    <div class="flex items-center gap-2">
      <!-- Mobile hamburger button -->
      <button
        @click="emit('toggleMobileMenu')"
        class="sm:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500"
        title="打开导航菜单"
        aria-label="打开导航菜单"
      >
        <Menu class="w-4 h-4" />
      </button>

      <!-- Search button styled with UI UX Pro Max Pill tokens -->
      <button
        @click="emit('openSearch')"
        class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-all duration-150 text-xs font-normal border border-slate-200/70 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
        title="搜寻剑桥雅思题库 (快捷键: Ctrl+K)"
      >
        <Search class="w-3.5 h-3.5 text-slate-400" />
        <span class="hidden sm:inline">搜寻题库、精听与真题...</span>
        <span class="sm:hidden">搜题库</span>
        <kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-md text-slate-500 shadow-2xs select-none">
          Ctrl+K
        </kbd>
      </button>

      <!-- Dictionary quick open pill button -->
      <button
        @click="emit('openDictionary')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100/80 text-sky-700 text-xs font-medium border border-sky-200/70 transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500"
        title="打开即时学术词典 (快捷键: Ctrl+D)"
      >
        <BookOpen class="w-3.5 h-3.5 text-sky-600" />
        <span>即时词典</span>
      </button>
    </div>

    <!-- Right: Ebbinghaus Review Due Pill, Countdown & User Account -->
    <div class="flex items-center gap-2.5">
      <!-- Diagnostic placement pill if currentBand is 0 -->
      <button
        v-if="activeUser.currentBand === 0"
        @click="emit('openPlacementTest')"
        class="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-medium border border-slate-200/80 transition-all cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
        title="完成 3 分钟学术定级测验"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
        <span>测定初始成绩</span>
      </button>

      <!-- Ebbinghaus Review Due Capsule -->
      <button
        @click="emit('navigateTab', 'vocabulary')"
        :class="[
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500',
          dueVocabCount > 0 
            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80' 
            : 'bg-slate-100/70 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
        ]"
        title="根据艾宾浩斯曲线，今日需要复习的词汇"
      >
        <Brain class="w-3.5 h-3.5 text-amber-600" v-if="dueVocabCount > 0" />
        <Brain class="w-3.5 h-3.5 text-slate-400" v-else />
        <span class="hidden md:inline text-slate-500">抗遗忘:</span>
        <span v-if="dueVocabCount > 0" class="font-semibold text-amber-900 tabular-nums">
          {{ dueVocabCount }} 词待复核
        </span>
        <span v-else class="text-slate-500">
          今日已清空 ✓
        </span>
      </button>

      <!-- Countdown capsule -->
      <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/60 text-slate-600 text-xs font-normal border border-slate-200/60 select-none">
        <Calendar class="w-3 h-3 text-slate-400" />
        <span>距考期 <strong class="text-slate-900 font-semibold tabular-nums">{{ remainingDays }}</strong> 天</span>
      </div>

      <!-- Admin Console Pill -->
      <button
        @click="emit('openAdmin')"
        class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/70 hover:bg-slate-900 text-slate-600 hover:text-white transition-all text-xs cursor-pointer group active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
        title="访问管理控制台 (/admin)"
      >
        <ShieldCheck class="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
        <span class="text-[11px] font-medium">管理后台</span>
      </button>

      <div class="h-4 w-px bg-slate-200 hidden sm:block" />

      <!-- User Account Capsule -->
      <button
        @click="emit('openAuthModal')"
        class="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100/70 hover:bg-slate-100 border border-slate-200/70 transition-all group cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
        :title="activeUser.id === 'user_guest' ? '点击登录或注册学员' : '点击切换账号或查看学员档案'"
      >
        <div class="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
          {{ activeUser.avatar }}
        </div>
        <div class="text-left hidden sm:block leading-none">
          <div class="font-medium text-xs text-slate-900 group-hover:text-sky-600 transition-colors truncate max-w-[90px]">
            {{ activeUser.displayName }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium mt-0.5">
            {{ activeUser.id === 'user_guest' ? '未登录' : (activeUser.currentBand === 0 ? '待定级' : `Band ${activeUser.currentBand.toFixed(1)}`) }}
          </div>
        </div>
      </button>
    </div>
  </header>
</template>
