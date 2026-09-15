import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Volume2, 
  Star, 
  CheckCircle2, 
  Search, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Brain,
  Award
} from 'lucide-react';
import { CORE_VOCABULARY, SYNONYM_PAIRS } from '../../data/vocabularyData';
import { getVocabProgress, updateWordStatus, toggleWordStar } from '../../services/storage';
import { 
  recordEbbinghausReview, 
  getEbbinghausItem, 
  calculateRetention, 
  STAGE_DESCRIPTIONS,
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
  const [, setRefreshTrigger] = useState(0);
  
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
      if (!ebItem) return true;
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
      {/* Module Header (Apple Clean Style) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0071e3] font-medium mb-1.5">
            <Brain className="w-4 h-4 text-[#0071e3]" />
            <span className="uppercase tracking-wider">IELTS Core Lexicon & Spaced Repetition</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            高频核心词库与同义替换宝典
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] mt-1 font-normal">
            严格遵循艾宾浩斯 7 级记忆周期 · 听力机经拼写与学术阅读提分必备
          </p>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex items-center p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-xs">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white text-[#1d1d1f] shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            艾宾浩斯闪卡
          </button>
          <button
            onClick={() => setActiveTab('synonyms')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'synonyms'
                ? 'bg-white text-[#1d1d1f] shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            同义替换宝典
          </button>
        </div>
      </div>

      {/* TAB 1: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Ebbinghaus Quick Stats Bar (Apple Inset Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <button
              onClick={() => {
                setSelectedCategory('DueReview');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                selectedCategory === 'DueReview'
                  ? 'bg-white border-[#1d1d1f] shadow-sm'
                  : 'bg-white border-black/[0.04] hover:bg-[#f5f5f7]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#86868b] mb-1 font-normal">
                <span>今日待强化</span>
                <Clock className="w-3.5 h-3.5 text-[#86868b]" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">
                {ebStats.dueTodayCount} <span className="text-xs font-normal text-[#86868b]">词到期</span>
              </div>
            </button>

            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] text-left">
              <div className="flex items-center justify-between text-xs text-[#86868b] mb-1 font-normal">
                <span>当前记忆留存率</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#86868b]" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">
                {ebStats.averageRetention}%
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] text-left">
              <div className="flex items-center justify-between text-xs text-[#86868b] mb-1 font-normal">
                <span>已达到永久掌握</span>
                <Award className="w-3.5 h-3.5 text-[#86868b]" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">
                {ebStats.masteredCount} <span className="text-xs font-normal text-[#86868b]">词牢固</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/[0.04] text-left">
              <div className="flex items-center justify-between text-xs text-[#86868b] mb-1 font-normal">
                <span>总词汇量收录</span>
                <BookMarked className="w-3.5 h-3.5 text-[#86868b]" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] tabular-nums">
                {CORE_VOCABULARY.length} <span className="text-xs font-normal text-[#86868b]">核心词</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Apple Style) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => {
              const isDueCat = cat === 'DueReview';
              let label = cat;
              if (cat === 'All') label = '全部核心词';
              else if (cat === 'DueReview') label = `今日待复习 (${ebStats.dueTodayCount})`;
              else if (cat === 'Starred') label = '⭐ 收藏夹';
              else if (cat === 'Listening_Campus') label = '听力校园场景';
              else if (cat === 'Academic') label = '学术高频词';
              else if (cat === 'Environment') label = '环境与生态';
              else if (cat === 'Technology') label = '科学与技术';
              else if (cat === 'Education') label = '教育与成长';
              else if (cat === 'Society') label = '社会与发展';

              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? isDueCat
                        ? 'bg-[#ff9500] text-white shadow-sm'
                        : 'bg-[#1d1d1f] text-white shadow-sm'
                      : isDueCat
                      ? 'bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/25 hover:bg-[#ff9500]/15'
                      : 'bg-white border border-black/[0.06] text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#34c759] mx-auto" />
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                {selectedCategory === 'DueReview' ? '太棒了！今日待复习词汇已全部清空' : '当前分类下暂无词汇'}
              </h3>
              <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                {selectedCategory === 'DueReview'
                  ? '艾宾浩斯记忆模型已将记忆突触排期至后续周期，您可以切换至“全部核心词”继续温习新词。'
                  : '您可以切换至其他分类或添加收藏。'}
              </p>
              {selectedCategory === 'DueReview' && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className="mt-2 px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer"
                >
                  浏览全部核心词汇
                </button>
              )}
            </div>
          ) : currentWord ? (
            <div className="space-y-6">
              {/* Progress counter & Ebbinghaus Stage Indicator */}
              <div className="flex flex-wrap items-center justify-between text-xs text-[#86868b] px-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1d1d1f]">词卡进度: {currentIndex + 1} / {filteredWords.length}</span>
                  <span className="text-black/10">|</span>
                  <span className="capitalize">{currentWord.category}</span>
                </div>

                {/* Ebbinghaus Stage Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${currentStageInfo.bg} ${currentStageInfo.color}`}>
                    {currentStageInfo.label}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[#1d1d1f] text-xs font-medium">
                    留存率 {currentRetention}%
                  </span>
                </div>
              </div>

              {/* Apple Card Container */}
              <div 
                onClick={handleFlip}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.03)] min-h-[330px] flex flex-col justify-between cursor-pointer hover:border-black/[0.12] transition-all select-none relative"
              >
                {/* Top star and audio icons */}
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar();
                    }}
                    className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#86868b] cursor-pointer"
                    title="收藏单词"
                  >
                    <Star className={`w-5 h-5 ${userProgress[currentWord.id]?.isStarred ? 'fill-[#ff9500] text-[#ff9500]' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    {currentEbItem && (
                      <span className="text-[11px] text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-black/[0.02]">
                        累计复盘 {currentEbItem.reviewCount} 次
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.word);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3] flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                      title="播放英音发音"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>发音</span>
                    </button>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="text-center my-auto space-y-3">
                  {!isFlipped ? (
                    /* Front side */
                    <div className="space-y-2">
                      <h2 className="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
                        {currentWord.word}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-sm text-[#86868b]">
                        <span className="font-mono text-[#0071e3] font-medium">{currentWord.phonetic}</span>
                        <span>·</span>
                        <span className="italic font-serif">{currentWord.partOfSpeech}</span>
                      </div>
                      <p className="text-xs text-[#86868b] pt-4 font-normal">轻点卡片翻看释义与语境例句</p>
                    </div>
                  ) : (
                    /* Back side */
                    <div className="space-y-4 max-w-md mx-auto animate-fadeIn">
                      <div>
                        <div className="text-2xl font-semibold text-[#1d1d1f]">{currentWord.chinese}</div>
                        <div className="text-xs text-[#86868b] mt-1">{currentWord.meaning}</div>
                      </div>

                      <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.02] text-xs text-[#1d1d1f] text-left font-serif leading-relaxed">
                        <span className="font-medium text-[#1d1d1f] font-sans block mb-1">真题经典语境:</span>
                        "{currentWord.example}"
                      </div>

                      {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                        <div className="text-xs text-left">
                          <span className="font-medium text-[#86868b] block mb-1.5">近义替换储备:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentWord.synonyms.map(syn => (
                              <span key={syn} className="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-medium border border-[#0071e3]/15">
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
                <div className="flex items-center justify-between text-[11px] text-[#86868b] pt-2 border-t border-black/[0.04]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevWord();
                    }}
                    className="hover:text-[#1d1d1f] flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一个</span>
                  </button>

                  <span>{isFlipped ? '轻点翻回正面' : '翻转卡片 ⟲'}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextWord();
                    }}
                    className="hover:text-[#1d1d1f] flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>下一个</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4-Level Ebbinghaus Spaced Review Action Buttons (Apple Pill Cards) */}
              <div className="space-y-2">
                <div className="text-center text-xs font-medium text-[#86868b]">
                  评估记忆提取状态（艾宾浩斯抗遗忘算法将自适应重新排期）
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleEbbinghausFeedback('forgot')}
                    className="py-3 px-3 rounded-2xl border border-[#ff3b30]/20 bg-[#ff3b30]/5 hover:bg-[#ff3b30]/10 text-[#ff3b30] transition-all shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer active:scale-98"
                  >
                    <span className="text-xs font-semibold">❌ 完全遗忘</span>
                    <span className="text-[10px] opacity-80 mt-0.5 font-normal">归零 Stage 0 · 20分内重测</span>
                  </button>

                  <button
                    onClick={() => handleEbbinghausFeedback('hard')}
                    className="py-3 px-3 rounded-2xl border border-[#ff9500]/20 bg-[#ff9500]/5 hover:bg-[#ff9500]/10 text-[#ff9500] transition-all shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer active:scale-98"
                  >
                    <span className="text-xs font-semibold">⚠️ 模糊吃力</span>
                    <span className="text-[10px] opacity-80 mt-0.5 font-normal">降 1 级 · 缩短下次间隔</span>
                  </button>

                  <button
                    onClick={() => handleEbbinghausFeedback('good')}
                    className="py-3 px-3 rounded-2xl border border-[#34c759]/20 bg-[#34c759]/5 hover:bg-[#34c759]/10 text-[#34c759] transition-all shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer active:scale-98"
                  >
                    <span className="text-xs font-semibold">✅ 顺利想起</span>
                    <span className="text-[10px] opacity-80 mt-0.5 font-normal">进 1 级 · 推进下一周期</span>
                  </button>

                  <button
                    onClick={() => handleEbbinghausFeedback('easy')}
                    className="py-3 px-3 rounded-2xl border border-[#0071e3]/20 bg-[#0071e3]/5 hover:bg-[#0071e3]/10 text-[#0071e3] transition-all shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer active:scale-98"
                  >
                    <span className="text-xs font-semibold">⚡ 极度熟练</span>
                    <span className="text-[10px] opacity-80 mt-0.5 font-normal">跳进 2 级 · 锁定永久记忆</span>
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
          {/* Apple Style Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="搜索英文原词、替换词或中文释义（如 increase, 解决, important）..."
              value={synonymSearch}
              onChange={(e) => setSynonymSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 shadow-2xs"
            />
          </div>

          {/* Synonym Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSynonyms.map(pair => (
              <div key={pair.id} className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 hover:border-black/[0.1] transition-all">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1d1d1f] text-sm">{pair.coreWord}</span>
                    <span className="text-xs text-[#86868b] font-normal">({pair.chinese})</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    pair.frequency === 'Essential' 
                      ? 'bg-[#ff3b30]/10 text-[#ff3b30]' 
                      : pair.frequency === 'High' 
                      ? 'bg-[#ff9500]/10 text-[#ff9500]' 
                      : 'bg-[#0071e3]/10 text-[#0071e3]'
                  }`}>
                    {pair.frequency}
                  </span>
                </div>

                {/* Replacement chips */}
                <div className="flex flex-wrap gap-1.5">
                  {pair.synonyms.map(syn => (
                    <span key={syn} className="px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-medium text-xs border border-[#0071e3]/15">
                      {syn}
                    </span>
                  ))}
                </div>

                {/* Example sentence */}
                <div className="bg-[#f5f5f7] p-3 rounded-2xl border border-black/[0.02] text-xs font-serif text-[#1d1d1f] leading-relaxed italic">
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
