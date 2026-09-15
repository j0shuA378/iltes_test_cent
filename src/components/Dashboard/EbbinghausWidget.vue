<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  Brain, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Layers,
  Sparkles
} from 'lucide-vue-next';
import { 
  getEbbinghausStats, 
  getEbbinghausItems, 
  STAGE_DESCRIPTIONS,
  seedInitialEbbinghausItems
} from '../../services/ebbinghausService';
import { CORE_VOCABULARY } from '../../data/vocabularyData';
import type { EbbinghausStats, MemoryStage } from '../../types/auth';

const emit = defineEmits<{
  (e: 'navigate', tab: string): void;
}>();

const stats = ref<EbbinghausStats>({
  totalItems: 0,
  dueTodayCount: 0,
  masteredCount: 0,
  learningCount: 0,
  averageRetention: 92
});

const showStageBreakdown = ref(false);
const stageCounts = ref<Record<MemoryStage, number>>({
  0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
});

const loadData = () => {
  seedInitialEbbinghausItems(
    CORE_VOCABULARY.map(v => ({ id: v.id, word: v.word, chinese: v.chinese }))
  );

  stats.value = getEbbinghausStats();

  const items = getEbbinghausItems();
  const counts: Record<MemoryStage, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  items.forEach(item => {
    counts[item.stage] = (counts[item.stage] || 0) + 1;
  });
  stageCounts.value = counts;
};

const handleUpdate = () => {
  loadData();
};

onMounted(() => {
  loadData();
  window.addEventListener('ielts_ebbinghaus_updated', handleUpdate);
  window.addEventListener('ielts_auth_changed', handleUpdate);
});

onUnmounted(() => {
  window.removeEventListener('ielts_ebbinghaus_updated', handleUpdate);
  window.removeEventListener('ielts_auth_changed', handleUpdate);
});

