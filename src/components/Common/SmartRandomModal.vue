<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Dice5, 
  X, 
  Sparkles, 
  Clock, 
  Target, 
  BrainCircuit, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-vue-next';
import type { BankCategory, ModuleType, QuestionType, RandomDrillConfig, RandomDrillType } from '../../types/ielts';
import { BANK_COLLECTIONS, getBankInfo } from '../../services/questionBankService';
import { 
  getRandomFullTest, 
  getRandomSinglePassage, 
  getRandomSingleSection, 
  getTestFocusingOnQuestionType, 
  getAdaptiveMistakeWeightedDrill,
  getQuestionTypeLabel
} from '../../services/randomBankService';
import { getMistakes } from '../../services/storage';

const props = defineProps<{
  isOpen: boolean;
  initialModule?: ModuleType;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'startDrill', config: RandomDrillConfig, targetTestId: string): void;
}>();

const selectedModule = ref<ModuleType>(props.initialModule || 'reading');
const selectedBank = ref<BankCategory>('all');
const drillMode = ref<RandomDrillType>('full_test');
const selectedQuestionType = ref<QuestionType>('true_false_not_given');

watch(() => props.initialModule, (newMod) => {
  if (newMod) selectedModule.value = newMod;
});

// Mistake stats for the selected module
const moduleMistakes = computed(() => {
  return getMistakes().filter(m => m.module === selectedModule.value && !m.isResolved);
});

// Adaptive recommendation analysis
const adaptiveInsight = computed(() => {
  if (selectedModule.value !== 'reading' && selectedModule.value !== 'listening') {
    return null;
  }
  return getAdaptiveMistakeWeightedDrill(selectedModule.value, selectedBank.value);
});

// Available drill modes for selected module
const availableModes = computed(() => {
  const base = [
    {
      id: 'full_test' as RandomDrillType,
      title: '全真整卷随机模考',
      tag: '60分钟标准战',
      desc: '在所选题库中随机抽取完整官方模考卷，全套仿真作答与换算评分。',
      icon: Dice5
    }
  ];

  if (selectedModule.value === 'reading' || selectedModule.value === 'listening') {
    base.push({
      id: 'single_passage' as RandomDrillType,
      title: selectedModule.value === 'reading' ? '单篇快练 (Passage)' : '单节快练 (Section)',
      tag: '15-20分钟碎片练',
      desc: selectedModule.value === 'reading' 
        ? '随机抽取 Passage 1/2/3 独立测验，适合短时间高效攻坚。'
        : '随机抽取 Section 1-4 独立精听，重点突击听力场景。',
      icon: Clock
    });

    base.push({
      id: 'question_type' as RandomDrillType,
      title: '题型定向专项抽题',
      tag: '薄弱题型突围',
      desc: '锁定特定易错题型（如 TFNG、小标题、填空等），精准抽取高密度包含该题型的试卷。',
      icon: Target
    });

    base.push({
      id: 'mistake_weighted' as RandomDrillType,
      title: '艾宾浩斯错题自适应推荐',
      tag: '动态智能算法',
      desc: `结合您错题本积累的 ${moduleMistakes.value.length} 道错题，根据遗忘曲线自动权衡最需巩固的试卷。`,
      icon: BrainCircuit
    });
  }

  return base;
});

// Reset mode if not compatible
watch(selectedModule, (newMod) => {
  if ((newMod === 'writing' || newMod === 'speaking') && drillMode.value !== 'full_test') {
    drillMode.value = 'full_test';
  }
});

const handleLaunch = () => {
  let targetTestId = '';

  if (drillMode.value === 'full_test') {
    const res = getRandomFullTest(selectedModule.value, selectedBank.value);
    if (res) targetTestId = res.testId;
  } else if (drillMode.value === 'single_passage') {
    if (selectedModule.value === 'reading') {
      const res = getRandomSinglePassage(selectedBank.value);
      if (res) targetTestId = res.testId;
    } else if (selectedModule.value === 'listening') {
      const res = getRandomSingleSection(selectedBank.value);
      if (res) targetTestId = res.testId;
    }
  } else if (drillMode.value === 'question_type') {
    if (selectedModule.value === 'reading' || selectedModule.value === 'listening') {
      const res = getTestFocusingOnQuestionType(selectedModule.value, selectedQuestionType.value, selectedBank.value);
      if (res) targetTestId = res.testId;
    }
  } else if (drillMode.value === 'mistake_weighted') {
    if (selectedModule.value === 'reading' || selectedModule.value === 'listening') {
      const res = getAdaptiveMistakeWeightedDrill(selectedModule.value, selectedBank.value);
      if (res) targetTestId = res.testId;
    }
  }

  // Fallback to random full test if empty
  if (!targetTestId) {
    const fallback = getRandomFullTest(selectedModule.value, selectedBank.value);
    if (fallback) targetTestId = fallback.testId;
  }

  const config: RandomDrillConfig = {
    module: selectedModule.value,
    bankCategory: selectedBank.value,
    drillType: drillMode.value,
    questionType: drillMode.value === 'question_type' ? selectedQuestionType.value : undefined
  };

  if (targetTestId) {
    emit('startDrill', config, targetTestId);
  }
};
</script>

