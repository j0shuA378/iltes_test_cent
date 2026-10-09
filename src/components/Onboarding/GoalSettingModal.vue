<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  X, 
  Target, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight, 
  Building2, 
  Laptop, 
  FileText, 
  AlertTriangle,
  Award,
  TrendingUp,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  CalendarCheck2,
  PieChart
} from 'lucide-vue-next';
import { 
  OFFICIAL_TEST_CENTERS, 
  CITIES, 
  generateRealExamSessions, 
  filterExamSessions, 
  type TestCenter, 
  type ExamSession 
} from '../../data/ieltsExamCenters';
import { 
  analyzeStudyCommitment, 
  type AiPlanAnalysisResult 
} from '../../services/aiStudyPlanService';
import { updateUserGoalAndExamSchedule } from '../../services/authService';
import { getStudyPlanConfig } from '../../services/storage';
import type { UserAccount } from '../../types/auth';

const props = defineProps<{
  isOpen: boolean;
  activeUser?: UserAccount;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', user: UserAccount): void;
}>();

// Active Step in Wizard: 1 = Goal, 2 = Center & Exam Date, 3 = AI Analysis
const step = ref<1 | 2 | 3>(1);

// --- Form State ---
const currentBand = ref<number>(0.0);
const targetBand = ref<number>(7.0);
const targetListening = ref<number>(7.5);
const targetReading = ref<number>(7.5);
const targetWriting = ref<number>(6.5);
const targetSpeaking = ref<number>(6.5);

// Center & Date
const selectedCity = ref<string>('全部城市');
const selectedTestType = ref<'all' | 'computer' | 'paper'>('computer');
const selectedCenter = ref<TestCenter>(OFFICIAL_TEST_CENTERS[0]);
const selectedSession = ref<ExamSession | null>(null);
const customExamDate = ref<string>('');
const isCustomDate = ref(false);

// AI Preferred daily hours slider
const preferredDailyHours = ref<number>(0);

// Initialize form from current user & study plan
const initFormData = () => {
  step.value = 1;
  const plan = getStudyPlanConfig(props.activeUser?.id);
  currentBand.value = props.activeUser?.currentBand ?? 0.0;
  targetBand.value = props.activeUser?.targetBand ?? 7.0;

  if (plan) {
    targetListening.value = plan.targetListening ?? 7.5;
    targetReading.value = plan.targetReading ?? 7.5;
    targetWriting.value = plan.targetWriting ?? 6.5;
    targetSpeaking.value = plan.targetSpeaking ?? 6.5;
  }

  // Pre-select city if user has a target center
  if (props.activeUser?.targetCenter) {
    const matched = OFFICIAL_TEST_CENTERS.find(c => c.name.includes(props.activeUser!.targetCenter!) || props.activeUser!.targetCenter!.includes(c.shortName));
    if (matched) {
      selectedCenter.value = matched;
      selectedCity.value = matched.city;
    }
  }

  // Pre-select default sessions
  const sessions = availableSessions.value;
  if (sessions.length > 0) {
    // Pick one around 60 - 90 days if available, else first
    const targetSessionFound = sessions.find(s => s.daysUntilExam >= 45 && s.daysUntilExam <= 90) || sessions[0];
    selectedSession.value = targetSessionFound;
    customExamDate.value = targetSessionFound.date;
  } else {
    const future = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];
    customExamDate.value = props.activeUser?.examDate || future;
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    initFormData();
  }
});

// Generated Real Exam Sessions Cache
const allExamSessions = computed(() => generateRealExamSessions(undefined, 365));

const filteredCenters = computed(() => {
  if (selectedCity.value === '全部城市') return OFFICIAL_TEST_CENTERS;
  return OFFICIAL_TEST_CENTERS.filter(c => c.city === selectedCity.value);
});

const availableSessions = computed(() => {
  return filterExamSessions(allExamSessions.value, {
    city: selectedCity.value,
    centerId: selectedCenter.value?.id,
    type: selectedTestType.value,
    maxDays: 300
  }).slice(0, 30); // show top 30 real sessions
});

// Calculate Days to Exam
const effectiveExamDate = computed(() => {
  if (isCustomDate.value && customExamDate.value) {
    return customExamDate.value;
  }
  return selectedSession.value?.date || customExamDate.value;
});

