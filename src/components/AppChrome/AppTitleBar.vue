<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  Search, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  Cloud, 
  CloudOff, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-vue-next';
import { syncStatus, lastSyncTime, serverLatency, syncActiveUserToCloud } from '../../services/syncService';
import type { UserAccount } from '../../types/auth';

const props = defineProps<{
  currentTab: string;
  activeUser: UserAccount;
  selectedTestLabel?: string;
  isSidebarCollapsed: boolean;
}>();

const emit = defineEmits<{
  (e: 'navigate', tab: string): void;
  (e: 'toggleSidebar'): void;
  (e: 'openSearch'): void;
  (e: 'openDictionary'): void;
  (e: 'openShortcuts'): void;
  (e: 'openAuthModal'): void;
  (e: 'openPlacementTest'): void;
}>();

const isFullscreen = ref(false);

const checkFullscreen = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};

const handleManualSync = () => {
  syncActiveUserToCloud();
};

onMounted(() => {
  document.addEventListener('fullscreenchange', checkFullscreen);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', checkFullscreen);
});

const getTabTitle = (tab: string) => {
  const map: Record<string, string> = {
    dashboard: '备考看板',
    reading: '全真阅读机考',
    listening: '全真听力机考',
    writing: '写作工坊与精批',
    speaking: '口语考场与实录',
    vocabulary: '艾宾浩斯抗遗忘词库',
    mistakes: '错题复核集',
    settings: '目标设定与数据沙箱'
  };
  return map[tab] || '备考工作区';
};
</script>

<template>
  <header class="h-11 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none transition-all">
    <!-- Left: macOS Native Window Traffic Light Dots & Breadcrumb -->
    <div class="flex items-center gap-3">
      <!-- Traffic Light Window Buttons -->
      <div class="flex items-center gap-1.5 shrink-0 pr-1">
        <button
          @click="emit('navigate', 'dashboard')"
          class="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-90 transition-all cursor-pointer shadow-xs active:scale-95"
          title="返回主页看板 (Home)"
        />
        <button
          @click="emit('toggleSidebar')"
          class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-90 transition-all cursor-pointer shadow-xs active:scale-95"
          title="收起 / 展开侧边导航栏"
        />
        <button
          @click="toggleFullscreen"
          class="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-90 transition-all cursor-pointer shadow-xs active:scale-95"
          title="进入 / 退出全真机考全屏沉浸模式 (F11)"
        />
      </div>

      <div class="h-3.5 w-px bg-black/[0.08]" />

      <!-- Breadcrumb App Title -->
      <div class="flex items-center gap-1.5 text-xs">
        <span class="font-bold text-[#1d1d1f] tracking-tight flex items-center gap-1">
          <span class="px-1.5 py-0.2 rounded bg-black/[0.05] font-mono text-[10px] text-[#1d1d1f]">IELTS Master</span>
        </span>
        <span class="text-[#86868b]">/</span>
        <span class="font-semibold text-[#1d1d1f]">{{ getTabTitle(currentTab) }}</span>
        <span v-if="selectedTestLabel" class="hidden md:inline-flex items-center gap-1 text-[#86868b]">
          <span>·</span>
          <span class="truncate max-w-[200px] text-[11px] font-normal">{{ selectedTestLabel }}</span>
        </span>
      </div>
    </div>

    <!-- Center: Search Pill Trigger -->
    <div class="hidden md:flex items-center">
      <button
        @click="emit('openSearch')"
        class="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] transition-all text-xs font-normal border border-black/[0.04] cursor-pointer"
        title="快速搜寻剑雅真题 (Ctrl+K)"
      >
        <Search class="w-3 h-3 text-[#86868b]" />
        <span class="text-[11px]">搜寻题库、试卷与精听...</span>
        <kbd class="px-1.5 py-0.2 text-[9px] font-mono bg-white border border-black/[0.06] rounded text-[#86868b]">
          Ctrl+K
        </kbd>
      </button>
    </div>

    <!-- Right: Tool Pills, Sync Status Capsule, Fullscreen & Shortcuts -->
    <div class="flex items-center gap-2">
      <!-- Dictionary Quick Pill -->
      <button
        @click="emit('openDictionary')"
        class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium border border-black/[0.04] transition-all cursor-pointer"
        title="即时学术英汉词典 (Ctrl+D)"
      >
        <BookOpen class="w-3 h-3 text-[#0071e3]" />
        <span class="text-[11px]">词典</span>
        <kbd class="hidden sm:inline text-[9px] text-[#86868b] font-mono">Ctrl+D</kbd>
      </button>

      <!-- Cloud Sync Capsule -->
      <button
        @click="handleManualSync"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer',
          syncStatus === 'synced' || syncStatus === 'connected'
            ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : syncStatus === 'syncing'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50/80 text-amber-700 border-amber-200 hover:bg-amber-100'
        ]"
        :title="syncStatus === 'synced' || syncStatus === 'connected' ? `后端服务已连接 · 延迟 ${serverLatency || 12}ms` : '后端未连通，当前处于本地沙箱离线模式 (做题数据 100% 完整保存在本地)'"
      >
        <span 
          :class="[
            'w-1.5 h-1.5 rounded-full shrink-0',
            syncStatus === 'synced' || syncStatus === 'connected'
              ? 'bg-emerald-500'
              : syncStatus === 'syncing'
                ? 'bg-blue-500 animate-pulse'
                : 'bg-amber-500'
          ]" 
        />
        <span class="hidden sm:inline">
          {{ syncStatus === 'syncing' ? '同步中...' : (syncStatus === 'offline' ? '本地沙箱' : '云端同步') }}
        </span>
        <RefreshCw v-if="syncStatus === 'syncing'" class="w-2.5 h-2.5 animate-spin" />
      </button>

      <!-- Fullscreen Toggle -->
      <button
        @click="toggleFullscreen"
        class="w-7 h-7 rounded-lg hover:bg-black/[0.05] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        :title="isFullscreen ? '退出全屏 (Esc)' : '全屏专注机考 (F11)'"
      >
        <Minimize2 v-if="isFullscreen" class="w-3.5 h-3.5" />
        <Maximize2 v-else class="w-3.5 h-3.5" />
      </button>

      <!-- Shortcuts Reference Trigger -->
      <button
        @click="emit('openShortcuts')"
        class="w-7 h-7 rounded-lg hover:bg-black/[0.05] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        title="查看键盘快捷键指南"
      >
        <HelpCircle class="w-3.5 h-3.5" />
      </button>

      <!-- User Avatar / Switch Trigger -->
      <button
        @click="emit('openAuthModal')"
        class="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-full hover:bg-black/[0.05] border border-transparent hover:border-black/[0.04] transition-all cursor-pointer"
        title="学员档案管理"
      >
        <span class="w-5 h-5 rounded-full bg-[#f5f5f7] border border-black/[0.06] flex items-center justify-center text-xs">
          {{ activeUser.avatar }}
        </span>
        <span class="text-xs font-semibold text-[#1d1d1f] max-w-[80px] truncate hidden sm:inline">
          {{ activeUser.displayName }}
        </span>
      </button>
    </div>
  </header>
</template>
