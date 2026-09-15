import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Sliders, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ShieldCheck
} from 'lucide-react';
import { 
  PersonalizedPlanConfig, 
  STUDY_PHASES, 
  StudyPlanPhase, 
  getDailyTasksForPhase, 
  DailyPlanTask, 
  DEFAULT_PLAN_CONFIG 
} from '../../data/studyPlanData';
import { 
  getStudyPlanConfig, 
  saveStudyPlanConfig, 
  getCompletedPlanTasks, 
  togglePlanTask 
} from '../../services/storage';
import { AdaptationConfigModal } from './AdaptationConfigModal';

interface PersonalStudyPlanCardProps {
  onNavigate: (tab: string) => void;
}

export const PersonalStudyPlanCard: React.FC<PersonalStudyPlanCardProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<PersonalizedPlanConfig>(() => {
    const saved = getStudyPlanConfig();
    return saved || DEFAULT_PLAN_CONFIG;
  });

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => getCompletedPlanTasks());

  const currentPhase: StudyPlanPhase = STUDY_PHASES[activePhaseIndex] || STUDY_PHASES[0];
  const dailyTasks: DailyPlanTask[] = getDailyTasksForPhase(currentPhase.id);

  const completedCount = dailyTasks.filter(t => completedTasks[t.id]).length;
  const progressPercent = Math.round((completedCount / dailyTasks.length) * 100);

  // Overall timeline progress (Day 1 / 178)
  const timelinePct = Math.min(100, Math.max(1, Math.round((config.currentDay / config.totalDays) * 100)));

  const handleToggleTask = (taskId: string) => {
    const nowDone = togglePlanTask(taskId);
    setCompletedTasks(prev => ({ ...prev, [taskId]: nowDone }));
  };

  const handleSaveConfig = (newConfig: PersonalizedPlanConfig) => {
    setConfig(newConfig);
    saveStudyPlanConfig(newConfig);
  };

  return (
    <div className="space-y-6">
      {/* Hero Adaptation Banner (Apple Clean Card Style) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all">
        <div className="space-y-6">
          {/* Top Tag & Settings Button */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff9500]/10 border border-[#ff9500]/20 text-[#ff9500] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#ff9500]" />
              <span>个人专属适配方案 · 178天进阶跃迁</span>
            </div>

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium border border-black/[0.04] transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#86868b]" />
              <span>个性化参数调优</span>
            </button>
          </div>

          {/* Core Title & Band Progression */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                当前水平 <span className="text-[#ff9500]">Band {config.currentBand.toFixed(1)}</span>
                <span className="mx-2.5 text-[#86868b] font-normal">➔</span>
                目标总分 <span className="text-[#34c759]">Band {config.targetBand.toFixed(1)}</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#86868b] max-w-2xl leading-relaxed">
                针对 4.0 基础（词汇量较小、长难句结构薄弱、精听连读弱）定制。178天 4 阶段平稳爬坡，四科目标分解：
                <span className="font-medium text-[#1d1d1f]"> 听力 {config.targetListening.toFixed(1)}</span>、
                <span className="font-medium text-[#1d1d1f]"> 阅读 {config.targetReading.toFixed(1)}</span>、
                <span className="font-medium text-[#1d1d1f]"> 写作 {config.targetWriting.toFixed(1)}</span>、
                <span className="font-medium text-[#1d1d1f]"> 口语 {config.targetSpeaking.toFixed(1)}</span>。
              </p>
            </div>

            {/* Key Metrics Counter (Apple Inset Style) */}
            <div className="flex items-center gap-3 sm:gap-4 bg-[#f5f5f7] p-3 sm:p-4 rounded-2xl border border-black/[0.02] shrink-0">
              <div className="text-center px-2 sm:px-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#ff9500]">{config.totalDays}</div>
                <div className="text-[10px] sm:text-xs text-[#86868b] mt-0.5 font-normal">备考周期 (天)</div>
              </div>
              <div className="h-8 w-px bg-black/[0.08]"></div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">+{((config.targetBand - config.currentBand)).toFixed(1)}</div>
                <div className="text-[10px] sm:text-xs text-[#86868b] mt-0.5 font-normal">净提分幅度</div>
              </div>
              <div className="h-8 w-px bg-black/[0.08]"></div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#34c759]">{config.dailyHours}h</div>
                <div className="text-[10px] sm:text-xs text-[#86868b] mt-0.5 font-normal">每日投入</div>
              </div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-[#86868b]">
              <span className="font-normal flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#86868b]" />
                备考进程：第 <strong className="text-[#1d1d1f] font-semibold">{config.currentDay}</strong> 天 / 剩余 {config.totalDays - config.currentDay} 天
              </span>
              <span className="text-xs font-medium text-[#0071e3]">
                当前阶段：Phase {currentPhase.phaseNumber} ({currentPhase.dayRange})
              </span>
            </div>
            <div className="w-full bg-[#f5f5f7] rounded-full h-2 overflow-hidden border border-black/[0.04]">
              <div 
                className="h-full bg-gradient-to-r from-[#0071e3] to-[#34c759] rounded-full transition-all duration-500"
                style={{ width: `${timelinePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Progressive Phases Interactive Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.04]">
          <div>
            <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0071e3]" />
              178 天 4 阶段进阶路线图
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">循序渐进：从词汇语法脱敏，到真题题型技巧，再到同义替换与全真模考</p>
          </div>
          <span className="text-xs font-medium px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full border border-[#0071e3]/15 shrink-0 self-start sm:self-auto">
            阶段 {activePhaseIndex + 1} / 4
          </span>
        </div>

        {/* Phase Pill Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STUDY_PHASES.map((phase, idx) => {
            const isActive = activePhaseIndex === idx;
            const isCurrent = idx === 0;

            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden cursor-pointer ${
                  isActive 
                    ? 'bg-[#1d1d1f] text-white border-transparent shadow-md' 
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border-transparent'
                }`}
              >
                {isCurrent && (
                  <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive ? 'bg-[#ff9500] text-black' : 'bg-[#ff9500]/15 text-[#ff9500]'
                  }`}>
                    当前进行
                  </span>
                )}
                <div className={`text-[11px] font-medium uppercase tracking-wider ${isActive ? 'text-slate-300' : 'text-[#86868b]'}`}>
                  Phase {phase.phaseNumber} · {phase.dayRange}
                </div>
                <div className="font-semibold text-sm mt-1 line-clamp-1">
                  {phase.name.split('·')[0]}
                </div>
                <div className={`text-xs font-medium mt-2 inline-block px-2.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-[#0071e3] border border-black/[0.06]'
                }`}>
                  {phase.targetBand}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        <div className="bg-[#fbfbfd] rounded-2xl p-5 sm:p-6 border border-black/[0.04] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wide">
                Phase {currentPhase.phaseNumber} 规划细节
              </span>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mt-0.5">
                {currentPhase.name}
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                {currentPhase.subtitle}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#34c759]/10 text-[#34c759] font-medium text-xs shrink-0 self-start sm:self-auto border border-[#34c759]/20">
              🎯 目标：{currentPhase.targetBand}
            </div>
          </div>

          {/* 4 Skills Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 font-medium text-xs text-[#0071e3]">
                <Headphones className="w-4 h-4 text-[#0071e3]" />
                <span>听力精听攻坚</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {currentPhase.listeningStrategy}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 font-medium text-xs text-[#34c759]">
                <BookOpen className="w-4 h-4 text-[#34c759]" />
                <span>阅读精读定位</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {currentPhase.readingStrategy}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 font-medium text-xs text-[#ff9500]">
                <PenTool className="w-4 h-4 text-[#ff9500]" />
                <span>写作结构规范</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {currentPhase.writingStrategy}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 font-medium text-xs text-[#af52de]">
                <Mic className="w-4 h-4 text-[#af52de]" />
                <span>口语流利串题</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {currentPhase.speakingStrategy}
              </p>
            </div>
          </div>

          {/* Core Objectives Checklist */}
          <div className="bg-white p-4 rounded-2xl border border-black/[0.04] shadow-2xs">
            <h4 className="text-xs font-semibold text-[#1d1d1f] mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              阶段攻坚验收目标 (Core Objectives)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPhase.coreObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#6e6e73]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Milestone */}
          <div className="bg-[#0071e3]/5 p-3.5 rounded-xl border border-[#0071e3]/10 flex items-center justify-between text-xs">
            <span className="font-medium text-[#1d1d1f] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0071e3] shrink-0" />
              <span>阶段考核验收：{currentPhase.keyMilestone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Today's Action Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.04]">
          <div>
            <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
              今日阶段定制任务打卡 (Phase {currentPhase.phaseNumber} · Day {config.currentDay})
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">保质完成每日量化目标，点击「去练习」直达实战训练模块</p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-medium px-3 py-1 bg-[#34c759]/10 text-[#34c759] rounded-full border border-[#34c759]/20">
              达成度 {progressPercent}% ({completedCount}/{dailyTasks.length} 项)
            </span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {dailyTasks.map((task) => {
            const isDone = !!completedTasks[task.id];

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone 
                    ? 'bg-[#34c759]/5 border-[#34c759]/20' 
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/70 border-transparent'
                }`}
              >
                {/* Left checkbox & text */}
                <div 
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0"
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#34c759]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#86868b] hover:text-[#0071e3] transition-colors" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${isDone ? 'line-through text-[#86868b]' : 'text-[#1d1d1f]'}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-[#86868b] mt-0.5">
                      {task.description} · <span className="text-[#0071e3] font-medium">{task.durationMinutes} 分钟</span>
                    </div>
                  </div>
                </div>

                {/* Right Direct Action Link (Apple Pill) */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onNavigate(task.targetModule)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDone 
                        ? 'bg-[#e8e8ed] text-[#6e6e73] hover:bg-[#dcdce0]' 
                        : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm active:scale-98'
                    }`}
                  >
                    <span>{isDone ? '重温' : '去练习'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adaptation Configuration Modal */}
      <AdaptationConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />
    </div>
  );
};
