<script setup lang="ts">
import { X, Command, Search, BookOpen, Maximize, Shield, Layers, Brain } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const shortcuts = [
  { key: 'Ctrl + K', desc: '全局搜寻剑桥雅思官方题库与机考原题', icon: Search },
  { key: 'Ctrl + D', desc: '唤醒即时学术英汉词典与发音', icon: BookOpen },
  { key: 'F11 / 全屏按钮', desc: '进入 / 退出沉浸式全真机考软件全屏', icon: Maximize },
  { key: 'Esc', desc: '一键关闭所有浮层弹窗与配置卡片', icon: X },
  { key: '1 - 7 数字快捷', desc: '备考看板 / 听读写说 / 错题本快速切科', icon: Layers },
  { key: 'Ctrl + S', desc: '强制将本地独立沙箱即刻同步至云端', icon: Shield },
];
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none"
    @click.self="emit('close')"
  >
    <div 
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-[0_24px_80px_rgba(0,0,0,0.22)] border border-black/[0.08] overflow-hidden flex flex-col animate-scaleUp"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-black/[0.04] text-[#1d1d1f] flex items-center justify-center">
            <Command class="w-4 h-4" />
          </div>
          <div>
            <h2 class="font-semibold text-sm text-[#1d1d1f]">IELTS Master 应用快捷键指南</h2>
            <p class="text-[11px] text-[#86868b]">专为高效率雅思机考模拟设计的键盘快捷操作</p>
          </div>
        </div>
        <button 
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Shortcuts List -->
      <div class="p-6 space-y-3">
        <div 
          v-for="s in shortcuts" 
          :key="s.key"
          class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div class="p-1.5 rounded-lg bg-white border border-black/[0.04] text-[#1d1d1f] shadow-2xs">
              <component :is="s.icon" class="w-3.5 h-3.5" />
            </div>
            <span class="text-xs text-[#1d1d1f] font-medium">{{ s.desc }}</span>
          </div>
          <kbd class="px-2.5 py-1 text-xs font-mono font-semibold bg-white border border-black/[0.08] rounded-lg shadow-2xs text-[#1d1d1f] shrink-0">
            {{ s.key }}
          </kbd>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 bg-[#fbfbfd] border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868b]">
        <span>💡 类似桌面客户端体验，支持安装至桌面独立运行</span>
        <button 
          @click="emit('close')"
          class="px-4 py-1.5 rounded-full bg-[#1d1d1f] text-white text-xs font-medium cursor-pointer"
        >
          我知道了
        </button>
      </div>
    </div>
  </div>
</template>
