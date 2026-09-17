<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Brain, 
  Database, 
  ArrowLeft, 
  LogOut, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Key, 
  FileText, 
  Sparkles,
  Sliders,
  ChevronRight,
  X
} from 'lucide-vue-next';
import { 
  isAdminAuthenticated, 
  verifyAdminPin, 
  logoutAdmin, 
  getAdminDashboardMetrics, 
  getAllStudents, 
  deleteStudentAccount, 
  updateStudentAccount, 
  exportFullDatabaseBackup, 
  restoreDatabaseBackup,
  type StudentDetail,
  type AdminDashboardMetrics
} from '../../services/adminService';
import { registerUser } from '../../services/authService';
import { READING_TESTS } from '../../data/readingTests';
import { LISTENING_TESTS } from '../../data/listeningTests';
import { WRITING_TASKS } from '../../data/writingTasks';
import { SPEAKING_TOPICS } from '../../data/speakingTopics';
import { CORE_VOCABULARY } from '../../data/vocabularyData';
import { inferBankCategory, getBankInfo, BANK_COLLECTIONS } from '../../services/questionBankService';
import type { BankCategory } from '../../types/ielts';

const emit = defineEmits<{
  (e: 'returnToPortal'): void;
}>();

// Auth State
const isAuthenticated = ref(isAdminAuthenticated());
const pinInput = ref('');
const loginError = ref('');

// Admin Navigation Tabs
type AdminTab = 'overview' | 'students' | 'questions' | 'ebbinghaus' | 'maintenance';
const activeTab = ref<AdminTab>('overview');

// Data State
const metrics = ref<AdminDashboardMetrics>(getAdminDashboardMetrics());
const students = ref<StudentDetail[]>(getAllStudents());
const studentSearchQuery = ref('');

// Selected student for detail view / editing
const selectedStudent = ref<StudentDetail | null>(null);
const isEditModalOpen = ref(false);
const isAddStudentModalOpen = ref(false);

// Edit Form
const editDisplayName = ref('');
const editTargetBand = ref(7.0);
const editCurrentBand = ref(0);
const editExamDate = ref('');
const editNewPassword = ref('');

// Add Student Form
const newUsername = ref('');
const newDisplayName = ref('');
const newTargetBand = ref(7.0);
const newExamDate = ref('');
const addError = ref('');

// Question Bank Module Tab & Bank Filter
const questionModuleTab = ref<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
const selectedAdminBank = ref<BankCategory>('all');

const getBankBadge = (item: any) => {
  const cat = inferBankCategory(item);
  return getBankInfo(cat);
};

const filteredAdminReading = computed(() => {
  if (selectedAdminBank.value === 'all') return READING_TESTS;
  return READING_TESTS.filter(t => inferBankCategory(t) === selectedAdminBank.value);
});

const filteredAdminListening = computed(() => {
  if (selectedAdminBank.value === 'all') return LISTENING_TESTS;
  return LISTENING_TESTS.filter(t => inferBankCategory(t) === selectedAdminBank.value);
});

const filteredAdminWriting = computed(() => {
  if (selectedAdminBank.value === 'all') return WRITING_TASKS;
  return WRITING_TASKS.filter(t => inferBankCategory(t) === selectedAdminBank.value);
});

const filteredAdminSpeaking = computed(() => {
  if (selectedAdminBank.value === 'all') return SPEAKING_TOPICS;
  return SPEAKING_TOPICS.filter(t => inferBankCategory(t) === selectedAdminBank.value);
});

// Maintenance status
const restoreStatus = ref<{ success?: boolean; message?: string } | null>(null);

const refreshData = () => {
  metrics.value = getAdminDashboardMetrics();
  students.value = getAllStudents();
};

onMounted(() => {
  if (isAuthenticated.value) {
    refreshData();
  }
});

const handleLogin = () => {
  loginError.value = '';
  if (verifyAdminPin(pinInput.value)) {
    isAuthenticated.value = true;
    pinInput.value = '';
    refreshData();
  } else {
    loginError.value = '口令错误，请重新输入（默认口令：admin888）';
  }
};

const handleQuickLogin = () => {
  verifyAdminPin('admin888');
  isAuthenticated.value = true;
  refreshData();
};

const handleLogout = () => {
  logoutAdmin();
  isAuthenticated.value = false;
};

