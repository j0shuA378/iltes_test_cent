<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  Volume2, 
  Star, 
  Maximize2, 
  X, 
  Loader2,
  BookmarkCheck
} from 'lucide-vue-next';
import { type DictionaryEntry, lookupWord } from '../../data/dictionaryData';
import { toggleWordStar, getVocabProgress } from '../../services/storage';

const props = defineProps<{
  word: string;
  position: { x: number; y: number };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'openFull', word: string): void;
  (e: 'highlight', color: string): void;
}>();

const entry = ref<DictionaryEntry | null>(null);
const loading = ref(true);
const isStarred = ref(false);
const isPlayingAudio = ref(false);
const popoverRef = ref<HTMLDivElement | null>(null);

const fetchWord = async (w: string) => {
  loading.value = true;
  const cleanWord = w.trim().replace(/^[^a-zA-Z\u4e00-\u9fa5]+|[^a-zA-Z\u4e00-\u9fa5]+$/g, '');
  
  const progress = getVocabProgress();
  isStarred.value = Boolean(progress[cleanWord.toLowerCase()]?.isStarred);

  try {
    const result = await lookupWord(cleanWord);
    if (result) {
      entry.value = result;
    } else {
      entry.value = {
        word: cleanWord,
        phonetic: `/${cleanWord}/`,
        partOfSpeech: 'dict.',
        chinese: '未在核心库找到释义，可点击“完全展示”深度检索',
        definition: `No local definition found for "${cleanWord}". Click Full View to explore online resources.`,
        example: ''
      };
    }
  } catch {
    // ignore
  } finally {
    loading.value = false;
  }
};

watch(() => props.word, (newWord) => {
  if (newWord) {
    fetchWord(newWord);
  }
}, { immediate: true });

const handleOutsideClick = (e: MouseEvent) => {
  if (popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
    emit('close');
  }
};

onMounted(() => {
  const timer = setTimeout(() => {
    window.addEventListener('mousedown', handleOutsideClick);
  }, 50);
  return () => {
    clearTimeout(timer);
    window.removeEventListener('mousedown', handleOutsideClick);
  };
});

onUnmounted(() => {
  window.removeEventListener('mousedown', handleOutsideClick);
});

const speakWord = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const british = voices.find(v => v.lang.includes('GB') || v.name.includes('UK') || v.name.includes('British'));
    if (british) utterance.voice = british;

    utterance.onstart = () => { isPlayingAudio.value = true; };
    utterance.onend = () => { isPlayingAudio.value = false; };
    utterance.onerror = () => { isPlayingAudio.value = false; };

    window.speechSynthesis.speak(utterance);
  }
};

const handleStar = () => {
  if (!entry.value) return;
  const nowStarred = toggleWordStar(entry.value.word);
  isStarred.value = nowStarred;
};

const cardWidth = 350;
const clampedX = computed(() => {
  return Math.min(window.innerWidth - cardWidth - 16, Math.max(16, props.position.x - cardWidth / 2));
});
const clampedY = computed(() => {
  return props.position.y < 170 ? props.position.y + 40 : props.position.y - 155;
});
</script>

