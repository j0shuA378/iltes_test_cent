import React from 'react';
import { 
  Search, 
  BookOpen, 
  Brain, 
  Calendar
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
    <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Quick Search & Dictionary Pill Triggers */}
      <div className="flex items-center gap-2.5">
        {/* Search button styled like Apple Spotlight / Search pill */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] transition-all text-xs font-normal border border-black/[0.04] cursor-pointer"
          title="搜寻剑桥雅思题库 (快捷键: Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#86868b]" />
          <span className="hidden sm:inline">搜寻题库、精听与真题...</span>
          <span className="sm:hidden">搜题库</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-black/[0.06] rounded-md text-[#86868b] shadow-2xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Dictionary quick open pill button */}
        <button
          onClick={onOpenDictionary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3] text-xs font-medium border border-[#0071e3]/15 transition-all active:scale-98 cursor-pointer"
          title="打开即时学术词典 (快捷键: Ctrl+D)"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>即时词典</span>
        </button>
      </div>

      {/* Right: Ebbinghaus Review Due Pill, Countdown & User Account */}
      <div className="flex items-center gap-2.5">
        {/* Ebbinghaus Review Due Capsule */}
        <button
          onClick={() => onNavigateTab('vocabulary')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            dueVocabCount > 0 
              ? 'bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/25 hover:bg-[#ff9500]/15' 
              : 'bg-black/[0.03] text-[#86868b] border border-black/[0.04] hover:bg-black/[0.05]'
          }`}
          title="根据艾宾浩斯曲线，今日需要复习的词汇"
        >
          <Brain className={`w-3.5 h-3.5 ${dueVocabCount > 0 ? 'text-[#ff9500]' : 'text-[#86868b]'}`} />
          <span className="hidden md:inline">抗遗忘:</span>
          {dueVocabCount > 0 ? (
            <span className="font-semibold">{dueVocabCount} 词待复核</span>
          ) : (
            <span className="text-[#86868b]">今日已清空 ✓</span>
          )}
        </button>

        {/* Countdown capsule */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] text-[#86868b] text-xs font-normal border border-black/[0.04]">
          <Calendar className="w-3 h-3 text-[#86868b]" />
          <span>距考期 <strong className="text-[#1d1d1f] font-semibold">{remainingDays}</strong> 天</span>
        </div>

        <div className="h-4 w-px bg-black/[0.08] hidden sm:block"></div>

        {/* User Account Capsule */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] transition-all group cursor-pointer"
          title="点击切换账号或注册新学员"
        >
          <div className="w-6 h-6 rounded-full bg-white border border-black/[0.08] shadow-2xs flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
            {activeUser.avatar}
          </div>
          <div className="text-left hidden sm:block leading-none">
            <div className="font-medium text-xs text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors truncate max-w-[90px]">
              {activeUser.displayName}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
