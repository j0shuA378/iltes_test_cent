import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Highlighter, 
  StickyNote, 
  Trash2, 
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { READING_TESTS } from '../../data/readingTests';
import { calculateReadingBand } from '../../services/scoring';
import { saveTestResult, saveMistake } from '../../services/storage';
import { Question } from '../../types/ielts';
import { QuickWordPopover } from '../Dictionary/QuickWordPopover';

interface ReadingViewProps {
  onRefreshMistakes?: () => void;
  selectedTestId?: string;
  onOpenSearch?: () => void;
  onOpenDictionary?: (word?: string) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ 
  onRefreshMistakes, 
  selectedTestId,
  onOpenSearch,
  onOpenDictionary 
}) => {
  const [currentTestId, setCurrentTestId] = useState(selectedTestId || READING_TESTS[0].id);
  
  useEffect(() => {
    if (selectedTestId) {
      setCurrentTestId(selectedTestId);
    }
  }, [selectedTestId]);

  const currentTest = READING_TESTS.find(t => t.id === currentTestId) || READING_TESTS[0];
  const [activePassageIndex, setActivePassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [currentQuestionId, setCurrentQuestionId] = useState(1);

  // Reset when test changes
  useEffect(() => {
    setActivePassageIndex(0);
    setAnswers({});
    setFlagged({});
    setIsSubmitted(false);
    setResultSummary(null);
    setSecondsRemaining(60 * 60);
    setCurrentQuestionId(1);
  }, [currentTestId]);
  
  // Highlights & Notes state
  const [highlights, setHighlights] = useState<{ id: string; text: string; color: string; note?: string }[]>([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showHighlightMenu, setShowHighlightMenu] = useState<{ 
    x: number; 
    y: number; 
    rectCenter?: number; 
    rectTop?: number; 
    rectBottom?: number; 
  } | null>(null);
  const [inlineQuickDef, setInlineQuickDef] = useState<{
    word: string;
    x: number;
    y: number;
  } | null>(null);
  
  // Timer (60 mins = 3600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(60 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Result state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultSummary, setResultSummary] = useState<{ rawScore: number; total: number; band: number } | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');

  const currentPassage = currentTest.passages[activePassageIndex];

  // All questions flattened
  const allQuestions: Question[] = currentTest.passages.flatMap(p => p.questions);
  const totalQuestions = allQuestions.length;

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || isTimerPaused) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, isTimerPaused]);

  // Handle Text Selection for Highlighting
  const handlePassageMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setShowHighlightMenu({
        x: Math.min(window.innerWidth - 180, Math.max(10, rect.left + rect.width / 2 - 80)),
        y: Math.max(10, rect.top - 45),
        rectCenter: rect.left + rect.width / 2,
        rectTop: rect.top,
        rectBottom: rect.bottom
      });
      setInlineQuickDef(null);
    } else {
      setShowHighlightMenu(null);
    }
  };

  const addHighlight = (color: string, skipPrompt = false) => {
    if (!selectedText) return;
    const note = skipPrompt ? undefined : prompt('添加笔记批注（可选）:');
    setHighlights(prev => [
      ...prev,
      { id: Date.now().toString(), text: selectedText, color, note: note || undefined }
    ]);
    setShowHighlightMenu(null);
    setInlineQuickDef(null);
    window.getSelection()?.removeAllRanges();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const toggleFlag = (questionId: number) => {
    setFlagged(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Submit test and grade
  const handleSubmitTest = () => {
    let score = 0;
    allQuestions.forEach(q => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(a => a.toLowerCase().trim())
        : [q.correctAnswer.toLowerCase().trim()];

      const isMatch = correctAns.some(ca => userAns === ca);
      if (isMatch) {
        score++;
      } else {
        // Save to mistakes
        saveMistake({
          id: `mistake_r_${q.id}_${Date.now()}`,
          module: 'reading',
          testTitle: currentTest.title,
          questionNumber: q.id,
          questionText: q.prompt,
          questionType: q.type,
          userAnswer: answers[q.id] || '(未作答)',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          createdAt: new Date().toISOString(),
          reviewedCount: 0,
          isResolved: false
        });
      }
    });

    const band = calculateReadingBand(score);
    setResultSummary({ rawScore: score, total: totalQuestions, band });
    setIsSubmitted(true);

    // Save test result
    saveTestResult({
      id: `res_r_${Date.now()}`,
      module: 'reading',
      testId: currentTest.id,
      testTitle: currentTest.title,
      score,
      band,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: 3600 - secondsRemaining,
      answers
    });

    if (onRefreshMistakes) onRefreshMistakes();

    if (band >= 7.0) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetTest = () => {
    setAnswers({});
    setFlagged({});
    setIsSubmitted(false);
    setResultSummary(null);
    setSecondsRemaining(60 * 60);
    setCurrentQuestionId(1);
    setActivePassageIndex(0);
  };

  // If submitted, show the score report and review
  if (isSubmitted && resultSummary) {
    const questionsToDisplay = allQuestions.filter(q => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(a => a.toLowerCase().trim())
        : [q.correctAnswer.toLowerCase().trim()];
      const isCorrect = correctAns.some(ca => userAns === ca);

      if (filterMode === 'wrong') return !isCorrect;
      if (filterMode === 'correct') return isCorrect;
      return true;
    });

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Score Hero */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Award className="w-4 h-4 text-indigo-600" />
            机考阅卷完成 · 官方换算
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {currentTest.title}
          </h2>

          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-5xl font-black text-indigo-600">Band {resultSummary.band.toFixed(1)}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">雅思阅读等级分</div>
            </div>
            <div className="h-14 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800">{resultSummary.rawScore} / {resultSummary.total}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">原始正确题数</div>
            </div>
            <div className="h-14 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800">{Math.round((resultSummary.rawScore / resultSummary.total) * 100)}%</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">综合准确率</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetTest}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重新模考
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部题目 ({allQuestions.length})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filterMode === 'wrong' ? 'bg-red-500 text-white shadow-sm' : 'text-red-600 hover:text-red-700'
              }`}
            >
              错题精析 ({allQuestions.length - resultSummary.rawScore})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filterMode === 'correct' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-600 hover:text-emerald-700'
              }`}
            >
              正确题目 ({resultSummary.rawScore})
            </button>
          </div>
          <span className="text-xs text-slate-500">所有错题已自动收入「错题集」</span>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          {questionsToDisplay.map((q) => {
            const userAns = (answers[q.id] || '').trim();
            const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer;
            const isCorrect = Array.isArray(q.correctAnswer)
              ? q.correctAnswer.some(a => a.toLowerCase().trim() === userAns.toLowerCase())
              : userAns.toLowerCase() === q.correctAnswer.toLowerCase().trim();

            return (
              <div 
                key={q.id}
                className={`bg-white rounded-xl p-5 border shadow-sm transition-all ${
                  isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {q.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {q.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle className="w-4 h-4" /> 正确
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                      <XCircle className="w-4 h-4" /> 错误
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-800 mb-3">{q.prompt}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-medium">您的回答: </span>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                      {userAns || '(未作答)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <span className="text-emerald-800 font-medium">官方正解: </span>
                    <span className="font-bold text-emerald-900">{correctAns}</span>
                  </div>
                </div>

                {/* Explanation and Location */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>原文定位与考点解析 ({q.paragraphReference || '文章相关段落'}):</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Exam Interface (CDI Layout)
  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      {/* Top CDI Exam Control Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red-500" />
            <span>IELTS Academic Reading</span>
          </div>

          {/* Test Selector Dropdown */}
          <select
            value={currentTestId}
            onChange={(e) => setCurrentTestId(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-700 focus:outline-none focus:border-red-500 max-w-[220px] truncate"
          >
            {READING_TESTS.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="text-xs text-amber-300 hover:text-amber-200 px-2 py-1 bg-amber-950/40 rounded border border-amber-800/40 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>搜题库</span>
            </button>
          )}

          {onOpenDictionary && (
            <button
              onClick={() => onOpenDictionary()}
              className="text-xs text-teal-300 hover:text-teal-200 px-2.5 py-1 bg-teal-950/40 rounded border border-teal-800/40 flex items-center gap-1 font-medium"
            >
              <BookOpen className="w-3 h-3 text-teal-400" />
              <span>即时词典</span>
            </button>
          )}

          {/* Passage Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md text-xs">
            {currentTest.passages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePassageIndex(idx)}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activePassageIndex === idx
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Passage {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md font-mono text-sm font-bold border ${
            secondsRemaining < 600 
              ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
              : 'bg-slate-800 text-slate-200 border-slate-700'
          }`}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {isTimerPaused ? '继续计时' : '暂停计时'}
          </button>

          <button
            onClick={handleSubmitTest}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow transition-all hover:scale-105 active:scale-95"
          >
            交卷评分
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Passage Text */}
        <div 
          onMouseUp={handlePassageMouseUp}
          className="w-1/2 p-6 overflow-y-auto bg-white border-r border-slate-200 leading-relaxed font-serif text-[15px] text-slate-800 select-text"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <span className="text-xs font-sans font-bold text-red-600 uppercase tracking-widest">
                READING PASSAGE {currentPassage.id}
              </span>
              <h1 className="text-xl font-bold font-sans text-slate-900 mt-1">
                {currentPassage.title}
              </h1>
              {currentPassage.subtitle && (
                <p className="text-xs font-sans text-slate-500 italic mt-0.5">
                  {currentPassage.subtitle}
                </p>
              )}
            </div>

            {/* Note alert if any */}
            {highlights.length > 0 && (
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs font-sans text-amber-800 flex items-center justify-between">
                <span>已在本文中做记号/划线 {highlights.length} 处</span>
                <button 
                  onClick={() => setHighlights([])}
                  className="text-amber-700 hover:text-amber-900 font-bold"
                >
                  清除所有高亮
                </button>
              </div>
            )}

            {/* Paragraphs */}
            <div className="space-y-4 pt-2">
              {currentPassage.paragraphs.map(p => (
                <div key={p.id} className="relative pl-6">
                  <span className="absolute left-0 top-0 font-sans font-bold text-sm text-red-600 select-none">
                    [{p.id}]
                  </span>
                  <p className="text-slate-800 text-justify">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Highlighting Toolbar */}
        {showHighlightMenu && (
          <div 
            style={{ position: 'fixed', left: showHighlightMenu.x, top: showHighlightMenu.y, zIndex: 100 }}
            className="bg-slate-900 text-white shadow-xl rounded-lg px-2 py-1.5 flex items-center gap-1.5 border border-slate-700 text-xs select-none"
          >
            <button 
              onClick={() => addHighlight('yellow')}
              className="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-amber-300"
              title="黄色高亮"
            >
              <div className="w-3.5 h-3.5 rounded bg-yellow-300"></div>
              <span>高亮</span>
            </button>
            <button 
              onClick={() => addHighlight('green')}
              className="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-emerald-300"
              title="绿色高亮"
            >
              <div className="w-3.5 h-3.5 rounded bg-emerald-400"></div>
            </button>
            <button 
              onClick={() => addHighlight('pink')}
              className="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-pink-300"
              title="粉色高亮"
            >
              <div className="w-3.5 h-3.5 rounded bg-pink-400"></div>
            </button>

            {onOpenDictionary && (
              <>
                <div className="h-4 w-px bg-slate-700"></div>
                <button 
                  onClick={() => {
                    setInlineQuickDef({
                      word: selectedText,
                      x: showHighlightMenu.rectCenter || (showHighlightMenu.x + 80),
                      y: showHighlightMenu.rectTop || showHighlightMenu.y
                    });
                    setShowHighlightMenu(null);
                  }}
                  className="p-1.5 hover:bg-slate-800 rounded flex items-center gap-1 text-teal-300 font-semibold transition-colors"
                  title="即时查词典释义（不打断阅读体验）"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span>查词典</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Inline Quick Definition Popover (Direct definition display without backdrop) */}
        {inlineQuickDef && (
          <QuickWordPopover
            word={inlineQuickDef.word}
            position={{ x: inlineQuickDef.x, y: inlineQuickDef.y }}
            onClose={() => setInlineQuickDef(null)}
            onOpenFull={(w) => {
              onOpenDictionary?.(w);
              setInlineQuickDef(null);
            }}
            onHighlight={(color) => {
              addHighlight(color, true);
              setInlineQuickDef(null);
            }}
          />
        )}

        {/* Right Pane: Questions */}
        <div className="w-1/2 p-6 overflow-y-auto bg-slate-50 space-y-6">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 font-sans uppercase tracking-wider">
                Questions for Passage {currentPassage.id}
              </h2>
              <span className="text-xs text-slate-500">
                本篇包含 {currentPassage.questions.length} 题
              </span>
            </div>

            {currentPassage.questions.map((q) => {
              const currentAns = answers[q.id] || '';
              const isFlag = !!flagged[q.id];

              return (
                <div 
                  key={q.id}
                  id={`question-${q.id}`}
                  className={`bg-white rounded-xl p-5 border transition-all ${
                    currentQuestionId === q.id 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                      : 'border-slate-200 shadow-sm'
                  }`}
                  onClick={() => setCurrentQuestionId(q.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        {q.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlag(q.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                        isFlag ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Flag className={`w-3.5 h-3.5 ${isFlag ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{isFlag ? '已标记' : '标记'}</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-800 font-medium mb-3">
                    {q.prompt}
                  </p>

                  {/* Render based on Question Type */}
                  {q.type === 'true_false_not_given' && (
                    <div className="grid grid-cols-3 gap-2">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleAnswerChange(q.id, opt)}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                            currentAns === opt
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'multiple_choice' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => handleAnswerChange(q.id, opt)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            currentAns === opt
                              ? 'bg-indigo-50/80 border-indigo-500 font-semibold text-indigo-900 shadow-sm'
                              : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'matching_headings' && q.options && (
                    <div className="space-y-1.5">
                      <select
                        value={currentAns}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- 选择对应段落标题 --</option>
                        {q.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(q.type === 'sentence_completion' || q.type === 'summary_completion') && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="在此输入答案（不区分大小写）..."
                        value={currentAns}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CDI Question Navigator Ribbon */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 select-none shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">答题进度:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-1">
            {allQuestions.map((q) => {
              const hasAns = !!answers[q.id];
              const isFlag = !!flagged[q.id];
              const isCurrent = currentQuestionId === q.id;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionId(q.id);
                    const el = document.getElementById(`question-${q.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-7 h-7 rounded text-xs font-bold relative transition-all ${
                    isCurrent
                      ? 'ring-2 ring-indigo-600 ring-offset-1'
                      : ''
                  } ${
                    hasAns
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {q.id}
                  {isFlag && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            已作答 {Object.keys(answers).length} / {totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
};
