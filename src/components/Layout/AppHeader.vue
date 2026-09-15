<script setup lang="ts">
import { 
  Search, 
  BookOpen, 
  Brain, 
  Calendar
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
}>();
</script>

<template>
  <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 select-none">
    <!-- Left: Quick Search & Dictionary Pill Triggers -->
    <div class="flex items-center gap-2.5">
      <!-- Search button styled like Apple Spotlight / Search pill -->
      <button
        @click="emit('openSearch')"
        class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] transition-all text-xs font-normal border border-black/[0.04] cursor-pointer"
        title="搜寻剑桥雅思题库 (快捷键: Ctrl+K)"
      >
        <Search class="w-3.5 h-3.5 text-[#86868b]" />
        <span class="hidden sm:inline">搜寻题库、精听与真题...</span>
        <span class="sm:hidden">搜题库</span>
        <kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-black/[0.06] rounded-md text-[#86868b] shadow-2xs">
          Ctrl+K
        </kbd>
      </button>

      <!-- Dictionary quick open pill button -->
      <button
        @click="emit('openDictionary')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3] text-xs font-medium border border-[#0071e3]/15 transition-all active:scale-98 cursor-pointer"
        title="打开即时学术词典 (快捷键: Ctrl+D)"
      >
        <BookOpen class="w-3.5 h-3.5 text-[#0071e3]" />
        <span>即时词典</span>
      </button>
    </div>

    <!-- Right: Ebbinghaus Review Due Pill, Countdown & User Account -->
    <div class="flex items-center gap-2.5">
      <!-- Diagnostic placement pill if currentBand is 0 -->
      <button
        v-if="activeUser.currentBand === 0"
        @click="emit('openPlacementTest')"
        class="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.07] text-[#1d1d1f] text-xs font-medium border border-black/[0.06] transition-all cursor-pointer active:scale-98"
        title="完成 3 分钟学术定级测验"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-[#1d1d1f] animate-pulse" />
        <span>测定初始成绩</span>
      </button>

      <!-- Ebbinghaus Review Due Capsule -->
      <button
        @click="emit('navigateTab', 'vocabulary')"
        :class="[
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
          dueVocabCount > 0 
            ? 'bg-black/[0.04] text-[#1d1d1f] border border-black/[0.06] hover:bg-black/[0.07]' 
            : 'bg-black/[0.03] text-[#86868b] border border-black/[0.04] hover:bg-black/[0.05]'
        ]"
        title="根据艾宾浩斯曲线，今日需要复习的词汇"
      >
        <Brain class="w-3.5 h-3.5 text-[#86868b]" />
        <span class="hidden md:inline text-[#86868b]">抗遗忘:</span>
        <span v-if="dueVocabCount > 0" class="font-semibold text-[#1d1d1f]">
          {{ dueVocabCount }} 词待复核
        </span>
        <span v-else class="text-[#86868b]">
          今日已清空 ✓
        </span>
      </button>

      <!-- Countdown capsule -->
      <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] text-[#86868b] text-xs font-normal border border-black/[0.04]">
        <Calendar class="w-3 h-3 text-[#86868b]" />
        <span>距考期 <strong class="text-[#1d1d1f] font-semibold tabular-nums">{{ remainingDays }}</strong> 天</span>
      </div>

      <div class="h-4 w-px bg-black/[0.08] hidden sm:block" />

      <!-- User Account Capsule -->
      <button
        @click="emit('openAuthModal')"
        class="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] transition-all group cursor-pointer"
        title="点击切换账号或注册新学员"
      >
        <div class="w-6 h-6 rounded-full bg-white border border-black/[0.08] shadow-2xs flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
          {{ activeUser.avatar }}
        </div>
        <div class="text-left hidden sm:block leading-none">
          <div class="font-medium text-xs text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors truncate max-w-[90px]">
            {{ activeUser.displayName }}
          </div>
          <div v-if="activeUser.currentBand === 0" class="text-[10px] text-[#86868b] font-medium mt-0.5">
            待定级
          </div>
        </div>
      </button>
    </div>
  </header>
</template>
