import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  BookMarked, 
  AlertCircle, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Award,
  Zap,
  Brain
} from 'lucide-react';
import { UserAccount } from '../../types/auth';

interface AppSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeUser: UserAccount;
  onOpenAuthModal: () => void;
  dueVocabCount?: number;
  mistakesCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onSelectTab,
  activeUser,
  onOpenAuthModal,
  dueVocabCount = 0,
  mistakesCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ielts_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('ielts_sidebar_collapsed', String(next));
    } catch {}
  };

  const navGroups = [
    {
      group: '主控中心',
      items: [
        { id: 'dashboard', label: '备考看板', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: '机考实战',
      items: [
        { id: 'reading', label: '阅读机考', icon: BookOpen, badge: null },
        { id: 'listening', label: '听力训练', icon: Headphones, badge: null },
        { id: 'writing', label: '写作工坊', icon: PenTool, badge: null },
        { id: 'speaking', label: '口语考场', icon: Mic, badge: null }
      ]
    },
    {
      group: '抗遗忘记忆',
      items: [
        { 
          id: 'vocabulary', 
          label: '艾宾浩斯词库', 
          icon: Brain, 
          badge: dueVocabCount > 0 ? `${dueVocabCount}待复习` : null,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold'
        },
        { 
          id: 'mistakes', 
          label: '错题集复盘', 
          icon: AlertCircle, 
          badge: mistakesCount > 0 ? `${mistakesCount}` : null,
          badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
        }
      ]
    },
    {
      group: '系统',
      items: [
        { id: 'settings', label: '系统设置', icon: Settings, badge: null }
      ]
    }
  ];

  return (
    <aside 
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* App Branding Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 shrink-0">
            雅
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <div className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
                <span>IELTS Master</span>
              </div>
              <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                全真机考门户
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Mini Card / Switcher Trigger */}
      <div className="p-3 border-b border-slate-800/80 shrink-0">
        <button
          onClick={onOpenAuthModal}
          className={`w-full rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 p-2.5 flex items-center transition-all group ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title="点击切换用户或注册新账号"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
              {activeUser.avatar}
            </div>
            {!isCollapsed && (
              <div className="text-left truncate leading-tight">
                <div className="font-bold text-xs text-white truncate group-hover:text-indigo-300 transition-colors">
                  {activeUser.displayName}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="text-amber-400 font-semibold">B{activeUser.currentBand.toFixed(1)}</span>
                  <span>➔</span>
                  <span className="text-emerald-400 font-semibold">B{activeUser.targetBand.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="text-[10px] font-medium text-slate-400 group-hover:text-white px-1.5 py-0.5 rounded bg-slate-700/60 shrink-0">
              切换
            </div>
          )}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {group.group}
              </div>
            )}

            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center rounded-xl p-2.5 text-xs font-semibold transition-all relative group ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Compact tooltip on collapsed mode */}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>本地独立存储 · 秒级响应</span>
          </div>
        )}

        <button
          onClick={toggleCollapse}
          className={`p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ${
            isCollapsed ? 'w-full flex justify-center' : ''
          }`}
          title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
