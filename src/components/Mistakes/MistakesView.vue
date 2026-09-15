<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Headphones, 
  Brain, 
  Clock 
} from 'lucide-vue-next';
import { getMistakes, toggleMistakeResolved } from '../../services/storage';
import { 
  recordEbbinghausReview, 
  getEbbinghausItem, 
  calculateRetention, 
  STAGE_DESCRIPTIONS 
} from '../../services/ebbinghausService';
import type { MistakeRecord } from '../../types/ielts';
import type { MemoryStage } from '../../types/auth';

const emit = defineEmits<{
  (e: 'refreshMistakes'): void;
}>();

const mistakes = ref<MistakeRecord[]>([]);
const moduleFilter = ref<'all' | 'reading' | 'listening'>('all');
const statusFilter = ref<'all' | 'unresolved' | 'resolved'>('unresolved');

const reload = () => {
  mistakes.value = getMistakes();
  emit('refreshMistakes');
};

const handleAuthChange = () => {
  reload();
};

onMounted(() => {
  reload();
  window.addEventListener('ielts_auth_changed', handleAuthChange);
});

onUnmounted(() => {
  window.removeEventListener('ielts_auth_changed', handleAuthChange);
});

const handleToggle = (id: string) => {
  const isNowResolved = toggleMistakeResolved(id);
  const feedback = isNowResolved ? 'easy' : 'forgot';
  const item = mistakes.value.find(m => m.id === id);
  if (item) {
    recordEbbinghausReview(
      item.id,
      'mistake',
      `#${item.questionNumber} ${item.questionText}`,
      feedback,
      item.testTitle
    );
  }
  reload();
};

const handleEbbinghausFeedback = (
  m: MistakeRecord, 
  feedback: 'forgot' | 'hard' | 'good' | 'easy'
) => {
  const updated = recordEbbinghausReview(
    m.id,
    'mistake',
    `#${m.questionNumber} ${m.questionText}`,
    feedback,
    m.testTitle
  );

  if (updated.stage === 6 && !m.isResolved) {
    toggleMistakeResolved(m.id);
  } else if (updated.stage < 6 && m.isResolved && feedback === 'forgot') {
    toggleMistakeResolved(m.id);
  }
  reload();
};

