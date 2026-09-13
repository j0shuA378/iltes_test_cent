import React, { useState, useEffect } from 'react';
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
  Flame, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Bookmark
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
      {/* Hero Adaptation Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Background Subtle Highlights */}
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Top Tag & Settings Button */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>个人专属适配方案 · 178天科学蜕变计划</span>
            </div>

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:border-indigo-400 active:scale-95 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>调整备考方案 (个人适配)</span>
            </button>
          </div>

          {/* Core Title & Band Progression */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                当前水平 <span className="text-amber-400">Band {config.currentBand.toFixed(1)}</span>
                <span className="mx-2 text-slate-500">➔</span>
                目标总分 <span className="text-emerald-400">Band {config.targetBand.toFixed(1)}</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                针对 4.0 基础（词汇量小、长难句阻滞、听力连读拼写弱）定制。分 4 阶段平稳爬坡，四科目标分解为：
                <span className="font-semibold text-sky-300"> 听力 {config.targetListening.toFixed(1)}</span>、
                <span className="font-semibold text-indigo-300"> 阅读 {config.targetReading.toFixed(1)}</span>、
                <span className="font-semibold text-amber-300"> 写作 {config.targetWriting.toFixed(1)}</span>、
                <span className="font-semibold text-rose-300"> 口语 {config.targetSpeaking.toFixed(1)}</span>。
              </p>
            </div>

            {/* Key Metrics Counter */}
            <div className="flex items-center gap-3 sm:gap-4 bg-slate-800/80 p-3 sm:p-4 rounded-xl border border-slate-700/80 backdrop-blur shrink-0">
              <div className="text-center px-2 sm:px-3">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{config.totalDays}</div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">备考周期 (天)</div>
              </div>
              <div className="h-9 w-px bg-slate-700"></div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-2xl sm:text-3xl font-black text-indigo-400">+{((config.targetBand - config.currentBand)).toFixed(1)}</div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">净提分幅度</div>
              </div>
              <div className="h-9 w-px bg-slate-700"></div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{config.dailyHours}h</div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">每日投入</div>
              </div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                备考进程：第 <strong className="text-white">{config.currentDay}</strong> 天 / 剩余 {config.totalDays - config.currentDay} 天
              </span>
              <span className="text-xs font-semibold text-amber-400">
                当前阶段：Phase {currentPhase.phaseNumber} ({currentPhase.dayRange})
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${timelinePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Progressive Phases Interactive Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              178 天 4 阶段进阶路线图 (点击阶段查看详尽打法)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">循序渐进：从词汇语法脱敏，到真题题型技巧，再到同义逻辑与全真模考</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 shrink-0">
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
                className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/20' 
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                    当前进行
                  </span>
                )}
                <div className={`text-[11px] font-bold tracking-wider uppercase ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                  Phase {phase.phaseNumber} · {phase.dayRange}
                </div>
                <div className="font-extrabold text-sm mt-1 line-clamp-1">
                  {phase.name.split('·')[0]}
                </div>
                <div className={`text-xs font-semibold mt-1.5 inline-block px-2 py-0.5 rounded ${
                  isActive ? 'bg-indigo-800/80 text-emerald-300' : 'bg-white text-indigo-600 border border-slate-200'
                }`}>
                  {phase.targetBand}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Phase {currentPhase.phaseNumber} 重点规划
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {currentPhase.name}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentPhase.subtitle}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-100/80 text-emerald-800 font-bold text-xs shrink-0 self-start sm:self-auto">
              🎯 目标：{currentPhase.targetBand}
            </div>
          </div>

          {/* 4 Skills Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-sky-700">
                <Headphones className="w-4 h-4 text-sky-500" />
                <span>听力攻坚突破</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPhase.listeningStrategy}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-indigo-700">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>阅读精读突破</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPhase.readingStrategy}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-700">
                <PenTool className="w-4 h-4 text-amber-500" />
                <span>写作规范突破</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPhase.writingStrategy}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-700">
                <Mic className="w-4 h-4 text-rose-500" />
                <span>口语脱敏突破</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPhase.speakingStrategy}
              </p>
            </div>
          </div>

          {/* Core Objectives Checklist */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              本阶段四大核心攻关目标 (Core Objectives)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPhase.coreObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Milestone */}
          <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>阶段验收里程碑：{currentPhase.keyMilestone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Today's Action Checklist (Phase-Specific Customized Tasks) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              今日阶段定制任务打卡 (Phase {currentPhase.phaseNumber} · Day {config.currentDay})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">每日保质保量完成，点击「去练习」可一键直达题库与工具</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              今日达成度 {progressPercent}% ({completedCount}/{dailyTasks.length} 项)
            </span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {dailyTasks.map((task) => {
            const isDone = !!completedTasks[task.id];

            return (
              <div 
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone 
                    ? 'bg-emerald-50/40 border-emerald-200/80' 
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                }`}
              >
                {/* Left checkbox & text */}
                <div 
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0"
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500 transition-colors" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {task.description} · <span className="text-indigo-600 font-medium">{task.durationMinutes} 分钟</span>
                    </div>
                  </div>
                </div>

                {/* Right Direct Action Link */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onNavigate(task.targetModule)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isDone 
                        ? 'bg-slate-200/70 text-slate-600 hover:bg-slate-300' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow'
                    }`}
                  >
                    <span>{isDone ? '再练一次' : '去练习'}</span>
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
