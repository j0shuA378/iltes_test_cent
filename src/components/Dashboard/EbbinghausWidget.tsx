import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  RotateCw, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { 
  getEbbinghausStats, 
  getEbbinghausItems, 
  STAGE_DESCRIPTIONS,
  seedInitialEbbinghausItems
} from '../../services/ebbinghausService';
import { CORE_VOCABULARY } from '../../data/vocabularyData';
import { EbbinghausStats, MemoryStage } from '../../types/auth';

interface EbbinghausWidgetProps {
  onNavigate: (tab: string) => void;
}

export const EbbinghausWidget: React.FC<EbbinghausWidgetProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<EbbinghausStats>({
    totalItems: 0,
    dueTodayCount: 0,
    masteredCount: 0,
    learningCount: 0,
    averageRetention: 92
  });

  const [showStageBreakdown, setShowStageBreakdown] = useState(false);
  const [stageCounts, setStageCounts] = useState<Record<MemoryStage, number>>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  });

  const loadData = () => {
    // Seed initial items if empty for a new account
    seedInitialEbbinghausItems(
      CORE_VOCABULARY.map(v => ({ id: v.id, word: v.word, chinese: v.chinese }))
    );

    const s = getEbbinghausStats();
    setStats(s);

    const items = getEbbinghausItems();
    const counts: Record<MemoryStage, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    items.forEach(item => {
      counts[item.stage] = (counts[item.stage] || 0) + 1;
    });
    setStageCounts(counts);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('ielts_ebbinghaus_updated', handleUpdate);
    window.addEventListener('ielts_auth_changed', handleUpdate);

    return () => {
      window.removeEventListener('ielts_ebbinghaus_updated', handleUpdate);
      window.removeEventListener('ielts_auth_changed', handleUpdate);
    };
  }, []);

  const stagesList: MemoryStage[] = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-700/80 shadow-xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-teal-400 font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Ebbinghaus Spaced Repetition Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] border border-teal-500/30">
                艾宾浩斯抗遗忘算法
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              智能动态遗忘监测与多级复盘
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              基于人类大脑衰减曲线公式 R = e^(-t/S)，系统在词汇与错题遗忘临界点精准提醒复核，以最小复习耗时建立考场本能永久突触。
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setShowStageBreakdown(!showStageBreakdown)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showStageBreakdown ? '收起阶段矩阵' : '查看7级突触'}</span>
            </button>

            <button
              onClick={() => onNavigate('vocabulary')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>开启抗遗忘冲刺</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>今日临界待复习</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 flex items-baseline gap-1">
              <span>{stats.dueTodayCount}</span>
              <span className="text-xs font-normal text-slate-400">项到期</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats.dueTodayCount > 0 ? '建议今日优先消灭' : '今日复习目标已达成 ✓'}
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>综合留存率</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-1">
              <span>{stats.averageRetention}%</span>
              <span className="text-xs font-normal text-slate-400">稳定度</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              远高于无复习基线 (21%)
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Stage 6 永久记忆</span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-300 flex items-baseline gap-1">
              <span>{stats.masteredCount}</span>
              <span className="text-xs font-normal text-slate-400">项牢固</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              已进入考场秒级提取区
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>记忆网络收录</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 flex items-baseline gap-1">
              <span>{stats.totalItems}</span>
              <span className="text-xs font-normal text-slate-400">总跟踪</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              涵盖核心高频词与重难错题
            </div>
          </div>
        </div>

        {/* Ebbinghaus Curve SVG Visualizer */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-3 gap-2">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <span>记忆衰减与对抗轨迹模拟</span>
              <span className="text-slate-500 font-normal">| 7个黄金突触强化节点</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                艾宾浩斯多级复习 (95%+)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400/80 font-medium">
                <span className="w-2.5 h-0.5 bg-rose-400 inline-block border-b border-dashed"></span>
                自然衰减遗忘 (跌至21%)
              </span>
            </div>
          </div>

          {/* SVG Curve */}
          <div className="relative w-full h-28 sm:h-32">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

              {/* Natural forgetting curve (dips severely to 21%) */}
              <path 
                d="M 10 20 Q 80 90 200 102 T 700 108" 
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                opacity="0.6"
              />

              {/* Ebbinghaus Spaced Repetition Sawtooth-to-Stable Curve */}
              <path 
                d="M 10 20 
                   Q 50 50 80 55 
                   L 80 20 
                   Q 140 45 180 50 
                   L 180 20 
                   Q 250 40 300 42 
                   L 300 20 
                   Q 390 35 440 36 
                   L 440 20 
                   Q 530 30 580 30 
                   L 580 20 
                   L 700 20" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
              />

              {/* Filled area under Ebbinghaus Curve */}
              <path 
                d="M 10 20 
                   Q 50 50 80 55 
                   L 80 20 
                   Q 140 45 180 50 
                   L 180 20 
                   Q 250 40 300 42 
                   L 300 20 
                   Q 390 35 440 36 
                   L 440 20 
                   Q 530 30 580 30 
                   L 580 20 
                   L 700 20 
                   L 700 115 
                   L 10 115 Z" 
                fill="url(#curveGradient)" 
              />

              {/* Nodes at each spaced repetition point */}
              {[
                { x: 10, label: '初学' },
                { x: 80, label: '20分' },
                { x: 180, label: '1天' },
                { x: 300, label: '2天' },
                { x: 440, label: '4天' },
                { x: 580, label: '7天' },
                { x: 700, label: '永久' },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy="20" r="4" fill="#34d399" stroke="#064e3b" strokeWidth="1.5" />
                  <text x={pt.x} y="115" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Stage Matrix Breakdown (Collapsible) */}
        {showStageBreakdown && (
          <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                当前用户 7 级突触分布情况
              </span>
              <span className="text-[11px] text-slate-400">总计 {stats.totalItems} 条记忆锚点</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {stagesList.map(st => {
                const desc = STAGE_DESCRIPTIONS[st];
                const count = stageCounts[st] || 0;
                return (
                  <div key={st} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${desc.color}`}>{desc.label}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-white">
                          {count} 个
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{desc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
