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
  AlertCircle,
  Trash2,
  LogOut,
  ShieldCheck,
  Key,
  Copy,
  CheckCircle2,
  HardDrive
} from 'lucide-vue-next';
import { 
  getAccounts, 
  getActiveUser, 
  setActiveUser, 
  registerUser, 
  loginUser, 
  removeAccount,
  logoutActiveUser,
  recoverUserByToken,
  AVATAR_OPTIONS 
} from '../../services/authService';
import type { UserAccount } from '../../types/auth';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  initialMode?: 'switch' | 'register' | 'login' | 'recover';
}>(), {
  initialMode: 'switch'
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'authSuccess', user: UserAccount): void;
  (e: 'userSwitched'): void;
  (e: 'userRegistered', user: UserAccount): void;
}>();

const mode = ref<'switch' | 'register' | 'login' | 'recover'>(props.initialMode);
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
const registeredUser = ref<UserAccount | null>(null);
const copySuccess = ref(false);

// Login form
const loginUsername = ref('');
const loginPassword = ref('');
const loginError = ref('');

// Recover form
const recoverInput = ref('');
const recoverError = ref('');

// Password prompt when switching into a password-protected account
const verifyPasswordAccount = ref<UserAccount | null>(null);
const verifyPasswordInput = ref('');
const verifyPasswordError = ref('');

watch(() => props.isOpen, (open) => {
  if (open) {
    mode.value = props.initialMode;
    accounts.value = getAccounts();
    activeUser.value = getActiveUser();
    regError.value = '';
    loginError.value = '';
    recoverError.value = '';
    recoverInput.value = '';
    registeredUser.value = null;
    copySuccess.value = false;
    verifyPasswordAccount.value = null;
    verifyPasswordInput.value = '';
    verifyPasswordError.value = '';
  }
});

const handleNotifySuccess = (user: UserAccount) => {
  emit('authSuccess', user);
  emit('userSwitched');
};

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  copySuccess.value = true;
  setTimeout(() => {
    copySuccess.value = false;
  }, 2000);
};

const handleSwitch = (acc: UserAccount) => {
  if (acc.id === activeUser.value.id) return;

  // If the target account is password-protected, prompt for password first
  if (acc.passwordHash) {
    verifyPasswordAccount.value = acc;
    verifyPasswordInput.value = '';
    verifyPasswordError.value = '';
    return;
  }

  try {
    const user = setActiveUser(acc.id);
    activeUser.value = user;
    handleNotifySuccess(user);
    emit('close');
  } catch (e: any) {
    alert(e.message || '切换失败');
  }
};

const handleVerifyPasswordSwitch = () => {
  if (!verifyPasswordAccount.value) return;
  verifyPasswordError.value = '';

  const target = verifyPasswordAccount.value;
  if (target.passwordHash && btoa(verifyPasswordInput.value) !== target.passwordHash) {
    verifyPasswordError.value = '密码不正确，请重新输入';
    return;
  }

  try {
    const user = setActiveUser(target.id);
    activeUser.value = user;
    verifyPasswordAccount.value = null;
    handleNotifySuccess(user);
    emit('close');
  } catch (e: any) {
    verifyPasswordError.value = e.message || '切换失败';
  }
};

const handleDelete = (acc: UserAccount) => {
  if (acc.id === 'user_guest') {
    alert('访客学员为系统预设沙箱，无需删除。');
    return;
  }

  if (!confirm(`确定要从此设备移除学员【${acc.displayName}】(@${acc.username}) 吗？\n该学员在当前设备的本地做题成绩与错题将一并安全擦除。`)) {
    return;
  }

  const res = removeAccount(acc.id);
  if (res.success && res.newActiveUser) {
    accounts.value = getAccounts();
    activeUser.value = res.newActiveUser;
    handleNotifySuccess(res.newActiveUser);
  }
};

const handleLogout = () => {
  const guest = logoutActiveUser();
  accounts.value = getAccounts();
  activeUser.value = guest;
  handleNotifySuccess(guest);
  emit('close');
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
    activeUser.value = user;
    registeredUser.value = user;
    handleNotifySuccess(user);
    emit('userRegistered', user);
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
    activeUser.value = res.user;
    handleNotifySuccess(res.user);
    emit('close');
  } else {
    loginError.value = res.error || '登录失败';
  }
};

