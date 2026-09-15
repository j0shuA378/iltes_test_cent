<script setup lang="ts">
import { ref, watch } from 'vue';
import { 
  X, 
  User, 
  Lock, 
  Check, 
  Users, 
  PlusCircle, 
  LogIn, 
  ArrowRight, 
  AlertCircle
} from 'lucide-vue-next';
import { 
  getAccounts, 
  getActiveUser, 
  setActiveUser, 
  registerUser, 
  loginUser, 
  AVATAR_OPTIONS 
} from '../../services/authService';
import type { UserAccount } from '../../types/auth';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  initialMode?: 'switch' | 'register' | 'login';
}>(), {
  initialMode: 'switch'
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'authSuccess', user: UserAccount): void;
  (e: 'userSwitched'): void;
  (e: 'userRegistered', user: UserAccount): void;
}>();

const mode = ref<'switch' | 'register' | 'login'>(props.initialMode);
const accounts = ref<UserAccount[]>(getAccounts());
const activeUser = ref<UserAccount>(getActiveUser());

// Register form
const regUsername = ref('');
const regDisplayName = ref('');
const regAvatar = ref('🎓');
const regTargetBand = ref<number>(7.0);
const regDays = ref<number>(178);
const regPassword = ref('');
const regError = ref('');

// Login form
const loginUsername = ref('');
const loginPassword = ref('');
const loginError = ref('');

watch(() => props.isOpen, (open) => {
  if (open) {
    mode.value = props.initialMode;
    accounts.value = getAccounts();
    activeUser.value = getActiveUser();
    regError.value = '';
    loginError.value = '';
  }
});

const handleNotifySuccess = (user: UserAccount) => {
  emit('authSuccess', user);
  emit('userSwitched');
};

const handleSwitch = (userId: string) => {
  try {
    const user = setActiveUser(userId);
    handleNotifySuccess(user);
    emit('close');
  } catch (e: any) {
    alert(e.message || '切换失败');
  }
};

const handleRegister = () => {
  regError.value = '';

  if (!regUsername.value.trim()) {
    regError.value = '请输入用户名';
    return;
  }

  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + regDays.value);

    const user = registerUser({
      username: regUsername.value,
      displayName: regDisplayName.value || regUsername.value,
      avatar: regAvatar.value,
      currentBand: 0, // All registered users start with baseline 0
      targetBand: regTargetBand.value,
      examDate: futureDate.toISOString().split('T')[0],
      password: regPassword.value || undefined
    });

    accounts.value = getAccounts();
    handleNotifySuccess(user);
    emit('userRegistered', user);
    emit('close');
  } catch (e: any) {
    regError.value = e.message || '注册失败';
  }
};

