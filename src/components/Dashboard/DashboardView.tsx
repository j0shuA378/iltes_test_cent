import React from 'react';
import { 
  Trophy, 
  Target, 
  Calendar, 
  Clock, 
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

  // 4 Skills configured for 4.0 -> 7.0 Leap
  const skills = [
    { 
      name: '听力 Listening', 
      current: results.filter(r => r.module === 'listening')[0]?.band ?? planConfig.currentBand, 
      target: planConfig.targetListening, 
      icon: Headphones, 
      color: 'text-[#0071e3]', 
      bg: 'bg-[#0071e3]/10', 
      barColor: 'bg-[#0071e3]',
      note: '核心拉分项 · 目标 32/40 题'
    },
    { 
      name: '阅读 Reading', 
      current: results.filter(r => r.module === 'reading')[0]?.band ?? planConfig.currentBand, 
      target: planConfig.targetReading, 
      icon: BookOpen, 
      color: 'text-[#34c759]', 
      bg: 'bg-[#34c759]/10', 
      barColor: 'bg-[#34c759]',
      note: '核心拉分项 · 目标 33/40 题'
    },
    { 
      name: '写作 Writing', 
      current: planConfig.currentBand, 
      target: planConfig.targetWriting, 
      icon: PenTool, 
      color: 'text-[#ff9500]', 
      bg: 'bg-[#ff9500]/10', 
      barColor: 'bg-[#ff9500]',
      note: '稳健输出项 · 论证严密不跑题'
    },
    { 
      name: '口语 Speaking', 
      current: planConfig.currentBand, 
      target: planConfig.targetSpeaking, 
      icon: Mic, 
      color: 'text-[#af52de]', 
      bg: 'bg-[#af52de]/10', 
      barColor: 'bg-[#af52de]',
      note: '流畅沟通项 · 万能故事串题'
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Personalized Adaptation Study Plan */}
      <PersonalStudyPlanCard onNavigate={onNavigate} />

      {/* 2. Ebbinghaus Spaced Repetition Memory Engine */}
      <EbbinghausWidget onNavigate={onNavigate} />

      {/* 4 Skills Target Progress Grid (Apple Inset Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon;
          const pct = Math.min(100, Math.round((skill.current / skill.target) * 100));
          return (
            <div key={skill.name} className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${skill.bg} ${skill.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-[#1d1d1f] text-sm">{skill.name}</span>
                </div>
                <span className="text-xs font-medium text-[#86868b]">目标 {skill.target.toFixed(1)}</span>
              </div>
              
              <div className="flex items-baseline justify-between mb-2.5">
                <span className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Band {skill.current.toFixed(1)}</span>
                <span className="text-xs font-normal text-[#86868b]">达标度 {pct}%</span>
              </div>

              {/* Apple Rounded Pill Progress Bar */}
              <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 overflow-hidden border border-black/[0.02]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${skill.barColor}`} 
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Practice Shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff9500]" />
              快速开启备考实战
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div 
                onClick={() => onNavigate('reading')}
                className="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#34c759] font-medium text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>学术类阅读机考</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">左右分屏、划线高亮笔记、Headings & TFNG 真实机考体验。</p>
              </div>

              <div 
                onClick={() => onNavigate('listening')}
                className="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#0071e3] font-medium text-sm">
                    <Headphones className="w-4 h-4" />
                    <span>听力真题与精听</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">倍速播放、快退 5 秒、S1-S4 答题卡与原文定位对照。</p>
              </div>

              <div 
                onClick={() => onNavigate('writing')}
                className="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#ff9500] font-medium text-sm">
                    <PenTool className="w-4 h-4" />
                    <span>写作限时与智能批改</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">Task 1/2 题库、实时字数统计、Band 9 范文与 4 维机考评分。</p>
              </div>

              <div 
                onClick={() => onNavigate('speaking')}
                className="group p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border border-black/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#af52de] font-medium text-sm">
                    <Mic className="w-4 h-4" />
                    <span>口语仿真考场</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">Part 2 准备 1 分钟 + 作答 2 分钟提示音，原生高清录音复盘。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mistake Alert & Test History */}
        <div className="space-y-6">
          {/* Mistake Notebook Card */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1d1d1f] text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#ff9500]" />
                错题本与弱项突破
              </span>
              <span className="px-2.5 py-0.5 bg-[#ff9500]/10 text-[#ff9500] font-medium text-xs rounded-full">
                {mistakesCount} 题待温习
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              雅思考试提分的核心在于“错题归因”。分析是定位失误、同义替换遗漏还是时间分配不均。
            </p>
            <button
              onClick={() => onNavigate('mistakes')}
              className="w-full py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-black/[0.04]"
            >
              <span>查看我的错题本</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vocabulary Flashcard Shortcut */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1d1d1f] text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0071e3]" />
                同义替换与核心词库
              </span>
              <span className="px-2.5 py-0.5 bg-[#0071e3]/10 text-[#0071e3] font-medium text-xs rounded-full">
                100+ 核心组
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              掌握 substantial = considerable、mitigate = alleviate 等 500 组听读同义替换词对。
            </p>
            <button
              onClick={() => onNavigate('vocabulary')}
              className="w-full py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>开始刷词闪卡</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Test History */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="font-semibold text-[#1d1d1f] text-sm mb-3.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#86868b]" />
              模考成绩记录
            </h3>

            {results.length === 0 ? (
              <div className="text-center py-6 text-[#86868b] text-xs font-normal">
                暂无模考记录，完成一套阅读或听力后自动沉淀在此。
              </div>
            ) : (
              <div className="space-y-2">
                {results.slice(0, 4).map((res) => (
                  <div key={res.id} className="p-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-[#1d1d1f] line-clamp-1">{res.testTitle}</div>
                      <div className="text-[#86868b] text-[11px] mt-0.5">
                        {new Date(res.completedAt).toLocaleDateString()} · 正确 {res.score}/40
                      </div>
                    </div>
                    <div className="font-semibold text-xs px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3]">
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
