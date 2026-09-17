<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  X, 
  Target, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  Sliders, 
  Award
} from 'lucide-vue-next';
import { type PersonalizedPlanConfig, DEFAULT_PLAN_CONFIG } from '../../data/studyPlanData';

const props = defineProps<{
  isOpen: boolean;
  config: PersonalizedPlanConfig;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', newConfig: PersonalizedPlanConfig): void;
}>();

const currentBand = ref(props.config.currentBand);
const targetBand = ref(props.config.targetBand);
const totalDays = ref(props.config.totalDays);
const dailyHours = ref(props.config.dailyHours);
const targetListening = ref(props.config.targetListening);
const targetReading = ref(props.config.targetReading);
const targetWriting = ref(props.config.targetWriting);
const targetSpeaking = ref(props.config.targetSpeaking);
const focusWeaknesses = ref<string[]>([...(props.config.focusWeaknesses || [])]);

watch(() => props.config, (newConf) => {
  currentBand.value = newConf.currentBand;
  targetBand.value = newConf.targetBand;
  totalDays.value = newConf.totalDays;
  dailyHours.value = newConf.dailyHours;
  targetListening.value = newConf.targetListening;
  targetReading.value = newConf.targetReading;
  targetWriting.value = newConf.targetWriting;
  targetSpeaking.value = newConf.targetSpeaking;
  focusWeaknesses.value = [...(newConf.focusWeaknesses || [])];
}, { deep: true });

const weaknessOptions = [
  '词汇量不足2500',
  '长难句语法结构混乱',
  '听力连读与数字拼写慢',
  '写作思路受限/论据单薄',
  '口语Part 2卡顿不连贯',
  '机考控时与打字速度慢'
];

const toggleWeakness = (w: string) => {
  if (focusWeaknesses.value.includes(w)) {
    focusWeaknesses.value = focusWeaknesses.value.filter(item => item !== w);
  } else {
    focusWeaknesses.value.push(w);
  }
};

const handleQuickReset = () => {
  currentBand.value = props.config.currentBand || 0.0;
  targetBand.value = 7.0;
  totalDays.value = 178;
  dailyHours.value = 2.5;
  targetListening.value = 7.5;
  targetReading.value = 7.5;
  targetWriting.value = 6.5;
  targetSpeaking.value = 6.5;
  focusWeaknesses.value = [...DEFAULT_PLAN_CONFIG.focusWeaknesses];
};

const handleSubmit = () => {
  emit('save', {
    ...props.config,
    currentBand: currentBand.value,
    targetBand: targetBand.value,
    totalDays: totalDays.value,
    dailyHours: dailyHours.value,
    targetListening: targetListening.value,
    targetReading: targetReading.value,
    targetWriting: targetWriting.value,
    targetSpeaking: targetSpeaking.value,
    focusWeaknesses: focusWeaknesses.value
  });
  emit('close');
};