const stagesList: MemoryStage[] = [0, 1, 2, 3, 4, 5, 6];
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all">
    <div class="relative z-10 space-y-6">
      <!-- Header section (Apple style) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#86868b]">
            <Brain class="w-4 h-4 text-[#0071e3]" />
            <span class="uppercase tracking-wider">Ebbinghaus Memory Engine</span>
            <span class="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-medium">
              智能抗遗忘算法
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            动态遗忘监测与多级复盘
          </h2>
          <p class="text-xs sm:text-sm text-[#86868b] max-w-2xl leading-relaxed">
            基于人类大脑衰减曲线公式 R = e^(-t/S)，系统在词汇与错题遗忘临界点精准提醒复核，以极简复习耗时建立考场本能永久突触。
          </p>
        </div>

        <div class="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            @click="showStageBreakdown = !showStageBreakdown"
            class="px-4 py-2 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium border border-black/[0.04] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers class="w-3.5 h-3.5 text-[#86868b]" />
            <span>{{ showStageBreakdown ? '收起矩阵' : '7级突触分布' }}</span>
          </button>

          <button
            @click="emit('navigate', 'vocabulary')"
            class="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <Flame class="w-3.5 h-3.5 text-white" />
            <span>开启今日复盘</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- 4 Core Metrics Grid (Apple Inset Cards) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02]">
          <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
            <span>今日临界待复习</span>
            <Clock class="w-3.5 h-3.5 text-[#86868b]" />
          </div>
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums flex items-baseline gap-1">
            <span>{{ stats.dueTodayCount }}</span>
            <span class="text-xs font-normal text-[#86868b]">项到期</span>
          </div>
          <div class="text-[11px] text-[#86868b] mt-1 font-normal">
            {{ stats.dueTodayCount > 0 ? '建议今日优先消灭' : '今日复习目标已达成 ✓' }}
          </div>
        </div>

        <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02]">
          <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
            <span>综合留存率</span>
            <TrendingUp class="w-3.5 h-3.5 text-[#86868b]" />
          </div>
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums flex items-baseline gap-1">
            <span>{{ stats.averageRetention }}%</span>
            <span class="text-xs font-normal text-[#86868b]">稳定度</span>
          </div>
          <div class="text-[11px] text-[#86868b] mt-1 font-normal">
            远高于无复习基线 (21%)
          </div>
        </div>

        <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02]">
          <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
            <span>Stage 6 永久记忆</span>
            <ShieldCheck class="w-3.5 h-3.5 text-[#86868b]" />
          </div>
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums flex items-baseline gap-1">
            <span>{{ stats.masteredCount }}</span>
            <span class="text-xs font-normal text-[#86868b]">项牢固</span>
          </div>
          <div class="text-[11px] text-[#86868b] mt-1 font-normal">
            已进入考场秒级提取区
          </div>
        </div>

        <div class="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02]">
          <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
            <span>记忆网络收录</span>
            <Sparkles class="w-3.5 h-3.5 text-[#86868b]" />
          </div>
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums flex items-baseline gap-1">
            <span>{{ stats.totalItems }}</span>
            <span class="text-xs font-normal text-[#86868b]">总跟踪</span>
          </div>
          <div class="text-[11px] text-[#86868b] mt-1 font-normal">
            涵盖核心高频词与重难错题
          </div>
        </div>
      </div>

      <!-- Ebbinghaus Curve SVG Visualizer (Clean Apple Graph) -->
      <div class="bg-[#fbfbfd] border border-black/[0.04] rounded-2xl p-4 sm:p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-3 gap-2">
          <div class="flex items-center gap-2 font-medium text-[#1d1d1f]">
            <span>记忆衰减与对抗轨迹模拟</span>
            <span class="text-[#86868b] font-normal">· 7个黄金突触强化节点</span>
          </div>
          <div class="flex items-center gap-4 text-[11px]">
            <span class="flex items-center gap-1.5 text-[#34c759] font-medium">
              <span class="w-2 h-2 rounded-full bg-[#34c759] inline-block" />
              艾宾浩斯多级复习 (95%+)
            </span>
            <span class="flex items-center gap-1.5 text-[#ff3b30] font-normal">
              <span class="w-2 h-0.5 bg-[#ff3b30] inline-block border-b border-dashed" />
              自然衰减遗忘 (跌至21%)
            </span>
          </div>
        </div>

        <!-- SVG Curve on Pristine Light Canvas -->
        <div class="relative w-full h-28 sm:h-32">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 700 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="appleCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34c759" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#34c759" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <line x1="0" y1="20" x2="700" y2="20" stroke="#e5e5ea" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="0" y1="60" x2="700" y2="60" stroke="#e5e5ea" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1="0" y1="100" x2="700" y2="100" stroke="#e5e5ea" strokeDasharray="3 3" strokeWidth="0.8" />

            <!-- Natural forgetting curve -->
            <path 
              d="M 10 20 Q 80 90 200 102 T 700 108" 
              fill="none" 
              stroke="#ff3b30" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
              opacity="0.75"
            />

            <!-- Ebbinghaus Spaced Repetition Curve -->
            <path 
              d="M 10 20 
                 Q 50 50 80 55 
                 L 80 20 
                 Q 140 45 180 50 
                 L 180 20 
                 Q 250 40 300 42 
                 L 300 20 
                 Q 390 35 440 36 
                 L 440 20 
                 Q 530 30 580 30 
                 L 580 20 
                 L 700 20" 
              fill="none" 
              stroke="#34c759" 
              strokeWidth="2.5" 
            />

            <!-- Filled area under Ebbinghaus Curve -->
            <path 
              d="M 10 20 
                 Q 50 50 80 55 
                 L 80 20 
                 Q 140 45 180 50 
                 L 180 20 
                 Q 250 40 300 42 
                 L 300 20 
                 Q 390 35 440 36 
                 L 440 20 
                 Q 530 30 580 30 
                 L 580 20 
                 L 700 20 
                 L 700 115 
                 L 10 115 Z" 
              fill="url(#appleCurveGradient)" 
            />

            <!-- Nodes at each spaced repetition point -->
            <g v-for="(pt, i) in [
              { x: 10, label: '初学' },
              { x: 80, label: '20分' },
              { x: 180, label: '1天' },
              { x: 300, label: '2天' },
              { x: 440, label: '4天' },
              { x: 580, label: '7天' },
              { x: 700, label: '永久' },
            ]" :key="i">
              <circle :cx="pt.x" cy="20" r="4" fill="#34c759" stroke="#ffffff" strokeWidth="2" />
              <text :x="pt.x" y="115" textAnchor="middle" fill="#86868b" fontSize="9" fontWeight="500">
                {{ pt.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Stage Matrix Breakdown (Collapsible) -->
      <div v-if="showStageBreakdown" class="bg-[#f5f5f7] border border-black/[0.04] rounded-2xl p-4 space-y-3 animate-fadeIn">
        <div class="flex items-center justify-between text-xs font-semibold text-[#1d1d1f]">
          <span class="flex items-center gap-1.5">
            <Layers class="w-4 h-4 text-[#0071e3]" />
            当前用户 7 级突触分布
          </span>
          <span class="text-[11px] text-[#86868b] font-normal">共计 {{ stats.totalItems }} 条记忆锚点</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div 
            v-for="st in stagesList" 
            :key="st" 
            class="p-3 rounded-xl bg-white border border-black/[0.04] flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div class="flex items-center justify-between mb-1">
                <span :class="['text-xs font-semibold', STAGE_DESCRIPTIONS[st].color]">
                  {{ STAGE_DESCRIPTIONS[st].label }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f5f5f7] text-[#1d1d1f]">
                  {{ stageCounts[st] || 0 }} 个
                </span>
              </div>
              <p class="text-[10px] text-[#86868b] leading-snug">{{ STAGE_DESCRIPTIONS[st].desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