const daysRemaining = computed(() => {
  if (!effectiveExamDate.value) return 60;
  const today = new Date();
  const exam = new Date(effectiveExamDate.value);
  return Math.max(1, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
});

// --- AI Diagnostic Analysis ---
const aiAnalysis = computed<AiPlanAnalysisResult>(() => {
  return analyzeStudyCommitment({
    currentBand: currentBand.value,
    targetBand: targetBand.value,
    targetListening: targetListening.value,
    targetReading: targetReading.value,
    targetWriting: targetWriting.value,
    targetSpeaking: targetSpeaking.value,
    examDate: effectiveExamDate.value,
    daysRemaining: daysRemaining.value,
    targetCenter: selectedCenter.value.name,
    testType: selectedSession.value?.type || 'computer',
    preferredDailyHours: preferredDailyHours.value > 0 ? preferredDailyHours.value : undefined
  });
});

// Sync preferred hours when entering step 3
watch(step, (newStep) => {
  if (newStep === 3 && preferredDailyHours.value === 0) {
    preferredDailyHours.value = aiAnalysis.value.recommendedDailyHours;
  }
});

const handleSelectSession = (s: ExamSession) => {
  selectedSession.value = s;
  customExamDate.value = s.date;
  isCustomDate.value = false;
};

const handleSelectCenter = (center: TestCenter) => {
  selectedCenter.value = center;
  const matching = filterExamSessions(allExamSessions.value, {
    centerId: center.id,
    type: selectedTestType.value
  });
  if (matching.length > 0) {
    selectedSession.value = matching[0];
    customExamDate.value = matching[0].date;
  }
};

const handleSavePlan = () => {
  if (!props.activeUser) return;

  const centerDisplay = selectedCenter.value.shortName;
  const sessionSlot = selectedSession.value?.timeSlotLabel || '上午场 09:00';
  const finalDailyHours = preferredDailyHours.value > 0 
    ? preferredDailyHours.value 
    : aiAnalysis.value.recommendedDailyHours;

  const updatedUser = updateUserGoalAndExamSchedule(props.activeUser.id, {
    targetBand: targetBand.value,
    currentBand: currentBand.value,
    examDate: effectiveExamDate.value,
    targetCenter: centerDisplay,
    targetSession: sessionSlot,
    testType: selectedSession.value?.type || 'computer',
    dailyHours: finalDailyHours,
    dailyGoalMinutes: Math.round(finalDailyHours * 60),
    targetListening: targetListening.value,
    targetReading: targetReading.value,
    targetWriting: targetWriting.value,
    targetSpeaking: targetSpeaking.value,
    aiAnalysisSummary: `${centerDisplay} · 备考${daysRemaining.value}天 · AI建议日均${finalDailyHours}h`
  });

  emit('saved', updatedUser);
  emit('close');
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-black/[0.08] flex flex-col max-h-[92vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between bg-[#fbfbfd]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center shadow-xs">
            <Sparkles class="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-base sm:text-lg text-[#1d1d1f] tracking-tight">
                雅思个性化目标与考期 AI 适配中心
              </h2>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">
                Cambridge Assessment AI
              </span>
            </div>
            <p class="text-xs text-[#86868b] mt-0.5">
              对接全国真实官方考点排期 · 智能演算提分总学时与每日精准投入时间
            </p>
          </div>
        </div>

        <button 
          @click="emit('close')" 
          class="p-2 rounded-full hover:bg-black/5 text-[#86868b] transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Step Indicator Capsule Bar -->
      <div class="px-6 py-3 bg-[#f5f5f7] border-b border-black/[0.04] flex items-center justify-between text-xs">
        <div class="flex items-center gap-2 sm:gap-4">
          <button 
            @click="step = 1"
            :class="[
              'px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
              step === 1 ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" :class="step === 1 ? 'bg-[#1d1d1f] text-white font-bold' : 'bg-black/10'">1</span>
            <span>设定目标与当前基准</span>
          </button>

          <span class="text-black/20">/</span>

          <button 
            @click="step = 2"
            :class="[
              'px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
              step === 2 ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" :class="step === 2 ? 'bg-[#1d1d1f] text-white font-bold' : 'bg-black/10'">2</span>
            <span>选择官方考点与真实考期</span>
          </button>

          <span class="text-black/20">/</span>

          <button 
            @click="step = 3"
            :class="[
              'px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
              step === 3 ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" :class="step === 3 ? 'bg-[#1d1d1f] text-white font-bold' : 'bg-black/10'">3</span>
            <span>AI 测算每日投入时间</span>
          </button>
        </div>

        <div class="text-[11px] text-[#86868b] hidden sm:block">
          考期距今: <strong class="text-[#1d1d1f] font-semibold">{{ daysRemaining }} 天</strong>
        </div>
      </div>

      <!-- Main Step Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">

        <!-- STEP 1: TARGET BAND & BASELINE -->
        <div v-if="step === 1" class="space-y-6 animate-fadeIn">
          <!-- Baseline Setting -->
          <div class="bg-[#fbfbfd] p-5 rounded-2xl border border-black/[0.04] space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                  <Target class="w-4 h-4 text-[#0071e3]" />
                  <span>当前学术基础水平 (Baseline)</span>
                </label>
                <p class="text-[11px] text-[#86868b] mt-0.5">
                  如未参加过雅思，可选“初始待测定”，进入平台后可随时通过 3 分钟测验校准。
                </p>
              </div>
              <span class="text-xs font-bold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-1 rounded-full">
                {{ currentBand === 0 ? '待测定 (~4.5分)' : `Band ${currentBand.toFixed(1)}` }}
              </span>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                v-for="b in [0, 4.5, 5.0, 5.5, 6.0, 6.5]"
                :key="b"
                @click="currentBand = b"
                :class="[
                  'py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer',
                  currentBand === b
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                    : 'bg-white text-[#1d1d1f] border-black/[0.08] hover:border-black/20'
                ]"
              >
                {{ b === 0 ? '初始未测' : `Band ${b.toFixed(1)}` }}
              </button>
            </div>
          </div>

          <!-- Target Band Selection -->
          <div class="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                  <Award class="w-4 h-4 text-amber-500" />
                  <span>目标雅思总成绩 (Target Overall)</span>
                </label>
                <p class="text-[11px] text-[#86868b] mt-0.5">
                  英国G5/澳洲八大常用门槛：Band 6.5 ~ 7.5
                </p>
              </div>
              <span class="text-base font-extrabold text-[#1d1d1f]">
                Band {{ targetBand.toFixed(1) }}
              </span>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                v-for="b in [6.0, 6.5, 7.0, 7.5, 8.0, 8.5]"
                :key="b"
                @click="targetBand = b"
                :class="[
                  'py-3 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer',
                  targetBand === b
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md scale-102'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/[0.04] hover:bg-[#e8e8ed]'
                ]"
              >
                Band {{ b.toFixed(1) }}
              </button>
            </div>
          </div>

          <!-- Subject Breakdown (Listening, Reading, Writing, Speaking) -->
          <div class="bg-[#fbfbfd] p-5 rounded-2xl border border-black/[0.04] space-y-3">
            <h3 class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Sliders class="w-3.5 h-3.5 text-[#86868b]" />
              <span>四科单项期望细分（系统自动优化配比）</span>
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-white p-3 rounded-xl border border-black/[0.04]">
                <div class="flex justify-between items-center mb-1.5 text-xs">
                  <span class="text-[#86868b]">听力 Listening</span>
                  <span class="font-bold text-[#1d1d1f]">{{ targetListening.toFixed(1) }}</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="9.0" 
                  step="0.5" 
                  v-model.number="targetListening"
                  class="w-full accent-[#0071e3]"
                />
              </div>

              <div class="bg-white p-3 rounded-xl border border-black/[0.04]">
                <div class="flex justify-between items-center mb-1.5 text-xs">
                  <span class="text-[#86868b]">阅读 Reading</span>
                  <span class="font-bold text-[#1d1d1f]">{{ targetReading.toFixed(1) }}</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="9.0" 
                  step="0.5" 
                  v-model.number="targetReading"
                  class="w-full accent-[#0071e3]"
                />
              </div>

              <div class="bg-white p-3 rounded-xl border border-black/[0.04]">
                <div class="flex justify-between items-center mb-1.5 text-xs">
                  <span class="text-[#86868b]">写作 Writing</span>
                  <span class="font-bold text-[#1d1d1f]">{{ targetWriting.toFixed(1) }}</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="8.5" 
                  step="0.5" 
                  v-model.number="targetWriting"
                  class="w-full accent-[#0071e3]"
                />
              </div>

              <div class="bg-white p-3 rounded-xl border border-black/[0.04]">
                <div class="flex justify-between items-center mb-1.5 text-xs">
                  <span class="text-[#86868b]">口语 Speaking</span>
                  <span class="font-bold text-[#1d1d1f]">{{ targetSpeaking.toFixed(1) }}</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="8.5" 
                  step="0.5" 
                  v-model.number="targetSpeaking"
                  class="w-full accent-[#0071e3]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: TEST CENTER & REAL EXAM SESSIONS -->
        <div v-else-if="step === 2" class="space-y-6 animate-fadeIn">
          <!-- City & Test Mode Filter -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <MapPin class="w-4 h-4 text-rose-500" />
                <span>选择目标考点城市与考试类型</span>
              </span>

              <div class="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full text-[11px]">
                <button
                  @click="selectedTestType = 'computer'"
                  :class="[
                    'px-3 py-1 rounded-full font-medium transition-all cursor-pointer',
                    selectedTestType === 'computer' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b]'
                  ]"
                >
                  <Laptop class="w-3 h-3 inline mr-1" />
                  学术类机考 (官方首选)
                </button>
                <button
                  @click="selectedTestType = 'paper'"
                  :class="[
                    'px-3 py-1 rounded-full font-medium transition-all cursor-pointer',
                    selectedTestType === 'paper' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b]'
                  ]"
                >
                  <FileText class="w-3 h-3 inline mr-1" />
                  纸笔考试
                </button>
              </div>
            </div>

            <!-- City Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                v-for="c in CITIES"
                :key="c"
                @click="selectedCity = c"
                :class="[
                  'px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer',
                  selectedCity === c 
                    ? 'bg-[#1d1d1f] text-white font-medium shadow-xs' 
                    : 'bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f]'
                ]"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <!-- Official Centers Grid -->
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              官方认证考点中心 ({{ filteredCenters.length }} 所)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              <div
                v-for="center in filteredCenters"
                :key="center.id"
                @click="handleSelectCenter(center)"
                :class="[
                  'p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                  selectedCenter.id === center.id
                    ? 'bg-[#0071e3]/5 border-[#0071e3] shadow-xs'
                    : 'bg-white border-black/[0.06] hover:border-black/20'
                ]"
              >
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold text-[#1d1d1f] leading-snug">
                      {{ center.name }}
                    </span>
                    <span 
                      v-if="selectedCenter.id === center.id" 
                      class="w-4 h-4 rounded-full bg-[#0071e3] text-white flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <Check class="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <p class="text-[11px] text-[#86868b] mt-1 line-clamp-1">
                    {{ center.address }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-1 mt-2.5">
                  <span 
                    v-for="f in center.features.slice(0, 2)" 
                    :key="f"
                    class="text-[9px] px-1.5 py-0.5 rounded bg-black/[0.04] text-[#86868b]"
                  >
                    {{ f }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Real Exam Dates & Sessions Selection -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <CalendarCheck2 class="w-4 h-4 text-[#0071e3]" />
                <span>官方真实场次排期与时间 ({{ availableSessions.length }} 场可选)</span>
              </label>

              <button 
                @click="isCustomDate = !isCustomDate"
                class="text-[11px] text-[#0071e3] hover:underline cursor-pointer"
              >
                {{ isCustomDate ? '切换回考场排期' : '自定义考试日期' }}
              </button>
            </div>

            <!-- Custom Date Fallback -->
            <div v-if="isCustomDate" class="p-4 bg-[#fbfbfd] rounded-2xl border border-black/[0.06] flex items-center gap-3">
              <input 
                type="date" 
                v-model="customExamDate"
                class="px-4 py-2 bg-white rounded-xl border border-black/[0.1] text-xs font-semibold text-[#1d1d1f]"
              />
              <span class="text-xs text-[#86868b]">
                当前距考试还有 <strong class="text-[#1d1d1f]">{{ daysRemaining }}</strong> 天
              </span>
            </div>

            <!-- Real Sessions Carousel / List -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              <div
                v-for="s in availableSessions"
                :key="s.id"
                @click="handleSelectSession(s)"
                :class="[
                  'p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden',
                  selectedSession?.id === s.id
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-[#1d1d1f]'
                ]"
              >
                <div class="flex items-center justify-between text-xs font-semibold">
                  <span>{{ s.date }} ({{ s.dayOfWeek }})</span>
                  <span 
                    :class="[
                      'text-[9px] px-1.5 py-0.5 rounded-full font-medium',
                      selectedSession?.id === s.id ? 'bg-white/20 text-white' : 'bg-black/[0.05] text-[#86868b]'
                    ]"
                  >
                    {{ s.daysUntilExam }}天后
                  </span>
                </div>

                <div class="text-[11px] mt-1" :class="selectedSession?.id === s.id ? 'text-white/80' : 'text-[#86868b]'">
                  {{ s.timeSlotLabel }}
                </div>

                <div class="mt-2 flex items-center justify-between text-[10px]">
                  <span :class="s.status === 'closing_soon' ? 'text-rose-400 font-medium' : (selectedSession?.id === s.id ? 'text-white/70' : 'text-emerald-600 font-medium')">
                    ● {{ s.statusLabel }}
                  </span>
                  <span :class="selectedSession?.id === s.id ? 'text-white/60' : 'text-[#86868b]'">
                    截止: {{ s.registrationDeadline.slice(5) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: AI DIAGNOSTIC ENGINE & DAILY HOURS ANALYSIS -->
        <div v-else-if="step === 3" class="space-y-6 animate-fadeIn">
          <!-- Summary Banner -->
          <div class="bg-gradient-to-br from-[#1d1d1f] to-[#2c2c2e] text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div class="relative z-10 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs backdrop-blur-md">
                  <BrainCircuit class="w-3.5 h-3.5 text-amber-400" />
                  <span>{{ selectedCenter.shortName }} · 考期倒计时 {{ aiAnalysis.daysRemaining }} 天</span>
                </div>

                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md',
                    aiAnalysis.intensityBg
                  ]"
                >
                  {{ aiAnalysis.intensityLabel }}
                </span>
              </div>

              <!-- Main Key Numbers -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <div class="text-xs text-white/60">提分差距 (Delta)</div>
                  <div class="text-xl sm:text-2xl font-bold mt-1 text-white">
                    +{{ aiAnalysis.scoreDelta }} 分
                  </div>
                  <div class="text-[10px] text-white/40 mt-0.5">
                    {{ aiAnalysis.baselineBandDisplay }} ➔ {{ aiAnalysis.targetBandDisplay }}
                  </div>
                </div>

                <div>
                  <div class="text-xs text-white/60">所需总训练学时</div>
                  <div class="text-xl sm:text-2xl font-bold mt-1 text-white">
                    ~{{ aiAnalysis.requiredTotalHours }}h
                  </div>
                  <div class="text-[10px] text-white/40 mt-0.5">
                    剑桥评估标准模型
                  </div>
                </div>

                <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <div class="text-xs text-amber-300 font-semibold flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5" />
                    <span>AI 推荐日均投入</span>
                  </div>
                  <div class="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
                    {{ preferredDailyHours > 0 ? preferredDailyHours : aiAnalysis.recommendedDailyHours }}h
                  </div>
                  <div class="text-[10px] text-white/70 mt-0.5">
                    约 {{ Math.round((preferredDailyHours > 0 ? preferredDailyHours : aiAnalysis.recommendedDailyHours) * 60) }} 分钟 / 天
                  </div>
                </div>

                <div>
                  <div class="text-xs text-white/60">目标达成把握</div>
                  <div class="text-xl sm:text-2xl font-bold mt-1 text-emerald-400">
                    {{ aiAnalysis.feasibilityLabel }}
                  </div>
                  <div class="text-[10px] text-white/40 mt-0.5">
                    按规划执行达成率
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Warning if Overload -->
          <div 
            v-if="aiAnalysis.feasibilityRiskNote" 
            class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3"
          >
            <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong class="font-bold">备考负荷评估建议：</strong>
              <p class="mt-0.5 text-amber-800 leading-relaxed">
                {{ aiAnalysis.feasibilityRiskNote }}
              </p>
            </div>
          </div>

          <!-- Adjust Daily Hours Slider (Dynamic User Fine-Tuning) -->
          <div class="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                  <Sliders class="w-4 h-4 text-[#0071e3]" />
                  <span>自主微调每日投入时长 (Daily Study Hours)</span>
                </span>
                <p class="text-[11px] text-[#86868b] mt-0.5">
                  拖动滑块可根据个人工作/学业作息微调，系统将自动调整四科日进度配比。
                </p>
              </div>

              <span class="text-base font-extrabold text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                {{ preferredDailyHours }} 小时 / 天
              </span>
            </div>

            <input 
              type="range" 
              min="1.0" 
              max="6.0" 
              step="0.5" 
              v-model.number="preferredDailyHours"
              class="w-full accent-[#0071e3] cursor-pointer"
            />

            <div class="flex justify-between text-[10px] text-[#86868b]">
              <span>轻松兼职 (1.0h)</span>
              <span>黄金区间 (2.5h - 3.5h)</span>
              <span>全职脱产 (5.0h+)</span>
            </div>
          </div>

          <!-- 4-Subject Daily Time Allocation -->
          <div class="bg-[#fbfbfd] p-5 rounded-2xl border border-black/[0.04] space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <PieChart class="w-4 h-4 text-emerald-600" />
                <span>AI 建议每日四科黄金时间切分</span>
              </h4>
              <span class="text-[11px] text-[#86868b]">
                总计 {{ Math.round(preferredDailyHours * 60) }} 分钟
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div class="bg-white p-3.5 rounded-xl border border-black/[0.04]">
                <div class="flex items-center justify-between text-xs font-medium">
                  <span class="text-[#1d1d1f]">🎧 听力 Listening</span>
                  <span class="font-bold text-[#0071e3]">{{ Math.round(preferredDailyHours * 15) }} 分钟</span>
                </div>
                <p class="text-[11px] text-[#86868b] mt-1">
                  剑雅Section 1/2场景词拼写 + 1.25x原速单题型定位精听
                </p>
              </div>

              <div class="bg-white p-3.5 rounded-xl border border-black/[0.04]">
                <div class="flex items-center justify-between text-xs font-medium">
                  <span class="text-[#1d1d1f]">📖 阅读 Reading</span>
                  <span class="font-bold text-[#0071e3]">{{ Math.round(preferredDailyHours * 15) }} 分钟</span>
                </div>
                <p class="text-[11px] text-[#86868b] mt-1">
                  单篇 Passage 计时精读 + 核心学术生词提炼与长难句断句
                </p>
              </div>

              <div class="bg-white p-3.5 rounded-xl border border-black/[0.04]">
                <div class="flex items-center justify-between text-xs font-medium">
                  <span class="text-[#1d1d1f]">✍️ 写作 Writing</span>
                  <span class="font-bold text-[#0071e3]">{{ Math.round(preferredDailyHours * 18) }} 分钟</span>
                </div>
                <p class="text-[11px] text-[#86868b] mt-1">
                  Task 1 图表关键特征概括 + Task 2 论述结构与逻辑连接词
                </p>
              </div>

              <div class="bg-white p-3.5 rounded-xl border border-black/[0.04]">
                <div class="flex items-center justify-between text-xs font-medium">
                  <span class="text-[#1d1d1f]">🗣️ 口语 Speaking</span>
                  <span class="font-bold text-[#0071e3]">{{ Math.round(preferredDailyHours * 12) }} 分钟</span>
                </div>
                <p class="text-[11px] text-[#86868b] mt-1">
                  Part 1/2 当季考题大声朗读 + 录音流利度自检与停顿消除
                </p>
              </div>
            </div>
          </div>

          <!-- Computer Test Specific Strategies -->
          <div v-if="aiAnalysis.computerTestTips" class="bg-white p-5 rounded-2xl border border-black/[0.06] space-y-2.5">
            <h4 class="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Laptop class="w-4 h-4 text-[#0071e3]" />
              <span>所选考场（{{ selectedCenter.shortName }}）针对性机考提分锦囊</span>
            </h4>
            <ul class="space-y-1.5 text-xs text-[#86868b]">
              <li v-for="(tip, idx) in aiAnalysis.computerTestTips" :key="idx" class="flex items-start gap-2">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="px-6 py-4 bg-[#fbfbfd] border-t border-black/[0.06] flex items-center justify-between">
        <div>
          <button
            v-if="step > 1"
            @click="step--"
            class="px-4 py-2 rounded-full border border-black/[0.1] text-xs font-medium text-[#1d1d1f] hover:bg-black/5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>上一步</span>
          </button>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            @click="emit('close')"
            class="px-4 py-2 rounded-full text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-all cursor-pointer"
          >
            取消
          </button>

          <button
            v-if="step < 3"
            @click="step++"
            class="px-5 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>下一步</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>

          <button
            v-else
            @click="handleSavePlan"
            class="px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Check class="w-4 h-4" />
            <span>确认并生成专属备考方案</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
