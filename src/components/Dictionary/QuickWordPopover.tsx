import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Star, 
  Maximize2, 
  X, 
  Loader2,
  BookmarkCheck
} from 'lucide-react';
import { DictionaryEntry, lookupWord } from '../../data/dictionaryData';
import { toggleWordStar, getVocabProgress } from '../../services/storage';

interface QuickWordPopoverProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
  onOpenFull: (word: string) => void;
  onHighlight?: (color: string) => void;
}

export const QuickWordPopover: React.FC<QuickWordPopoverProps> = ({
  word,
  position,
  onClose,
  onOpenFull,
  onHighlight
}) => {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Look up word on mount or change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Clean word
    const cleanWord = word.trim().replace(/^[^a-zA-Z\u4e00-\u9fa5]+|[^a-zA-Z\u4e00-\u9fa5]+$/g, '');
    
    // Check star status
    const progress = getVocabProgress();
    setIsStarred(!!progress[cleanWord.toLowerCase()]?.isStarred);

    lookupWord(cleanWord).then(result => {
      if (isMounted) {
        if (result) {
          setEntry(result);
        } else {
          // Fallback entry if not found
          setEntry({
            word: cleanWord,
            phonetic: `/${cleanWord}/`,
            partOfSpeech: 'dict.',
            chinese: '未在核心库找到释义，可点击“完全展示”深度检索',
            definition: `No local definition found for "${cleanWord}". Click Full View to explore online resources.`,
            example: ''
          });
        }
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [word]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Add listener after small delay to avoid current click triggering close
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleOutsideClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  // Audio pronunciation
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

  // Toggle star
  const handleStar = () => {
    if (!entry) return;
    const nowStarred = toggleWordStar(entry.word);
    setIsStarred(nowStarred);
  };

  // Adjust position so it doesn't overflow the viewport
  const cardWidth = 350;
  const clampedX = Math.min(window.innerWidth - cardWidth - 16, Math.max(16, position.x - cardWidth / 2));
  // If near top, display below
  const clampedY = position.y < 170 ? position.y + 40 : position.y - 155;

  return (
    <div
      ref={popoverRef}
      style={{ 
        position: 'fixed', 
        left: `${clampedX}px`, 
        top: `${clampedY}px`, 
        width: `${cardWidth}px`,
        zIndex: 110 
      }}
      className="bg-slate-900/95 backdrop-blur-md text-white shadow-2xl rounded-xl border border-slate-700/80 p-3.5 select-none animate-fadeIn transition-all"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-bold text-sm text-white tracking-tight shrink-0">
            {entry?.word || word}
          </span>
          {entry?.phonetic && (
            <span className="text-xs text-teal-300 font-mono shrink-0">
              {entry.phonetic}
            </span>
          )}
          {/* Audio Pronunciation */}
          <button
            onClick={() => speakWord(entry?.word || word)}
            className={`p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition-colors shrink-0 ${
              isPlayingAudio ? 'text-teal-400 animate-pulse' : ''
            }`}
            title="播放英音发音"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          {/* Band tag */}
          {entry?.ieltsBand && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 truncate max-w-[110px]">
              {entry.ieltsBand}
            </span>
          )}
        </div>

        {/* Right side: Button to enter full view (icon only, text on hover) + Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative group flex items-center">
            <button
              onClick={() => {
                onOpenFull(entry?.word || word);
                onClose();
              }}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-colors shadow-sm flex items-center justify-center"
              aria-label="完全展示"
              title="完全展示"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Tooltip visible on hover */}
            <div className="absolute -top-7 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-y-1 group-hover:translate-y-0 px-2 py-0.5 rounded bg-slate-950/95 border border-slate-700 text-indigo-200 text-[10px] font-medium whitespace-nowrap shadow-xl z-30">
              完全展示
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="关闭简易释义"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: Concise Definition */}
      <div className="py-2 min-h-[48px] flex flex-col justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
            <span>查询即时释义中...</span>
          </div>
        ) : entry ? (
          <div className="space-y-1">
            <div className="text-xs text-slate-100 flex items-baseline gap-1.5 leading-relaxed">
              <span className="font-bold text-teal-400 shrink-0">{entry.partOfSpeech}</span>
              <span className="font-medium text-slate-100">{entry.chinese}</span>
            </div>

            {/* Concise definition / Synonyms preview */}
            {entry.synonyms && entry.synonyms.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                <span className="text-slate-500 shrink-0 text-[10px]">同义:</span>
                <div className="flex items-center gap-1 overflow-hidden flex-wrap">
                  {entry.synonyms.slice(0, 3).map(s => (
                    <span key={s} className="px-1 py-0.2 bg-slate-800/90 text-slate-300 rounded text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-400">暂无释义</div>
        )}
      </div>

      {/* Footer: Quick Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        {/* Star Button */}
        <button
          onClick={handleStar}
          className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all ${
            isStarred 
              ? 'text-amber-300 bg-amber-500/20 font-medium' 
              : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
          }`}
          title={isStarred ? '已收入生词本' : '加入生词本'}
        >
          {isStarred ? (
            <>
              <BookmarkCheck className="w-3 h-3 text-amber-300" />
              <span>已收入生词本</span>
            </>
          ) : (
            <>
              <Star className="w-3 h-3" />
              <span>加入生词本</span>
            </>
          )}
        </button>

        {/* Quick Highlighting dots if user wants to highlight right away */}
        {onHighlight && (
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[10px] text-slate-500 mr-0.5">高亮:</span>
            <button
              onClick={() => {
                onHighlight('yellow');
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-yellow-300 hover:scale-125 transition-transform"
              title="黄色高亮"
            />
            <button
              onClick={() => {
                onHighlight('green');
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-emerald-400 hover:scale-125 transition-transform"
              title="绿色高亮"
            />
            <button
              onClick={() => {
                onHighlight('pink');
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-pink-400 hover:scale-125 transition-transform"
              title="粉色高亮"
            />
          </div>
        )}
      </div>
    </div>
  );
};
