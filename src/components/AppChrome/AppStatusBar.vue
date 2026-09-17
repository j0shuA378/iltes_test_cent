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
  <footer class="h-6 bg-[#f5f5f7] border-t border-black/[0.06] px-3 flex items-center justify-between text-[11px] text-[#86868b] select-none z-20 shrink-0">
    <!-- Left: App Identity & System Status -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5 font-mono text-[10px] text-[#1d1d1f]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
        <span>Ready</span>
      </div>

      <div class="h-3 w-px bg-black/[0.08]" />

      <button
        @click="emit('openAdmin')"
        class="hover:text-[#1d1d1f] hover:underline cursor-pointer flex items-center gap-1 font-mono text-[10px]"
        title="打开管理与运维后台"
      >
        <Terminal class="w-3 h-3 text-[#86868b]" />
        <span>v2.4.0 (Core)</span>
      </button>

      <div class="hidden sm:block h-3 w-px bg-black/[0.08]" />

      <span class="hidden sm:inline">雅思全真机考冲刺桌面端</span>
    </div>

    <!-- Center: Active Student Marker -->
    <div class="flex items-center gap-2 font-mono text-[10px]">
      <button 
        @click="emit('openAuthModal')"
        class="hover:text-[#1d1d1f] transition-colors cursor-pointer flex items-center gap-1"
        title="点击管理学员档案与恢复标记"
      >
        <span class="text-[#1d1d1f] font-semibold">{{ activeUser.displayName }}</span>
        <span class="px-1 py-0.2 rounded bg-black/[0.04] text-[#0071e3] border border-black/[0.04]">
          {{ activeUser.recoveryToken || 'MK-GUEST-0000' }}
        </span>
      </button>
      <span v-if="lastSyncTime" class="hidden md:inline text-[#86868b]">
        (同步于 {{ lastSyncTime }})
      </span>
    </div>

    <!-- Right: Metrics & Controls -->
    <div class="flex items-center gap-3">
      <!-- Storage Consumption -->
      <div class="hidden sm:flex items-center gap-1 text-[10px]">
        <HardDrive class="w-3 h-3 text-[#86868b]" />
        <span>{{ vaultStats.totalKB }} KB</span>
      </div>

      <div class="hidden sm:block h-3 w-px bg-black/[0.08]" />

      <!-- Network / Backend Ping Status -->
      <div class="flex items-center gap-1 text-[10px]">
        <Wifi v-if="syncStatus !== 'offline'" class="w-3 h-3 text-emerald-600" />
        <WifiOff v-else class="w-3 h-3 text-amber-600" />
        <span :class="syncStatus !== 'offline' ? 'text-emerald-700' : 'text-amber-700'">
          {{ syncStatus !== 'offline' ? `${serverLatency || 12}ms` : '本地沙箱' }}
        </span>
      </div>

      <div class="h-3 w-px bg-black/[0.08]" />

      <!-- Shortcuts Trigger Button -->
      <button 
        @click="emit('openShortcuts')" 
        class="hover:text-[#1d1d1f] transition-colors cursor-pointer p-0.5 rounded"
        title="查看快捷键"
      >
        <HelpCircle class="w-3 h-3" />
      </button>

      <!-- Fullscreen Button -->
      <button 
        @click="toggleFullscreen" 
        class="hover:text-[#1d1d1f] transition-colors cursor-pointer p-0.5 rounded"
        title="沉浸全屏"
      >
        <Maximize class="w-3 h-3" />
      </button>
    </div>
  </footer>
</template>
