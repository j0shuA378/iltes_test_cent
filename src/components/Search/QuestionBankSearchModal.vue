<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Search, 
  X, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Sparkles, 
  ArrowRight
} from 'lucide-vue-next';
import { READING_TESTS } from '../../data/readingTests';
import { LISTENING_TESTS } from '../../data/listeningTests';
import { WRITING_TASKS } from '../../data/writingTasks';
import { SPEAKING_TOPICS } from '../../data/speakingTopics';

export interface SearchResultItem {
  id: string;
  module: 'reading' | 'listening' | 'writing' | 'speaking';
  title: string;
  source: string;
  year?: string;
  category: string;
  description: string;
  tags?: string[];
  questionCount?: number;
}

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'selectTest', module: string, testId: string): void;
}>();

const query = ref('');
const selectedModule = ref<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
const selectedSource = ref<string>('all');

const allItems = computed<SearchResultItem[]>(() => {
  const list: SearchResultItem[] = [];

  // Reading
  READING_TESTS.forEach(rt => {
    const qCount = rt.passages.reduce((acc, p) => acc + p.questions.length, 0);
    list.push({
      id: rt.id,
      module: 'reading',
      title: rt.title,
      source: rt.source,
      year: rt.year || '2024',
      category: `包含 ${rt.passages.length} 篇学术长难篇章`,
      description: rt.passages.map(p => `Passage ${p.id}: ${p.title}`).join(' | '),
      tags: rt.tags || ['Headings', 'TFNG', 'Summary'],
      questionCount: qCount
    });
  });

  // Listening
  LISTENING_TESTS.forEach(lt => {
    const qCount = lt.sections.reduce((acc, s) => acc + s.questions.length, 0);
    list.push({
      id: lt.id,
      module: 'listening',
      title: lt.title,
      source: lt.source,
      year: lt.year || '2024',
      category: `包含 Section 1 - ${lt.sections.length} 仿真音频`,
      description: lt.sections.map(s => `Section ${s.sectionNumber}: ${s.title}`).join(' | '),
      tags: lt.tags || ['Gap Filling', 'MCQ'],
      questionCount: qCount
    });
  });

  // Writing
  WRITING_TASKS.forEach(wt => {
    list.push({
      id: wt.id,
      module: 'writing',
      title: `[${wt.type.toUpperCase()}] ${wt.title}`,
      source: wt.source || 'Cambridge IELTS Collection',
      year: wt.year || '2024-2025',
      category: wt.category,
      description: wt.prompt.slice(0, 120) + '...',
      tags: wt.tags || [wt.type.toUpperCase(), wt.category],
      questionCount: 1
    });
  });

  // Speaking
  SPEAKING_TOPICS.forEach(st => {
    list.push({
      id: st.id,
      module: 'speaking',
      title: `[Part ${st.part}] ${st.title}`,
      source: st.source || '2024-2025 官方轮换题库',
      year: '2024-2025',
      category: st.category,
      description: st.part === 2 ? (st.cueCard?.topic || '') : (st.questions?.slice(0, 2).join(' | ') || ''),
      tags: [st.category, `Part ${st.part}`],
      questionCount: st.questions?.length || 1
    });
  });

  return list;
});

const filteredItems = computed(() => {
  return allItems.value.filter(item => {
    if (selectedModule.value !== 'all' && item.module !== selectedModule.value) return false;
    if (selectedSource.value !== 'all') {
      if (selectedSource.value === 'cam19' && !item.source.toLowerCase().includes('19')) return false;
      if (selectedSource.value === 'cam18' && !item.source.toLowerCase().includes('18')) return false;
      if (selectedSource.value === 'cdi' && !item.source.toLowerCase().includes('机考') && !item.source.toLowerCase().includes('回忆') && !item.source.toLowerCase().includes('轮换')) return false;
    }

    if (!query.value.trim()) return true;

    const q = query.value.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  });
});