const calculatedOverall = computed(() => {
  return ((targetListening.value + targetReading.value + targetWriting.value + targetSpeaking.value) / 4);
});
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none"
    @click.self="emit('close')"
  >
    <div 
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-black/[0.08] overflow-hidden flex flex-col animate-scaleUp max-h-[90vh]"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-black/[0.04] text-[#1d1d1f] flex items-center justify-center">
            <Sliders class="w-4 h-4" />
          </div>
          <div>
            <h2 class="font-semibold text-sm text-[#1d1d1f]">个人备考适配设定 (Personal Adaptation)</h2>
            <p class="text-[11px] text-[#86868b] font-normal">根据当前基础与备考周期，量身定制科学提分路线图</p>
          </div>
        </div>
        <button 
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content Form -->
      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-5 text-[#1d1d1f] text-sm">
        <!-- Top Presets: Current & Target -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03]">
            <label class="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
              <Target class="w-3.5 h-3.5 text-[#86868b]" />
              当前平均基础分
            </label>
            <div class="flex items-center gap-2">
              <select 
                v-model.number="currentBand"
                class="w-full bg-white border border-black/[0.08] rounded-xl p-2.5 font-semibold text-[#1d1d1f] text-sm focus:outline-none shadow-2xs"
              >
                <option :value="0">Band 0.0 (待定级 / 无初始成绩)</option>
                <option :value="3.5">Band 3.5 (初学起步)</option>
                <option :value="4.0">Band 4.0 (有限水平)</option>
                <option :value="4.5">Band 4.5 (基础薄弱)</option>
                <option :value="5.0">Band 5.0 (基础中等)</option>
                <option :value="5.5">Band 5.5 (面临瓶颈)</option>
                <option :value="6.0">Band 6.0 (合格水平)</option>
              </select>
            </div>
            <p class="text-[11px] text-[#86868b] mt-1.5 font-normal">
              {{ currentBand === 0 ? '新学员无初始成绩，一切需经测验后定论。建议先进行 3 分钟定级测验。' : `当前基础设定为 Band ${currentBand.toFixed(1)}，系统将根据此起点规划提分路线。` }}
            </p>
          </div>

          <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03]">
            <label class="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
              <Award class="w-3.5 h-3.5 text-[#86868b]" />
              目标期望总分
            </label>
            <div class="flex items-center gap-2">
              <select 
                v-model.number="targetBand"
                class="w-full bg-white border border-black/[0.08] rounded-xl p-2.5 font-semibold text-[#1d1d1f] text-sm focus:outline-none shadow-2xs"
              >
                <option :value="6.5">Band 6.5 (常规直录)</option>
                <option :value="7.0">Band 7.0 (名校通用 · 推荐)</option>
                <option :value="7.5">Band 7.5 (顶尖名校/法学)</option>
                <option :value="8.0">Band 8.0 (极高要求)</option>
              </select>
            </div>
            <p class="text-[11px] text-[#86868b] mt-1.5 font-normal">
              达成 7.0 分策略：听读双 7.5 分拉高均分，写作口语稳过 6.5 分。
            </p>
          </div>
        </div>

        <!-- Timeline & Daily Hours -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-[#86868b]" />
              备考总周期（天数）
            </label>
            <div class="relative">
              <input 
                v-model.number="totalDays"
                type="number" 
                min="30" 
                max="365" 
                class="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm font-semibold text-[#1d1d1f] focus:outline-none shadow-2xs"
              />
              <span class="absolute right-3 top-2.5 text-xs text-[#86868b] font-normal">天</span>
            </div>
            <span class="text-[11px] text-[#86868b] block mt-1 font-normal">
              当前设定：{{ totalDays }} 天（科学排期，阶梯递进跃升目标分数）
            </span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-[#86868b]" />
              每日规划投入时长
            </label>
            <select 
              v-model.number="dailyHours"
              class="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm font-semibold text-[#1d1d1f] focus:outline-none shadow-2xs"
            >
              <option :value="1.5">1.5 小时 / 天 (在职轻度)</option>
              <option :value="2.0">2.0 小时 / 天 (兼顾学业)</option>
              <option :value="2.5">2.5 小时 / 天 (推荐黄金配比)</option>
              <option :value="3.0">3.0 小时 / 天 (高强度突破)</option>
              <option :value="4.0">4.0 小时 / 天 (全脱产备战)</option>
            </select>
            <span class="text-[11px] text-[#86868b] block mt-1 font-normal">
              黄金配比：每天 2.5 小时，兼顾词汇、输入（听读）与输出（写说）
            </span>
          </div>
        </div>

        <!-- 4 Skills Target Allocation -->
        <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03]">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-xs text-[#1d1d1f] flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-[#86868b]" />
              四科提分配置方案
            </span>
            <span class="text-xs font-semibold text-[#1d1d1f] tabular-nums">
              核算总分：Band {{ calculatedOverall.toFixed(2) }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span class="text-[11px] text-[#86868b] block mb-1">听力 Listening</span>
              <input 
                v-model.number="targetListening"
                type="number" 
                step="0.5" 
                min="4.0" 
                max="9.0" 
                class="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
              />
            </div>
            <div>
              <span class="text-[11px] text-[#86868b] block mb-1">阅读 Reading</span>
              <input 
                v-model.number="targetReading"
                type="number" 
                step="0.5" 
                min="4.0" 
                max="9.0" 
                class="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
              />
            </div>
            <div>
              <span class="text-[11px] text-[#86868b] block mb-1">写作 Writing</span>
              <input 
                v-model.number="targetWriting"
                type="number" 
                step="0.5" 
                min="4.0" 
                max="9.0" 
                class="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
              />
            </div>
            <div>
              <span class="text-[11px] text-[#86868b] block mb-1">口语 Speaking</span>
              <input 
                v-model.number="targetSpeaking"
                type="number" 
                step="0.5" 
                min="4.0" 
                max="9.0" 
                class="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
              />
            </div>
          </div>
          <span class="text-[10px] text-[#86868b] block mt-2 text-center">
            雅思总分计算规则：四科平均后按 0.25 进位制向上进阶（如 6.75 ➔ 7.0 分）
          </span>
        </div>

        <!-- Weakness Checklist -->
        <div>
          <label class="block text-xs font-semibold text-[#1d1d1f] mb-2">
            选择重点突破弱项（针对性生成学习模块重点）
          </label>
          <div class="grid grid-cols-2 gap-2">
            <div 
              v-for="w in weaknessOptions"
              :key="w"
              @click="toggleWeakness(w)"
              :class="[
                'p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all',
                focusWeaknesses.includes(w)
                  ? 'bg-[#1d1d1f] border-transparent text-white font-medium shadow-xs' 
                  : 'bg-white border-black/[0.06] text-[#1d1d1f] hover:bg-[#f5f5f7]'
              ]"
            >
              <span>{{ w }}</span>
              <Check v-if="focusWeaknesses.includes(w)" class="w-3.5 h-3.5 text-white shrink-0" />
            </div>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="pt-3 flex items-center justify-between border-t border-black/[0.04]">
          <button
            type="button"
            @click="handleQuickReset"
            class="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            恢复推荐基准参数 (178天)
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 rounded-full border border-black/[0.08] text-[#1d1d1f] hover:bg-[#f5f5f7] text-xs font-medium transition-all cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              保存并应用方案
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
