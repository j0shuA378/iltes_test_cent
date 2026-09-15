import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  Target, 
  Clock, 
  Award, 
  HelpCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import { 
  PLACEMENT_QUESTIONS, 
  PlacementQuestion, 
  evaluatePlacementScore, 
  PlacementEvaluation 
} from '../../data/placementTestData';
import { updateUserPlacement } from '../../services/authService';
import { UserAccount } from '../../types/auth';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserAccount;
  onCompleted?: (resultBand: number) => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  onCompleted
}) => {
  // Mode: 'intro' | 'testing' | 'report'
  const [step, setStep] = useState<'intro' | 'testing' | 'report'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [evaluation, setEvaluation] = useState<PlacementEvaluation | null>(null);
  const [rawScore, setRawScore] = useState(0);

  if (!isOpen) return null;

  const currentQuestion: PlacementQuestion = PLACEMENT_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / PLACEMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (key: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: key
    }));
  };

  const handleNext = () => {
    if (currentIndex < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate results
      finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const finishTest = () => {
    let correctCount = 0;
    PLACEMENT_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const evalResult = evaluatePlacementScore(correctCount);
    setRawScore(correctCount);
    setEvaluation(evalResult);
    setStep('report');
  };

  const handleApplyPlacement = () => {
    if (!evaluation) return;

    updateUserPlacement(activeUser.id, {
      testedBand: evaluation.testedBand,
      rawScore,
      totalQuestions: PLACEMENT_QUESTIONS.length,
      levelSummary: evaluation.levelTitle
    });

    if (onCompleted) {
      onCompleted(evaluation.testedBand);
    }
    onClose();
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setStep('testing');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none">
      <div 
        className="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-2xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-black/[0.08] overflow-hidden flex flex-col animate-scaleUp max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar (Apple Sheet Style) */}
        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-[#1d1d1f]">
                雅思初始学术水平摸底测验
              </h2>
              <span className="text-[11px] text-[#86868b] font-normal">
                3分钟极简定级 · 专属 178 天路线图基准校准
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
            title="关闭 (仍为 0.0 未定级状态)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: INTRO SCREEN */}
        {step === 'intro' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                欢迎开启雅思备考之旅
              </h1>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                所有新学员默认初始分为 <span className="font-semibold text-[#ff9500]">Band 0.0</span>。通过 6 道涵盖核心词汇、语法逻辑、长难句与真题题型的简易摸底题，精准测定您的起点基线。
              </p>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0071e3]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>极速 3 分钟</span>
                </div>
                <p className="text-[11px] text-[#86868b]">无需整套长篇模考，6 道代表性小题快速定位。</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34c759]">
                  <Target className="w-3.5 h-3.5" />
                  <span>精准阶梯定级</span>
                </div>
                <p className="text-[11px] text-[#86868b]">科学映射 Band 3.5 ~ 6.0 起始水平，不虚高、不盲目。</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#af52de]">
                  <Award className="w-3.5 h-3.5" />
                  <span>动态定制方案</span>
                </div>
                <p className="text-[11px] text-[#86868b]">即刻调优 178 天 4 阶段备考配额与艾宾浩斯突触复习。</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setStep('testing')}
                className="w-full sm:w-auto px-8 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>立即开始 3 分钟定级测验</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] text-xs font-medium rounded-full transition-colors cursor-pointer"
              >
                稍后测验 (保留 0.0 分)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TESTING QUESTION CAROUSEL */}
        {step === 'testing' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Progress Bar & Counter */}
            <div className="px-6 pt-4 pb-2 shrink-0">
              <div className="flex items-center justify-between text-xs text-[#86868b] mb-1.5">
                <span className="font-medium text-[#1d1d1f]">
                  第 {currentIndex + 1} / {PLACEMENT_QUESTIONS.length} 题
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-medium text-[11px]">
                  {currentQuestion.category}
                </span>
              </div>
              <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[#0071e3] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-[#1d1d1f] leading-snug">
                  {currentQuestion.title}
                </h3>

                {/* Context snippet if any */}
                {currentQuestion.context && (
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.03] text-xs text-[#1d1d1f] font-serif leading-relaxed italic">
                    "{currentQuestion.context}"
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#424245] leading-relaxed whitespace-pre-line font-normal">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map(opt => {
                  const isSelected = userAnswers[currentQuestion.id] === opt.key;

                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/15 shadow-sm' 
                          : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]/80 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                          isSelected ? 'bg-[#0071e3] text-white' : 'bg-white text-[#86868b] border border-black/[0.04]'
                        }`}>
                          {opt.key}
                        </span>
                        <span className={`text-xs sm:text-sm ${isSelected ? 'font-medium text-[#1d1d1f]' : 'text-[#424245]'}`}>
                          {opt.text}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar Footer */}
            <div className="px-6 py-4 border-t border-black/[0.04] bg-[#fbfbfd] flex items-center justify-between shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  currentIndex === 0 
                    ? 'opacity-30 cursor-not-allowed text-[#86868b]' 
                    : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一题</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNext}
                  disabled={!userAnswers[currentQuestion.id]}
                  className={`px-6 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    !userAnswers[currentQuestion.id]
                      ? 'bg-black/[0.05] text-[#86868b] cursor-not-allowed'
                      : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm cursor-pointer active:scale-98'
                  }`}
                >
                  <span>{currentIndex === PLACEMENT_QUESTIONS.length - 1 ? '提交并生成报告' : '下一题'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DIAGNOSTIC REPORT SCREEN */}
        {step === 'report' && evaluation && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-3xl bg-[#34c759]/10 text-[#34c759] flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                初始水平定级报告已生成
              </h2>
              <p className="text-xs text-[#86868b]">
                恭喜完成入学会考！系统已测得您的起始水平基线
              </p>
            </div>

            {/* Primary Score Badge Card (Apple Health style) */}
            <div className="p-6 rounded-3xl bg-[#f5f5f7] border border-black/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <span className="text-xs font-medium text-[#86868b] uppercase tracking-wider block mb-1">
                  经测定初始成绩 (Baseline Band)
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
                    Band {evaluation.testedBand.toFixed(1)}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#34c759]/10 text-[#34c759]">
                    答对 {rawScore}/6 题
                  </span>
                </div>
                <div className="text-xs text-[#86868b] mt-1 font-medium">
                  等级判定：{evaluation.levelTitle}
                </div>
              </div>

              <div className="h-10 w-px bg-black/[0.08] hidden sm:block"></div>

              <div className="space-y-1">
                <div className="text-xs text-[#86868b]">冲刺目标分数</div>
                <div className="text-2xl font-semibold text-[#0071e3]">
                  Band {activeUser.targetBand.toFixed(1)}
                </div>
                <div className="text-[11px] text-[#ff9500] font-medium">
                  提分空间：+{((activeUser.targetBand - evaluation.testedBand)).toFixed(1)} 分
                </div>
              </div>
            </div>

            {/* Detailed Advice & Recommendation */}
            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0071e3]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>备考诊断与路线建议</span>
              </div>
              <p className="text-xs text-[#1d1d1f] leading-relaxed font-normal">
                {evaluation.summary}
              </p>
              <p className="text-xs text-[#86868b] leading-relaxed font-normal pt-1 border-t border-black/[0.04]">
                💡 <strong>行动指南：</strong>{evaluation.advice}
              </p>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#1d1d1f]">
                6 大维度作答与考点剖析
              </div>
              <div className="space-y-2">
                {PLACEMENT_QUESTIONS.map(q => {
                  const isCorrect = userAnswers[q.id] === q.correctAnswer;
                  return (
                    <div 
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-[#fbfbfd] border border-black/[0.04] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#1d1d1f]">
                          {q.id}. {q.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isCorrect ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                        }`}>
                          {isCorrect ? '✓ 正确' : '✗ 需加强'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#86868b] leading-relaxed">
                        考点：{q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-black/[0.08] hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新摸底</span>
              </button>

              <button
                onClick={handleApplyPlacement}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>保存定级并开启专属路线图</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
