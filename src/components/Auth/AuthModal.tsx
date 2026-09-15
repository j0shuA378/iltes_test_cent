import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Target, 
  Sparkles, 
  Check, 
  Users, 
  PlusCircle, 
  LogIn, 
  ArrowRight,
  ShieldCheck,
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
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'switch',
  onAuthSuccess,
  onUserSwitched
}) => {
  const [mode, setMode] = useState<'switch' | 'register' | 'login'>(initialMode);
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getAccounts());
  const activeUser = getActiveUser();

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regAvatar, setRegAvatar] = useState('🎓');
  const [regCurrentBand, setRegCurrentBand] = useState<number>(4.0);
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
        currentBand: regCurrentBand,
        targetBand: regTargetBand,
        examDate: futureDate.toISOString().split('T')[0],
        password: regPassword || undefined
      });

      setAccounts(getAccounts());
      handleNotifySuccess(user);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleUp max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-lg">
              {activeUser.avatar}
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">用户中心 · 独立数据空间</h2>
              <p className="text-xs text-slate-400">每个人拥有独立的做题成绩、错题本与艾宾浩斯复习档案</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-3 shrink-0">
          <button
            onClick={() => setMode('switch')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'switch' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>切换账号 ({accounts.length})</span>
          </button>

          <button
            onClick={() => setMode('register')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'register' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>注册新用户</span>
          </button>

          <button
            onClick={() => setMode('login')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'login' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>账号登录</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* MODE: SWITCH ACCOUNTS */}
          {mode === 'switch' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                选择要进入的学员档案（独立存储、数据互不影响）：
              </div>

              {accounts.map(acc => {
                const isActive = acc.id === activeUser.id;

                return (
                  <div 
                    key={acc.id}
                    onClick={() => handleSwitch(acc.id)}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm' 
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl shrink-0">
                        {acc.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{acc.displayName}</span>
                          <span className="text-[11px] text-slate-400">(@{acc.username})</span>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                              当前使用
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>基础 Band {acc.currentBand.toFixed(1)}</span>
                          <span>➔</span>
                          <span className="text-indigo-600 font-semibold">目标 Band {acc.targetBand.toFixed(1)}</span>
                          <span className="text-slate-400">· 考期 {acc.examDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        <Check className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1" />
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <button
                  onClick={() => setMode('register')}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>新建另外一个学员档案</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE: REGISTER NEW USER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-sm">
              {regError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  选择学员个性头像
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRegAvatar(opt.emoji)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all ${
                        regAvatar === opt.emoji 
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20 shadow-sm scale-105' 
                          : 'border-slate-200 hover:bg-slate-50'
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    登录用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如: Alex_IELTS"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    显示昵称 (可选)
                  </label>
                  <input
                    type="text"
                    placeholder="如: Alex · 冲刺牛津"
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Score Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    当前基础分
                  </label>
                  <select
                    value={regCurrentBand}
                    onChange={(e) => setRegCurrentBand(parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-bold"
                  >
                    <option value={3.5}>Band 3.5</option>
                    <option value={4.0}>Band 4.0 (推荐)</option>
                    <option value={4.5}>Band 4.5</option>
                    <option value={5.0}>Band 5.0</option>
                    <option value={5.5}>Band 5.5</option>
                    <option value={6.0}>Band 6.0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    目标期望分
                  </label>
                  <select
                    value={regTargetBand}
                    onChange={(e) => setRegTargetBand(parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-bold text-indigo-700"
                  >
                    <option value={6.5}>Band 6.5</option>
                    <option value={7.0}>Band 7.0 (推荐)</option>
                    <option value={7.5}>Band 7.5</option>
                    <option value={8.0}>Band 8.0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    备考天数
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={365}
                    value={regDays}
                    onChange={(e) => setRegDays(parseInt(e.target.value) || 178)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-bold text-center"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  访问密码 / PIN 码 (选填，留空则免密登录)
                </label>
                <input
                  type="password"
                  placeholder="留空即为免密码随心登录"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('switch')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  返回账号列表
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  创建并进入独立空间
                </button>
              </div>
            </form>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-sm">
              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  required
                  placeholder="输入已注册的用户名"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  密码 / PIN 码 (若未设置密码可直接留空)
                </label>
                <input
                  type="password"
                  placeholder="输入密码（若有）"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('switch')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  返回账号列表
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  登录进入
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