// Filtered Students
const filteredStudents = computed(() => {
  if (!studentSearchQuery.value.trim()) return students.value;
  const q = studentSearchQuery.value.toLowerCase();
  return students.value.filter(s => 
    s.username.toLowerCase().includes(q) || 
    s.displayName.toLowerCase().includes(q)
  );
});

// Student Actions
const openEditModal = (student: StudentDetail) => {
  selectedStudent.value = student;
  editDisplayName.value = student.displayName;
  editTargetBand.value = student.targetBand;
  editCurrentBand.value = student.currentBand;
  editExamDate.value = student.examDate;
  editNewPassword.value = '';
  isEditModalOpen.value = true;
};

const handleSaveStudent = () => {
  if (!selectedStudent.value) return;
  updateStudentAccount(selectedStudent.value.id, {
    displayName: editDisplayName.value,
    targetBand: editTargetBand.value,
    currentBand: editCurrentBand.value,
    examDate: editExamDate.value,
    newPassword: editNewPassword.value || undefined
  });
  isEditModalOpen.value = false;
  refreshData();
};

const handleDeleteStudent = (student: StudentDetail) => {
  if (!confirm(`确定要注销学员 @${student.username} (${student.displayName}) 吗？`)) {
    return;
  }
  const res = deleteStudentAccount(student.id);
  if (!res.success) {
    alert(res.error || '删除失败');
  } else {
    refreshData();
  }
};

const handleCreateStudent = () => {
  addError.value = '';
  if (!newUsername.value.trim()) {
    addError.value = '用户名不能为空';
    return;
  }

  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 178);

    registerUser({
      username: newUsername.value.trim(),
      displayName: newDisplayName.value.trim() || newUsername.value.trim(),
      targetBand: newTargetBand.value,
      examDate: newExamDate.value || futureDate.toISOString().split('T')[0]
    });

    isAddStudentModalOpen.value = false;
    newUsername.value = '';
    newDisplayName.value = '';
    refreshData();
  } catch (err: any) {
    addError.value = err.message || '注册失败';
  }
};

// Database Export/Import
const handleExportBackup = () => {
  const json = exportFullDatabaseBackup();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ielts_master_full_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    const res = restoreDatabaseBackup(content);
    restoreStatus.value = res;
    if (res.success) {
      refreshData();
    }
  };
  reader.readAsText(file);
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};
</script>

