import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  AlertCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
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
      group: '控制中心',
      items: [
        { id: 'dashboard', label: '备考看板', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: '全真模考',
      items: [
        { id: 'reading', label: '阅读机考', icon: BookOpen, badge: null },
        { id: 'listening', label: '听力训练', icon: Headphones, badge: null },
        { id: 'writing', label: '写作工坊', icon: PenTool, badge: null },
        { id: 'speaking', label: '口语考场', icon: Mic, badge: null }
      ]
    },
    {
      group: '记忆引擎',
      items: [
        { 
          id: 'vocabulary', 
          label: '艾宾浩斯词库', 
          icon: Brain, 
          badge: dueVocabCount > 0 ? `${dueVocabCount}` : null,
          badgeColor: 'bg-[#ff9500] text-white font-bold'
        },
        { 
          id: 'mistakes', 
          label: '错题集复盘', 
          icon: AlertCircle, 
          badge: mistakesCount > 0 ? `${mistakesCount}` : null,
          badgeColor: 'bg-black/[0.06] text-[#424245]'
        }
      ]
    },
    {
      group: '偏好设置',
      items: [
        { id: 'settings', label: '系统设置', icon: Settings, badge: null }
      ]
    }
  ];

  return (
    <aside 
      className={`bg-[#fbfbfd]/90 backdrop-blur-xl border-r border-black/[0.06] text-[#1d1d1f] flex flex-col transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* App Branding Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-black/[0.04] shrink-0">
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden group"
        >
          {/* Apple Squircle Icon */}
          <div className="w-8 h-8 rounded-[10px] bg-[#1d1d1f] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
            雅
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <div className="font-semibold text-[#1d1d1f] text-sm tracking-tight">
                IELTS Master
              </div>
              <div className="text-[10px] text-[#86868b] tracking-normal font-normal">
                学术机考门户
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Capsule (macOS style) */}
      <div className="p-3 border-b border-black/[0.04] shrink-0">
        <button
          onClick={onOpenAuthModal}
          className={`w-full rounded-2xl bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] p-2 flex items-center transition-all group cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title="点击切换账号或注册新学员"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-white border border-black/[0.06] shadow-2xs flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform">
              {activeUser.avatar}
            </div>
            {!isCollapsed && (
              <div className="text-left truncate leading-tight">
                <div className="font-medium text-xs text-[#1d1d1f] truncate group-hover:text-[#0071e3] transition-colors">
                  {activeUser.displayName}
                </div>
                <div className="text-[10px] text-[#86868b] flex items-center gap-1 mt-0.5 font-normal">
                  {activeUser.currentBand === 0 ? (
                    <span className="text-[#ff9500] font-medium bg-[#ff9500]/10 px-1 py-0.5 rounded text-[9px]">待定级</span>
                  ) : (
                    <span className="text-[#ff9500] font-medium">B{activeUser.currentBand.toFixed(1)}</span>
                  )}
                  <span>➔</span>
                  <span className="text-[#34c759] font-medium">B{activeUser.targetBand.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="text-[10px] font-medium text-[#86868b] group-hover:text-[#1d1d1f] px-2 py-0.5 rounded-full bg-black/[0.04] shrink-0">
              切换
            </div>
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="px-3 text-[11px] font-semibold text-[#86868b] tracking-wider mb-1">
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
                  className={`w-full flex items-center rounded-xl p-2 text-xs transition-all relative group cursor-pointer ${
                    isActive 
                      ? 'bg-[#0071e3] text-white font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)]' 
                      : 'text-[#424245] hover:text-[#1d1d1f] hover:bg-black/[0.04] font-normal'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-[#86868b] group-hover:text-[#1d1d1f]'
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
                      isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Dot badge on collapsed mode */}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff9500] ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-black/[0.04] flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#86868b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]"></span>
            <span>本地独立存储</span>
          </div>
        )}

        <button
          onClick={toggleCollapse}
          className={`p-1.5 rounded-lg hover:bg-black/[0.05] text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer ${
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
