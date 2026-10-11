<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  BookMarked, 
  Volume2, 
  Star, 
  CheckCircle2, 
  Search, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Brain, 
  Award,
  XCircle,
  AlertTriangle,
  Zap
} from 'lucide-vue-next';
import { CORE_VOCABULARY, SYNONYM_PAIRS } from '../../data/vocabularyData';
import { getVocabProgress, updateWordStatus, toggleWordStar } from '../../services/storage';
import { 
  recordEbbinghausReview, 
  getEbbinghausItem, 
  calculateRetention, 
  STAGE_DESCRIPTIONS, 
  getEbbinghausStats 
} from '../../services/ebbinghausService';
import type { VocabWord } from '../../types/ielts';
import type { EbbinghausItem, MemoryStage } from '../../types/auth';

const activeTab = ref<'flashcards' | 'synonyms'>('flashcards');

// Flashcards state
const selectedCategory = ref<string>('All');
const currentIndex = ref(0);
const isFlipped = ref(false);
const userProgress = ref<Record<string, { status: string; isStarred?: boolean }>>({});
const refreshTrigger = ref(0);

// Synonyms search
const synonymSearch = ref('');

const reloadData = () => {
  userProgress.value = getVocabProgress();
  refreshTrigger.value++;
};

const handleAuthChange = () => {
  reloadData();
  currentIndex.value = 0;
  isFlipped.value = false;
};

onMounted(() => {
  reloadData();
  window.addEventListener('ielts_auth_changed', handleAuthChange);
});

onUnmounted(() => {
  window.removeEventListener('ielts_auth_changed', handleAuthChange);
});

const categories = [
  'All',
  'DueReview',
  'Starred',
  'Academic',
  'Environment',
  'Technology',
  'Education',
  'Society',
  'Listening_Campus'
];

// Filter words
const filteredWords = computed(() => {
  // depend on refreshTrigger
  const _ = refreshTrigger.value;
  return CORE_VOCABULARY.filter(w => {
    const saved = userProgress.value[w.id];
    if (selectedCategory.value === 'All') return true;
    if (selectedCategory.value === 'Starred') return !!saved?.isStarred;
    if (selectedCategory.value === 'DueReview') {
      const ebItem = getEbbinghausItem(`vocab_${w.id}`);
      if (!ebItem) return true;
      return new Date(ebItem.nextReviewAt).getTime() <= Date.now();
    }
    return w.category === selectedCategory.value;
  });
});

const currentWord = computed<VocabWord | undefined>(() => filteredWords.value[currentIndex.value] || filteredWords.value[0]);

const currentEbItem = computed<EbbinghausItem | null>(() => {
  if (!currentWord.value) return null;
  const _ = refreshTrigger.value;
  return getEbbinghausItem(`vocab_${currentWord.value.id}`);
});

const currentStage = computed<MemoryStage>(() => currentEbItem.value ? currentEbItem.value.stage : 0);
const currentStageInfo = computed(() => STAGE_DESCRIPTIONS[currentStage.value]);
const currentRetention = computed(() => currentEbItem.value ? calculateRetention(currentEbItem.value) : 100);

const ebStats = computed(() => {
  const _ = refreshTrigger.value;
  return getEbbinghausStats();
});

const handleFlip = () => {
  isFlipped.value = !isFlipped.value;
};

const handleNextWord = () => {
  isFlipped.value = false;
  if (currentIndex.value < filteredWords.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const handlePrevWord = () => {
  isFlipped.value = false;
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = filteredWords.value.length - 1;
  }
};

const handleEbbinghausFeedback = (feedback: 'forgot' | 'hard' | 'good' | 'easy') => {
  if (!currentWord.value) return;

  recordEbbinghausReview(
    `vocab_${currentWord.value.id}`,
    'vocab',
    currentWord.value.word,
    feedback,
    currentWord.value.chinese
  );

  const legacyStatus = feedback === 'forgot' ? 'unfamiliar' : feedback === 'hard' ? 'learning' : 'mastered';
  updateWordStatus(currentWord.value.id, legacyStatus);
  userProgress.value = {
    ...userProgress.value,
    [currentWord.value.id]: { ...(userProgress.value[currentWord.value.id] || {}), status: legacyStatus }
  };

  refreshTrigger.value++;
  handleNextWord();
};

const handleToggleStar = () => {
  if (!currentWord.value) return;
  const isNowStarred = toggleWordStar(currentWord.value.id);
  userProgress.value = {
    ...userProgress.value,
    [currentWord.value.id]: { ...(userProgress.value[currentWord.value.id] || { status: 'unfamiliar' }), isStarred: isNowStarred }
  };
};

const speakWord = (word: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    window.speechSynthesis.speak(utterance);
  }
};

