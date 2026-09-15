<script setup lang="ts">
import { ref } from 'vue';
import { 
  LayoutDashboard, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  AlertCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Brain
} from 'lucide-vue-next';
import type { UserAccount } from '../../types/auth';

const props = withDefaults(defineProps<{
  currentTab: string;
  activeUser: UserAccount;
  dueVocabCount?: number;
  mistakesCount?: number;
}>(), {
  dueVocabCount: 0,
  mistakesCount: 0
});

const emit = defineEmits<{
  (e: 'selectTab', tab: string): void;
  (e: 'openAuthModal'): void;
}>();

const isCollapsed = ref<boolean>(() => {
  try {
    return localStorage.getItem('ielts_sidebar_collapsed') === 'true';
  } catch {
    return false;
  }
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  try {
    localStorage.setItem('ielts_sidebar_collapsed', String(isCollapsed.value));
  } catch {}
};

const navGroups = [
  {
    group: '控制中心',
    items: [
      { id: 'dashboard', label: '备考看板', icon: LayoutDashboard, badge: null, badgeColor: '' }
    ]
  },
  {
    group: '全真模考',
    items: [
      { id: 'reading', label: '阅读机考', icon: BookOpen, badge: null, badgeColor: '' },
      { id: 'listening', label: '听力训练', icon: Headphones, badge: null, badgeColor: '' },
      { id: 'writing', label: '写作工坊', icon: PenTool, badge: null, badgeColor: '' },
      { id: 'speaking', label: '口语考场', icon: Mic, badge: null, badgeColor: '' }
    ]
  },
  {
    group: '记忆引擎',
    items: [
      { 
        id: 'vocabulary', 
        label: '艾宾浩斯词库', 
        icon: Brain, 
        badge: 'vocab',
        badgeColor: 'bg-[#ff9500] text-white font-bold'
      },
      { 
        id: 'mistakes', 
        label: '错题集复盘', 
        icon: AlertCircle, 
        badge: 'mistakes',
        badgeColor: 'bg-black/[0.06] text-[#424245]'
      }
    ]
  },
  {
    group: '偏好设置',
    items: [
      { id: 'settings', label: '系统设置', icon: Settings, badge: null, badgeColor: '' }
    ]
  }
];

const getItemBadge = (badgeType: string | null) => {
  if (badgeType === 'vocab' && props.dueVocabCount > 0) return `${props.dueVocabCount}`;
  if (badgeType === 'mistakes' && props.mistakesCount > 0) return `${props.mistakesCount}`;
  return null;
};
</script>

<template>
  <aside 
    :class="[
      'bg-[#fbfbfd]/90 backdrop-blur-xl border-r border-black/[0.06] text-[#1d1d1f] flex flex-col transition-all duration-300 select-none z-30 shrink-0',
      isCollapsed ? 'w-[72px]' : 'w-60'
    ]"
  >
    <!-- App Branding Header -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-black/[0.04] shrink-0">
      <div 
        @click="emit('selectTab', 'dashboard')"
        class="flex items-center gap-3 cursor-pointer overflow-hidden group"
      >
        <!-- Apple Squircle Icon -->
        <div class="w-8 h-8 rounded-[10px] bg-[#1d1d1f] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
          雅
        </div>
        <div v-if="!isCollapsed" class="leading-tight">
          <div class="font-semibold text-[#1d1d1f] text-sm tracking-tight">
            IELTS Master
          </div>
          <div class="text-[10px] text-[#86868b] tracking-normal font-normal">
            学术机考门户
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile Capsule (macOS style) -->
    <div class="p-3 border-b border-black/[0.04] shrink-0">
      <button
        @click="emit('openAuthModal')"
        :class="[
          'w-full rounded-2xl bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] p-2 flex items-center transition-all group cursor-pointer',
          isCollapsed ? 'justify-center' : 'justify-between'
        ]"
        title="点击切换账号或注册新学员"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-7 h-7 rounded-xl bg-white border border-black/[0.06] shadow-2xs flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform">
            {{ activeUser.avatar }}
          </div>
          <div v-if="!isCollapsed" class="text-left truncate leading-tight">
            <div class="font-medium text-xs text-[#1d1d1f] truncate group-hover:text-[#0071e3] transition-colors">
              {{ activeUser.displayName }}
            </div>
            <div class="text-[10px] text-[#86868b] flex items-center gap-1.5 mt-0.5 font-normal">
              <span v-if="activeUser.currentBand === 0" class="text-[#86868b] font-medium bg-black/[0.04] px-1.5 py-0.5 rounded text-[10px]">
                待定级
              </span>
              <span v-else class="text-[#1d1d1f] font-medium">
                B{{ activeUser.currentBand.toFixed(1) }}
              </span>
              <span class="text-black/30">➔</span>
              <span class="text-[#1d1d1f] font-medium">
                B{{ activeUser.targetBand.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="!isCollapsed" class="text-[10px] font-medium text-[#86868b] group-hover:text-[#1d1d1f] px-2 py-0.5 rounded-full bg-black/[0.04] shrink-0">
          切换
        </div>
      </button>
    </div>

    <!-- Navigation List -->
    <div class="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
      <div v-for="(group, gIdx) in navGroups" :key="gIdx" class="space-y-0.5">
        <div v-if="!isCollapsed" class="px-3 text-[11px] font-semibold text-[#86868b] tracking-wider mb-1">
          {{ group.group }}
        </div>

        <button
          v-for="item in group.items"
          :key="item.id"
          @click="emit('selectTab', item.id)"
          :class="[
            'w-full flex items-center rounded-xl p-2 text-xs transition-all relative group cursor-pointer',
            currentTab === item.id
              ? 'bg-[#0071e3] text-white font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)]'
              : 'text-[#424245] hover:text-[#1d1d1f] hover:bg-black/[0.04] font-normal',
            isCollapsed ? 'justify-center' : 'justify-between'
          ]"
          :title="isCollapsed ? item.label : undefined"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <component 
              :is="item.icon" 
              :class="[
                'w-4 h-4 shrink-0 transition-transform',
                currentTab === item.id ? 'text-white' : 'text-[#86868b] group-hover:text-[#1d1d1f]'
              ]" 
            />
            <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
          </div>

          <span 
            v-if="!isCollapsed && getItemBadge(item.badge)" 
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] shrink-0',
              currentTab === item.id ? 'bg-white/20 text-white font-bold' : item.badgeColor
            ]"
          >
            {{ getItemBadge(item.badge) }}
          </span>

          <!-- Dot badge on collapsed mode -->
          <span 
            v-if="isCollapsed && getItemBadge(item.badge)" 
            class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff9500] ring-2 ring-white" 
          />
        </button>
      </div>
    </div>

    <!-- Collapse Toggle Footer -->
    <div class="p-3 border-t border-black/[0.04] flex items-center justify-between shrink-0">
      <div v-if="!isCollapsed" class="flex items-center gap-1.5 text-[11px] text-[#86868b]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
        <span>本地独立存储</span>
      </div>

      <button
        @click="toggleCollapse"
        :class="[
          'p-1.5 rounded-lg hover:bg-black/[0.05] text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer',
          isCollapsed ? 'w-full flex justify-center' : ''
        ]"
        :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
      >
        <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
        <ChevronLeft v-else class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>
