<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  Terminal, 
  Maximize, 
  HelpCircle,
  Clock
} from 'lucide-vue-next';
import { syncStatus, serverLatency, lastSyncTime } from '../../services/syncService';
import { getUserStorageStats } from '../../services/storage';
import type { UserAccount } from '../../types/auth';

const props = defineProps<{
  activeUser: UserAccount;
}>();

const emit = defineEmits<{
  (e: 'openShortcuts'): void;
  (e: 'openAdmin'): void;
  (e: 'openAuthModal'): void;
  (e: 'openDictionary'): void;
}>();

const vaultStats = computed(() => {
  return getUserStorageStats(props.activeUser.id);
});

const isFullscreen = ref(!!document.fullscreenElement);

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    isFullscreen.value = true;
  } else {
    document.exitFullscreen().catch(() => {});
    isFullscreen.value = false;
  }
};
</script>

<template>
  <footer class="h-6 bg-slate-50 border-t border-slate-200/80 px-3 flex items-center justify-between text-[11px] text-slate-500 select-none z-20 shrink-0 font-sans">
    <!-- Left: App Identity & System Status -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5 font-mono text-[10px] text-slate-900">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Ready</span>
      </div>

      <div class="h-3 w-px bg-slate-200" />

      <button
        @click="emit('openAdmin')"
        class="hover:text-slate-900 hover:underline cursor-pointer flex items-center gap-1 font-mono text-[10px]"
        title="打开管理与运维后台"
      >
        <Terminal class="w-3 h-3 text-slate-400" />
        <span>v2.4.0 (Core)</span>
      </button>

      <div class="hidden sm:block h-3 w-px bg-slate-200" />

      <span class="hidden sm:inline text-slate-500">雅思全真机考冲刺桌面端</span>
    </div>

    <!-- Center: Active Student Marker -->
    <div class="flex items-center gap-2 font-mono text-[10px]">
      <button 
        @click="emit('openAuthModal')"
        class="hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
        title="点击管理学员档案与恢复标记"
      >
        <span class="text-slate-900 font-semibold">{{ activeUser.displayName }}</span>
        <span class="px-1 py-0.2 rounded bg-slate-200/80 text-sky-700 border border-slate-200 font-medium">
          {{ activeUser.recoveryToken || 'MK-GUEST-0000' }}
        </span>
      </button>
      <span v-if="lastSyncTime" class="hidden md:inline text-slate-400">
        (同步于 {{ lastSyncTime }})
      </span>
    </div>

    <!-- Right: Metrics & Controls -->
    <div class="flex items-center gap-3">
      <!-- Storage Consumption -->
      <div class="hidden sm:flex items-center gap-1 text-[10px] tabular-nums">
        <HardDrive class="w-3 h-3 text-slate-400" />
        <span>{{ vaultStats.totalKB }} KB</span>
      </div>

      <div class="hidden sm:block h-3 w-px bg-slate-200" />

      <!-- Network / Backend Ping Status -->
      <div class="flex items-center gap-1 text-[10px] tabular-nums">
        <Wifi v-if="syncStatus !== 'offline'" class="w-3 h-3 text-emerald-600" />
        <WifiOff v-else class="w-3 h-3 text-amber-600" />
        <span :class="syncStatus !== 'offline' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'">
          {{ syncStatus !== 'offline' ? `${serverLatency || 12}ms` : '本地沙箱' }}
        </span>
      </div>

      <div class="h-3 w-px bg-slate-200" />

      <!-- Shortcuts Trigger Button -->
      <button 
        @click="emit('openShortcuts')" 
        class="hover:text-slate-900 transition-colors cursor-pointer p-0.5 rounded focus-visible:ring-2 focus-visible:ring-sky-500"
        title="查看快捷键"
        aria-label="查看快捷键"
      >
        <HelpCircle class="w-3 h-3" />
      </button>

      <!-- Fullscreen Button -->
      <button 
        @click="toggleFullscreen" 
        class="hover:text-slate-900 transition-colors cursor-pointer p-0.5 rounded focus-visible:ring-2 focus-visible:ring-sky-500"
        title="沉浸全屏"
        aria-label="切换全屏模式"
      >
        <Maximize class="w-3 h-3" />
      </button>
    </div>
  </footer>
</template>