const handleLogin = () => {
  loginError.value = '';

  if (!loginUsername.value.trim()) {
    loginError.value = '请输入用户名';
    return;
  }

  const res = loginUser(loginUsername.value, loginPassword.value || undefined);
  if (res.success && res.user) {
    accounts.value = getAccounts();
    handleNotifySuccess(res.user);
    emit('close');
  } else {
    loginError.value = res.error || '登录失败';
  }
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none"
    @click.self="emit('close')"
  >
    <div 
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-[0_24px_70px_rgba(0,0,0,0.14)] border border-black/[0.06] overflow-hidden flex flex-col animate-scaleUp max-h-[90vh]"
      @click.stop
    >
      <!-- Header (Apple Sheet Style) -->
      <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-black/[0.04]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center text-xl">
            {{ activeUser.avatar }}
          </div>
          <div>
            <h2 class="font-semibold text-base text-[#1d1d1f]">学员中心 · 独立数据空间</h2>
            <p class="text-xs text-[#86868b] mt-0.5">每位学员拥有独立的做题成绩、错题本与记忆档案</p>
          </div>
        </div>
        <button 
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Apple Segmented Control -->
      <div class="px-5 sm:px-6 pt-3 pb-1 shrink-0">
        <div class="flex p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
          <button
            @click="mode = 'switch'"
            :class="[
              'flex-1 py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              mode === 'switch' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <Users class="w-3.5 h-3.5" />
            <span>切换学员 ({{ accounts.length }})</span>
          </button>

          <button
            @click="mode = 'register'"
            :class="[
              'flex-1 py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              mode === 'register' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <PlusCircle class="w-3.5 h-3.5" />
            <span>注册新账号</span>
          </button>

          <button
            @click="mode = 'login'"
            :class="[
              'flex-1 py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              mode === 'login' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <LogIn class="w-3.5 h-3.5" />
            <span>密码登录</span>
          </button>
        </div>
      </div>

      <!-- Content Body -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-4">
        <!-- MODE: SWITCH ACCOUNTS -->
        <div v-if="mode === 'switch'" class="space-y-2.5">
          <div class="text-xs text-[#86868b] mb-2 font-normal">
            轻点切换进入学员专属档案（数据完全物理隔离）：
          </div>

          <div 
            v-for="acc in accounts"
            :key="acc.id"
            @click="handleSwitch(acc.id)"
            :class="[
              'p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer',
              acc.id === activeUser.id
                ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/15 shadow-sm'
                : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border-transparent'
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white border border-black/[0.04] shadow-2xs flex items-center justify-center text-xl shrink-0">
                {{ acc.avatar }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-sm text-[#1d1d1f]">{{ acc.displayName }}</span>
                  <span class="text-[11px] text-[#86868b]">(@{{ acc.username }})</span>
                  <span v-if="acc.id === activeUser.id" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3] text-white">
                    当前使用
                  </span>
                </div>
                <div class="text-xs text-[#86868b] mt-0.5 flex items-center gap-2 font-normal">
                  <span>{{ acc.currentBand === 0 ? '待定级 (Band 0.0)' : `基础 Band ${acc.currentBand.toFixed(1)}` }}</span>
                  <span>➔</span>
                  <span class="text-[#1d1d1f] font-medium">目标 Band {{ acc.targetBand.toFixed(1) }}</span>
                  <span class="text-[#86868b]">· 考期 {{ acc.examDate }}</span>
                </div>
              </div>
            </div>

            <div class="shrink-0">
              <Check v-if="acc.id === activeUser.id" class="w-5 h-5 text-[#0071e3]" />
              <ArrowRight v-else class="w-4 h-4 text-[#86868b]" />
            </div>
          </div>

          <div class="pt-2">
            <button
              @click="mode = 'register'"
              class="w-full py-2.5 rounded-full border border-dashed border-black/[0.15] hover:border-[#0071e3] text-[#86868b] hover:text-[#0071e3] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle class="w-4 h-4" />
              <span>添加新的学员档案</span>
            </button>
          </div>
        </div>

        <!-- MODE: REGISTER NEW USER -->
        <form v-if="mode === 'register'" @submit.prevent="handleRegister" class="space-y-4 text-sm">
          <div v-if="regError" class="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-xs rounded-2xl border border-[#ff3b30]/20 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ regError }}</span>
          </div>

          <!-- Avatar Picker -->
          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-2">
              选择个性化专属头像
            </label>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="opt in AVATAR_OPTIONS"
                :key="opt.id"
                type="button"
                @click="regAvatar = opt.emoji"
                :class="[
                  'w-10 h-10 rounded-2xl border flex items-center justify-center text-lg transition-all cursor-pointer',
                  regAvatar === opt.emoji
                    ? 'border-[#0071e3] bg-[#0071e3]/10 ring-2 ring-[#0071e3]/20 scale-105'
                    : 'border-black/[0.06] hover:bg-[#f5f5f7]'
                ]"
                :title="opt.label"
              >
                {{ opt.emoji }}
              </button>
            </div>
          </div>

          <!-- Username & Nickname -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
                登录用户名 <span class="text-[#ff3b30]">*</span>
              </label>
              <input
                v-model="regUsername"
                type="text"
                required
                placeholder="如: Alex_IELTS"
                class="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl p-2.5 text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
                显示昵称 (可选)
              </label>
              <input
                v-model="regDisplayName"
                type="text"
                placeholder="如: Alex · 冲刺牛津"
                class="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl p-2.5 text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-normal"
              />
            </div>
          </div>

          <!-- Score Settings -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02]">
            <div>
              <label class="block text-[11px] font-medium text-[#86868b] mb-1">
                初始成绩起点
              </label>
              <div class="w-full bg-white border border-black/[0.06] rounded-xl p-2 text-xs font-semibold text-[#1d1d1f] flex items-center justify-between shadow-2xs">
                <span>Band 0.0</span>
                <span class="text-[10px] font-normal text-[#86868b]">注册后测验定级</span>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-medium text-[#86868b] mb-1">
                冲刺目标分
              </label>
              <select
                v-model.number="regTargetBand"
                class="w-full bg-white border border-black/[0.06] rounded-xl p-2 text-xs font-semibold focus:outline-none text-[#1d1d1f]"
              >
                <option :value="6.0">Band 6.0</option>
                <option :value="6.5">Band 6.5</option>
                <option :value="7.0">Band 7.0 (推荐)</option>
                <option :value="7.5">Band 7.5</option>
                <option :value="8.0">Band 8.0</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-medium text-[#86868b] mb-1">
                备考周期
              </label>
              <select
                v-model.number="regDays"
                class="w-full bg-white border border-black/[0.06] rounded-xl p-2 text-xs font-semibold focus:outline-none"
              >
                <option :value="60">60 天 (急速冲刺)</option>
                <option :value="90">90 天 (强化突破)</option>
                <option :value="120">120 天 (阶段进阶)</option>
                <option :value="178">178 天 (4分升7分)</option>
              </select>
            </div>
          </div>

          <!-- Optional Password -->
          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
              密码保护 (可选，防止他人误登)
            </label>
            <div class="relative">
              <Lock class="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
              <input
                v-model="regPassword"
                type="password"
                placeholder="如需隐私保护请设置密码，无需可留空"
                class="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-normal"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <PlusCircle class="w-4 h-4" />
              <span>立即创建并开启专属备考</span>
            </button>
          </div>
        </form>

        <!-- MODE: LOGIN -->
        <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4 text-sm">
          <div v-if="loginError" class="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-xs rounded-2xl border border-[#ff3b30]/20 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ loginError }}</span>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
              用户名
            </label>
            <div class="relative">
              <User class="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
              <input
                v-model="loginUsername"
                type="text"
                required
                placeholder="输入您的学员用户名"
                class="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
              密码 (如注册时未设则留空)
            </label>
            <div class="relative">
              <Lock class="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
              <input
                v-model="loginPassword"
                type="password"
                placeholder="输入密码（未设密码请留空）"
                class="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-normal"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <LogIn class="w-4 h-4" />
              <span>验证并登录</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
