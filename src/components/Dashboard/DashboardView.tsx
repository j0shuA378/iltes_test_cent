import React from 'react';
import { 
  Trophy, 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ArrowRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { UserProfile, TestResult } from '../../types/ielts';
import { PersonalStudyPlanCard } from './PersonalStudyPlanCard';
import { EbbinghausWidget } from './EbbinghausWidget';
import { getStudyPlanConfig } from '../../services/storage';

interface DashboardViewProps {
  profile: UserProfile;
  results: TestResult[];
  onNavigate: (tab: string) => void;
  mistakesCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  results,
  onNavigate,
  mistakesCount
}) => {
  const planConfig = getStudyPlanConfig() || {
    currentBand: 4.0,
    targetBand: 7.0,
    targetListening: 7.5,
    targetReading: 7.5,
    targetWriting: 6.5,
    targetSpeaking: 6.5,
    totalDays: 178
  };

  const today = new Date();
  const examDate = new Date(profile.examDate);
  const daysLeft = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // 4 Skills configured for 4.0 -> 7.0 Leap
  const skills = [
    { 
      name: '听力 Listening', 
      current: results.filter(r => r.module === 'listening')[0]?.band ?? planConfig.currentBand, 
      target: planConfig.targetListening, 
      icon: Headphones, 
      color: 'text-sky-500', 
      bg: 'bg-sky-50', 
      barColor: 'bg-sky-500',
      note: '核心拉分项 · 目标 32/40 题'
    },
    { 
      name: '阅读 Reading', 
      current: results.filter(r => r.module === 'reading')[0]?.band ?? planConfig.currentBand, 
      target: planConfig.targetReading, 
      icon: BookOpen, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50', 
      barColor: 'bg-indigo-500',
      note: '核心拉分项 · 目标 33/40 题'
    },
    { 
      name: '写作 Writing', 
      current: planConfig.currentBand, 
      target: planConfig.targetWriting, 
      icon: PenTool, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50', 
      barColor: 'bg-amber-500',
      note: '稳健输出项 · 论证严密不跑题'
    },
    { 
      name: '口语 Speaking', 
      current: planConfig.currentBand, 
      target: planConfig.targetSpeaking, 
      icon: Mic, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50', 
      barColor: 'bg-rose-500',
      note: '流畅沟通项 · 万能故事串题'
    },
  ];

  const currentOverall = ((skills[0].current + skills[1].current + skills[2].current + skills[3].current) / 4);

  return (
    <div className="space-y-6">
      {/* 1. Personalized Adaptation Study Plan (Hero + 4-Phase Roadmap + Phase Quota Checklist) */}
      <PersonalStudyPlanCard onNavigate={onNavigate} />

      {/* 2. Ebbinghaus Spaced Repetition Memory Engine */}
      <EbbinghausWidget onNavigate={onNavigate} />

      {/* 4 Skills Target Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon;
          const pct = Math.min(100, Math.round((skill.current / skill.target) * 100));
          return (
            <div key={skill.name} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${skill.bg} ${skill.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{skill.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-400">目标 {skill.target.toFixed(1)}</span>
              </div>
              
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-black text-slate-900">Band {skill.current.toFixed(1)}</span>
                <span className="text-xs font-semibold text-slate-500">达标度 {pct}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${skill.barColor}`} 
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Entry & Daily Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Practice Shortcuts */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              快速开启备考实战
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate('reading')}
                className="group p-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold">
                    <BookOpen className="w-5 h-5" />
                    <span>学术类阅读机考</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">左右分屏、划线高亮笔记、Headings & TFNG 真实机考体验。</p>
              </div>

              <div 
                onClick={() => onNavigate('listening')}
                className="group p-4 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/50 to-white hover:border-sky-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sky-700 font-bold">
                    <Headphones className="w-5 h-5" />
                    <span>听力真题与精听</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">倍速播放、快退 5 秒、S1-S4 答题卡与原文定位对照。</p>
              </div>

              <div 
                onClick={() => onNavigate('writing')}
                className="group p-4 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <PenTool className="w-5 h-5" />
                    <span>写作限时与智能批改</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">Task 1/2 题库、实时字数统计、Band 9 范文与 4 维机考评分。</p>
              </div>

              <div 
                onClick={() => onNavigate('speaking')}
                className="group p-4 rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <Mic className="w-5 h-5" />
                    <span>口语仿真考场</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">Part 2 准备 1 分钟 + 作答 2 分钟提示音，原生高清录音复盘。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mistake Alert & Test History */}
        <div className="space-y-6">
          {/* Mistake Notebook Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                错题本与弱项突破
              </span>
              <span className="px-2 py-0.5 bg-amber-200/80 text-amber-800 font-bold text-xs rounded-full">
                {mistakesCount} 题待温习
              </span>
            </div>
            <p className="text-xs text-amber-800/80 mb-4 leading-relaxed">
              雅思考试提分的核心在于“错题归因”。分析是定位失误、同义替换遗漏还是时间分配不均。
            </p>
            <button
              onClick={() => onNavigate('mistakes')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>查看我的错题本</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vocabulary Flashcard Shortcut */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                同义替换与核心词库
              </span>
              <span className="px-2 py-0.5 bg-teal-200/80 text-teal-800 font-bold text-xs rounded-full">
                100+ 核心组
              </span>
            </div>
            <p className="text-xs text-teal-800/80 mb-4 leading-relaxed">
              掌握 substantial = considerable、mitigate = alleviate 等 500 组听读同义替换词对。
            </p>
            <button
              onClick={() => onNavigate('vocabulary')}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>开始刷词闪卡</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Test History */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              模考成绩记录
            </h3>

            {results.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                暂无模考记录，快去完成一套阅读或听力吧！
              </div>
            ) : (
              <div className="space-y-2.5">
                {results.slice(0, 4).map((res) => (
                  <div key={res.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 line-clamp-1">{res.testTitle}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {new Date(res.completedAt).toLocaleDateString()} · 正确 {res.score}/40
                      </div>
                    </div>
                    <div className="font-black text-sm px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Band {res.band.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