<template>
  <!-- LOGIN SCREEN -->
  <div 
    v-if="!isAuthenticated" 
    class="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 selection:bg-[#1d1d1f] selection:text-white"
  >
    <div class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.14)] border border-black/[0.06] p-7 sm:p-8 space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-xl font-semibold tracking-tight text-[#1d1d1f]">
          IELTS Master 管理控制台
        </h1>
        <p class="text-xs text-[#86868b]">
          后台核心运维系统 · 全科学员档案、题库与数据沙箱安全管控
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
            <Key class="w-3.5 h-3.5 text-[#86868b]" />
            <span>管理员安全口令</span>
          </label>
          <input
            v-model="pinInput"
            type="password"
            autofocus
            placeholder="输入管理口令 (默认: admin888)"
            class="w-full px-4 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all shadow-2xs font-mono"
          />
          <p v-if="loginError" class="text-xs text-[#ff3b30] mt-1.5 font-medium flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" />
            <span>{{ loginError }}</span>
          </p>
        </div>

        <button
          type="submit"
          class="w-full py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer active:scale-98"
        >
          验证口令并进入
        </button>

        <button
          type="button"
          @click="handleQuickLogin"
          class="w-full py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full border border-black/[0.04] transition-all cursor-pointer"
        >
          ⚡ 一键管理员登入 (演示模式)
        </button>
      </form>

      <div class="pt-2 border-t border-black/[0.04] text-center">
        <button
          @click="emit('returnToPortal')"
          class="text-xs text-[#0071e3] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>返回学员前台考场</span>
        </button>
      </div>
    </div>
  </div>

  <!-- AUTHENTICATED ADMIN CONSOLE -->
  <div v-else class="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-[#1d1d1f] selection:text-white flex flex-col">
    <!-- Top Frosted Header Bar -->
    <header class="h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-[#1d1d1f] text-white flex items-center justify-center shadow-xs">
          <ShieldCheck class="w-4 h-4" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-semibold text-sm sm:text-base text-[#1d1d1f] tracking-tight">
              IELTS Master 管理控制台
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
              <span>系统运行正常</span>
            </span>
          </div>
          <p class="text-[11px] text-[#86868b] font-normal hidden sm:block">
            全科学员数据物理隔离 · 艾宾浩斯记忆模型 · 剑桥 18/19 官方题库
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="emit('returnToPortal')"
          class="px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>返回学员考场</span>
        </button>

        <button
          @click="handleLogout"
          class="p-2 rounded-full hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#ff3b30] transition-colors cursor-pointer"
          title="退出管理权限"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Sub-navigation Tabs (Apple Capsule Bar) -->
    <div class="bg-[#fbfbfd] border-b border-black/[0.04] px-4 sm:px-8 py-2.5 sticky top-16 z-20 overflow-x-auto">
      <div class="flex items-center gap-1.5 p-1 bg-[#f5f5f7] rounded-full text-xs w-max border border-black/[0.03]">
        <button
          @click="activeTab = 'overview'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
            activeTab === 'overview' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <TrendingUp class="w-3.5 h-3.5" />
          <span>数据总览</span>
        </button>

        <button
          @click="activeTab = 'students'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
            activeTab === 'students' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <Users class="w-3.5 h-3.5" />
          <span>学员档案 ({{ students.length }})</span>
        </button>

        <button
          @click="activeTab = 'questions'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
            activeTab === 'questions' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <BookOpen class="w-3.5 h-3.5" />
          <span>全科题库管理</span>
        </button>

        <button
          @click="activeTab = 'ebbinghaus'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
            activeTab === 'ebbinghaus' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <Brain class="w-3.5 h-3.5" />
          <span>记忆引擎监控</span>
        </button>

        <button
          @click="activeTab = 'maintenance'"
          :class="[
            'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
            activeTab === 'maintenance' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
          ]"
        >
          <Database class="w-3.5 h-3.5" />
          <span>系统运维与备份</span>
        </button>
      </div>
    </div>

    <!-- Main Content Workspace -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
      <!-- 1. TAB: OVERVIEW -->
      <div v-if="activeTab === 'overview'" class="space-y-6 animate-fadeIn">
        <!-- 4 Top KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs">
            <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
              <span>在册活跃学员</span>
              <Users class="w-3.5 h-3.5 text-[#86868b]" />
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tabular-nums">
              {{ metrics.totalStudents }} <span class="text-xs font-normal text-[#86868b]">位学员</span>
            </div>
            <div class="text-[11px] text-[#86868b] mt-1 font-normal">
              多账户本地数据物理隔离
            </div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs">
            <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
              <span>全科学员模考总场次</span>
              <FileText class="w-3.5 h-3.5 text-[#86868b]" />
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tabular-nums">
              {{ metrics.totalExamsTaken }} <span class="text-xs font-normal text-[#86868b]">套卷完成</span>
            </div>
            <div class="text-[11px] text-[#86868b] mt-1 font-normal">
              全科均分: Band {{ metrics.averageOverallScore > 0 ? metrics.averageOverallScore.toFixed(1) : '0.0' }}
            </div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs">
            <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
              <span>全员错题沉淀总数</span>
              <AlertCircle class="w-3.5 h-3.5 text-[#86868b]" />
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tabular-nums">
              {{ metrics.totalMistakesRecorded }} <span class="text-xs font-normal text-[#86868b]">道错题</span>
            </div>
            <div class="text-[11px] text-[#86868b] mt-1 font-normal">
              待攻克: {{ metrics.totalUnresolvedMistakes }} 题
            </div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs">
            <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
              <span>抗遗忘记忆突触复核</span>
              <Brain class="w-3.5 h-3.5 text-[#86868b]" />
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tabular-nums">
              {{ metrics.totalEbbinghausReviews }} <span class="text-xs font-normal text-[#86868b]">次复查</span>
            </div>
            <div class="text-[11px] text-[#86868b] mt-1 font-normal">
              覆盖 {{ metrics.totalCoreVocabCount }} 核心词与错题
            </div>
          </div>
        </div>

        <!-- Two Column Overview Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Skill Average Radar -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-2xs space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <Target class="w-4 h-4 text-[#86868b]" />
                  <span>各科模考平均成绩与达标分布</span>
                </h2>
                <span class="text-xs text-[#86868b]">基于全真判分算法</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02]">
                  <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
                    <span class="flex items-center gap-1.5 text-[#1d1d1f] font-medium">
                      <BookOpen class="w-3.5 h-3.5 text-[#34c759]" />
                      <span>学术阅读 Reading</span>
                    </span>
                    <span class="font-semibold text-[#1d1d1f]">Band {{ metrics.averageReadingScore || '0.0' }}</span>
                  </div>
                  <div class="w-full bg-white rounded-full h-1.5 overflow-hidden mt-2">
                    <div 
                      class="h-full bg-[#34c759] rounded-full" 
                      :style="{ width: Math.min(100, (metrics.averageReadingScore / 9.0) * 100) + '%' }" 
                    />
                  </div>
                </div>

                <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02]">
                  <div class="flex items-center justify-between text-xs text-[#86868b] mb-1">
                    <span class="flex items-center gap-1.5 text-[#1d1d1f] font-medium">
                      <Headphones class="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>全真听力 Listening</span>
                    </span>
                    <span class="font-semibold text-[#1d1d1f]">Band {{ metrics.averageListeningScore || '0.0' }}</span>
                  </div>
                  <div class="w-full bg-white rounded-full h-1.5 overflow-hidden mt-2">
                    <div 
                      class="h-full bg-[#0071e3] rounded-full" 
                      :style="{ width: Math.min(100, (metrics.averageListeningScore / 9.0) * 100) + '%' }" 
                    />
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] flex items-center justify-between text-xs text-[#86868b]">
                <div class="flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-[#ff9500]" />
                  <span>收录剑桥雅思 18/19 官方真题与机考题卡共 <strong>{{ metrics.activeCambridgePapersCount }}</strong> 套/项</span>
                </div>
                <button
                  @click="activeTab = 'questions'"
                  class="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  查看题库明细 ➔
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Recent Test Submissions -->
          <div class="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-2xs space-y-4">
            <h2 class="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Clock class="w-4 h-4 text-[#86868b]" />
              <span>最新提交记录</span>
            </h2>

            <div v-if="metrics.recentExams.length === 0" class="text-xs text-[#86868b] py-8 text-center font-normal">
              暂无学员模考提交记录
            </div>
            <div v-else class="space-y-2.5">
              <div
                v-for="(exam, idx) in metrics.recentExams"
                :key="idx"
                class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] flex items-center justify-between text-xs"
              >
                <div>
                  <div class="font-medium text-[#1d1d1f] flex items-center gap-1.5">
                    <span>{{ exam.studentName }}</span>
                    <span class="px-1.5 py-0.2 rounded text-[10px] bg-black/[0.04] text-[#86868b] uppercase font-mono">
                      {{ exam.module }}
                    </span>
                  </div>
                  <div class="text-[11px] text-[#86868b] truncate max-w-[160px] mt-0.5">
                    {{ exam.testTitle }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-xs text-[#0071e3]">
                    Band {{ exam.band.toFixed(1) }}
                  </div>
                  <div class="text-[10px] text-[#86868b]">
                    {{ exam.score }}/40
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. TAB: STUDENTS -->
      <div v-else-if="activeTab === 'students'" class="space-y-4 animate-fadeIn">
        <div class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="relative flex-1 max-w-sm w-full">
            <Search class="w-4 h-4 text-[#86868b] absolute left-3.5 top-2.5" />
            <input
              v-model="studentSearchQuery"
              type="text"
              placeholder="搜索学员用户名或姓名..."
              class="w-full pl-10 pr-4 py-2 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all font-normal"
            />
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="isAddStudentModalOpen = true"
              class="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>新建学员档案</span>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-black/[0.04] shadow-2xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#f5f5f7] text-[#86868b] font-medium border-b border-black/[0.04]">
                <tr>
                  <th class="px-5 py-3">学员信息</th>
                  <th class="px-4 py-3">当前水平</th>
                  <th class="px-4 py-3">目标分</th>
                  <th class="px-4 py-3">模考次数</th>
                  <th class="px-4 py-3">错题积压</th>
                  <th class="px-4 py-3">考期</th>
                  <th class="px-5 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.04]">
                <tr 
                  v-for="s in filteredStudents" 
                  :key="s.id"
                  class="hover:bg-[#fbfbfd] transition-colors"
                >
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center text-base shrink-0">
                        {{ s.avatar }}
                      </div>
                      <div>
                        <div class="font-semibold text-xs text-[#1d1d1f]">{{ s.displayName }}</div>
                        <div class="text-[11px] text-[#86868b]">@{{ s.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3.5">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[11px] font-medium',
                      s.currentBand === 0 ? 'bg-black/[0.04] text-[#86868b]' : 'bg-[#0071e3]/10 text-[#0071e3]'
                    ]">
                      {{ s.currentBand === 0 ? '待定级 (0.0)' : 'Band ' + s.currentBand.toFixed(1) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 font-semibold text-[#1d1d1f]">
                    Band {{ s.targetBand.toFixed(1) }}
                  </td>
                  <td class="px-4 py-3.5 tabular-nums">
                    {{ s.testCount }} 次 (均分 {{ s.averageScore }})
                  </td>
                  <td class="px-4 py-3.5">
                    <span v-if="s.unresolvedMistakes > 0" class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ff9500]/10 text-[#ff9500]">
                      {{ s.unresolvedMistakes }} 题待攻克
                    </span>
                    <span v-else class="text-[#86868b] text-[11px]">无错题</span>
                  </td>
                  <td class="px-4 py-3.5 text-[#86868b] text-[11px]">
                    {{ s.examDate }} (余 {{ s.examCountdownDays }} 天)
                  </td>
                  <td class="px-5 py-3.5 text-right space-x-1.5">
                    <button
                      @click="openEditModal(s)"
                      class="px-2.5 py-1 rounded-lg hover:bg-[#f5f5f7] text-[#0071e3] font-medium transition-colors cursor-pointer"
                      title="编辑学员信息"
                    >
                      编辑
                    </button>
                    <button
                      @click="handleDeleteStudent(s)"
                      class="px-2.5 py-1 rounded-lg hover:bg-red-50 text-[#ff3b30] font-medium transition-colors cursor-pointer"
                      title="注销学员"
                    >
                      注销
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3. TAB: QUESTION BANK -->
      <div v-else-if="activeTab === 'questions'" class="space-y-4 animate-fadeIn">
        <div class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs space-y-4">
          <!-- Module Tabs & Bank Selector Row -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5 p-1 bg-[#f5f5f7] rounded-full text-xs border border-black/[0.03]">
              <button
                @click="questionModuleTab = 'reading'"
                :class="[
                  'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                  questionModuleTab === 'reading' ? 'bg-white text-[#34c759] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
                ]"
              >
                <BookOpen class="w-3.5 h-3.5" />
                <span>学术阅读 ({{ filteredAdminReading.length }})</span>
              </button>
              <button
                @click="questionModuleTab = 'listening'"
                :class="[
                  'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                  questionModuleTab === 'listening' ? 'bg-white text-[#0071e3] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
                ]"
              >
                <Headphones class="w-3.5 h-3.5" />
                <span>机考听力 ({{ filteredAdminListening.length }})</span>
              </button>
              <button
                @click="questionModuleTab = 'writing'"
                :class="[
                  'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                  questionModuleTab === 'writing' ? 'bg-white text-[#ff9500] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
                ]"
              >
                <PenTool class="w-3.5 h-3.5" />
                <span>写作题库 ({{ filteredAdminWriting.length }})</span>
              </button>
              <button
                @click="questionModuleTab = 'speaking'"
                :class="[
                  'px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                  questionModuleTab === 'speaking' ? 'bg-white text-[#af52de] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
                ]"
              >
                <Mic class="w-3.5 h-3.5" />
                <span>口语题库 ({{ filteredAdminSpeaking.length }})</span>
              </button>
            </div>

            <!-- Bank Filter Pills -->
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-[#86868b] text-[11px]">题库归属:</span>
              <button
                v-for="b in BANK_COLLECTIONS"
                :key="b.id"
                @click="selectedAdminBank = b.id"
                :class="[
                  'px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border',
                  selectedAdminBank === b.id
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                    : 'bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] border-transparent'
                ]"
              >
                {{ b.shortName }}
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <template v-if="questionModuleTab === 'reading'">
            <div 
              v-for="paper in filteredAdminReading" 
              :key="paper.id"
              class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1.5">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1d1d1f] text-white">
                      {{ getBankBadge(paper).shortName }}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#34c759]/10 text-[#34c759]">
                      {{ paper.difficulty || 'Authentic' }}
                    </span>
                  </div>
                  <span class="text-xs text-[#86868b]">3 篇长难篇章 · 40 题</span>
                </div>
                <h3 class="font-semibold text-sm text-[#1d1d1f]">
                  {{ paper.title }}
                </h3>
                <ul class="text-xs text-[#86868b] space-y-1 pt-1 font-serif">
                  <li v-for="p in paper.passages" :key="p.id" class="truncate">
                    • Passage {{ p.id }}: {{ p.title }}
                  </li>
                </ul>
              </div>
              <div class="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <span class="text-[11px] text-[#86868b]">{{ paper.year || '2024' }}</span>
                <span class="text-[#0071e3] font-medium">状态: 已上线 ✓</span>
              </div>
            </div>
          </template>

          <template v-else-if="questionModuleTab === 'listening'">
            <div 
              v-for="paper in filteredAdminListening" 
              :key="paper.id"
              class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1.5">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1d1d1f] text-white">
                      {{ getBankBadge(paper).shortName }}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#0071e3]/10 text-[#0071e3]">
                      {{ paper.source }}
                    </span>
                  </div>
                  <span class="text-xs text-[#86868b]">Section 1-4 · 40 题</span>
                </div>
                <h3 class="font-semibold text-sm text-[#1d1d1f]">
                  {{ paper.title }}
                </h3>
                <ul class="text-xs text-[#86868b] space-y-1 pt-1">
                  <li v-for="s in paper.sections" :key="s.id" class="truncate">
                    • Section {{ s.sectionNumber }}: {{ s.title }}
                  </li>
                </ul>
              </div>
              <div class="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <span class="text-[11px] text-[#86868b]">内置双语听力剧本</span>
                <span class="text-[#0071e3] font-medium">状态: 已上线 ✓</span>
              </div>
            </div>
          </template>

          <template v-else-if="questionModuleTab === 'writing'">
            <div 
              v-for="task in filteredAdminWriting" 
              :key="task.id"
              class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1.5">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1d1d1f] text-white">
                      {{ getBankBadge(task).shortName }}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff9500]/10 text-[#ff9500] uppercase">
                      {{ task.type }}
                    </span>
                  </div>
                  <span class="text-xs text-[#86868b]">{{ task.category }}</span>
                </div>
                <h3 class="font-semibold text-sm text-[#1d1d1f]">
                  {{ task.title }}
                </h3>
                <p class="text-xs text-[#86868b] line-clamp-3 leading-relaxed">
                  {{ task.prompt }}
                </p>
              </div>
              <div class="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <span class="text-[11px] text-[#86868b]">带考官 Band 9 范文</span>
                <span class="text-[#0071e3] font-medium">已上线 ✓</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div 
              v-for="topic in filteredAdminSpeaking" 
              :key="topic.id"
              class="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1.5">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1d1d1f] text-white">
                      {{ getBankBadge(topic).shortName }}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#af52de]/10 text-[#af52de]">
                      Part {{ topic.part }}
                    </span>
                  </div>
                  <span class="text-xs text-[#86868b]">{{ topic.category }}</span>
                </div>
                <h3 class="font-semibold text-sm text-[#1d1d1f]">
                  {{ topic.title }}
                </h3>
                <p class="text-xs text-[#86868b] line-clamp-2">
                  {{ topic.part === 2 ? topic.cueCard?.topic : topic.questions?.join(' | ') }}
                </p>
              </div>
              <div class="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <span class="text-[11px] text-[#86868b]">高频真题题卡</span>
                <span class="text-[#0071e3] font-medium">已上线 ✓</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 4. TAB: EBBINGHAUS MONITOR -->
      <div v-else-if="activeTab === 'ebbinghaus'" class="space-y-6 animate-fadeIn">
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-2xs space-y-4">
          <div>
            <div class="flex items-center gap-2 text-xs text-[#0071e3] font-semibold mb-1">
              <Brain class="w-4 h-4" />
              <span>EBBINGHAUS SPATION MEMORY ENGINE</span>
            </div>
            <h2 class="text-lg font-semibold text-[#1d1d1f]">
              艾宾浩斯记忆模型全局运行状况
            </h2>
            <p class="text-xs text-[#86868b] mt-1 max-w-2xl">
              系统对全科学员词汇记忆与错题复盘执行 7 阶段突触排期（0:初记 ➔ 1:20分 ➔ 2:1小时 ➔ 3:1天 ➔ 4:2天 ➔ 5:6天 ➔ 6:永久掌握）。
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02]">
              <div class="text-xs text-[#86868b] mb-1">词库索引总数</div>
              <div class="text-2xl font-semibold text-[#1d1d1f] tabular-nums">{{ metrics.totalCoreVocabCount }}</div>
            </div>
            <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02]">
              <div class="text-xs text-[#86868b] mb-1">全员复盘提取</div>
              <div class="text-2xl font-semibold text-[#1d1d1f] tabular-nums">{{ metrics.totalEbbinghausReviews }} 次</div>
            </div>
            <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02]">
              <div class="text-xs text-[#86868b] mb-1">算法自适应率</div>
              <div class="text-2xl font-semibold text-[#34c759] tabular-nums">100%</div>
            </div>
            <div class="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02]">
              <div class="text-xs text-[#86868b] mb-1">遗忘临界唤醒</div>
              <div class="text-2xl font-semibold text-[#0071e3] tabular-nums">主动响应</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. TAB: MAINTENANCE & BACKUP -->
      <div v-else-if="activeTab === 'maintenance'" class="space-y-6 animate-fadeIn">
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-2xs space-y-6">
          <div>
            <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Database class="w-4 h-4 text-[#86868b]" />
              <span>系统本地存储容量与灾备恢复</span>
            </h2>
            <p class="text-xs text-[#86868b] mt-1">
              全站使用客户端沙箱隔离存储，保障在离线、网络中断环境下 100% 正常运行。
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#86868b]">已占用存储空间: <strong>{{ formatBytes(metrics.storageUsageBytes) }}</strong></span>
              <span class="text-[#86868b]">浏览器配额上限 ~5MB</span>
            </div>
            <div class="w-full bg-black/[0.04] rounded-full h-2 overflow-hidden">
              <div 
                class="h-full bg-[#0071e3] rounded-full transition-all" 
                :style="{ width: Math.min(100, Math.max(2, (metrics.storageUsageBytes / (5 * 1024 * 1024)) * 100)) + '%' }"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl border border-black/[0.06] space-y-3">
              <div class="flex items-center gap-2 text-[#1d1d1f] font-semibold text-sm">
                <Download class="w-4 h-4 text-[#0071e3]" />
                <span>全量数据库备份导出</span>
              </div>
              <p class="text-xs text-[#86868b]">
                一键导出包含全部在册学员账户、模考历史、错题记录与记忆突触的统一 JSON 备份文件。
              </p>
              <button
                @click="handleExportBackup"
                class="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Download class="w-3.5 h-3.5" />
                <span>导出全量系统 JSON 备份</span>
              </button>
            </div>

            <div class="p-5 rounded-2xl border border-black/[0.06] space-y-3">
              <div class="flex items-center gap-2 text-[#1d1d1f] font-semibold text-sm">
                <Upload class="w-4 h-4 text-[#34c759]" />
                <span>恢复数据库备份</span>
              </div>
              <p class="text-xs text-[#86868b]">
                从导出的 JSON 备份文件恢复系统，自动重建学员沙箱与做题数据。
              </p>
              <label class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f5f5f7] border border-black/[0.08] text-[#1d1d1f] text-xs font-semibold shadow-2xs cursor-pointer active:scale-98">
                <Upload class="w-3.5 h-3.5" />
                <span>选择备份文件并恢复</span>
                <input type="file" accept=".json" @change="handleFileImport" class="hidden" />
              </label>

              <div v-if="restoreStatus" :class="[
                'text-xs p-2.5 rounded-xl border mt-2',
                restoreStatus.success ? 'bg-emerald-50 text-[#34c759] border-emerald-200' : 'bg-red-50 text-[#ff3b30] border-red-200'
              ]">
                {{ restoreStatus.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL: EDIT STUDENT -->
    <div 
      v-if="isEditModalOpen && selectedStudent"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      @click.self="isEditModalOpen = false"
    >
      <div class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-md shadow-2xl border border-black/[0.08] p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-black/[0.04] pb-3">
          <h3 class="font-semibold text-sm text-[#1d1d1f]">编辑学员档案: @{{ selectedStudent.username }}</h3>
          <button @click="isEditModalOpen = false" class="p-1 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-[#1d1d1f] mb-1">显示名称</label>
            <input 
              v-model="editDisplayName" 
              type="text" 
              class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs focus:outline-none focus:bg-white focus:border-[#0071e3]" 
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-medium text-[#1d1d1f] mb-1">当前水平 (Band)</label>
              <input 
                v-model.number="editCurrentBand" 
                type="number" 
                step="0.5" 
                min="0" 
                max="9" 
                class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0071e3]" 
              />
            </div>
            <div>
              <label class="block font-medium text-[#1d1d1f] mb-1">目标总分 (Band)</label>
              <input 
                v-model.number="editTargetBand" 
                type="number" 
                step="0.5" 
                min="4" 
                max="9" 
                class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0071e3]" 
              />
            </div>
          </div>

          <div>
            <label class="block font-medium text-[#1d1d1f] mb-1">预定考期</label>
            <input 
              v-model="editExamDate" 
              type="date" 
              class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs focus:outline-none focus:bg-white focus:border-[#0071e3]" 
            />
          </div>

          <div>
            <label class="block font-medium text-[#1d1d1f] mb-1">重设密码 (留空则不修改)</label>
            <input 
              v-model="editNewPassword" 
              type="password" 
              placeholder="输入新密码" 
              class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs focus:outline-none focus:bg-white focus:border-[#0071e3]" 
            />
          </div>
        </div>

        <div class="pt-3 border-t border-black/[0.04] flex items-center justify-end gap-2">
          <button
            @click="isEditModalOpen = false"
            class="px-4 py-1.5 rounded-full text-xs font-medium text-[#86868b] hover:bg-[#f5f5f7] cursor-pointer"
          >
            取消
          </button>
          <button
            @click="handleSaveStudent"
            class="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1d1d1f] hover:bg-black text-white cursor-pointer active:scale-98"
          >
            保存变更
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD STUDENT -->
    <div 
      v-if="isAddStudentModalOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      @click.self="isAddStudentModalOpen = false"
    >
      <div class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-md shadow-2xl border border-black/[0.08] p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-black/[0.04] pb-3">
          <h3 class="font-semibold text-sm text-[#1d1d1f]">注册新学员档案</h3>
          <button @click="isAddStudentModalOpen = false" class="p-1 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-[#1d1d1f] mb-1">用户名 (唯一识别码) *</label>
            <input 
              v-model="newUsername" 
              type="text" 
              placeholder="例如：Emily" 
              class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs focus:outline-none focus:bg-white focus:border-[#0071e3]" 
            />
          </div>

          <div>
            <label class="block font-medium text-[#1d1d1f] mb-1">显示昵称</label>
            <input 
              v-model="newDisplayName" 
              type="text" 
              placeholder="例如：Emily Zhang" 
              class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs focus:outline-none focus:bg-white focus:border-[#0071e3]" 
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-medium text-[#1d1d1f] mb-1">目标总分</label>
              <input 
                v-model.number="newTargetBand" 
                type="number" 
                step="0.5" 
                min="4" 
                max="9" 
                class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0071e3]" 
              />
            </div>
            <div>
              <label class="block font-medium text-[#1d1d1f] mb-1">考试日期</label>
              <input 
                v-model="newExamDate" 
                type="date" 
                class="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-xs focus:outline-none focus:bg-white focus:border-[#0071e3]" 
              />
            </div>
          </div>

          <p v-if="addError" class="text-xs text-[#ff3b30] font-medium">
            {{ addError }}
          </p>
        </div>

        <div class="pt-3 border-t border-black/[0.04] flex items-center justify-end gap-2">
          <button
            @click="isAddStudentModalOpen = false"
            class="px-4 py-1.5 rounded-full text-xs font-medium text-[#86868b] hover:bg-[#f5f5f7] cursor-pointer"
          >
            取消
          </button>
          <button
            @click="handleCreateStudent"
            class="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1d1d1f] hover:bg-black text-white cursor-pointer active:scale-98"
          >
            创建档案
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
