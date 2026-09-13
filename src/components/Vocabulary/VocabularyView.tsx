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
  Award
} from 'lucide-react';
import { CORE_VOCABULARY, SYNONYM_PAIRS } from '../../data/vocabularyData';
import { getVocabProgress, updateWordStatus, toggleWordStar } from '../../services/storage';
import { VocabWord } from '../../types/ielts';

export const VocabularyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'synonyms'>('flashcards');

  // Flashcards state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, { status: string; isStarred?: boolean }>>({});
  
  // Synonyms search
  const [synonymSearch, setSynonymSearch] = useState('');

  useEffect(() => {
    setUserProgress(getVocabProgress());
  }, []);

  const categories = ['All', 'Academic', 'Environment', 'Technology', 'Education', 'Society', 'Listening_Campus', 'Starred'];

  const filteredWords = CORE_VOCABULARY.filter(w => {
    const saved = userProgress[w.id];
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Starred') return !!saved?.isStarred;
    return w.category === selectedCategory;
  });

  const currentWord: VocabWord | undefined = filteredWords[currentIndex] || filteredWords[0];

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

  const handleStatusChange = (status: 'unfamiliar' | 'learning' | 'mastered') => {
    if (!currentWord) return;
    updateWordStatus(currentWord.id, status);
    setUserProgress(prev => ({
      ...prev,
      [currentWord.id]: { ...(prev[currentWord.id] || {}), status }
    }));
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Module Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <BookMarked className="w-4 h-4" />
            <span>IELTS Core Corpus & Lexical Bank</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            雅思高频核心词库与同义替换宝典
          </h1>
          <span className="text-xs text-slate-400 mt-0.5 inline-block">
            突破听力机经拼写与学术阅读提分必备词汇积累
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
            核心词汇闪卡
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
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? '全部场景' : cat === 'Starred' ? '⭐ 收藏词汇' : cat}
              </button>
            ))}
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <p className="text-slate-500 text-sm">该场景下暂无词汇或暂无收藏词汇。</p>
            </div>
          ) : currentWord ? (
            <div className="space-y-6">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>词卡进度: {currentIndex + 1} / {filteredWords.length}</span>
                <span className="capitalize">当前分类: {currentWord.category}</span>
              </div>

              {/* The 3D Flashcard Container */}
              <div 
                onClick={handleFlip}
                className="bg-white rounded-2xl p-8 sm:p-12 border-2 border-teal-100 shadow-lg min-h-[300px] flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-all select-none relative"
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentWord.word);
                    }}
                    className="p-2 rounded-full hover:bg-teal-50 text-teal-600 flex items-center gap-1 text-xs font-medium"
                    title="播放发音"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>发音</span>
                  </button>
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
                        <span className="font-mono text-teal-700">{currentWord.phonetic}</span>
                        <span>·</span>
                        <span className="italic font-serif">{currentWord.partOfSpeech}</span>
                      </div>
                      <p className="text-xs text-slate-400 pt-4">点击卡片翻看中文释义、例句与同义词</p>
                    </div>
                  ) : (
                    /* Back side */
                    <div className="space-y-4 max-w-md mx-auto">
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
                          <span className="font-bold text-slate-700 block mb-1.5">近义词替换:</span>
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
                <div className="text-center text-[11px] text-slate-400">
                  {isFlipped ? '点击可翻回正面' : '翻转卡片 ⟲'}
                </div>
              </div>

              {/* Master / Review Rating Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleStatusChange('unfamiliar')}
                  className="py-3 px-4 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>❌ 不熟悉 / 遗忘</span>
                </button>
                <button
                  onClick={() => handleStatusChange('learning')}
                  className="py-3 px-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>⚠️ 模糊 / 需复习</span>
                </button>
                <button
                  onClick={() => handleStatusChange('mastered')}
                  className="py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>✅ 已完全掌握</span>
                </button>
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
