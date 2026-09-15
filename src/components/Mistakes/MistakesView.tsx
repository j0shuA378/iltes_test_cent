import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Headphones, 
  Brain, 
  Clock 
} from 'lucide-react';
import { getMistakes, toggleMistakeResolved } from '../../services/storage';
import { 
  recordEbbinghausReview, 
  getEbbinghausItem, 
  calculateRetention, 
  STAGE_DESCRIPTIONS 
} from '../../services/ebbinghausService';
import { MistakeRecord } from '../../types/ielts';
import { MemoryStage } from '../../types/auth';

interface MistakesViewProps {
  onRefreshMistakes?: () => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({ onRefreshMistakes }) => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [moduleFilter, setModuleFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  const reload = () => {
    setMistakes(getMistakes());
    if (onRefreshMistakes) onRefreshMistakes();
  };

  useEffect(() => {
    reload();

    const handleAuthChange = () => {
      reload();
    };

    window.addEventListener('ielts_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('ielts_auth_changed', handleAuthChange);
    };
  }, []);

  const handleToggle = (id: string) => {
    const isNowResolved = toggleMistakeResolved(id);
    const feedback = isNowResolved ? 'easy' : 'forgot';
    const item = mistakes.find(m => m.id === id);
    if (item) {
      recordEbbinghausReview(
        item.id,
        'mistake',
        `#${item.questionNumber} ${item.questionText}`,
        feedback,
        item.testTitle
      );
    }
    reload();
  };

  const handleEbbinghausFeedback = (
    m: MistakeRecord, 
    feedback: 'forgot' | 'hard' | 'good' | 'easy'
  ) => {
    const updated = recordEbbinghausReview(
      m.id,
      'mistake',
      `#${m.questionNumber} ${m.questionText}`,
      feedback,
      m.testTitle
    );

    if (updated.stage === 6 && !m.isResolved) {
      toggleMistakeResolved(m.id);
    } else if (updated.stage < 6 && m.isResolved && feedback === 'forgot') {
      toggleMistakeResolved(m.id);
    }
    reload();
  };

  const filteredMistakes = mistakes.filter(m => {
    if (moduleFilter !== 'all' && m.module !== moduleFilter) return false;
    if (statusFilter === 'unresolved' && m.isResolved) return false;
    if (statusFilter === 'resolved' && !m.isResolved) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* Header (Apple Clean Style) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#ff9500] font-medium mb-1.5">
            <Brain className="w-4 h-4 text-[#ff9500]" />
            <span className="uppercase tracking-wider">IELTS Mistake Notebook & Spaced Elimination</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            错题集与艾宾浩斯抗遗忘复盘
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] mt-1 font-normal">
            依循 7 级记忆突触周期持续复盘抽测，直至考场秒答彻底消除失误
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/20 text-xs font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>收录 {mistakes.length} 道错题</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs (Apple Segmented Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-black/[0.04] shadow-2xs">
        {/* Module Filter */}
        <div className="flex items-center gap-1.5 bg-[#f5f5f7] p-1 rounded-full text-xs">
          <button
            onClick={() => setModuleFilter('all')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
              moduleFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            全部科目
          </button>
          <button
            onClick={() => setModuleFilter('reading')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer ${
              moduleFilter === 'reading' ? 'bg-white text-[#34c759] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            阅读错题
          </button>
          <button
            onClick={() => setModuleFilter('listening')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer ${
              moduleFilter === 'listening' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <Headphones className="w-3 h-3" />
            听力错题
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-[#f5f5f7] p-1 rounded-full text-xs">
          <button
            onClick={() => setStatusFilter('unresolved')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
              statusFilter === 'unresolved' ? 'bg-white text-[#ff9500] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            待攻克 ({mistakes.filter(m => !m.isResolved).length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
              statusFilter === 'resolved' ? 'bg-white text-[#34c759] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            已攻破 ({mistakes.filter(m => m.isResolved).length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            全部
          </button>
        </div>
      </div>

      {/* Mistake Items List */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[#34c759] mx-auto" />
          <h3 className="text-base font-semibold text-[#1d1d1f]">当前分类下暂无错题</h3>
          <p className="text-xs text-[#86868b] max-w-sm mx-auto">
            进行阅读或听力模考时，答错的题目将自动归纳至此进行艾宾浩斯多级复盘。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((m) => {
            const correctAns = Array.isArray(m.correctAnswer) ? m.correctAnswer.join(' / ') : m.correctAnswer;
            const ebItem = getEbbinghausItem(m.id);
            const stage: MemoryStage = ebItem ? ebItem.stage : (m.isResolved ? 6 : 0);
            const stageInfo = STAGE_DESCRIPTIONS[stage];
            const retention = ebItem ? calculateRetention(ebItem) : (m.isResolved ? 98 : 40);

            return (
              <div 
                key={m.id}
                className={`bg-white rounded-3xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all space-y-4 ${
                  m.isResolved ? 'border-black/[0.04] opacity-80' : 'border-black/[0.06]'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      m.module === 'reading' 
                        ? 'bg-[#34c759]/10 text-[#34c759]' 
                        : 'bg-[#0071e3]/10 text-[#0071e3]'
                    }`}>
                      {m.module === 'reading' ? <BookOpen className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                      {m.module === 'reading' ? '阅读' : '听力'} #{m.questionNumber}
                    </span>
                    <span className="text-xs text-[#86868b]">{m.testTitle}</span>
                  </div>

                  {/* Stage badge and 1-click status */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${stageInfo.bg} ${stageInfo.color}`}>
                      {stageInfo.label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] text-[11px] font-medium">
                      留存率 {retention}%
                    </span>

                    <button
                      onClick={() => handleToggle(m.id)}
                      className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer active:scale-98 ${
                        m.isResolved
                          ? 'bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/15'
                          : 'bg-[#ff9500]/10 text-[#ff9500] hover:bg-[#ff9500]/15'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{m.isResolved ? '已攻克 (重新激活)' : '标为已攻克'}</span>
                    </button>
                  </div>
                </div>

                {/* Question text */}
                <p className="text-sm font-semibold text-[#1d1d1f] leading-snug">
                  {m.questionText}
                </p>

                {/* Answer comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#ff3b30]/5 border border-[#ff3b30]/15">
                    <span className="text-[#ff3b30] font-normal">您的失误答案: </span>
                    <span className="font-semibold text-[#ff3b30]">{m.userAnswer || '(未填)'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#34c759]/5 border border-[#34c759]/15">
                    <span className="text-[#34c759] font-normal">官方标准答案: </span>
                    <span className="font-semibold text-[#34c759]">{correctAns}</span>
                  </div>
                </div>

                {/* Root cause analysis */}
                <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.02] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[#1d1d1f] font-medium">
                    <HelpCircle className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>错题解析与失误根因:</span>
                  </div>
                  <p className="text-[#6e6e73] leading-relaxed pl-5">{m.explanation}</p>
                </div>

                {/* Spaced repetition review bar */}
                <div className="pt-2 border-t border-black/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="text-[11px] text-[#86868b] flex items-center gap-1.5 font-normal">
                    <Clock className="w-3.5 h-3.5 text-[#86868b]" />
                    <span>艾宾浩斯抗遗忘评估:</span>
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => handleEbbinghausFeedback(m, 'forgot')}
                      className="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/15 transition-all cursor-pointer"
                      title="重置回 Stage 0"
                    >
                      ❌ 仍有疑惑
                    </button>
                    <button
                      onClick={() => handleEbbinghausFeedback(m, 'hard')}
                      className="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#ff9500]/10 text-[#ff9500] hover:bg-[#ff9500]/15 transition-all cursor-pointer"
                      title="降 1 级复习"
                    >
                      ⚠️ 需再巩固
                    </button>
                    <button
                      onClick={() => handleEbbinghausFeedback(m, 'good')}
                      className="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/15 transition-all cursor-pointer"
                      title="进 1 级周期"
                    >
                      ✅ 理解考点
                    </button>
                    <button
                      onClick={() => handleEbbinghausFeedback(m, 'easy')}
                      className="flex-1 sm:flex-initial px-3 py-1 rounded-full text-[11px] font-medium bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/15 transition-all cursor-pointer"
                      title="锁定 Stage 6 永久掌握"
                    >
                      ⚡ 彻底吃透
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
