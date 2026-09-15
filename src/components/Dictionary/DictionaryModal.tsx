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
  HelpCircle
} from 'lucide-react';
import { DictionaryEntry, lookupWord, getWordSuggestions } from '../../data/dictionaryData';
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
      
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStarToggle = () => {
    if (!currentEntry) return;
    const next = toggleWordStar(currentEntry.word);
    setIsStarred(next);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-fadeIn select-none">
      <div 
        className="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-2xl shadow-[0_24px_80px_rgba(0,0,0,0.16)] border border-black/[0.08] overflow-hidden my-8 flex flex-col max-h-[88vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dictionary Modal Header (Apple Sheet Style) */}
        <div className="p-5 sm:p-6 border-b border-black/[0.04] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1d1d1f] flex items-center justify-center text-white shadow-sm">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#1d1d1f]">雅思即时学术词典 (IELTS Lexicon)</h2>
              <p className="text-xs text-[#86868b] mt-0.5 font-normal">双向即时搜寻 · 权威学术释义 · 真题语境 · 英音发音</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar with Suggestions */}
        <div className="p-5 sm:p-6 pt-3 pb-4 bg-[#fbfbfd] border-b border-black/[0.04] shrink-0 relative space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="输入英文原词或中文释义（如 substantial, apple, 解决, 环境）..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full pl-11 pr-24 py-2.5 bg-white border border-black/[0.06] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 shadow-2xs font-normal"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-98"
            >
              查询
            </button>
          </form>

          {/* Auto-complete Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-5 right-5 top-[64px] z-20 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-xl overflow-hidden animate-slideDown">
              <div className="px-3.5 py-1.5 bg-[#f5f5f7] text-[10px] text-[#86868b] font-medium border-b border-black/[0.04]">
                实时匹配建议:
              </div>
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setSearchTerm(s.split(' ')[0]);
                    executeSearch(s.split(' ')[0]);
                  }}
                  className="px-4 py-2 text-xs text-[#1d1d1f] hover:bg-[#0071e3]/10 hover:text-[#0071e3] cursor-pointer transition-colors flex items-center justify-between font-normal"
                >
                  <span className="font-medium">{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#86868b]" />
                </div>
              ))}
            </div>
          )}

          {/* Quick Recommendations & Recents */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[#86868b] text-[11px] flex items-center gap-1 font-normal">
              <History className="w-3 h-3 text-[#86868b]" />
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
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.06] text-[11px] font-normal transition-all cursor-pointer shadow-2xs"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#86868b] font-normal animate-pulse">正在检索词库与学术例句...</p>
            </div>
          ) : currentEntry ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Word Title & Pronunciation Header Card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                      {currentEntry.word}
                    </h1>
                    <span className="px-2.5 py-0.5 bg-[#f5f5f7] text-[#1d1d1f] text-xs font-serif font-medium rounded-full">
                      {currentEntry.partOfSpeech}
                    </span>
                    {currentEntry.ieltsBand && (
                      <span className="px-2.5 py-0.5 bg-[#ff9500]/10 text-[#ff9500] text-[11px] font-medium rounded-full">
                        {currentEntry.ieltsBand}
                      </span>
                    )}
                  </div>

                  {/* Phonetic & Audio Trigger */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm text-[#0071e3] font-medium">
                      {currentEntry.phonetic}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(currentEntry.word)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingAudio 
                          ? 'bg-[#0071e3] text-white animate-pulse' 
                          : 'bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3]'
                      }`}
                      title="点击收听英音标准发音"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>发音</span>
                    </button>
                  </div>
                </div>

                {/* Star / Save to Wordbook */}
                <button
                  type="button"
                  onClick={handleStarToggle}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isStarred
                      ? 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/30 shadow-2xs'
                      : 'bg-white text-[#86868b] border-black/[0.06] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                  }`}
                  title="收藏至我的个人生词库"
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#ff9500] text-[#ff9500]' : 'text-[#86868b]'}`} />
                  <span>{isStarred ? '已收藏' : '收藏'}</span>
                </button>
              </div>

              {/* Chinese Meaning */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-black/[0.04] shadow-2xs space-y-1">
                <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
                  中文释义
                </span>
                <p className="text-base font-semibold text-[#1d1d1f]">
                  {currentEntry.chinese}
                </p>
              </div>

              {/* English Definition */}
              <div className="p-4 sm:p-5 bg-[#f5f5f7] rounded-2xl border border-black/[0.02] text-xs space-y-1">
                <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
                  English Definition (英英释义)
                </span>
                <p className="text-[#1d1d1f] font-serif leading-relaxed italic">
                  "{currentEntry.definition}"
                </p>
              </div>

              {/* Real IELTS Context Example */}
              <div className="p-4 sm:p-5 bg-[#0071e3]/5 rounded-2xl border border-[#0071e3]/10 text-xs space-y-1.5">
                <span className="text-[11px] font-medium text-[#0071e3] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  真题例句 / 权威语境
                </span>
                <p className="text-[#1d1d1f] font-serif leading-relaxed pl-3 border-l-2 border-[#0071e3]">
                  "{currentEntry.example}"
                </p>
              </div>

              {/* Synonyms & Collocations */}
              {(currentEntry.synonyms || currentEntry.collocations) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentEntry.synonyms && (
                    <div className="p-4 bg-white rounded-2xl border border-black/[0.04] space-y-2 shadow-2xs">
                      <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
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
                            className="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-medium border border-[#0071e3]/15 hover:bg-[#0071e3]/20 transition-colors cursor-pointer"
                          >
                            {syn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentEntry.collocations && (
                    <div className="p-4 bg-white rounded-2xl border border-black/[0.04] space-y-2 shadow-2xs">
                      <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">
                        考官高频搭配 (Collocations)
                      </span>
                      <div className="space-y-1 pl-2">
                        {currentEntry.collocations.map((col, idx) => (
                          <div key={idx} className="text-[#6e6e73] font-normal list-item">
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
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] text-[#86868b] flex items-center justify-center mx-auto border border-black/[0.04]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#1d1d1f]">
                  未直接检索到单词 "{searchTerm}"
                </p>
                <p className="text-xs text-[#86868b]">
                  可能存在拼写偏差，您可以轻点下方推荐词或重新输入：
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
                    className="px-3.5 py-1 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-normal rounded-full border border-black/[0.04] transition-colors cursor-pointer"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
