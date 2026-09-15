<script setup lang="ts">
import { ref, watch } from 'vue';
import { 
  Settings, 
  Target, 
  Calendar, 
  Download, 
  Upload, 
  Save, 
  Check, 
  Sparkles
} from 'lucide-vue-next';
import type { UserProfile } from '../../types/ielts';
import { saveUserProfile, exportBackupData, importBackupData } from '../../services/storage';

const props = defineProps<{
  profile: UserProfile;
}>();

const emit = defineEmits<{
  (e: 'updateProfile', p: UserProfile): void;
}>();

const formData = ref<UserProfile>({ ...props.profile });
const savedSuccess = ref(false);
const importStatus = ref<string | null>(null);

watch(() => props.profile, (newP) => {
  formData.value = { ...newP };
}, { deep: true });

const handleSave = () => {
  saveUserProfile(formData.value);
  emit('updateProfile', formData.value);
  savedSuccess.value = true;
  setTimeout(() => {
    savedSuccess.value = false;
  }, 2500);
};

const handleExport = () => {
  const dataStr = exportBackupData();
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ielts_master_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

const handleImportFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result as string;
    const success = importBackupData(content);
    if (success) {
      importStatus.value = '备份数据恢复成功！刷新页面即可生效。';
      setTimeout(() => window.location.reload(), 1500);
    } else {
      importStatus.value = '恢复失败，文件格式有误。';
    }
  };
  reader.readAsText(file);
};
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-12">
    <!-- Header -->
    <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
          <Settings class="w-4 h-4" />
          <span>IELTS Candidate Preferences & Profile</span>
        </div>
        <h1 class="text-xl font-extrabold text-white">
          目标设置与数据备份
        </h1>
        <span class="text-xs text-slate-400 mt-0.5 inline-block">
          个性化定制备考倒计时、目标小分与离线数据安全存储
        </span>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Exam Goals Card -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Target class="w-5 h-5 text-emerald-600" />
          目标分数设定 (Target Band Scores)
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">目标总分 (Overall)</label>
            <input
              v-model.number="formData.targetOverall"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">听力 (Listening)</label>
            <input
              v-model.number="formData.targetListening"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">阅读 (Reading)</label>
            <input
              v-model.number="formData.targetReading"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">写作 (Writing)</label>
            <input
              v-model.number="formData.targetWriting"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">口语 (Speaking)</label>
            <input
              v-model.number="formData.targetSpeaking"
              type="number"
              step="0.5"
              min="4.0"
              max="9.0"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      <!-- Date and Daily Routine -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar class="w-5 h-5 text-amber-500" />
          考试日期与每日打卡目标
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">雅思官方机考报名日期</label>
            <input
              v-model="formData.examDate"
              type="date"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">每日计划浸泡时长 (分钟)</label>
            <input
              v-model.number="formData.dailyGoalMinutes"
              type="number"
              min="30"
              max="480"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      <!-- AI Key Configuration (Optional) -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles class="w-5 h-5 text-indigo-600" />
          AI 智能考官扩展配置（可选）
        </h2>
        <p class="text-xs text-slate-500 leading-relaxed">
          平台内置了考官标准离线启发式评估引擎。若您拥有自定义大模型 API Key（如 Gemini / OpenAI / DeepSeek），可在此填写以解锁无上限的云端实时作文深度精批与口语润色建议。您的 API Key 仅保存在浏览器本地，绝不上云。
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">模型服务商</label>
            <select
              v-model="formData.apiProvider"
              class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI (GPT-4o)</option>
              <option value="deepseek">DeepSeek API</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-medium text-slate-700 mb-1">API Key 密钥</label>
            <input
              v-model="formData.apiKey"
              type="password"
              placeholder="AIzaSy... 或 sk-..."
              class="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <!-- Save button -->
      <div class="flex items-center justify-end gap-3">
        <span v-if="savedSuccess" class="text-xs text-emerald-600 font-bold flex items-center gap-1">
          <Check class="w-4 h-4" /> 设置已成功保存！
        </span>
        <button
          type="submit"
          class="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save class="w-4 h-4" />
          <span>保存偏好设置</span>
        </button>
      </div>
    </form>

    <!-- Data Backup & Restore -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        数据备份与恢复 (本地离线优先)
      </h2>
      <p class="text-xs text-slate-500">
        您的做题成绩、错题本、写作草稿和单词掌握状态均安全存储在您的本地浏览器中。您可以随时导出 JSON 备份文件或在其他设备上恢复。
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          @click="handleExport"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download class="w-4 h-4" />
          <span>一键导出数据备份 (JSON)</span>
        </button>

        <label class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
          <Upload class="w-4 h-4" />
          <span>导入备份文件</span>
          <input
            type="file"
            accept=".json"
            @change="handleImportFile"
            class="hidden"
          />
        </label>
      </div>

      <div v-if="importStatus" class="text-xs font-bold text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
        {{ importStatus }}
      </div>
    </div>
  </div>
</template>
