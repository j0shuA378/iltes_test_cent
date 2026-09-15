import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Target, 
  Check, 
  Users, 
  PlusCircle, 
  LogIn, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { 
  getAccounts, 
  getActiveUser, 
  setActiveUser, 
  registerUser, 
  loginUser, 
  AVATAR_OPTIONS 
} from '../../services/authService';
import { UserAccount } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'switch' | 'register' | 'login';
  onAuthSuccess?: (user: UserAccount) => void;
  onUserSwitched?: () => void;
  onUserRegistered?: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'switch',
  onAuthSuccess,
  onUserSwitched,
  onUserRegistered
}) => {
  const [mode, setMode] = useState<'switch' | 'register' | 'login'>(initialMode);
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getAccounts());
  const activeUser = getActiveUser();

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regAvatar, setRegAvatar] = useState('🎓');
  const [regTargetBand, setRegTargetBand] = useState<number>(7.0);
  const [regDays, setRegDays] = useState<number>(178);
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleNotifySuccess = (user: UserAccount) => {
    if (onAuthSuccess) onAuthSuccess(user);
    if (onUserSwitched) onUserSwitched();
  };

  const handleSwitch = (userId: string) => {
    try {
      const user = setActiveUser(userId);
      handleNotifySuccess(user);
      onClose();
    } catch (e: any) {
      alert(e.message || '切换失败');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername.trim()) {
      setRegError('请输入用户名');
      return;
    }

    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + regDays);

      const user = registerUser({
        username: regUsername,
        displayName: regDisplayName || regUsername,
        avatar: regAvatar,
        currentBand: 0, // All registered users start with baseline 0
        targetBand: regTargetBand,
        examDate: futureDate.toISOString().split('T')[0],
        password: regPassword || undefined
      });

      setAccounts(getAccounts());
      handleNotifySuccess(user);
      if (onUserRegistered) {
        onUserRegistered(user);
      }
      onClose();
    } catch (e: any) {
      setRegError(e.message || '注册失败');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim()) {
      setLoginError('请输入用户名');
      return;
    }

    const res = loginUser(loginUsername, loginPassword || undefined);
    if (res.success && res.user) {
      setAccounts(getAccounts());
      handleNotifySuccess(res.user);
      onClose();
    } else {
      setLoginError(res.error || '登录失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div 
        className="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-[0_24px_70px_rgba(0,0,0,0.14)] border border-black/[0.06] overflow-hidden flex flex-col animate-scaleUp max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Apple Sheet Style) */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-black/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center text-xl">
              {activeUser.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#1d1d1f]">学员中心 · 独立数据空间</h2>
              <p className="text-xs text-[#86868b] mt-0.5">每位学员拥有独立的做题成绩、错题本与记忆档案</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Segmented Control */}
        <div className="px-5 sm:px-6 pt-3 pb-1 shrink-0">
          <div className="flex p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
            <button
              onClick={() => setMode('switch')}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'switch' 
                  ? 'bg-white text-[#1d1d1f] shadow-sm' 
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>切换学员 ({accounts.length})</span>
            </button>

            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register' 
                  ? 'bg-white text-[#1d1d1f] shadow-sm' 
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>注册新账号</span>
            </button>

            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-[#1d1d1f] shadow-sm' 
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>密码登录</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* MODE: SWITCH ACCOUNTS */}
          {mode === 'switch' && (
            <div className="space-y-2.5">
              <div className="text-xs text-[#86868b] mb-2 font-normal">
                轻点切换进入学员专属档案（数据完全物理隔离）：
              </div>

              {accounts.map(acc => {
                const isActive = acc.id === activeUser.id;

                return (
                  <div 
                    key={acc.id}
                    onClick={() => handleSwitch(acc.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/15 shadow-sm' 
                        : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.04] shadow-2xs flex items-center justify-center text-xl shrink-0">
                        {acc.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#1d1d1f]">{acc.displayName}</span>
                          <span className="text-[11px] text-[#86868b]">(@{acc.username})</span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3] text-white">
                              当前使用
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#86868b] mt-0.5 flex items-center gap-2 font-normal">
                          <span>{acc.currentBand === 0 ? '待定级 (Band 0.0)' : `基础 Band ${acc.currentBand.toFixed(1)}`}</span>
                          <span>➔</span>
                          <span className="text-[#1d1d1f] font-medium">目标 Band {acc.targetBand.toFixed(1)}</span>
                          <span className="text-[#86868b]">· 考期 {acc.examDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        <Check className="w-5 h-5 text-[#0071e3]" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#86868b]" />
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <button
                  onClick={() => setMode('register')}
                  className="w-full py-2.5 rounded-full border border-dashed border-black/[0.15] hover:border-[#0071e3] text-[#86868b] hover:text-[#0071e3] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>添加新的学员档案</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE: REGISTER NEW USER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-sm">
              {regError && (
                <div className="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-xs rounded-2xl border border-[#ff3b30]/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-2">
                  选择个性化专属头像
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRegAvatar(opt.emoji)}
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                        regAvatar === opt.emoji 
                          ? 'border-[#0071e3] bg-[#0071e3]/10 ring-2 ring-[#0071e3]/20 scale-105' 
                          : 'border-black/[0.06] hover:bg-[#f5f5f7]'
                      }`}
                      title={opt.label}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username & Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                    登录用户名 <span className="text-[#ff3b30]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如: Alex_IELTS"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl p-2.5 text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                    显示昵称 (可选)
                  </label>
                  <input
                    type="text"
                    placeholder="如: Alex · 冲刺牛津"
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl p-2.5 text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-normal"
                  />
                </div>
              </div>

              {/* Score Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02]">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">
                    初始成绩起点
                  </label>
                  <div className="w-full bg-white border border-black/[0.06] rounded-xl p-2 text-xs font-semibold text-[#1d1d1f] flex items-center justify-between shadow-2xs">
                    <span>Band 0.0</span>
                    <span className="text-[10px] font-normal text-[#86868b]">注册后测验定级</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">
                    冲刺目标分
                  </label>
                  <select
                    value={regTargetBand}
                    onChange={(e) => setRegTargetBand(parseFloat(e.target.value))}
                    className="w-full bg-white border border-black/[0.06] rounded-xl p-2 text-xs font-semibold focus:outline-none text-[#1d1d1f]"
                  >
                    <option value={6.0}>Band 6.0</option>
                    <option value={6.5}>Band 6.5</option>
                    <option value={7.0}>Band 7.0 (推荐)</option>
                    <option value={7.5}>Band 7.5</option>
                    <option value={8.0}>Band 8.0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">
                    备考周期
                  </label>
                  <select
                    value={regDays}
                    onChange={(e) => setRegDays(parseInt(e.target.value))}
                    className="w-full bg-white border border-black/[0.06] rounded-xl p-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value={60}>60 天 (急速冲刺)</option>
                    <option value={90}>90 天 (强化突破)</option>
                    <option value={120}>120 天 (阶段进阶)</option>
                    <option value={178}>178 天 (4分升7分)</option>
                  </select>
                </div>
              </div>

              {/* Optional Password */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  密码保护 (可选，防止他人误登)
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="如需隐私保护请设置密码，无需可留空"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-normal"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>立即创建并开启专属备考</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-sm">
              {loginError && (
                <div className="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-xs rounded-2xl border border-[#ff3b30]/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  用户名
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="输入您的学员用户名"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  密码 (如注册时未设则留空)
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="输入密码（未设密码请留空）"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none font-normal"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  <span>验证并登录</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
