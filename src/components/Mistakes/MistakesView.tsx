import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Trash2, 
  BookOpen, 
  Headphones,
  Filter,
  Award
} from 'lucide-react';
import { getMistakes, toggleMistakeResolved } from '../../services/storage';
import { MistakeRecord } from '../../types/ielts';

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
  }, []);

  const handleToggle = (id: string) => {
    toggleMistakeResolved(id);
    reload();
  };

  const filteredMistakes = mistakes.filter(m => {
    if (moduleFilter !== 'all' && m.module !== moduleFilter) return false;
    if (statusFilter === 'unresolved' && m.isResolved) return false;
    if (statusFilter === 'resolved' && !m.isResolved) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>IELTS Mistake Notebook & Root-Cause Analysis</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            错题本与提分攻坚
          </h1>
          <span className="text-xs text-slate-400 mt-0.5 inline-block">
            记录所有做题失误，剖析生词障碍、同义替换盲区与定位偏差
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            累计收录 {mistakes.length} 题
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {/* Module Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setModuleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              moduleFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部科目
          </button>
          <button
            onClick={() => setModuleFilter('reading')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              moduleFilter === 'reading' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            阅读错题
          </button>
          <button
            onClick={() => setModuleFilter('listening')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              moduleFilter === 'listening' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            听力错题
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('unresolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'unresolved' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            待攻克 ({mistakes.filter(m => !m.isResolved).length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            已攻破 ({mistakes.filter(m => m.isResolved).length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部
          </button>
        </div>
      </div>

      {/* Mistake Items List */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">太棒了！当前分类下暂无错题</h3>
          <p className="text-xs text-slate-400">进行阅读或听力模考时，答错的题目将自动归纳至此。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((m) => {
            const correctAns = Array.isArray(m.correctAnswer) ? m.correctAnswer.join(' / ') : m.correctAnswer;

            return (
              <div 
                key={m.id}
                className={`bg-white rounded-xl p-5 border shadow-sm transition-all space-y-3 ${
                  m.isResolved ? 'border-slate-200 opacity-75' : 'border-amber-200 bg-amber-50/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                      m.module === 'reading' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {m.module === 'reading' ? <BookOpen className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                      {m.module === 'reading' ? '阅读' : '听力'} #{m.questionNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{m.testTitle}</span>
                  </div>

                  <button
                    onClick={() => handleToggle(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      m.isResolved
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{m.isResolved ? '已掌握 (重新标记)' : '点击标记为已掌握'}</span>
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  {m.questionText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-200">
                    <span className="text-red-700 font-medium">您的原答案: </span>
                    <span className="font-bold text-red-800">{m.userAnswer}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                    <span className="text-emerald-700 font-medium">官方正解: </span>
                    <span className="font-bold text-emerald-800">{correctAns}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>错题解析与反思:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">{m.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
