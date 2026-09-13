import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Volume2, 
  BookMarked, 
  Star, 
  Sparkles, 
  History, 
  ArrowRight,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { LOCAL_DICTIONARY, DictionaryEntry, lookupWord, getWordSuggestions } from '../../data/dictionaryData';
import { toggleWordStar, getVocabProgress } from '../../services/storage';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [currentEntry, setCurrentEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'substantial', 'rewilding', 'mitigate', 'apple', 'equilibrium', 'telecommuting'
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // When modal opens or initialQuery changes
  useEffect(() => {
    if (isOpen) {
      if (initialQuery && initialQuery.trim()) {
        const clean = initialQuery.trim();
        setSearchTerm(clean);
        executeSearch(clean);
      } else if (!currentEntry) {
        executeSearch('substantial');
      }
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen, initialQuery]);

  // Update suggestions on input change
  const handleInputChange = (val: string) => {
    setSearchTerm(val);
    if (val.trim().length >= 2) {
      setSuggestions(getWordSuggestions(val));
    } else {
      setSuggestions([]);
    }
  };

  const executeSearch = async (word: string) => {
    if (!word || !word.trim()) return;
    // Strip any extra prompt text if user clicked a suggestion like "substantial (大量的...)"
    const cleanWord = word.split(' ')[0].trim();

    setIsLoading(true);
    setHasSearched(true);
    setSuggestions([]);

    const entry = await lookupWord(cleanWord);
    setCurrentEntry(entry);
    setIsLoading(false);

    if (entry) {
      const progress = getVocabProgress();
      setIsStarred(!!progress[entry.word]?.isStarred);

      // Add to recents
      setRecentSearches(prev => {
        const filtered = prev.filter(w => w.toLowerCase() !== entry.word.toLowerCase());
        return [entry.word, ...filtered].slice(0, 8);
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const british = voices.find(v => v.lang.includes('GB') || v.name.includes('UK') || v.name.includes('British'));
      if (british) utterance.voice = british;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStarToggle = () => {
    if (!currentEntry) return;
    const nowStarred = toggleWordStar(currentEntry.word);
    setIsStarred(nowStarred);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleUp max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dictionary Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">雅思即时学术词典 (IELTS Lexicon)</h2>
              <p className="text-[11px] text-slate-400">中英双向即时搜寻 · 权威释义 · 真题语境 · 原生发音</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar with Suggestions */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="输入任何英文或中文（如 substantial, apple, 解决, 环境）..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              查询
            </button>
          </form>

          {/* Auto-complete Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-4 right-4 top-[58px] z-20 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slideDown">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] text-slate-400 font-semibold border-b border-slate-100">
                实时匹配建议:
              </div>
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setSearchTerm(s.split(' ')[0]);
                    executeSearch(s.split(' ')[0]);
                  }}
                  className="px-3.5 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold">{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              ))}
            </div>
          )}

          {/* Quick Recommendations & Recents */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 text-xs">
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <History className="w-3 h-3 text-slate-400" />
              高频/最近:
            </span>
            {recentSearches.map(word => (
              <button
                key={word}
                type="button"
                onClick={() => {
                  setSearchTerm(word);
                  executeSearch(word);
                }}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 text-[11px] font-medium transition-all hover:border-teal-300"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-medium animate-pulse">正在检索词库与学术例句...</p>
            </div>
          ) : currentEntry ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Word Title & Pronunciation Header Card */}
              <div className="bg-gradient-to-br from-teal-50/60 via-slate-50 to-white p-5 rounded-2xl border border-teal-200/80 shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {currentEntry.word}
                    </h1>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-serif font-bold rounded-md">
                      {currentEntry.partOfSpeech}
                    </span>
                    {currentEntry.ieltsBand && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                        {currentEntry.ieltsBand}
                      </span>
                    )}
                  </div>

                  {/* Phonetic & Audio Trigger */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm text-teal-700 font-medium">
                      {currentEntry.phonetic}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(currentEntry.word)}
                      className={`p-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                        isPlayingAudio 
                          ? 'bg-teal-500 text-white animate-pulse' 
                          : 'bg-white hover:bg-teal-50 text-teal-700 border border-teal-200'
                      }`}
                      title="点击收听英音标准发音"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] pr-1">英音发音</span>
                    </button>
                  </div>
                </div>

                {/* Star / Save to Wordbook */}
                <button
                  type="button"
                  onClick={handleStarToggle}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isStarred
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-amber-600'
                  }`}
                  title="收藏至我的个人生词库"
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                  <span>{isStarred ? '已收入生词本' : '收藏生词'}</span>
                </button>
              </div>

              {/* Chinese Meaning */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                  中文释义
                </span>
                <p className="text-base font-bold text-slate-900">
                  {currentEntry.chinese}
                </p>
              </div>

              {/* English Definition */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  English Definition (英英释义)
                </span>
                <p className="text-slate-700 font-serif leading-relaxed italic">
                  "{currentEntry.definition}"
                </p>
              </div>

              {/* Real IELTS Context Example */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  真题例句 / 权威语境
                </span>
                <p className="text-slate-800 font-serif leading-relaxed pl-3 border-l-2 border-amber-400">
                  "{currentEntry.example}"
                </p>
              </div>

              {/* Synonyms & Collocations */}
              {(currentEntry.synonyms || currentEntry.collocations) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentEntry.synonyms && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        学术近义替换 (Synonyms)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentEntry.synonyms.map(syn => (
                          <button
                            key={syn}
                            type="button"
                            onClick={() => {
                              setSearchTerm(syn);
                              executeSearch(syn);
                            }}
                            className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[11px] font-medium border border-teal-200/80 hover:bg-teal-100 transition-colors"
                          >
                            {syn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentEntry.collocations && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        考官高频搭配 (Collocations)
                      </span>
                      <div className="space-y-1 pl-2">
                        {currentEntry.collocations.map((col, idx) => (
                          <div key={idx} className="text-slate-700 font-medium list-item">
                            {col}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : hasSearched ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  未直接检索到单词 "{searchTerm}"
                </p>
                <p className="text-xs text-slate-500">
                  可能存在拼写偏差，您可以点击下方推荐词或重新输入：
                </p>
              </div>

              {/* Helpful suggestions */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-2">
                {['substantial', 'rewilding', 'mitigate', 'biodiversity', 'curriculum', 'architecture'].map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setSearchTerm(w);
                      executeSearch(w);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <span>💡 提示：支持中英双向搜索，在阅读文章中双击或圈选词汇也可一键查词</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