<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
  >
    <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.14)] border border-black/[0.06] overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between bg-white shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-2xl bg-black/[0.04] border border-black/[0.06] flex items-center justify-center">
            <Dice5 class="w-5 h-5 text-[#1d1d1f]" />
          </div>
          <div>
            <h2 class="text-base font-semibold text-[#1d1d1f] tracking-tight">智能随机抽题 & 专项训练</h2>
            <p class="text-xs text-[#86868b]">多题库自适应调度 · 破解背题套路</p>
          </div>
        </div>

        <button 
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Body Scrollable -->
      <div class="p-6 overflow-y-auto space-y-6">
        <!-- 1. Select Module -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">训练科目</label>
          <div class="grid grid-cols-4 gap-2">
            <button
              type="button"
              @click="selectedModule = 'listening'"
              :class="[
                'p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer',
                selectedModule === 'listening'
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed]'
              ]"
            >
              <Headphones class="w-4 h-4" />
              <span>听力</span>
            </button>
            <button
              type="button"
              @click="selectedModule = 'reading'"
              :class="[
                'p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer',
                selectedModule === 'reading'
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed]'
              ]"
            >
              <BookOpen class="w-4 h-4" />
              <span>阅读</span>
            </button>
            <button
              type="button"
              @click="selectedModule = 'writing'"
              :class="[
                'p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer',
                selectedModule === 'writing'
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed]'
              ]"
            >
              <PenTool class="w-4 h-4" />
              <span>写作</span>
            </button>
            <button
              type="button"
              @click="selectedModule = 'speaking'"
              :class="[
                'p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer',
                selectedModule === 'speaking'
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed]'
              ]"
            >
              <Mic class="w-4 h-4" />
              <span>口语</span>
            </button>
          </div>
        </div>

        <!-- 2. Select Bank Category -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">抽题来源范围</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="b in BANK_COLLECTIONS"
              :key="b.id"
              type="button"
              @click="selectedBank = b.id"
              :class="[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border',
                selectedBank === b.id
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed]'
              ]"
            >
              {{ b.shortName }}
            </button>
          </div>
        </div>

        <!-- 3. Drill Mode Selection -->
        <div class="space-y-2.5">
          <label class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">抽题训练模式</label>
          <div class="space-y-2">
            <div
              v-for="mode in availableModes"
              :key="mode.id"
              @click="drillMode = mode.id"
              :class="[
                'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5',
                drillMode === mode.id
                  ? 'bg-[#fbfbfd] border-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
                  : 'bg-white border-black/[0.06] hover:border-black/[0.14] hover:bg-[#fafafa]'
              ]"
            >
              <div 
                :class="[
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  drillMode === mode.id ? 'bg-[#1d1d1f] text-white' : 'bg-black/[0.04] text-[#86868b]'
                ]"
              >
                <component :is="mode.icon" class="w-4 h-4" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-[#1d1d1f]">{{ mode.title }}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] text-[#86868b] font-medium">
                    {{ mode.tag }}
                  </span>
                </div>
                <p class="text-[11px] text-[#86868b] mt-1 leading-relaxed">{{ mode.desc }}</p>

                <!-- Sub-options for Question Type Mode -->
                <div 
                  v-if="drillMode === 'question_type' && mode.id === 'question_type'"
                  class="mt-3 pt-2.5 border-t border-black/[0.06]"
                  @click.stop
                >
                  <label class="text-[11px] font-semibold text-[#1d1d1f] mb-1.5 block">选择目标突破题型：</label>
                  <select
                    v-model="selectedQuestionType"
                    class="w-full bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium px-3 py-2 rounded-xl border border-black/[0.08] focus:outline-none focus:border-[#0071e3] transition-all cursor-pointer"
                  >
                    <option value="true_false_not_given">TFNG / 判断题 (True/False/Not Given)</option>
                    <option value="matching_headings">段落小标题匹配 (Matching Headings)</option>
                    <option value="summary_completion">摘要填空 (Summary Completion)</option>
                    <option value="multiple_choice">多项/单项选择题 (Multiple Choice)</option>
                    <option value="sentence_completion">短语句子填空 (Sentence Completion)</option>
                    <option value="matching_information">段落信息配对 (Matching Information)</option>
                  </select>
                </div>

                <!-- Sub-insight for Mistake Weighted Mode -->
                <div 
                  v-if="drillMode === 'mistake_weighted' && mode.id === 'mistake_weighted' && adaptiveInsight"
                  class="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] flex items-start gap-2"
                >
                  <Sparkles class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span class="leading-relaxed">{{ adaptiveInsight.reason }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-black/[0.06] bg-[#fafafa] flex items-center justify-between shrink-0">
        <div class="text-[11px] text-[#86868b]">
          已选：{{ getBankInfo(selectedBank).shortName }} · {{ selectedModule === 'reading' ? '阅读' : selectedModule === 'listening' ? '听力' : selectedModule === 'writing' ? '写作' : '口语' }}
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs font-medium text-[#1d1d1f] transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleLaunch"
            class="px-5 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-xs font-medium text-white shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            <span>开始抽取</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