<template>
  <div
    ref="popoverRef"
    :style="{ 
      position: 'fixed', 
      left: `${clampedX}px`, 
      top: `${clampedY}px`, 
      width: `${cardWidth}px`,
      zIndex: 110 
    }"
    class="bg-[#1d1d1f]/95 backdrop-blur-xl text-white shadow-2xl rounded-2xl border border-white/10 p-3.5 select-none animate-fadeIn transition-all"
    @click.stop
    @mousedown.stop
  >
    <!-- Header Bar -->
    <div class="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span class="font-bold text-sm text-white tracking-tight shrink-0">
          {{ entry?.word || word }}
        </span>
        <span v-if="entry?.phonetic" class="text-xs text-white/60 font-mono shrink-0">
          {{ entry.phonetic }}
        </span>
        <button
          @click="speakWord(entry?.word || word)"
          :class="[
            'p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0',
            isPlayingAudio ? 'text-[#0071e3] animate-pulse' : ''
          ]"
          title="播放英音发音"
        >
          <Volume2 class="w-3.5 h-3.5" />
        </button>
        <span v-if="entry?.ieltsBand" class="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/90 border border-white/10 truncate max-w-[110px]">
          {{ entry.ieltsBand }}
        </span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <div class="relative group flex items-center">
          <button
            @click="emit('openFull', entry?.word || word); emit('close');"
            class="p-1.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white transition-all shadow-xs flex items-center justify-center cursor-pointer"
            aria-label="完全展示"
            title="完全展示"
          >
            <Maximize2 class="w-3.5 h-3.5" />
          </button>

          <div class="absolute -top-7 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-y-1 group-hover:translate-y-0 px-2 py-0.5 rounded-md bg-[#1d1d1f] border border-white/10 text-white/90 text-[10px] font-medium whitespace-nowrap shadow-xl z-30">
            完全展示
          </div>
        </div>

        <button
          @click="emit('close')"
          class="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="关闭简易释义"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Body: Concise Definition -->
    <div class="py-2 min-h-[48px] flex flex-col justify-center">
      <div v-if="loading" class="flex items-center gap-2 text-xs text-white/60 py-1.5">
        <Loader2 class="w-3.5 h-3.5 animate-spin text-[#0071e3]" />
        <span>查询即时释义中...</span>
      </div>
      <div v-else-if="entry" class="space-y-1">
        <div class="text-xs text-white/90 flex items-baseline gap-1.5 leading-relaxed">
          <span class="font-bold text-blue-400 shrink-0">{{ entry.partOfSpeech }}</span>
          <span class="font-medium text-white">{{ entry.chinese }}</span>
        </div>

        <div v-if="entry.synonyms && entry.synonyms.length > 0" class="flex items-center gap-1.5 text-[11px] text-white/60 pt-0.5">
          <span class="text-white/40 shrink-0 text-[10px]">同义:</span>
          <div class="flex items-center gap-1 overflow-hidden flex-wrap">
            <span v-for="s in entry.synonyms.slice(0, 3)" :key="s" class="px-1.5 py-0.5 bg-white/10 text-white/80 rounded-md text-[10px]">
              {{ s }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="text-xs text-white/50">暂无释义</div>
    </div>

    <!-- Footer: Quick Actions -->
    <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
      <button
        @click="handleStar"
        :class="[
          'flex items-center gap-1 px-2 py-0.5 rounded-lg transition-all cursor-pointer',
          isStarred 
            ? 'text-amber-300 bg-amber-400/20 font-medium' 
            : 'text-white/60 hover:text-amber-300 hover:bg-white/10'
        ]"
        :title="isStarred ? '已收入生词本' : '加入生词本'"
      >
        <template v-if="isStarred">
          <BookmarkCheck class="w-3 h-3 text-amber-300" />
          <span>已收入生词本</span>
        </template>
        <template v-else>
          <Star class="w-3 h-3" />
          <span>加入生词本</span>
        </template>
      </button>

      <div class="flex items-center gap-1.5 text-white/60">
        <span class="text-[10px] text-white/40 mr-0.5">高亮:</span>
        <button
          @click="emit('highlight', 'yellow'); emit('close');"
          class="w-3 h-3 rounded-full bg-amber-300 hover:scale-125 transition-transform cursor-pointer shadow-xs"
          title="黄色高亮"
        />
        <button
          @click="emit('highlight', 'green'); emit('close');"
          class="w-3 h-3 rounded-full bg-emerald-400 hover:scale-125 transition-transform cursor-pointer shadow-xs"
          title="绿色高亮"
        />
        <button
          @click="emit('highlight', 'pink'); emit('close');"
          class="w-3 h-3 rounded-full bg-rose-400 hover:scale-125 transition-transform cursor-pointer shadow-xs"
          title="粉色高亮"
        />
      </div>
    </div>
  </div>
</template>