const handleRecover = () => {
  recoverError.value = '';

  if (!recoverInput.value.trim()) {
    recoverError.value = '请输入专属恢复标记或用户名';
    return;
  }

  const res = recoverUserByToken(recoverInput.value.trim());
  if (res.success && res.user) {
    accounts.value = getAccounts();
    activeUser.value = res.user;
    handleNotifySuccess(res.user);
    emit('close');
  } else {
    recoverError.value = res.error || '未找到对应学员本地档案';
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
      class="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-[0_24px_70px_rgba(0,0,0,0.14)] border border-black/[0.06] overflow-hidden flex flex-col animate-scaleUp max-h-[90vh] relative"
      @click.stop
    >
      <!-- Sub-dialog: Password verification modal when switching -->
      <div 
        v-if="verifyPasswordAccount"
        class="absolute inset-0 bg-white/95 backdrop-blur-2xl z-30 p-6 flex flex-col justify-center items-center text-center animate-fadeIn"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center mb-3 shadow-sm">
          <Lock class="w-5 h-5" />
        </div>
        <h3 class="text-base font-semibold text-[#1d1d1f]">验证安全密码</h3>
        <p class="text-xs text-[#86868b] mt-1 max-w-xs">
          学员 <strong>@{{ verifyPasswordAccount.username }}</strong> 已开启密码保护，请输入密码以切换档案：
        </p>

        <form @submit.prevent="handleVerifyPasswordSwitch" class="w-full max-w-xs mt-4 space-y-3">
          <div>
            <input
              v-model="verifyPasswordInput"
              type="password"
              placeholder="请输入密码"
              autofocus
              required
              class="w-full px-4 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs text-center focus:bg-white focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div v-if="verifyPasswordError" class="text-xs text-[#ff3b30] font-medium">
            {{ verifyPasswordError }}
          </div>

          <div class="flex items-center gap-2 pt-1">
            <button
              type="button"
              @click="verifyPasswordAccount = null"
              class="flex-1 py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs text-[#1d1d1f] font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              class="flex-1 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              验证切换
            </button>
          </div>
        </form>
      </div>

      <!-- Header (Apple Sheet Style) -->
      <div class="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-black/[0.04]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center text-xl">
            {{ activeUser.avatar }}
          </div>
          <div>
            <h2 class="font-semibold text-base text-[#1d1d1f]">学员中心 · 本地数据空间</h2>
            <p class="text-xs text-[#86868b] mt-0.5">数据存储在本地设备，网站仅保留恢复标记防串号</p>
          </div>
        </div>
        <button 
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Apple Segmented Control (4 Tabs) -->
      <div v-if="!registeredUser" class="px-5 sm:px-6 pt-3 pb-1 shrink-0">
        <div class="grid grid-cols-4 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
          <button
            @click="mode = 'switch'"
            :class="[
              'py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1 cursor-pointer text-center',
              mode === 'switch' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <Users class="w-3.5 h-3.5 hidden sm:inline" />
            <span>切换 ({{ accounts.length }})</span>
          </button>

          <button
            @click="mode = 'register'"
            :class="[
              'py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1 cursor-pointer text-center',
              mode === 'register' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <PlusCircle class="w-3.5 h-3.5 hidden sm:inline" />
            <span>注册新学员</span>
          </button>

          <button
            @click="mode = 'login'"
            :class="[
              'py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1 cursor-pointer text-center',
              mode === 'login' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <LogIn class="w-3.5 h-3.5 hidden sm:inline" />
            <span>密码登录</span>
          </button>

          <button
            @click="mode = 'recover'"
            :class="[
              'py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1 cursor-pointer text-center',
              mode === 'recover' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            ]"
          >
            <Key class="w-3.5 h-3.5 hidden sm:inline" />
            <span>标记恢复</span>
          </button>
        </div>
      </div>

      <!-- Content Body -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-4">
        <!-- SUCCESS CARD: POST-REGISTRATION CELEBRATION -->
        <div v-if="registeredUser" class="space-y-4 animate-scaleUp text-center py-2">
          <div class="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
            <CheckCircle2 class="w-7 h-7" />
          </div>

          <div>
            <h3 class="text-base font-semibold text-[#1d1d1f]">学员档案注册成功！</h3>
            <p class="text-xs text-[#86868b] mt-1">
              已为您在当前设备本地分配独立的加密数据沙箱，初始成绩已设为 <strong>0.0</strong>。
            </p>
          </div>

          <!-- User Recovery Token Card -->
          <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] text-left space-y-2">
            <div class="flex items-center justify-between text-xs text-[#86868b]">
              <span class="flex items-center gap-1 font-medium text-[#1d1d1f]">
                <Key class="w-3.5 h-3.5 text-[#0071e3]" />
                您的专属数据恢复标记 (Recovery Token)
              </span>
              <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                本地隔离
              </span>
            </div>

            <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-black/[0.06]">
              <span class="font-mono text-base font-semibold text-[#0071e3] tracking-wide select-all">
                {{ registeredUser.recoveryToken }}
              </span>
              <button
                type="button"
                @click="handleCopy(registeredUser.recoveryToken)"
                class="px-3 py-1.5 rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs text-[#1d1d1f] font-medium flex items-center gap-1 transition-all cursor-pointer"
              >
                <Check v-if="copySuccess" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5 text-[#86868b]" />
                <span>{{ copySuccess ? '已复制' : '复制标记' }}</span>
              </button>
            </div>

            <p class="text-[11px] text-[#86868b] leading-relaxed">
              💡 <strong>重要保障</strong>：您的所有模考成绩、错题本与词汇数据均储存在当前电脑本地，网站仅保留此恢复标记。不同学员间数据物理隔离，永不混淆。如更换设备或恢复数据，可随时凭此标记找回。
            </p>
          </div>

          <div class="pt-2">
            <button
              type="button"
              @click="emit('close')"
              class="w-full py-2.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>立即进入备考工作台</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- MODE: SWITCH ACCOUNTS -->
        <div v-else-if="mode === 'switch'" class="space-y-2.5">
          <div class="text-xs text-[#86868b] mb-2 font-normal flex items-center justify-between">
            <span>本设备已就绪的学员本地沙箱（数据物理隔离）：</span>
            <span class="text-[10px] text-emerald-600 font-medium">🔒 绝不混用</span>
          </div>

          <div 
            v-for="acc in accounts"
            :key="acc.id"
            @click="handleSwitch(acc)"
            :class="[
              'p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group',
              acc.id === activeUser.id
                ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/15 shadow-sm'
                : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border-transparent'
            ]"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-2xl bg-white border border-black/[0.04] shadow-2xs flex items-center justify-center text-xl shrink-0">
                {{ acc.avatar }}
              </div>
              <div class="min-w-0 truncate">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-sm text-[#1d1d1f] truncate">{{ acc.displayName }}</span>
                  <span class="text-[11px] text-[#86868b] shrink-0">(@{{ acc.username }})</span>
                  <span v-if="acc.id === activeUser.id" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3] text-white shrink-0">
                    当前使用
                  </span>
                  <span v-if="acc.id === 'user_guest'" class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/[0.05] text-[#86868b] shrink-0">
                    访客
                  </span>
                </div>
                <div class="text-xs text-[#86868b] mt-0.5 flex items-center gap-2 font-normal truncate">
                  <span>{{ acc.currentBand === 0 ? '待定级 (0.0)' : `基础 Band ${acc.currentBand.toFixed(1)}` }}</span>
                  <span>➔</span>
                  <span class="text-[#1d1d1f] font-medium">目标 Band {{ acc.targetBand.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/80 border border-black/[0.04] text-[#86868b]">
                    标记: {{ acc.recoveryToken || 'MK-LOCAL' }}
                  </span>
                  <span v-if="acc.passwordHash" class="text-[10px] text-amber-600 flex items-center gap-0.5">
                    <Lock class="w-2.5 h-2.5" /> 密保
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0 pl-2">
              <button
                v-if="acc.id !== activeUser.id && acc.id !== 'user_guest'"
                type="button"
                @click.stop="handleDelete(acc)"
                class="p-2 rounded-xl text-[#86868b] hover:text-[#ff3b30] hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="移除该学员的本地存储"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>

              <div 
                v-if="acc.id === activeUser.id"
                class="w-7 h-7 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center"
              >
                <Check class="w-4 h-4" />
              </div>
            </div>
          </div>

          <!-- Bottom Action: Sign out to Guest -->
          <div v-if="activeUser.id !== 'user_guest'" class="pt-3 border-t border-black/[0.04] flex items-center justify-between">
            <span class="text-xs text-[#86868b]">退出当前学员并返回通用访客模式：</span>
            <button
              type="button"
              @click="handleLogout"
              class="px-3.5 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-[#ff3b30] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 border border-black/[0.04]"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>

        <!-- MODE: REGISTER -->
        <form v-else-if="mode === 'register'" @submit.prevent="handleRegister" class="space-y-3.5 text-sm">
          <div v-if="regError" class="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-xs rounded-2xl border border-[#ff3b30]/20 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ regError }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
                登录用户名 <span class="text-[#ff3b30]">*</span>
              </label>
              <input
                v-model="regUsername"
                type="text"
                required
                placeholder="例如: alex_ielts"
                class="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
                备考昵称 (选填)
              </label>
              <input
                v-model="regDisplayName"
                type="text"
                placeholder="例如: Alex 李同学"
                class="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none"
              />
            </div>
          </div>

          <!-- Avatar Select -->
          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-1.5">
              学员专属徽章
            </label>
            <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
              <button
                v-for="av in AVATAR_OPTIONS"
                :key="av.id"
                type="button"
                @click="regAvatar = av.emoji"
                :class="[
                  'h-10 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer',
                  regAvatar === av.emoji 
                    ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-2xs' 
                    : 'bg-[#f5f5f7] border-transparent hover:bg-[#e8e8ed]'
                ]"
                :title="av.label"
              >
                {{ av.emoji }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
                目标雅思总分
              </label>
              <select
                v-model.number="regTargetBand"
                class="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
              >
                <option :value="6.0">Band 6.0 (合格水平)</option>
                <option :value="6.5">Band 6.5 (英澳授课标配)</option>
                <option :value="7.0">Band 7.0 (世界前50名校)</option>
                <option :value="7.5">Band 7.5 (牛剑G5硬通货)</option>
                <option :value="8.0">Band 8.0 (极高分精英)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
                备考周期规划
              </label>
              <select
                v-model.number="regDays"
                class="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
              >
                <option :value="60">60 天 (急速冲刺)</option>
                <option :value="90">90 天 (强化突破)</option>
                <option :value="120">120 天 (阶段进阶)</option>
                <option :value="178">178 天 (零基础升7分)</option>
              </select>
            </div>
          </div>

          <!-- Optional Password -->
          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
              密码保护 (可选，防止其他人在当前电脑切换您的档案)
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
              <span>创建学员档案并生成专属恢复标记</span>
            </button>
          </div>
        </form>

        <!-- MODE: LOGIN -->
        <form v-else-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4 text-sm">
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
                placeholder="输入已在本机注册的用户名"
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

        <!-- MODE: RECOVER BY TOKEN -->
        <form v-else-if="mode === 'recover'" @submit.prevent="handleRecover" class="space-y-4 text-sm">
          <div v-if="recoverError" class="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-xs rounded-2xl border border-[#ff3b30]/20 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ recoverError }}</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1.5">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f]">
              <HardDrive class="w-3.5 h-3.5 text-[#0071e3]" />
              <span>通过恢复标记找回本地数据</span>
            </div>
            <p class="text-xs text-[#86868b] leading-relaxed">
              数据储存在您的本地设备中，网站仅保留恢复标记用于数据绑定。请输入注册时生成的标记（如 <code>MK-8E2A-9D4F</code>）或用户名，即可立刻唤醒并恢复您的专属做题与错题沙箱。
            </p>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1d1d1f] mb-1">
              专属恢复标记或注册用户名
            </label>
            <div class="relative">
              <Key class="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
              <input
                v-model="recoverInput"
                type="text"
                required
                placeholder="例如: MK-8E2A-9D4F 或 用户名"
                class="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs font-mono focus:bg-white focus:border-[#0071e3] focus:outline-none"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="w-full py-2.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Key class="w-4 h-4" />
              <span>一键恢复并绑定本地数据</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