const getModuleBadge = (module: string) => {
  switch (module) {
    case 'reading':
      return { label: '学术阅读', bg: 'bg-[#34c759]/10 text-[#34c759]', icon: BookOpen };
    case 'listening':
      return { label: '机考听力', bg: 'bg-[#0071e3]/10 text-[#0071e3]', icon: Headphones };
    case 'writing':
      return { label: '写作题库', bg: 'bg-[#ff9500]/10 text-[#ff9500]', icon: PenTool };
    case 'speaking':
      return { label: '口语真题', bg: 'bg-[#af52de]/10 text-[#af52de]', icon: Mic };
    default:
      return { label: module, bg: 'bg-[#f5f5f7] text-[#1d1d1f]', icon: Sparkles };
  }
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-fadeIn select-none"
    @click.self="emit('close')"
  >
    <div 
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-4xl shadow-[0_24px_80px_rgba(0,0,0,0.16)] border border-black/[0.08] overflow-hidden my-8 flex flex-col max-h-[88vh] animate-scaleUp"
      @click.stop
    >
      <!-- Search Modal Header (Apple Style) -->
      <div class="p-5 sm:p-6 border-b border-black/[0.04] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-[#1d1d1f] flex items-center justify-center text-white shadow-sm">
            <Search class="w-4 h-4" />
          </div>
          <div>
            <h2 class="font-semibold text-base text-[#1d1d1f]">雅思全科真题检索中心 (Cambridge 18/19 & 官方机考)</h2>
            <p class="text-xs text-[#86868b] mt-0.5 font-normal">一键检索最新剑桥雅思真题、机考回忆考题与高频题卡</p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Search Input Bar -->
      <div class="p-5 sm:p-6 pt-3 pb-4 border-b border-black/[0.04] bg-[#fbfbfd] shrink-0 space-y-3.5">
        <div class="relative">
          <Search class="w-4 h-4 text-[#86868b] absolute left-4 top-3.5" />
          <input
            v-model="query"
            type="text"
            autofocus
            placeholder="搜索任何题库关键词（如：Space, EV, Rewilding, Termite, AI, Park, Line Chart, Cambridge 19）..."
            class="w-full pl-11 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 shadow-2xs font-normal"
          />
        </div>

        <!-- Filters row (Apple Segmented Bar) -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
          <!-- Module filters -->
          <div class="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full overflow-x-auto">
            <button
              v-for="m in [
                { id: 'all', label: '全部科目' },
                { id: 'reading', label: '阅读' },
                { id: 'listening', label: '听力' },
                { id: 'writing', label: '写作' },
                { id: 'speaking', label: '口语' },
              ]"
              :key="m.id"
              @click="selectedModule = m.id as any"
              :class="[
                'px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer',
                selectedModule === m.id
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              ]"
            >
              {{ m.label }}
            </button>
          </div>

          <!-- Source filter pills -->
          <div class="flex items-center gap-1.5">
            <span class="text-[#86868b] text-[11px]">来源:</span>
            <button
              v-for="src in [
                { id: 'all', label: '全部' },
                { id: 'cam19', label: '剑 19 最新' },
                { id: 'cam18', label: '剑 18' },
                { id: 'cdi', label: '机考回忆库' },
              ]"
              :key="src.id"
              @click="selectedSource = src.id"
              :class="[
                'px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer',
                selectedSource === src.id
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f]'
              ]"
            >
              {{ src.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results Count Bar -->
      <div class="px-6 py-2 bg-[#f5f5f7]/60 text-[11px] text-[#86868b] flex items-center justify-between shrink-0 border-b border-black/[0.04]">
        <span>找到 {{ filteredItems.length }} 条匹配试卷 / 题目</span>
        <span>点击「进入练习」立即跳转该科全真机考</span>
      </div>

      <!-- Scrollable Results List -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
        <div v-if="filteredItems.length === 0" class="text-center py-12 text-[#86868b] space-y-2">
          <Search class="w-8 h-8 mx-auto text-[#86868b]/40" />
          <p class="text-sm font-medium text-[#1d1d1f]">未找到符合筛选条件的真题试卷</p>
          <p class="text-xs text-[#86868b]">尝试更换搜索词（如 "Cambridge", "Environment", "Task 1"）</p>
        </div>

        <div 
          v-for="item in filteredItems"
          :key="`${item.module}_${item.id}`"
          class="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.04] hover:border-black/[0.1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all group space-y-2.5 shadow-2xs"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1', getModuleBadge(item.module).bg]">
                  <component :is="getModuleBadge(item.module).icon" class="w-3 h-3" />
                  {{ getModuleBadge(item.module).label }}
                </span>
                <span class="text-xs text-[#86868b]">
                  {{ item.source }} · {{ item.year }}
                </span>
              </div>
              <h3 class="text-sm font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                {{ item.title }}
              </h3>
            </div>

            <button
              @click="emit('selectTest', item.module, item.id); emit('close');"
              class="shrink-0 px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-98"
            >
              <span>进入练习</span>
              <ArrowRight class="w-3 h-3" />
            </button>
          </div>

          <p class="text-xs text-[#86868b] line-clamp-2 leading-relaxed font-normal">
            {{ item.description }}
          </p>

          <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1.5 pt-0.5">
            <span 
              v-for="tag in item.tags"
              :key="tag"
              class="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] text-[10px] font-normal border border-black/[0.02]"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
