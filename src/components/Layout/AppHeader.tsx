import React from 'react';
import { 
  Search, 
  BookOpen, 
  Brain, 
  Calendar, 
  User, 
  Users, 
  Sparkles,
  Command
} from 'lucide-react';
import { UserAccount } from '../../types/auth';

interface AppHeaderProps {
  activeUser: UserAccount;
  onOpenSearch: () => void;
  onOpenDictionary: () => void;
  onOpenAuthModal: () => void;
  onNavigateTab: (tab: string) => void;
  dueVocabCount?: number;
  remainingDays?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeUser,
  onOpenSearch,
  onOpenDictionary,
  onOpenAuthModal,
  onNavigateTab,
  dueVocabCount = 0,
  remainingDays = 178
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 select-none shadow-sm">
      {/* Left: Quick Actions & Search */}
      <div className="flex items-center gap-3">
        {/* Search button with keyboard shortcut badge */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-all text-xs font-medium border border-slate-200"
          title="快速搜寻剑桥雅思题库 (快捷键: Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">搜寻最新剑18/19题库...</span>
          <span className="sm:hidden">搜题库</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Dictionary quick open */}
        <button
          onClick={onOpenDictionary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-800 text-xs font-semibold border border-teal-200/80 transition-all active:scale-95"
          title="打开即时学术词典 (快捷键: Ctrl+D)"
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>即时词典</span>
        </button>
      </div>

      {/* Right: Ebbinghaus Due Alert, Countdown, and User Profile */}
      <div className="flex items-center gap-3">
        {/* Ebbinghaus Review Due Capsule */}
        <button
          onClick={() => onNavigateTab('vocabulary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            dueVocabCount > 0 
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm animate-pulse' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title="根据艾宾浩斯遗忘曲线，今日需要复习的词汇"
        >
          <Brain className={`w-3.5 h-3.5 ${dueVocabCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">艾宾浩斯抗遗忘:</span>
          {dueVocabCount > 0 ? (
            <span className="font-black text-amber-700">{dueVocabCount} 词待复习</span>
          ) : (
            <span className="text-slate-500 font-medium">今日已清空 ✓</span>
          )}
        </button>

        {/* Countdown badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>距考期 <strong className="text-slate-900">{remainingDays}</strong> 天</span>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Account Capsule */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all group"
          title="点击切换账号或注册新用户"
        >
          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center text-sm group-hover:scale-105 transition-transform">
            {activeUser.avatar}
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors leading-none truncate max-w-[100px]">
              {activeUser.displayName}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 leading-none">
              Band {activeUser.currentBand.toFixed(1)} ➔ {activeUser.targetBand.toFixed(1)}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