const filteredSynonyms = computed(() => {
  return SYNONYM_PAIRS.filter(s => {
    if (!synonymSearch.value.trim()) return true;
    const q = synonymSearch.value.toLowerCase();
    return s.coreWord.toLowerCase().includes(q) ||
      s.chinese.includes(q) ||
      s.synonyms.some(syn => syn.toLowerCase().includes(q));
  });
});
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12 select-none">
    <!-- Module Header (Apple Clean Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#0071e3] font-medium mb-1.5">
          <Brain class="w-4 h-4 text-[#0071e3]" />
          <span class="uppercase tracking-wider">IELTS Core Lexicon & Spaced Repetition</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f]">
          高频核心词库与同义替换宝典
        </h1>
        <p class="text-xs sm:text-sm text-[#86868b] mt-1 font-normal">
          严格遵循艾宾浩斯 7 级记忆周期 · 听力机经拼写与学术阅读提分必备
        </p>
      </div>

      <!-- Apple Segmented Control -->
      <div class="flex items-center p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
        <button
          @click="activeTab = 'flashcards'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer',
            activeTab === 'flashcards' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          艾宾浩斯闪卡
        </button>
        <button
          @click="activeTab = 'synonyms'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer',
            activeTab === 'synonyms' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          同义替换宝典
        </button>
      </div>
    </div>

    <!-- TAB 1: FLASHCARDS -->
    <div v-if="activeTab === 'flashcards'" class="space-y-6">
      <!-- Ebbinghaus Quick Stats Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          @click="selectedCategory = 'DueReview'; currentIndex = 0; isFlipped = false;"
          :class="[
            'p-4 rounded-2xl border transition-all duration-150 text-left cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500 shadow-card-subtle',
            selectedCategory === 'DueReview'
              ? 'bg-white border-slate-900 shadow-sm'
              : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
          ]"
        >
          <div class="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>今日待强化</span>
            <Clock class="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {{ ebStats.dueTodayCount }} <span class="text-xs font-normal text-slate-500">词到期</span>
          </div>
        </button>

        <div class="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 text-left shadow-card-subtle">
          <div class="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>当前记忆留存率</span>
            <TrendingUp class="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {{ ebStats.averageRetention }}%
          </div>
        </div>

        <div class="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 text-left shadow-card-subtle">
          <div class="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>已达到永久掌握</span>
            <Award class="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {{ ebStats.masteredCount }} <span class="text-xs font-normal text-slate-500">词牢固</span>
          </div>
        </div>

        <div class="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 text-left shadow-card-subtle">
          <div class="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>总词汇量收录</span>
            <BookMarked class="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {{ CORE_VOCABULARY.length }} <span class="text-xs font-normal text-slate-500">核心词</span>
          </div>
        </div>
      </div>

      <!-- Category Filter Pills (Apple Style) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat; currentIndex = 0; isFlipped = false;"
          :class="[
            'px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
            selectedCategory === cat
              ? cat === 'DueReview'
                ? 'bg-[#ff9500] text-white shadow-sm'
                : 'bg-[#1d1d1f] text-white shadow-sm'
              : cat === 'DueReview'
              ? 'bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/25 hover:bg-[#ff9500]/15'
              : 'bg-white border border-black/[0.06] text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
          ]"
        >
          {{ 
            cat === 'All' ? '全部核心词' :
            cat === 'DueReview' ? `今日待复习 (${ebStats.dueTodayCount})` :
            cat === 'Starred' ? '⭐ 收藏夹' :
            cat === 'Listening_Campus' ? '听力校园场景' :
            cat === 'Academic' ? '学术高频词' :
            cat === 'Environment' ? '环境与生态' :
            cat === 'Technology' ? '科学与技术' :
            cat === 'Education' ? '教育与成长' :
            cat === 'Society' ? '社会与发展' : cat
          }}
        </button>
      </div>

      <div v-if="filteredWords.length === 0" class="bg-white rounded-3xl p-12 text-center border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
        <CheckCircle2 class="w-12 h-12 text-[#34c759] mx-auto" />
        <h3 class="text-base font-semibold text-[#1d1d1f]">
          {{ selectedCategory === 'DueReview' ? '太棒了！今日待复习词汇已全部清空' : '当前分类下暂无词汇' }}
        </h3>
        <p class="text-xs text-[#86868b] max-w-sm mx-auto">
          {{ selectedCategory === 'DueReview'
            ? '艾宾浩斯记忆模型已将记忆突触排期至后续周期，您可以切换至“全部核心词”继续温习新词。'
            : '您可以切换至其他分类或添加收藏。' }}
        </p>
        <button
          v-if="selectedCategory === 'DueReview'"
          @click="selectedCategory = 'All'; currentIndex = 0; isFlipped = false;"
          class="mt-2 px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer"
        >
          浏览全部核心词汇
        </button>
      </div>

      <div v-else-if="currentWord" class="space-y-6">
        <!-- Progress counter & Ebbinghaus Stage Indicator -->
        <div class="flex flex-wrap items-center justify-between text-xs text-[#86868b] px-2 gap-2">
          <div class="flex items-center gap-2">
            <span class="font-medium text-[#1d1d1f]">词卡进度: {{ currentIndex + 1 }} / {{ filteredWords.length }}</span>
            <span class="text-black/10">|</span>
            <span class="capitalize">{{ currentWord.category }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span :class="['px-3 py-1 rounded-full text-xs font-medium border', currentStageInfo.bg, currentStageInfo.color]">
              {{ currentStageInfo.label }}
            </span>
            <span class="px-3 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[#1d1d1f] text-xs font-medium">
              留存率 {{ currentRetention }}%
            </span>
          </div>
        </div>

        <!-- Apple Card Container -->
        <div 
          @click="handleFlip"
          class="bg-white rounded-3xl p-8 sm:p-12 border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.03)] min-h-[330px] flex flex-col justify-between cursor-pointer hover:border-black/[0.12] transition-all select-none relative"
        >
          <!-- Top star and audio icons -->
          <div class="flex items-center justify-between w-full">
            <button
              @click.stop="handleToggleStar"
              class="p-2 rounded-full hover:bg-[#f5f5f7] text-[#86868b] cursor-pointer"
              title="收藏单词"
            >
              <Star :class="['w-5 h-5', userProgress[currentWord.id]?.isStarred ? 'fill-[#ff9500] text-[#ff9500]' : '']" />
            </button>

            <div class="flex items-center gap-2">
              <span v-if="currentEbItem" class="text-[11px] text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-black/[0.02]">
                累计复盘 {{ currentEbItem.reviewCount }} 次
              </span>

              <button
                @click.stop="speakWord(currentWord.word)"
                class="px-3 py-1.5 rounded-full bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3] flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="播放英音发音"
              >
                <Volume2 class="w-4 h-4" />
                <span>发音</span>
              </button>
            </div>
          </div>

          <!-- Card Center Content -->
          <div class="text-center my-auto space-y-3">
            <!-- Front side -->
            <div v-if="!isFlipped" class="space-y-2">
              <h2 class="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
                {{ currentWord.word }}
              </h2>
              <div class="flex items-center justify-center gap-2 text-sm text-[#86868b]">
                <span class="font-mono text-[#0071e3] font-medium">{{ currentWord.phonetic }}</span>
                <span>·</span>
                <span class="italic font-serif">{{ currentWord.partOfSpeech }}</span>
              </div>
              <p class="text-xs text-[#86868b] pt-4 font-normal">轻点卡片翻看释义与语境例句</p>
            </div>

            <!-- Back side -->
            <div v-else class="space-y-4 max-w-md mx-auto animate-fadeIn">
              <div>
                <div class="text-2xl font-semibold text-[#1d1d1f]">{{ currentWord.chinese }}</div>
                <div class="text-xs text-[#86868b] mt-1">{{ currentWord.meaning }}</div>
              </div>

              <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02] text-xs text-[#1d1d1f] text-left font-serif leading-relaxed">
                <span class="font-medium text-[#1d1d1f] font-sans block mb-1">真题经典语境:</span>
                "{{ currentWord.example }}"
              </div>

              <div v-if="currentWord.synonyms && currentWord.synonyms.length > 0" class="text-xs text-left">
                <span class="font-medium text-[#86868b] block mb-1.5">近义替换储备:</span>
                <div class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="syn in currentWord.synonyms" 
                    :key="syn" 
                    class="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-medium border border-[#0071e3]/15"
                  >
                    {{ syn }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Bottom Indicator -->
          <div class="flex items-center justify-between text-[11px] text-[#86868b] pt-2 border-t border-black/[0.04]">
            <button
              @click.stop="handlePrevWord"
              class="hover:text-[#1d1d1f] flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>上一个</span>
            </button>

            <span>{{ isFlipped ? '轻点翻回正面' : '翻转卡片 ⟲' }}</span>

            <button
              @click.stop="handleNextWord"
              class="hover:text-[#1d1d1f] flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>下一个</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- 4-Level Ebbinghaus Spaced Review Action Buttons -->
        <div class="space-y-2">
          <div class="text-center text-xs font-medium text-[#86868b]">
            评估记忆提取状态（艾宾浩斯抗遗忘算法将自适应重新排期）
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              @click="handleEbbinghausFeedback('forgot')"
              class="py-3 px-3 rounded-2xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 transition-all duration-150 shadow-card-subtle flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <span class="text-xs font-bold flex items-center gap-1.5 font-sans">
                <XCircle class="w-4 h-4 text-rose-600 shrink-0" />
                <span>完全遗忘</span>
              </span>
              <span class="text-[10px] text-rose-600/80 mt-1 font-normal">归零 Stage 0 · 20分内重测</span>
            </button>

            <button
              @click="handleEbbinghausFeedback('hard')"
              class="py-3 px-3 rounded-2xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-800 transition-all duration-150 shadow-card-subtle flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <span class="text-xs font-bold flex items-center gap-1.5 font-sans">
                <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0" />
                <span>模糊吃力</span>
              </span>
              <span class="text-[10px] text-amber-700/80 mt-1 font-normal">降 1 级 · 缩短下次间隔</span>
            </button>

            <button
              @click="handleEbbinghausFeedback('good')"
              class="py-3 px-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 transition-all duration-150 shadow-card-subtle flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span class="text-xs font-bold flex items-center gap-1.5 font-sans">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>顺利想起</span>
              </span>
              <span class="text-[10px] text-emerald-700/80 mt-1 font-normal">进 1 级 · 推进下一周期</span>
            </button>

            <button
              @click="handleEbbinghausFeedback('easy')"
              class="py-3 px-3 rounded-2xl border border-sky-200 bg-sky-50/80 hover:bg-sky-100 text-sky-800 transition-all duration-150 shadow-card-subtle flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <span class="text-xs font-bold flex items-center gap-1.5 font-sans">
                <Zap class="w-4 h-4 text-sky-600 shrink-0" />
                <span>极度熟练</span>
              </span>
              <span class="text-[10px] text-sky-700/80 mt-1 font-normal">跳进 2 级 · 锁定永久记忆</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: SYNONYM PAIRS -->
    <div v-if="activeTab === 'synonyms'" class="space-y-6">
      <div class="relative">
        <Search class="w-4 h-4 text-[#86868b] absolute left-4 top-3.5" />
        <input
          v-model="synonymSearch"
          type="text"
          placeholder="搜索英文原词、替换词或中文释义（如 increase, 解决, important）..."
          class="w-full pl-11 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 shadow-2xs"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="pair in filteredSynonyms" 
          :key="pair.id" 
          class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 hover:border-black/[0.1] transition-all"
        >
          <div class="flex items-center justify-between pb-2 border-b border-black/[0.04]">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-[#1d1d1f] text-sm">{{ pair.coreWord }}</span>
              <span class="text-xs text-[#86868b] font-normal">({{ pair.chinese }})</span>
            </div>
            <span :class="[
              'text-[10px] font-semibold px-2.5 py-0.5 rounded-full',
              pair.frequency === 'Essential' 
                ? 'bg-[#ff3b30]/10 text-[#ff3b30]' 
                : pair.frequency === 'High' 
                ? 'bg-[#ff9500]/10 text-[#ff9500]' 
                : 'bg-[#0071e3]/10 text-[#0071e3]'
            ]">
              {{ pair.frequency }}
            </span>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <span 
              v-for="syn in pair.synonyms" 
              :key="syn" 
              class="px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-medium text-xs border border-[#0071e3]/15"
            >
              {{ syn }}
            </span>
          </div>

          <div class="bg-[#f5f5f7] p-3 rounded-2xl border border-black/[0.02] text-xs font-serif text-[#1d1d1f] leading-relaxed italic">
            "{{ pair.sampleSentence }}"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
