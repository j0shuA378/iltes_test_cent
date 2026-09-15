import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  RotateCw, 
  Volume2, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Flame, 
  Check, 
  Award, 
  Brain, 
  Clock, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { CORE_VOCABULARY, SYNONYM_PAIRS } from '../../data/vocabularyData';
import { getVocabProgress, updateWordStatus, toggleWordStar } from '../../services/storage';
import { 
  recordEbbinghausReview, 
  getEbbinghausItem, 
  calculateRetention, 
  STAGE_DESCRIPTIONS,
  getDueEbbinghausItems,
  getEbbinghausStats
} from '../../services/ebbinghausService';
import { VocabWord } from '../../types/ielts';
import { EbbinghausItem, MemoryStage } from '../../types/auth';

export const VocabularyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'synonyms'>('flashcards');

  // Flashcards state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, { status: string; isStarred?: boolean }>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Synonyms search
  const [synonymSearch, setSynonymSearch] = useState('');

  const reloadData = () => {
    setUserProgress(getVocabProgress());
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    reloadData();

    const handleAuthChange = () => {
      reloadData();
      setCurrentIndex(0);
      setIsFlipped(false);
    };

    window.addEventListener('ielts_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('ielts_auth_changed', handleAuthChange);
    };
  }, []);

  const categories = [
    'All',
    'DueReview',
    'Starred',
    'Academic',
    'Environment',
    'Technology',
    'Education',
    'Society',
    'Listening_Campus'
  ];

  // Filter words
  const filteredWords = CORE_VOCABULARY.filter(w => {
    const saved = userProgress[w.id];
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Starred') return !!saved?.isStarred;
    if (selectedCategory === 'DueReview') {
      const ebItem = getEbbinghausItem(`vocab_${w.id}`);
      if (!ebItem) return true; // Never reviewed
      return new Date(ebItem.nextReviewAt).getTime() <= Date.now();
    }
    return w.category === selectedCategory;
  });

  const currentWord: VocabWord | undefined = filteredWords[currentIndex] || filteredWords[0];

  // Current item's Ebbinghaus state
  const currentEbItem: EbbinghausItem | null = currentWord ? getEbbinghausItem(`vocab_${currentWord.id}`) : null;
  const currentStage: MemoryStage = currentEbItem ? currentEbItem.stage : 0;
  const currentStageInfo = STAGE_DESCRIPTIONS[currentStage];
  const currentRetention = currentEbItem ? calculateRetention(currentEbItem) : 100;

  // Global Ebbinghaus stats
  const ebStats = getEbbinghausStats();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    setIsFlipped(false);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevWord = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(filteredWords.length - 1);
    }
  };

  // 4-Level Ebbinghaus Feedback Handler
  const handleEbbinghausFeedback = (feedback: 'forgot' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;

    recordEbbinghausReview(
      `vocab_${currentWord.id}`,
      'vocab',
      currentWord.word,
      feedback,
      currentWord.chinese
    );

    // Sync legacy status
    const legacyStatus = feedback === 'forgot' ? 'unfamiliar' : feedback === 'hard' ? 'learning' : 'mastered';
    updateWordStatus(currentWord.id, legacyStatus);
    setUserProgress(prev => ({
      ...prev,
      [currentWord.id]: { ...(prev[currentWord.id] || {}), status: legacyStatus }
    }));

    setRefreshTrigger(prev => prev + 1);
    handleNextWord();
  };

  const handleToggleStar = () => {
    if (!currentWord) return;
    const isNowStarred = toggleWordStar(currentWord.id);
    setUserProgress(prev => ({
      ...prev,
      [currentWord.id]: { ...(prev[currentWord.id] || { status: 'unfamiliar' }), isStarred: isNowStarred }
    }));
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Synonyms search filtering
  const filteredSynonyms = SYNONYM_PAIRS.filter(s => {
    if (!synonymSearch.trim()) return true;
    const q = synonymSearch.toLowerCase();
    return s.coreWord.toLowerCase().includes(q) ||
      s.chinese.includes(q) ||
      s.synonyms.some(syn => syn.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* Module Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <Brain className="w-4 h-4 text-teal-400" />
            <span>IELTS Core Corpus & Ebbinghaus Spaced Repetition</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>雅思高频核心词库与同义替换宝典</span>
          </h1>
          <span className="text-xs text-slate-400 mt-0.5 inline-block">
            严格遵循艾宾浩斯 7 级记忆周期 · 听力机经拼写与学术阅读提分利器
          </span>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            艾宾浩斯闪卡
          </button>
          <button
            onClick={() => setActiveTab('synonyms')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'synonyms'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            同义替换宝典
          </button>
        </div>
      </div>

      {/* TAB 1: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Ebbinghaus Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setSelectedCategory('DueReview');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`p-3 rounded-xl border transition-all text-left ${
                selectedCategory === 'DueReview'
                  ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold">今日待强化</span>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-black text-amber-600">
                {ebStats.dueTodayCount} <span className="text-xs font-normal text-slate-500">词到期</span>
              </div>
            </button>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold">当前记忆留存率</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-black text-emerald-600">
                {ebStats.averageRetention}%
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold">已达到永久掌握</span>
                <Award className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-xl font-black text-indigo-600">
                {ebStats.masteredCount} <span className="text-xs font-normal text-slate-500">词牢固</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold">总词汇量收录</span>
                <BookMarked className="w-3.5 h-3.5 text-teal-500" />
              </div>
              <div className="text-xl font-black text-teal-700">
                {CORE_VOCABULARY.length} <span className="text-xs font-normal text-slate-500">核心词</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const isDueCat = cat === 'DueReview';
              let label = cat;
              if (cat === 'All') label = '全部核心词';
              else if (cat === 'DueReview') label = `🧠 今日待复习 (${ebStats.dueTodayCount})`;
              else if (cat === 'Starred') label = '⭐ 收藏夹';
              else if (cat === 'Listening_Campus') label = '听力校园场景';
              else if (cat === 'Academic') label = '学术高频词';
              else if (cat === 'Environment') label = '环境与生态';
              else if (cat === 'Technology') label = '科学与技术';
              else if (cat === 'Education') label = '教育与成长';
              else if (cat === 'Society') label = '社会与发展';

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? isDueCat
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'bg-teal-600 text-white shadow-sm'
                      : isDueCat
                      ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {selectedCategory === 'DueReview' ? '太棒了！今日待复习词汇已全部清空' : '当前分类下暂无词汇'}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedCategory === 'DueReview'
                  ? '艾宾浩斯记忆模型已将记忆节点排至明天，您可以切换至“全部核心词”继续预习新词。'
                  : '您可以切换至其他分类或收藏词汇进行练习。'}
              </p>
              {selectedCategory === 'DueReview' && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  浏览全部核心词汇
                </button>
              )}
            </div>
          ) : currentWord ? (
            <div className="space-y-6">
              {/* Progress counter & Ebbinghaus Stage Indicator */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">词卡进度: {currentIndex + 1} / {filteredWords.length}</span>
                  <span className="text-slate-300">|</span>
                  <span className="capitalize">{currentWord.category}</span>
                </div>

                {/* Ebbinghaus Stage Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${currentStageInfo.bg} ${currentStageInfo.color}`}>
                    {currentStageInfo.label}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                    留存率 {currentRetention}%
                  </span>
                </div>
              </div>

              {/* The 3D Flashcard Container */}
              <div 
                onClick={handleFlip}
                className="bg-white rounded-2xl p-8 sm:p-12 border-2 border-teal-100 shadow-lg min-h-[320px] flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-all select-none relative"
              >
                {/* Top star and audio icons */}
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar();
                    }}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                    title="收藏单词"
                  >
                    <Star className={`w-5 h-5 ${userProgress[currentWord.id]?.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    {currentEbItem && (
                      <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                        累计复盘 {currentEbItem.reviewCount} 次
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.word);
                      }}
                      className="p-2 rounded-full hover:bg-teal-50 text-teal-600 flex items-center gap-1 text-xs font-medium"
                      title="播放英音发音"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>发音</span>
                    </button>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="text-center my-auto space-y-3">
                  {!isFlipped ? (
                    /* Front side */
                    <div className="space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {currentWord.word}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <span className="font-mono text-teal-700 font-semibold">{currentWord.phonetic}</span>
                        <span>·</span>
                        <span className="italic font-serif text-slate-600">{currentWord.partOfSpeech}</span>
                      </div>
                      <p className="text-xs text-slate-400 pt-4">点击卡片翻看中文释义、例句与同义词</p>
                    </div>
                  ) : (
                    /* Back side */
                    <div className="space-y-4 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-150">
                      <div>
                        <div className="text-2xl font-bold text-teal-900">{currentWord.chinese}</div>
                        <div className="text-xs text-slate-500 mt-1">{currentWord.meaning}</div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 text-left font-serif leading-relaxed">
                        <span className="font-bold text-slate-900 font-sans block mb-1">真题经典语境:</span>
                        "{currentWord.example}"
                      </div>

                      {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                        <div className="text-xs text-left">
                          <span className="font-bold text-slate-700 block mb-1.5">近义替换储备:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentWord.synonyms.map(syn => (
                              <span key={syn} className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[11px] font-medium border border-teal-200">
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevWord();
                    }}
                    className="hover:text-slate-700 flex items-center gap-1 font-medium"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一个</span>
                  </button>

                  <span>{isFlipped ? '点击可翻回正面' : '翻转卡片 ⟲'}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextWord();
                    }}
                    className="hover:text-slate-700 flex items-center gap-1 font-medium"
                  >
                    <span>跳过 / 下一个</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4-Level Ebbinghaus Spaced Review Action Buttons */}
              <div className="space-y-2">
                <div className="text-center text-xs font-bold text-slate-500">
                  请选择您的记忆提取状态（艾宾浩斯抗遗忘算法将自适应重新排期）
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleEbbinghausFeedback('forgot')}
                    className="py-3 px-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 transition-all shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer active:scale-95"
                  >
                    <span className="text-xs font-black">❌ 完全遗忘</span>
                    <span className="text-[10px] text-rose-500 mt-0.5">重置回 Stage 0 · 20分钟内重测</span>
                  </button>

                  <button
                    onClick={() => handleEbbinghausFeedback('hard')}
                    className="py-3 px-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-800 transition-all shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer active:scale-95"
                  >
                    <span className="text-xs font-black">⚠️ 模糊吃力</span>
                    <span className="text-[10px] text-amber-600 mt-0.5">降 1 级 · 缩短下次复习间隔</span>
                  </button>

                  <button
                    onClick={() => handleEbbinghausFeedback('good')}
                    className="py-3 px-3 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-800 transition-all shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer active:scale-95"
                  >
                    <span className="text-xs font-black">✅ 顺利想起</span>
                    <span className="text-[10px] text-teal-600 mt-0.5">进 1 级 · 推进下一稳定周期</span>
                  </button>

                  <button
                    onClick={() => handleEbbinghausFeedback('easy')}
                    className="py-3 px-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 transition-all shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer active:scale-95"
                  >
                    <span className="text-xs font-black">⚡ 极度熟练</span>
                    <span className="text-[10px] text-emerald-600 mt-0.5">跳进 2 级 · 迅速锁定永久突触</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 2: SYNONYM PAIRS */}
      {activeTab === 'synonyms' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="搜索任何英文原词、替换词或中文词义（如 increase, 解决, important）..."
              value={synonymSearch}
              onChange={(e) => setSynonymSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500 shadow-sm"
            />
          </div>

          {/* Synonym Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSynonyms.map(pair => (
              <div key={pair.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{pair.coreWord}</span>
                    <span className="text-xs text-slate-500 font-medium">({pair.chinese})</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pair.frequency === 'Essential' 
                      ? 'bg-rose-100 text-rose-800' 
                      : pair.frequency === 'High' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {pair.frequency}
                  </span>
                </div>

                {/* Replacement chips */}
                <div className="flex flex-wrap gap-1.5">
                  {pair.synonyms.map(syn => (
                    <span key={syn} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 font-bold text-xs border border-teal-200/80">
                      {syn}
                    </span>
                  ))}
                </div>

                {/* Example sentence */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-serif text-slate-700 leading-relaxed italic">
                  "{pair.sampleSentence}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
