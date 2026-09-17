<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { 
  Settings, 
  Target, 
  Calendar, 
  Download, 
  Upload, 
  Save, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Users,
  LogOut,
  Key,
  Copy,
  Trash2,
  HardDrive,
  Shield
} from 'lucide-vue-next';
import type { UserProfile } from '../../types/ielts';
import type { UserAccount } from '../../types/auth';
import { 
  saveUserProfile, 
  exportBackupData, 
  importBackupData, 
  getUserStorageStats, 
  clearUserLocalData 
} from '../../services/storage';
import { getActiveUser, logoutActiveUser } from '../../services/authService';

const props = defineProps<{
  profile: UserProfile;
}>();

const emit = defineEmits<{
  (e: 'updateProfile', p: UserProfile): void;
  (e: 'openAdmin'): void;
  (e: 'openAuthModal'): void;
}>();

const formData = ref<UserProfile>({ ...props.profile });
const savedSuccess = ref(false);
const importStatus = ref<string | null>(null);
const activeUser = ref<UserAccount>(getActiveUser());
const vaultStats = ref(getUserStorageStats(activeUser.value.id));
const copiedToken = ref(false);

const refreshStats = () => {
  activeUser.value = getActiveUser();
  vaultStats.value = getUserStorageStats(activeUser.value.id);
};

const handleAuthChanged = () => {
  refreshStats();
};

onMounted(() => {
  refreshStats();
  window.addEventListener('ielts_auth_changed', handleAuthChanged);
});

onUnmounted(() => {
  window.removeEventListener('ielts_auth_changed', handleAuthChanged);
});

const handleCopyToken = () => {
  const token = activeUser.value.recoveryToken || 'MK-GUEST-0000';
  navigator.clipboard.writeText(token);
  copiedToken.value = true;
  setTimeout(() => {
    copiedToken.value = false;
  }, 2000);
};

const handleLogout = () => {
  if (!confirm('确定要退出当前学员登录并切换至访客模式吗？')) return;
  const guest = logoutActiveUser();
  activeUser.value = guest;
  refreshStats();
};

const handleResetLocalVault = () => {
  if (activeUser.value.id === 'user_guest') {
    if (!confirm('确定要清空访客本地临时数据吗？')) return;
  } else {
    if (!confirm(`确定要清空学员【${activeUser.value.displayName}】在当前设备的本地做题成绩与错题吗？\n此操作将重置初始积分为 0.0，不影响其他学员。`)) return;
  }
  clearUserLocalData(activeUser.value.id);
  refreshStats();
  importStatus.value = '当前学员本地沙箱已重置清零！';
  setTimeout(() => { importStatus.value = null; }, 3000);
};

watch(() => props.profile, (newP) => {
  formData.value = { ...newP };
}, { deep: true });

const handleSave = () => {
  saveUserProfile(formData.value);
  emit('updateProfile', formData.value);
  savedSuccess.value = true;
  refreshStats();
  setTimeout(() => {
    savedSuccess.value = false;
  }, 2500);
};

