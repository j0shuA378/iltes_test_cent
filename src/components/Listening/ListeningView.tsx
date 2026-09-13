import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Award, 
  RotateCw, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Headphones, 
  BookOpen,
  FastForward
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LISTENING_TESTS } from '../../data/listeningTests';
import { calculateListeningBand } from '../../services/scoring';
import { saveTestResult, saveMistake } from '../../services/storage';

interface ListeningViewProps {
  onRefreshMistakes?: () => void;
  selectedTestId?: string;
  onOpenSearch?: () => void;
  onOpenDictionary?: (word?: string) => void;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ 
  onRefreshMistakes,
  selectedTestId,
  onOpenSearch,
  onOpenDictionary
}) => {
  const [currentTestId, setCurrentTestId] = useState(selectedTestId || LISTENING_TESTS[0].id);

  useEffect(() => {
    if (selectedTestId) {
      setCurrentTestId(selectedTestId);
    }
  }, [selectedTestId]);

  const currentTest = LISTENING_TESTS.find(t => t.id === currentTestId) || LISTENING_TESTS[0];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Answers state
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultSummary, setResultSummary] = useState<{ rawScore: number; total: number; band: number } | null>(null);

  // Reset when test changes
  useEffect(() => {
    setActiveSectionIndex(0);
    setIsPlaying(false);
    setShowTranscript(false);
    setAnswers({});
    setIsSubmitted(false);
    setResultSummary(null);
    if (synthRef.current) synthRef.current.cancel();
  }, [currentTestId]);

  const activeSection = currentTest.sections[activeSectionIndex];
  const allQuestions = currentTest.sections.flatMap(s => s.questions);
  const totalQuestions = allQuestions.length;

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle Playback with Web Speech API
  const togglePlayAudio = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      synthRef.current.cancel();
      // Join dialogue lines into a continuous speech
      const textToRead = activeSection.transcript
        .map(t => `${t.speaker}: ${t.text}`)
        .join('. ');

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = playbackRate;
      utterance.lang = 'en-GB'; // Prefer British English

      // Select British or English voice if available
      const voices = synthRef.current.getVoices();
      const britishVoice = voices.find(v => v.lang.includes('GB') || v.lang.includes('en-AU') || v.name.includes('UK') || v.name.includes('British'));
      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  const playSingleSentence = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.lang = 'en-GB';
    synthRef.current.speak(utterance);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      togglePlayAudio(); // Restart with new rate
      setTimeout(() => togglePlayAudio(), 100);
    }
  };

  const handleAnswerChange = (questionId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleSubmitTest = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }

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
        saveMistake({
          id: `mistake_l_${q.id}_${Date.now()}`,
          module: 'listening',
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

    const band = calculateListeningBand(score);
    setResultSummary({ rawScore: score, total: totalQuestions, band });
    setIsSubmitted(true);

    saveTestResult({
      id: `res_l_${Date.now()}`,
      module: 'listening',
      testId: currentTest.id,
      testTitle: currentTest.title,
      score,
      band,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: 1800,
      answers
    });

    if (onRefreshMistakes) onRefreshMistakes();

    if (band >= 7.0) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetTest = () => {
    setAnswers({});
    setIsSubmitted(false);
    setResultSummary(null);
    setShowTranscript(false);
  };

  if (isSubmitted && resultSummary) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
            <Award className="w-4 h-4 text-sky-600" />
            听力机考阅卷完成 · 换算标准
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {currentTest.title}
          </h2>

          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-5xl font-black text-sky-600">Band {resultSummary.band.toFixed(1)}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">雅思听力等级分</div>
            </div>
            <div className="h-14 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800">{resultSummary.rawScore} / {resultSummary.total}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">原始正确题数</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetTest}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重新训练
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          {allQuestions.map(q => {
            const userAns = (answers[q.id] || '').trim();
            const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer;
            const isCorrect = Array.isArray(q.correctAnswer)
              ? q.correctAnswer.some(a => a.toLowerCase().trim() === userAns.toLowerCase())
              : userAns.toLowerCase() === q.correctAnswer.toLowerCase().trim();

            return (
              <div 
                key={q.id}
                className={`bg-white rounded-xl p-5 border shadow-sm ${
                  isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {q.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase">
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
                    <span className="text-slate-500 font-medium">您的作答: </span>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                      {userAns || '(未作答)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <span className="text-emerald-800 font-medium">官方正解: </span>
                    <span className="font-bold text-emerald-900">{correctAns}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                    <span>听力定位与考点解析 ({q.paragraphReference}):</span>
                  </div>
                  <p className="text-slate-600 pl-5">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Listening Header & Player Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
              <Headphones className="w-4 h-4" />
              <span>IELTS Official Listening Simulation</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">
              {activeSection.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {activeSection.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentTestId}
              onChange={(e) => setCurrentTestId(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 max-w-[220px] truncate"
            >
              {LISTENING_TESTS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="px-2.5 py-1.5 bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-amber-800/40 rounded-lg text-xs font-semibold"
              >
                搜题库
              </button>
            )}

            {onOpenDictionary && (
              <button
                onClick={() => onOpenDictionary()}
                className="px-2.5 py-1.5 bg-teal-950/40 text-teal-300 hover:text-teal-200 border border-teal-800/40 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3 text-teal-400" />
                <span>词典</span>
              </button>
            )}

            <button
              onClick={handleSubmitTest}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md transition-all"
            >
              交卷评分
            </button>
          </div>
        </div>

        {/* Audio Controls Bar */}
        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
          {/* Play / Pause */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayAudio}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{isPlaying ? '正在播放考场听力录音' : '点击播放音频'}</span>
                {isPlaying && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 h-2 bg-sky-400 animate-pulse"></span>
                    <span className="w-1 h-3 bg-sky-400 animate-pulse delay-75"></span>
                    <span className="w-1 h-1.5 bg-sky-400 animate-pulse delay-150"></span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">英式/澳式原生语音合成播放</span>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">播放语速:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs">
              {[0.8, 1.0, 1.2, 1.5].map(rate => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    playbackRate === rate ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Dictation / Transcript Toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showTranscript 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showTranscript ? '隐藏听力原文' : '展开精听原文 (精听跟读)'}</span>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex space-x-2 pt-1 border-t border-slate-800">
          {currentTest.sections.map((sec, idx) => (
            <button
              key={sec.sectionNumber}
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsPlaying(false);
                setActiveSectionIndex(idx);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSectionIndex === idx 
                  ? 'bg-sky-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Section {sec.sectionNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Transcript / Dictation Panel */}
      {showTranscript && (
        <div className="bg-white rounded-xl p-5 border border-indigo-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-indigo-600" />
              Section {activeSection.sectionNumber} 精听逐句跟读与点播
            </span>
            <span className="text-[11px] text-slate-400">点击单句扬声器图标可单句复读</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {activeSection.transcript.map((line, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-xs">
                <button
                  onClick={() => playSingleSentence(line.text)}
                  className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shrink-0 mt-0.5"
                  title="单句复读"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1">
                  <span className="font-bold text-slate-700">{line.speaker}: </span>
                  <span className="text-slate-600 leading-relaxed">{line.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Form Area */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Section {activeSection.sectionNumber} 答题卡 (Questions {activeSection.questions[0].id} - {activeSection.questions[activeSection.questions.length - 1].id})
          </h2>
          <span className="text-xs text-slate-500">
            共 {activeSection.questions.length} 题
          </span>
        </div>

        <div className="space-y-5">
          {activeSection.questions.map((q) => {
            const currentAns = answers[q.id] || '';

            return (
              <div 
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition-all bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {q.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {q.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-800">
                  {q.prompt}
                </p>

                {q.type === 'sentence_completion' && (
                  <input
                    type="text"
                    placeholder="输入听到的一到两个单词或数字..."
                    value={currentAns}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full sm:w-80 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
                  />
                )}

                {q.type === 'multiple_choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map(opt => (
                      <div
                        key={opt}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                          currentAns === opt
                            ? 'bg-sky-50 border-sky-500 font-semibold text-sky-900 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
