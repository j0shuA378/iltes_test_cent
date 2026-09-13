import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  BookMarked, 
  AlertCircle, 
  Settings, 
  Calendar, 
  Target,
  Search,
  Pin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowUpDown,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types/ielts';

export type NavDisplayMode = 'fixed-open' | 'auto-hide' | 'fixed-collapsed';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onOpenSearch: () => void;
  onOpenDictionary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  profile,
  onOpenSearch,
  onOpenDictionary
}) => {
  // Navigation display mode: 'fixed-open' | 'auto-hide' | 'fixed-collapsed'
  const [navDisplayMode, setNavDisplayMode] = useState<NavDisplayMode>(() => {
    try {
      const saved = localStorage.getItem('ielts_navbar_display_mode');
      return (saved as NavDisplayMode) || 'auto-hide';
    } catch {
      return 'auto-hide';
    }
  });

  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTempExpanded, setIsTempExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Save mode to localStorage
  const handleModeChange = (mode: NavDisplayMode) => {
    setNavDisplayMode(mode);
    try {
      localStorage.setItem('ielts_navbar_display_mode', mode);
    } catch (e) {
      // Ignore
    }
    if (mode === 'fixed-collapsed') {
      setIsTempExpanded(false);
      setIsHovered(false);
    }
  };

  // Calculate remaining days
  const today = new Date();
  const examDate = new Date(profile.examDate);
  const diffTime = examDate.getTime() - today.getTime();
  const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const navItems = [
    { id: 'dashboard', label: '备考总览', icon: LayoutDashboard },
    { id: 'reading', label: '阅读机考', icon: BookOpen },
    { id: 'listening', label: '听力训练', icon: Headphones },
    { id: 'writing', label: '写作工坊', icon: PenTool },
    { id: 'speaking', label: '口语考场', icon: Mic },
    { id: 'vocabulary', label: '核心词库', icon: BookMarked },
    { id: 'mistakes', label: '错题集', icon: AlertCircle },
  ];

  // Scroll listener for auto-hide mode
  useEffect(() => {
    if (navDisplayMode !== 'auto-hide') {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navDisplayMode, lastScrollY]);

  // Determine whether navbar should be visually displayed
  const showNav = (() => {
    if (navDisplayMode === 'fixed-open') return true;
    if (navDisplayMode === 'auto-hide') return isVisible || isHovered || isTempExpanded;
    if (navDisplayMode === 'fixed-collapsed') return isTempExpanded || isHovered;
    return true;
  })();

  return (
    <>
      {/* 1. Floating Capsule for 'fixed-collapsed' mode */}
      {navDisplayMode === 'fixed-collapsed' && !showNav && (
        <div 
          onClick={() => setIsTempExpanded(true)}
          onMouseEnter={() => setIsHovered(true)}
          className="fixed top-2.5 right-4 sm:right-6 z-50 cursor-pointer animate-fadeIn select-none"
        >
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 hover:bg-red-600 text-white text-xs font-semibold shadow-xl border border-slate-700/80 hover:border-red-500 transition-all group"
            title="顶栏已固定收起，点击或悬停即可展开导航"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
            <span>顶栏已固定收起</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      )}

      {/* 2. Subtle top hover trigger pill for 'auto-hide' mode */}
      {navDisplayMode === 'auto-hide' && !showNav && (
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onClick={() => setIsTempExpanded(true)}
          className="fixed top-0 left-0 right-0 h-4 z-50 cursor-pointer flex justify-center items-start select-none"
        >
          <div className="bg-slate-900/90 text-white text-[10px] font-semibold px-3 py-0.5 rounded-b-lg border border-slate-700/80 shadow-md flex items-center gap-1 opacity-75 hover:opacity-100 transition-opacity">
            <ChevronDown className="w-3 h-3 text-red-400 animate-bounce" />
            <span>鼠标悬停展开导航栏</span>
          </div>
        </div>
      )}

      {/* Main Header Container with smooth slide in/out */}
      <header 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (navDisplayMode === 'fixed-collapsed') {
            setIsTempExpanded(false);
          }
        }}
        className={`bg-slate-900 text-white shadow-md sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Top Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div 
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-bold text-lg tracking-wider shadow-lg shadow-red-900/50 group-hover:scale-105 transition-transform">
                IE
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">IELTS Master</span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 font-semibold px-1.5 py-0.5 rounded border border-red-500/30 hidden sm:inline">
                    CDI 机考全真
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">雅思全真模考冲刺平台</p>
              </div>
            </div>

            {/* Middle Quick Search Bar Trigger */}
            <div className="hidden md:flex items-center">
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-all shadow-inner group"
              >
                <Search className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                <span>搜索 Cambridge 18/19 最新真题库...</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded text-[10px] border border-slate-700 font-mono">
                  搜真题
                </kbd>
              </button>
            </div>

            {/* Right Status Badges & Display Mode Controller */}
            <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm">
              {/* Target Band */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">目标:</span>
                <span className="font-bold text-emerald-400">Band {profile.targetOverall.toFixed(1)}</span>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-amber-400">{remainingDays} 天</span>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={onOpenSearch}
                className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                title="搜索题库"
              >
                <Search className="w-4 h-4 text-red-400" />
              </button>

              {/* Quick Dictionary Button */}
              <button
                onClick={onOpenDictionary}
                className="px-2.5 py-1 rounded-lg bg-teal-950/40 hover:bg-teal-900/60 text-teal-300 border border-teal-800/40 text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                title="打开雅思学术即时词典"
              >
                <BookMarked className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">词典</span>
              </button>

              {/* 3-State Display Mode Switcher (常驻 / 自动 / 固定收起) */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
                {/* 1. 固定常驻 */}
                <button
                  onClick={() => handleModeChange('fixed-open')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    navDisplayMode === 'fixed-open'
                      ? 'bg-slate-700 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="固定常驻：顶栏始终显示，不隐藏"
                >
                  <Pin className="w-3 h-3 inline mr-1" />
                  <span className="hidden xl:inline">常驻</span>
                </button>

                {/* 2. 智能自动隐藏 */}
                <button
                  onClick={() => handleModeChange('auto-hide')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    navDisplayMode === 'auto-hide'
                      ? 'bg-slate-700 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="智能隐藏：滚屏时自动隐藏与显现"
                >
                  <ArrowUpDown className="w-3 h-3 inline mr-1" />
                  <span className="hidden xl:inline">自动</span>
                </button>

                {/* 3. 固定收起 (新增选项) */}
                <button
                  onClick={() => handleModeChange('fixed-collapsed')}
                  className={`px-2 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                    navDisplayMode === 'fixed-collapsed'
                      ? 'bg-red-600 text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-red-300 hover:bg-slate-700/60'
                  }`}
                  title="固定收起：保持全程收起，全屏沉浸专注"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-amber-300" />
                  <span>固定收起</span>
                </button>
              </div>

              {/* Settings Button */}
              <button
                onClick={() => onSelectTab('settings')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  currentTab === 'settings' 
                    ? 'bg-red-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="设置与目标调整"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation Bar */}
        <div className="bg-slate-800/95 border-t border-slate-700/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none items-center justify-between">
              <div className="flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm shadow-red-900/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Quick Search Button and Quick Collapse Action */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={onOpenSearch}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cambridge 19 题库搜寻</span>
                </button>

                <button
                  onClick={() => handleModeChange('fixed-collapsed')}
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 flex items-center gap-1 transition-colors"
                  title="立即收起导航栏进入全屏专注"
                >
                  <ChevronUp className="w-3 h-3" />
                  <span>收起顶栏</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
