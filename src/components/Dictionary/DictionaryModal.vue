<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { 
  Search, 
  X, 
  Volume2, 
  BookMarked, 
  Star, 
  Sparkles, 
  History, 
  ArrowRight,
  HelpCircle
} from 'lucide-vue-next';
import { type DictionaryEntry, lookupWord, getWordSuggestions } from '../../data/dictionaryData';
import { toggleWordStar, getVocabProgress } from '../../services/storage';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  initialQuery?: string;
}>(), {
  initialQuery: ''
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const searchTerm = ref(props.initialQuery);
const currentEntry = ref<DictionaryEntry | null>(null);
const isLoading = ref(false);
const hasSearched = ref(false);
const isStarred = ref(false);
const recentSearches = ref<string[]>([
  'substantial', 'rewilding', 'mitigate', 'apple', 'equilibrium', 'telecommuting'
]);
const suggestions = ref<string[]>([]);
const isPlayingAudio = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const executeSearch = async (word: string) => {
  if (!word || !word.trim()) return;
  const cleanWord = word.split(' ')[0].trim();

  isLoading.value = true;
  hasSearched.value = true;
  suggestions.value = [];

  try {
    const entry = await lookupWord(cleanWord);
    currentEntry.value = entry;

    if (entry) {
      const progress = getVocabProgress();
      isStarred.value = Boolean(progress[entry.word]?.isStarred);

      // Add to recents
      const filtered = recentSearches.value.filter(w => w.toLowerCase() !== entry.word.toLowerCase());
      recentSearches.value = [entry.word, ...filtered].slice(0, 8);
    }
  } catch {
    currentEntry.value = null;
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.initialQuery && props.initialQuery.trim()) {
      const clean = props.initialQuery.trim();
      searchTerm.value = clean;
      executeSearch(clean);
    } else if (!currentEntry.value) {
      executeSearch('substantial');
    }
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

watch(() => props.initialQuery, (newQuery) => {
  if (props.isOpen && newQuery && newQuery.trim()) {
    const clean = newQuery.trim();
    searchTerm.value = clean;
    executeSearch(clean);
  }
});

const handleInputChange = (val: string) => {
  searchTerm.value = val;
  if (val.trim().length >= 2) {
    suggestions.value = getWordSuggestions(val);
  } else {
    suggestions.value = [];
  }
};

const handleSearchSubmit = () => {
  executeSearch(searchTerm.value);
};

const speakWord = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    
    isPlayingAudio.value = true;
    utterance.onend = () => { isPlayingAudio.value = false; };
    utterance.onerror = () => { isPlayingAudio.value = false; };

    window.speechSynthesis.speak(utterance);
  }
};