const handleExport = () => {
  const dataStr = exportBackupData(activeUser.value.id);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const token = activeUser.value.recoveryToken || 'vault';
  a.download = `ielts_vault_${activeUser.value.username}_${token}_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const handleImportFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result as string;
    const res = importBackupData(content);
    if (res.success) {
      importStatus.value = `数据已成功恢复至学员【${res.user?.displayName || '当前学员'}】档案中！`;
      refreshStats();
      setTimeout(() => window.location.reload(), 1500);
    } else {
      importStatus.value = `恢复失败: ${res.error || '文件格式有误'}`;
    }
  };
  reader.readAsText(file);
};
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-12 select-none">
    <!-- Header (Apple Style) -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
      <div>
        <div class="flex items-center gap-1.5 text-xs text-[#0071e3] font-medium mb-1">
          <Settings class="w-3.5 h-3.5" />
          <span>IELTS Candidate Preferences & Profile</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
          目标设置与数据隔离
        </h1>
        <span class="text-xs text-[#86868b] mt-0.5 inline-block font-normal">
          数据储存在当前本地设备，网站仅保留恢复标记以防各用户数据混淆
        </span>
      </div>
    </div>

    <!-- Candidate Account & Data Marker Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center text-2xl shadow-2xs shrink-0">
            {{ activeUser.avatar }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-semibold text-[#1d1d1f]">{{ activeUser.displayName }}</h2>
              <span class="text-xs text-[#86868b]">(@{{ activeUser.username }})</span>
              <span v-if="activeUser.id === 'user_guest'" class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/[0.04] text-[#86868b]">
                访客模式
              </span>
              <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-0.5">
                <Shield class="w-2.5 h-2.5" />
                本地独立沙箱
              </span>
            </div>
            <p class="text-xs text-[#86868b] mt-0.5">
              {{ activeUser.id === 'user_guest' ? '未登录专属学员档案，数据临时保存在浏览器沙箱中' : `基础 Band ${activeUser.currentBand.toFixed(1)} ➔ 目标 Band ${activeUser.targetBand.toFixed(1)} · 考期 ${activeUser.examDate}` }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="emit('openAuthModal')"
            class="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-98 flex items-center gap-1.5"
          >
            <Users class="w-3.5 h-3.5" />
            <span>{{ activeUser.id === 'user_guest' ? '登录 / 注册学员' : '切换学员档案' }}</span>
          </button>

          <button
            v-if="activeUser.id !== 'user_guest'"
            type="button"
            @click="handleLogout"
            class="px-3.5 py-2 rounded-full bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-[#ff3b30] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 border border-black/[0.04]"
            title="退出当前登录"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span>退出登录</span>
          </button>
        </div>
      </div>

      <!-- Recovery Token Pill Display -->
      <div class="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div class="flex items-center gap-2">
          <Key class="w-4 h-4 text-[#0071e3] shrink-0" />
          <span class="text-[#86868b]">专属数据恢复标记:</span>
          <span class="font-mono font-semibold text-[#1d1d1f] bg-white px-2 py-0.5 rounded-md border border-black/[0.06] select-all">
            {{ activeUser.recoveryToken || 'MK-GUEST-0000' }}
          </span>
        </div>
        <button
          type="button"
          @click="handleCopyToken"
          class="px-3 py-1 rounded-full bg-white hover:bg-[#e8e8ed] text-xs font-medium text-[#1d1d1f] border border-black/[0.06] transition-all flex items-center gap-1 cursor-pointer"
        >
          <Check v-if="copiedToken" class="w-3.5 h-3.5 text-emerald-600" />
          <Copy v-else class="w-3.5 h-3.5 text-[#86868b]" />
          <span>{{ copiedToken ? '已复制标记' : '复制恢复标记' }}</span>
        </button>
      </div>
    </div>

    <!-- Preferences Form -->
    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Exam Goals Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
        <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2 border-b border-black/[0.04] pb-3">
          <Target class="w-4 h-4 text-[#0071e3]" />
          目标分数设定 (Target Band Scores)
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[#1d1d1f] mb-1.5">目标总分 (Overall)</label>
            <input
              v-model.number="formData.targetOverall"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3.5 py-2 text-sm font-semibold border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">听力 (Listening)</label>
            <input
              v-model.number="formData.targetListening"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3.5 py-2 text-sm border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">阅读 (Reading)</label>
            <input
              v-model.number="formData.targetReading"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3.5 py-2 text-sm border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">写作 (Writing)</label>
            <input
              v-model.number="formData.targetWriting"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3.5 py-2 text-sm border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">口语 (Speaking)</label>
            <input
              v-model.number="formData.targetSpeaking"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3.5 py-2 text-sm border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>
        </div>
      </div>

      <!-- Date and Daily Routine -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
        <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2 border-b border-black/[0.04] pb-3">
          <Calendar class="w-4 h-4 text-[#ff9500]" />
          考试日期与每日打卡目标
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">雅思官方机考报名日期</label>
            <input
              v-model="formData.examDate"
              type="date"
              class="w-full px-3.5 py-2 text-xs sm:text-sm border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">每日计划投入时长 (分钟)</label>
            <input
              v-model.number="formData.dailyGoalMinutes"
              type="number"
              min="30"
              max="480"
              class="w-full px-3.5 py-2 text-xs sm:text-sm border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>
        </div>
      </div>

      <!-- AI Key Configuration (Optional) -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2 border-b border-black/[0.04] pb-3">
          <Sparkles class="w-4 h-4 text-[#ff9500]" />
          AI 智能考官扩展配置（可选）
        </h2>
        <p class="text-xs text-[#86868b] leading-relaxed font-normal">
          平台内置了考官标准离线启发式评估引擎。若您拥有自定义大模型 API Key（如 Gemini / OpenAI / DeepSeek），可在此填写以解锁无上限的云端实时作文深度精批与口语润色建议。您的 API Key 仅保存在浏览器本地，绝不上云。
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">模型服务商</label>
            <select
              v-model="formData.apiProvider"
              class="w-full px-3.5 py-2 text-xs border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI (GPT-4o)</option>
              <option value="deepseek">DeepSeek API</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-medium text-[#86868b] mb-1.5">API Key 密钥</label>
            <input
              v-model="formData.apiKey"
              type="password"
              placeholder="AIzaSy... 或 sk-..."
              class="w-full px-3.5 py-2 text-xs font-mono border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#0071e3] bg-[#f5f5f7] focus:bg-white text-[#1d1d1f]"
            />
          </div>
        </div>
      </div>

      <!-- Save button -->
      <div class="flex items-center justify-end gap-3">
        <span v-if="savedSuccess" class="text-xs text-[#34c759] font-medium flex items-center gap-1">
          <Check class="w-4 h-4" /> 设置已成功保存！
        </span>
        <button
          type="submit"
          class="px-6 py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium rounded-full shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer active:scale-98"
        >
          <Save class="w-3.5 h-3.5" />
          <span>保存偏好设置</span>
        </button>
      </div>
    </form>

    <!-- Local Sandboxed Data Vault & Backup -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
      <div class="flex items-center justify-between border-b border-black/[0.04] pb-3">
        <h2 class="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
          <HardDrive class="w-4 h-4 text-[#0071e3]" />
          <span>本地独立数据保险箱 (Local Sandboxed Vault)</span>
        </h2>
        <span class="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
          物理隔离保障
        </span>
      </div>

      <p class="text-xs text-[#86868b] leading-relaxed font-normal">
        系统实行【<strong>数据存储在本地设备、网站仅保留用户标记</strong>】的安全机制。学员的所有成绩、错题本、写作批改与词汇进度均被物理隔离存储在您的本地浏览器沙箱中。不同学员之间的数据绝不混淆或混用。
      </p>

      <!-- Local Vault Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
        <div class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02]">
          <div class="text-[11px] text-[#86868b]">本地模考场次</div>
          <div class="text-base font-semibold text-[#1d1d1f] mt-0.5">{{ vaultStats.testCount }} 套</div>
        </div>

        <div class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02]">
          <div class="text-[11px] text-[#86868b]">本地沉淀错题</div>
          <div class="text-base font-semibold text-[#1d1d1f] mt-0.5">{{ vaultStats.mistakeCount }} 题</div>
        </div>

        <div class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02]">
          <div class="text-[11px] text-[#86868b]">记忆词汇记录</div>
          <div class="text-base font-semibold text-[#1d1d1f] mt-0.5">{{ vaultStats.vocabCount }} 词</div>
        </div>

        <div class="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02]">
          <div class="text-[11px] text-[#86868b]">沙箱空间占用</div>
          <div class="text-base font-semibold text-[#0071e3] mt-0.5">{{ (vaultStats.vaultSizeBytes / 1024).toFixed(1) }} KB</div>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            @click="handleExport"
            class="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer border border-black/[0.04]"
          >
            <Download class="w-3.5 h-3.5 text-[#0071e3]" />
            <span>导出专属数据包 (JSON)</span>
          </button>

          <label class="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer border border-black/[0.04]">
            <Upload class="w-3.5 h-3.5 text-emerald-600" />
            <span>导入数据包恢复</span>
            <input
              type="file"
              accept=".json"
              @change="handleImportFile"
              class="hidden"
            />
          </label>
        </div>

        <button
          type="button"
          @click="handleResetLocalVault"
          class="px-3.5 py-2 text-xs text-[#86868b] hover:text-[#ff3b30] hover:bg-red-50 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          title="清空当前账号在本地的错题与成绩"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>重置当前沙箱数据</span>
        </button>
      </div>

      <div v-if="importStatus" class="text-xs font-medium text-[#0071e3] bg-[#0071e3]/10 p-3 rounded-2xl border border-[#0071e3]/20 animate-fadeIn">
        {{ importStatus }}
      </div>
    </div>

    <!-- Admin Console Entrance Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-[#1d1d1f]" />
          <h2 class="text-sm font-semibold text-[#1d1d1f]">后台管理控制台 (Admin Console)</h2>
          <span class="px-2 py-0.5 rounded-full bg-black/[0.04] text-[10px] font-mono text-[#86868b]">/admin</span>
        </div>
        <p class="text-xs text-[#86868b]">
          管理员专属面板：监控全员学习数据、管理剑桥真题库、查看艾宾浩斯记忆模型及全系统灾备导出。
        </p>
      </div>

      <button
        type="button"
        @click="emit('openAdmin')"
        class="px-5 py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-full shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
      >
        <span>进入管理控制台</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
