import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Clock, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Copy, 
  Check, 
  Save, 
  RotateCcw,
  Send,
  Sliders
} from 'lucide-react';
import { WRITING_TASKS } from '../../data/writingTasks';
import { evaluateWritingOffline, HeuristicEvaluationResult } from '../../services/scoring';
import { saveWritingSubmission } from '../../services/storage';
import { UserProfile } from '../../types/ielts';

interface WritingViewProps {
  profile: UserProfile;
  selectedTaskId?: string;
  onOpenSearch?: () => void;
}

export const WritingView: React.FC<WritingViewProps> = ({ 
  profile,
  selectedTaskId: initialTaskId,
  onOpenSearch
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId || WRITING_TASKS[0].id);

  useEffect(() => {
    if (initialTaskId) {
      setSelectedTaskId(initialTaskId);
    }
  }, [initialTaskId]);
  const currentTask = WRITING_TASKS.find(t => t.id === selectedTaskId) || WRITING_TASKS[0];

  const [essayContent, setEssayContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'model' | 'feedback'>('write');
  
  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(currentTask.recommendedMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Evaluation Result
  const [evaluationResult, setEvaluationResult] = useState<HeuristicEvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiApiKey, setAiApiKey] = useState(profile.apiKey || '');

  // Word count
  const words = essayContent.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const isWordTargetMet = wordCount >= currentTask.minWords;

  // Reset timer on task switch
  useEffect(() => {
    setSecondsLeft(currentTask.recommendedMinutes * 60);
    setIsTimerRunning(false);
    setEvaluationResult(null);
    setEssayContent('');
  }, [selectedTaskId]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEvaluate = async () => {
    if (wordCount < 10) {
      alert('请先输入至少一段文字后再进行评分评估！');
      return;
    }

    setAiLoading(true);

    // Run offline heuristic evaluation
    const result = evaluateWritingOffline(essayContent, currentTask.minWords, currentTask.type);
    setEvaluationResult(result);
    setActiveTab('feedback');

    // Save submission to storage
    saveWritingSubmission({
      id: `write_${Date.now()}`,
      taskId: currentTask.id,
      taskType: currentTask.type,
      taskTitle: currentTask.title,
      content: essayContent,
      wordCount,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: currentTask.recommendedMinutes * 60 - secondsLeft,
      scores: result.scores,
      feedback: {
        strengths: result.feedback.strengths,
        weaknesses: result.feedback.weaknesses,
        grammarSuggestions: result.feedback.grammarSuggestions
      }
    });

    setAiLoading(false);
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentTask.sampleBand9);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Task Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <PenTool className="w-4 h-4" />
            <span>IELTS Academic Writing Studio</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            {currentTask.title}
          </h1>
          <span className="text-xs text-slate-400 mt-0.5 inline-block">
            {currentTask.category} · 要求字数至少 {currentTask.minWords} 词 · 建议耗时 {currentTask.recommendedMinutes} 分钟
          </span>
        </div>

        {/* Task dropdown selector */}
        <div className="flex items-center gap-2">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="px-3 py-2 bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-amber-800/40 rounded-lg text-xs font-semibold"
            >
              搜题库
            </button>
          )}

          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
          >
            {WRITING_TASKS.map(t => (
              <option key={t.id} value={t.id}>
                {t.type.toUpperCase()}: {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt & Visual (4 or 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Writing Prompt (试题要求)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                {currentTask.type.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {currentTask.prompt}
            </p>

            {/* Task 1 SVG Chart render if applicable */}
            {currentTask.chartSvg && (
              <div className="pt-2">
                <div 
                  className="overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: currentTask.chartSvg }}
                />
              </div>
            )}

            {/* Key Vocabulary Hints */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                推荐高分学术表达:
              </span>
              <ul className="grid grid-cols-1 gap-1 pl-4 list-disc text-slate-600">
                {currentTask.keyVocabulary.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Writing Pad, Word Count, Model & Feedback (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Navigation Bar inside Right Pane */}
          <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('write')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'write'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                写作实战
              </button>
              <button
                onClick={() => setActiveTab('model')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'model'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Band 9 官方范文
              </button>
              {evaluationResult && (
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'feedback'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  评分报告 (Band {evaluationResult.scores.overall.toFixed(1)})
                </button>
              )}
            </div>

            {/* Timer Controller */}
            <div className="flex items-center gap-2 pr-2">
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{formatTimer(secondsLeft)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-xs px-2 py-1 bg-slate-800 text-white rounded hover:bg-slate-700"
              >
                {isTimerRunning ? '暂停' : '开始计时'}
              </button>
            </div>
          </div>

          {/* TAB 1: Real-time Writing Canvas */}
          {activeTab === 'write' && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              {/* Word Count Indicator Bar */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">字数统计:</span>
                  <span className={`font-bold text-sm ${isWordTargetMet ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {wordCount} 词
                  </span>
                  <span className="text-slate-400">/ 最低要求 {currentTask.minWords} 词</span>
                </div>

                {isWordTargetMet ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> 已达标
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                    <AlertTriangle className="w-4 h-4" /> 还差 {currentTask.minWords - wordCount} 词
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 transition-all ${isWordTargetMet ? 'bg-emerald-500' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, Math.round((wordCount / currentTask.minWords) * 100))}%` }}
                />
              </div>

              {/* Textarea */}
              <textarea
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                placeholder="在此输入您的学术英语作文... 请注意分段，使用标准学术词汇，避免缩写 (如 don't, can't)。"
                rows={16}
                className="w-full p-4 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed bg-slate-50/50"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setEssayContent('')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  清空重写
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={aiLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiLoading ? '正在进行考官标准批改...' : '智能考官评卷'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Band 9 Model Essay */}
          {activeTab === 'model' && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-xs">
                    Band 9.0 满分范文
                  </span>
                  <span className="text-xs text-slate-500">剑桥考官示范作答</span>
                </div>

                <button
                  onClick={handleCopyModel}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制范文' : '一键复制'}</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-serif leading-relaxed text-slate-800 whitespace-pre-line">
                {currentTask.sampleBand9}
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-xs space-y-2">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  考官范文深度架构点评:
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {currentTask.sampleAnalysis}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AI / Heuristic Feedback Report */}
          {activeTab === 'feedback' && evaluationResult && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
              {/* Score summary 4 dimensions */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-400 font-semibold">四维官方评测结果</span>
                  <div className="text-3xl font-black mt-0.5">
                    Band {evaluationResult.scores.overall.toFixed(1)}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <div className="text-sm font-bold text-amber-400">{evaluationResult.scores.tr.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-300 uppercase">TR</div>
                  </div>
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <div className="text-sm font-bold text-sky-400">{evaluationResult.scores.cc.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-300 uppercase">CC</div>
                  </div>
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <div className="text-sm font-bold text-emerald-400">{evaluationResult.scores.lr.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-300 uppercase">LR</div>
                  </div>
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <div className="text-sm font-bold text-purple-400">{evaluationResult.scores.gra.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-300 uppercase">GRA</div>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  作答亮点与达成项 (Strengths):
                </span>
                <div className="space-y-1.5 pl-5 text-xs text-slate-700">
                  {evaluationResult.feedback.strengths.map((s, idx) => (
                    <div key={idx} className="list-item">{s}</div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              {evaluationResult.feedback.weaknesses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    待提升维度 (Areas for Improvement):
                  </span>
                  <div className="space-y-1.5 pl-5 text-xs text-slate-700">
                    {evaluationResult.feedback.weaknesses.map((w, idx) => (
                      <div key={idx} className="list-item">{w}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar & Academic Style suggestions */}
              {evaluationResult.feedback.grammarSuggestions.length > 0 && (
                <div className="bg-red-50/70 p-3.5 rounded-lg border border-red-200 text-xs space-y-1.5">
                  <span className="font-bold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    语法规范与学术习惯提醒:
                  </span>
                  <ul className="pl-4 list-disc text-red-700 space-y-1">
                    {evaluationResult.feedback.grammarSuggestions.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