const handleStarToggle = () => {
  if (!currentEntry.value) return;
  const next = toggleWordStar(currentEntry.value.word);
  isStarred.value = next;
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-fadeIn select-none"
    @click.self="emit('close')"
  >
    <div 
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-2xl shadow-[0_24px_80px_rgba(0,0,0,0.16)] border border-black/[0.08] overflow-hidden my-8 flex flex-col max-h-[88vh] animate-scaleUp"
      @click.stop
    >
      <!-- Dictionary Modal Header (Apple Sheet Style) -->
      <div class="p-5 sm:p-6 border-b border-black/[0.04] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-[#1d1d1f] flex items-center justify-center text-white shadow-sm">
            <BookMarked class="w-4 h-4" />
          </div>
          <div>
            <h2 class="font-semibold text-base text-[#1d1d1f]">雅思即时学术词典 (IELTS Lexicon)</h2>
            <p class="text-xs text-[#86868b] mt-0.5 font-normal">双向即时搜寻 · 权威学术释义 · 真题语境 · 英音发音</p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Search Input Bar with Suggestions -->
      <div class="p-5 sm:p-6 pt-3 pb-4 bg-[#fbfbfd] border-b border-black/[0.04] shrink-0 relative space-y-3">
        <form @submit.prevent="handleSearchSubmit" class="relative">
          <Search class="w-4 h-4 text-[#86868b] absolute left-4 top-3.5" />
          <input
            ref="inputRef"
            type="text"
            placeholder="输入英文原词或中文释义（如 substantial, apple, 解决, 环境）..."
            :value="searchTerm"
            @input="handleInputChange(($event.target as HTMLInputElement).value)"
            class="w-full pl-11 pr-24 py-2.5 bg-white border border-black/[0.06] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 shadow-2xs font-normal"
          />
          <button
            type="submit"
            class="absolute right-1.5 top-1.5 px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-98"
          >
            查询
          </button>
        </form>

        <!-- Auto-complete Suggestions Dropdown -->
        <div v-if="suggestions.length > 0" class="absolute left-5 right-5 top-[64px] z-20 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-xl overflow-hidden animate-slideDown">
          <div class="px-3.5 py-1.5 bg-[#f5f5f7] text-[10px] text-[#86868b] font-medium border-b border-black/[0.04]">
            实时匹配建议:
          </div>
          <div
            v-for="s in suggestions"
            :key="s"
            @click="searchTerm = s.split(' ')[0]; executeSearch(s.split(' ')[0]);"
            class="px-4 py-2 text-xs text-[#1d1d1f] hover:bg-[#0071e3]/10 hover:text-[#0071e3] cursor-pointer transition-colors flex items-center justify-between font-normal"
          >
            <span class="font-medium">{{ s }}</span>
            <ArrowRight class="w-3.5 h-3.5 text-[#86868b]" />
          </div>
        </div>

        <!-- Quick Recommendations & Recents -->
        <div class="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span class="text-[#86868b] text-[11px] flex items-center gap-1 font-normal">
            <History class="w-3 h-3 text-[#86868b]" />
            高频/最近:
          </span>
          <button
            v-for="word in recentSearches"
            :key="word"
            type="button"
            @click="searchTerm = word; executeSearch(word);"
            class="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.06] text-[11px] font-normal transition-all cursor-pointer shadow-2xs"
          >
            {{ word }}
          </button>
        </div>
      </div>

      <!-- Content Body -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
        <div v-if="isLoading" class="py-16 text-center space-y-3">
          <div class="w-7 h-7 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p class="text-xs text-[#86868b] font-normal animate-pulse">正在检索词库与学术例句...</p>
        </div>

        <div v-else-if="currentEntry" class="space-y-4 animate-fadeIn">
          <!-- Word Title & Pronunciation Header Card -->
          <div class="bg-white p-5 sm:p-6 rounded-3xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-start justify-between gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-2.5 flex-wrap">
                <h1 class="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                  {{ currentEntry.word }}
                </h1>
                <span class="px-2.5 py-0.5 bg-[#f5f5f7] text-[#1d1d1f] text-xs font-serif font-medium rounded-full">
                  {{ currentEntry.partOfSpeech }}
                </span>
                <span v-if="currentEntry.ieltsBand" class="px-2.5 py-0.5 bg-[#ff9500]/10 text-[#ff9500] text-[11px] font-medium rounded-full">
                  {{ currentEntry.ieltsBand }}
                </span>
              </div>

              <!-- Phonetic & Audio Trigger -->
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs sm:text-sm text-[#0071e3] font-medium">
                  {{ currentEntry.phonetic }}
                </span>
                <button
                  type="button"
                  @click="speakWord(currentEntry.word)"
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer',
                    isPlayingAudio ? 'bg-[#0071e3] text-white animate-pulse' : 'bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3]'
                  ]"
                  title="点击收听英音标准发音"
                >
                  <Volume2 class="w-3.5 h-3.5" />
                  <span>发音</span>
                </button>
              </div>
            </div>

            <!-- Star / Save to Wordbook -->
            <button
              type="button"
              @click="handleStarToggle"
              :class="[
                'px-3.5 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer',
                isStarred
                  ? 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/30 shadow-2xs'
                  : 'bg-white text-[#86868b] border-black/[0.06] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
              ]"
              title="收藏至我的个人生词库"
            >
              <Star :class="['w-3.5 h-3.5', isStarred ? 'fill-[#ff9500] text-[#ff9500]' : 'text-[#86868b]']" />
              <span>{{ isStarred ? '已收藏' : '收藏' }}</span>
            </button>
          </div>

          <!-- Chinese Meaning -->
          <div class="p-4 sm:p-5 bg-white rounded-2xl border border-black/[0.04] shadow-2xs space-y-1">
            <span class="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
              中文释义
            </span>
            <p class="text-base font-semibold text-[#1d1d1f]">
              {{ currentEntry.chinese }}
            </p>
          </div>

          <!-- English Definition -->
          <div class="p-4 sm:p-5 bg-[#f5f5f7] rounded-2xl border border-black/[0.02] text-xs space-y-1">
            <span class="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
              English Definition (英英释义)
            </span>
            <p class="text-[#1d1d1f] font-serif leading-relaxed italic">
              "{{ currentEntry.definition }}"
            </p>
          </div>

          <!-- Real IELTS Context Example -->
          <div class="p-4 sm:p-5 bg-[#0071e3]/5 rounded-2xl border border-[#0071e3]/10 text-xs space-y-1.5">
            <span class="text-[11px] font-medium text-[#0071e3] uppercase tracking-wider flex items-center gap-1">
              <Sparkles class="w-3.5 h-3.5 text-[#0071e3]" />
              真题例句 / 权威语境
            </span>
            <p class="text-[#1d1d1f] font-serif leading-relaxed pl-3 border-l-2 border-[#0071e3]">
              "{{ currentEntry.example }}"
            </p>
          </div>

          <!-- Synonyms & Collocations -->
          <div v-if="currentEntry.synonyms || currentEntry.collocations" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div v-if="currentEntry.synonyms" class="p-4 bg-white rounded-2xl border border-black/[0.04] space-y-2 shadow-2xs">
              <span class="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
                学术近义替换 (Synonyms)
              </span>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="syn in currentEntry.synonyms"
                  :key="syn"
                  type="button"
                  @click="searchTerm = syn; executeSearch(syn);"
                  class="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-medium border border-[#0071e3]/15 hover:bg-[#0071e3]/20 transition-colors cursor-pointer"
                >
                  {{ syn }}
                </button>
              </div>
            </div>

            <div v-if="currentEntry.collocations" class="p-4 bg-white rounded-2xl border border-black/[0.04] space-y-2 shadow-2xs">
              <span class="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
                考官高频搭配 (Collocations)
              </span>
              <div class="space-y-1 pl-2">
                <div v-for="(col, idx) in currentEntry.collocations" :key="idx" class="text-[#6e6e73] font-normal list-item">
                  {{ col }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Not found -->
        <div v-else-if="hasSearched" class="py-12 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-[#f5f5f7] text-[#86868b] flex items-center justify-center mx-auto border border-black/[0.04]">
            <HelpCircle class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-semibold text-[#1d1d1f]">
              未直接检索到单词 "{{ searchTerm }}"
            </p>
            <p class="text-xs text-[#86868b]">
              可能存在拼写偏差，您可以轻点下方推荐词或重新输入：
            </p>
          </div>

          <!-- Helpful suggestions -->
          <div class="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-2">
            <button
              v-for="w in ['substantial', 'rewilding', 'mitigate', 'biodiversity', 'curriculum', 'architecture']"
              :key="w"
              type="button"
              @click="searchTerm = w; executeSearch(w);"
              class="px-3.5 py-1 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-normal rounded-full border border-black/[0.04] transition-colors cursor-pointer"
            >
              {{ w }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
