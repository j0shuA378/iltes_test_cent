<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Sparkles, 
  Dice5, 
  ChevronDown, 
  Layers, 
  Info, 
  Check,
  Search
} from 'lucide-vue-next';
import type { BankCategory, ModuleType } from '../../types/ielts';
import { 
  BANK_COLLECTIONS, 
  getBankInfo, 
  inferBankCategory,
  getReadingTestsByBank,
  getListeningTestsByBank,
  getWritingTasksByBank,
  getSpeakingTopicsByBank
} from '../../services/questionBankService';

const props = defineProps<{
  module: ModuleType;
  modelValue: string; // Current test / task / topic ID
  compact?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void;
  (e: 'changeBank', bank: BankCategory): void;
  (e: 'openSmartRandom'): void;
  (e: 'openSearch'): void;
}>();

const currentBank = ref<BankCategory>('all');
const showBankInfo = ref(false);

// Infer initial bank from current modelValue
const initializeBankFromId = (id: string) => {
  const tests = getAvailableItems('all');
  const target = tests.find(t => t.id === id);
  if (target) {
    const cat = inferBankCategory(target);
    // Don't force away from 'all' if user selected 'all', but default to matching category if specific
    if (currentBank.value !== 'all' && currentBank.value !== cat) {
      currentBank.value = cat;
    }
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    initializeBankFromId(newVal);
  }
}, { immediate: true });

function getAvailableItems(bank: BankCategory) {
  switch (props.module) {
    case 'reading':
      return getReadingTestsByBank(bank).map(t => ({
        id: t.id,
        title: t.title,
        source: t.source,
        year: t.year || '2024',
        difficulty: t.difficulty || 'Authentic Exam',
        bankCategory: inferBankCategory(t)
      }));
    case 'listening':
      return getListeningTestsByBank(bank).map(t => ({
        id: t.id,
        title: t.title,
        source: t.source,
        year: t.year || '2024',
        difficulty: t.difficulty || 'Authentic Exam',
        bankCategory: inferBankCategory(t)
      }));
    case 'writing':
      return getWritingTasksByBank(bank).map(t => ({
        id: t.id,
        title: `${t.type.toUpperCase()}: ${t.title}`,
        source: t.source || 'Writing Bank',
        year: t.year || '2024',
        difficulty: t.minWords > 200 ? 'Task 2' : 'Task 1',
        bankCategory: inferBankCategory(t)
      }));
    case 'speaking':
      return getSpeakingTopicsByBank(bank).map(t => ({
        id: t.id,
        title: `PART ${t.part}: ${t.title}`,
        source: t.source || 'Speaking Bank',
        year: t.year || '2024',
        difficulty: `Part ${t.part}`,
        bankCategory: inferBankCategory(t)
      }));
  }
}

// Current filtered items based on selected bank
const filteredItems = computed(() => getAvailableItems(currentBank.value));

// Bank counts for badge
const bankCounts = computed(() => {
  const counts: Record<BankCategory, number> = {
    all: 0,
    cam19: 0,
    cam18: 0,
    cam17: 0,
    cdi_recent: 0
  };
  BANK_COLLECTIONS.forEach(b => {
    counts[b.id] = getAvailableItems(b.id).length;
  });
  return counts;
});

const activeBankInfo = computed(() => getBankInfo(currentBank.value));

const handleSelectBank = (bankId: BankCategory) => {
  currentBank.value = bankId;
  emit('changeBank', bankId);

  // If currently selected test is not in this bank, pick the first available test
  const items = getAvailableItems(bankId);
  if (items.length > 0 && !items.some(i => i.id === props.modelValue)) {
    emit('update:modelValue', items[0].id);
  }
};

const handleSelectTest = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  emit('update:modelValue', select.value);
};
</script>

<template>
  <div class="space-y-3">
    <!-- Top Control Bar (Pills & Dropdown) -->
    <div class="flex flex-wrap items-center justify-between gap-2.5">
      <!-- Apple-style Segmented Bank Pills -->
      <div class="inline-flex items-center bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04] text-xs max-w-full overflow-x-auto scrollbar-none shadow-xs">
        <button
          v-for="b in BANK_COLLECTIONS"
          :key="b.id"
          @click="handleSelectBank(b.id)"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center gap-1.5 shrink-0 select-none cursor-pointer',
            currentBank === b.id
              ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
              : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
          ]"
        >
          <span>{{ b.shortName }}</span>
          <span 
            v-if="bankCounts[b.id] > 0"
            :class="[
              'text-[10px] px-1.5 py-0.2 rounded-full tabular-nums',
              currentBank === b.id 
                ? 'bg-black/[0.06] text-[#1d1d1f]' 
                : 'bg-black/[0.04] text-[#86868b]'
            ]"
          >
            {{ bankCounts[b.id] }}
          </span>
        </button>
      </div>

      <!-- Right Controls: Test Dropdown + Smart Random + Search -->
      <div class="flex items-center gap-2">
        <!-- Test Paper Dropdown -->
        <div class="relative">
          <select
            :value="modelValue"
            @change="handleSelectTest"
            class="appearance-none bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium pl-3 pr-8 py-1.5 rounded-full border border-black/[0.06] focus:outline-none focus:border-[#0071e3] transition-all cursor-pointer max-w-[210px] sm:max-w-[280px] truncate"
          >
            <option v-for="item in filteredItems" :key="item.id" :value="item.id">
              {{ item.title }}
            </option>
          </select>
          <ChevronDown class="w-3.5 h-3.5 text-[#86868b] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <!-- Smart Random Action Pill -->
        <button
          type="button"
          @click="emit('openSmartRandom')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium rounded-full shadow-xs transition-all active:scale-97 cursor-pointer"
          title="智能随机抽题 & 模考"
        >
          <Dice5 class="w-3.5 h-3.5 text-amber-400" />
          <span class="hidden sm:inline">智能随机</span>
          <span class="sm:hidden">随机</span>
        </button>

        <!-- Search shortcut -->
        <button
          type="button"
          @click="emit('openSearch')"
          class="p-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] border border-black/[0.04] rounded-full text-xs transition-colors cursor-pointer"
          title="全库搜索 (Ctrl+K)"
        >
          <Search class="w-3.5 h-3.5" />
        </button>

        <!-- Info toggle -->
        <button
          type="button"
          @click="showBankInfo = !showBankInfo"
          :class="[
            'p-1.5 rounded-full text-xs transition-colors cursor-pointer border',
            showBankInfo
              ? 'bg-[#0071e3]/10 text-[#0071e3] border-[#0071e3]/30'
              : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] border-black/[0.04]'
          ]"
          title="查看题库说明"
        >
          <Info class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Expandable Bank Info Drawer (Apple subtle banner) -->
    <div 
      v-if="showBankInfo"
      class="rounded-2xl p-4 bg-[#fbfbfd] border border-black/[0.06] text-xs text-[#1d1d1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-sm text-[#1d1d1f]">{{ activeBankInfo.name }}</span>
          <span class="px-2 py-0.5 rounded-full bg-black/[0.05] text-[10px] font-medium text-[#86868b]">
            {{ activeBankInfo.officialBadge }}
          </span>
          <span class="text-[11px] text-[#86868b]">{{ activeBankInfo.year }}</span>
        </div>
        <p class="text-[#86868b] leading-relaxed max-w-2xl">
          {{ activeBankInfo.subtitle }} · {{ activeBankInfo.description }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[11px] text-[#86868b]">当前科目共有 <strong class="text-[#1d1d1f] font-semibold">{{ filteredItems.length }}</strong> 套可用题目</span>
      </div>
    </div>
  </div>
</template>
