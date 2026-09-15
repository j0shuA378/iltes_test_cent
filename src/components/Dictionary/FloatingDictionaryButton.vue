<script setup lang="ts">
import { BookMarked } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 select-none animate-fadeIn">
    <button
      @click="emit('click')"
      class="flex items-center gap-2 px-4 py-2.5 bg-[#1d1d1f]/90 hover:bg-[#0071e3] text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/15 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
      title="点击开启雅思即时学术词典 (快捷键: Ctrl+D)"
    >
      <div class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white transition-colors">
        <BookMarked class="w-3 h-3" />
      </div>
      <span class="text-xs font-medium tracking-normal pr-0.5">查词典</span>
      <span class="w-1.5 h-1.5 rounded-full bg-[#34c759] inline-block" />
    </button>
  </div>
</template>