const filteredMistakes = computed(() => {
  return mistakes.value.filter(m => {
    if (moduleFilter.value !== 'all' && m.module !== moduleFilter.value) return false;
    if (statusFilter.value === 'unresolved' && m.isResolved) return false;
    if (statusFilter.value === 'resolved' && !m.isResolved) return false;
    return true;
  });
});
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12 select-none">
    <!-- Header (Apple Clean Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#ff9500] font-medium mb-1.5">
          <Brain class="w-4 h-4 text-[#ff9500]" />
          <span class="uppercase tracking-wider">IELTS Mistake Notebook & Spaced Elimination</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f]">
          错题集与艾宾浩斯抗遗忘复盘
        </h1>
        <p class="text-xs sm:text-sm text-[#86868b] mt-1 font-normal">
          依循 7 级记忆突触周期持续复盘抽测，直至考场秒答彻底消除失误
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="px-3.5 py-1.5 rounded-full bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/20 text-xs font-medium flex items-center gap-1.5">
          <AlertCircle class="w-3.5 h-3.5" />
          <span>收录 {{ mistakes.length }} 道错题</span>
        </span>
      </div>
    </div>

    <!-- Filter Tabs (Apple Segmented Bar) -->
    <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-black/[0.04] shadow-2xs">
      <!-- Module Filter -->
      <div class="flex items-center gap-1.5 bg-[#f5f5f7] p-1 rounded-full text-xs">
        <button
          @click="moduleFilter = 'all'"
          :class="[
            'px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer',
            moduleFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          全部科目
        </button>
        <button
          @click="moduleFilter = 'reading'"
          :class="[
            'px-3.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer',
            moduleFilter === 'reading' ? 'bg-white text-[#34c759] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <BookOpen class="w-3 h-3" />
          阅读错题
        </button>
        <button
          @click="moduleFilter = 'listening'"
          :class="[
            'px-3.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer',
            moduleFilter === 'listening' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <Headphones class="w-3 h-3" />
          听力错题
        </button>
      </div>

      <!-- Status Filter -->
      <div class="flex items-center gap-1.5 bg-[#f5f5f7] p-1 rounded-full text-xs">
        <button
          @click="statusFilter = 'unresolved'"
          :class="[
            'px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer',
            statusFilter === 'unresolved' ? 'bg-white text-[#ff9500] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          待攻克 ({{ mistakes.filter(m => !m.isResolved).length }})
        </button>
        <button
          @click="statusFilter = 'resolved'"
          :class="[
            'px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer',
            statusFilter === 'resolved' ? 'bg-white text-[#34c759] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          已攻破 ({{ mistakes.filter(m => m.isResolved).length }})
        </button>
        <button
          @click="statusFilter = 'all'"
          :class="[
            'px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer',
            statusFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          全部
        </button>
      </div>
    </div>

    <!-- Mistake Items List -->
    <div v-if="filteredMistakes.length === 0" class="bg-white rounded-3xl p-12 text-center border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
      <CheckCircle2 class="w-12 h-12 text-[#34c759] mx-auto" />
      <h3 class="text-base font-semibold text-[#1d1d1f]">当前分类下暂无错题</h3>
      <p class="text-xs text-[#86868b] max-w-sm mx-auto">
        进行阅读或听力模考时，答错的题目将自动归纳至此进行艾宾浩斯多级复盘。
      </p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="m in filteredMistakes"
        :key="m.id"
        :class="[
          'bg-white rounded-3xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all space-y-4',
          m.isResolved ? 'border-black/[0.04] opacity-80' : 'border-black/[0.06]'
        ]"
      >
        <!-- Header info -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex items-center gap-2">
            <span :class="[
              'px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
              m.module === 'reading' ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#0071e3]/10 text-[#0071e3]'
            ]">
              <BookOpen v-if="m.module === 'reading'" class="w-3 h-3" />
              <Headphones v-else class="w-3 h-3" />
              {{ m.module === 'reading' ? '阅读' : '听力' }} #{{ m.questionNumber }}
            </span>
            <span class="text-xs text-[#86868b]">{{ m.testTitle }}</span>
          </div>

          <!-- Stage badge and 1-click status -->
          <div class="flex items-center gap-2">
            <span :class="[
              'px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
              STAGE_DESCRIPTIONS[getEbbinghausItem(m.id)?.stage ?? (m.isResolved ? 6 : 0)].bg,
              STAGE_DESCRIPTIONS[getEbbinghausItem(m.id)?.stage ?? (m.isResolved ? 6 : 0)].color
            ]">
              {{ STAGE_DESCRIPTIONS[getEbbinghausItem(m.id)?.stage ?? (m.isResolved ? 6 : 0)].label }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] text-[11px] font-medium">
              留存率 {{ getEbbinghausItem(m.id) ? calculateRetention(getEbbinghausItem(m.id)!) : (m.isResolved ? 98 : 40) }}%
            </span>

            <button
              @click="handleToggle(m.id)"
              :class="[
                'px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer active:scale-98',
                m.isResolved
                  ? 'bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/15'
                  : 'bg-[#ff9500]/10 text-[#ff9500] hover:bg-[#ff9500]/15'
              ]"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>{{ m.isResolved ? '已攻克 (重新激活)' : '标为已攻克' }}</span>
            </button>
          </div>
        </div>

        <!-- Question text -->
        <p class="text-sm font-semibold text-[#1d1d1f] leading-snug">
          {{ m.questionText }}
        </p>

        <!-- Answer comparison -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-2xl bg-[#ff3b30]/5 border border-[#ff3b30]/15">
            <span class="text-[#ff3b30] font-normal">您的失误答案: </span>
            <span class="font-semibold text-[#ff3b30]">{{ m.userAnswer || '(未填)' }}</span>
          </div>
          <div class="p-3 rounded-2xl bg-[#34c759]/5 border border-[#34c759]/15">
            <span class="text-[#34c759] font-normal">官方标准答案: </span>
            <span class="font-semibold text-[#34c759]">{{ Array.isArray(m.correctAnswer) ? m.correctAnswer.join(' / ') : m.correctAnswer }}</span>
          </div>
        </div>

        <!-- Root cause analysis -->
        <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02] text-xs space-y-1">
          <div class="flex items-center gap-1.5 text-[#1d1d1f] font-medium">
            <HelpCircle class="w-3.5 h-3.5 text-[#0071e3]" />
            <span>错题解析与失误根因:</span>
          </div>
          <p class="text-[#6e6e73] leading-relaxed pl-5">{{ m.explanation }}</p>
        </div>

        <!-- Spaced repetition review bar -->
        <div class="pt-2 border-t border-black/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div class="text-[11px] text-[#86868b] flex items-center gap-1.5 font-normal">
            <Clock class="w-3.5 h-3.5 text-[#86868b]" />
            <span>艾宾浩斯抗遗忘评估:</span>
          </div>

          <div class="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              @click="handleEbbinghausFeedback(m, 'forgot')"
              class="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/15 transition-all cursor-pointer"
              title="重置回 Stage 0"
            >
              ❌ 仍有疑惑
            </button>
            <button
              @click="handleEbbinghausFeedback(m, 'hard')"
              class="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#ff9500]/10 text-[#ff9500] hover:bg-[#ff9500]/15 transition-all cursor-pointer"
              title="降 1 级复习"
            >
              ⚠️ 需再巩固
            </button>
            <button
              @click="handleEbbinghausFeedback(m, 'good')"
              class="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/15 transition-all cursor-pointer"
              title="进 1 级周期"
            >
              ✅ 理解考点
            </button>
            <button
              @click="handleEbbinghausFeedback(m, 'easy')"
              class="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/15 transition-all cursor-pointer"
              title="锁定 Stage 6 永久掌握"
            >
              ⚡ 彻底吃透
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
