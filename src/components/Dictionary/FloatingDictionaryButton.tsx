import React from 'react';
import { BookMarked, Sparkles } from 'lucide-react';

interface FloatingDictionaryButtonProps {
  onClick: () => void;
}

export const FloatingDictionaryButton: React.FC<FloatingDictionaryButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 select-none animate-fadeIn">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 hover:bg-teal-600 text-white rounded-full shadow-2xl border border-slate-700/80 hover:border-teal-500 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group"
        title="点击开启雅思即时学术词典 (即时查词)"
      >
        <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-400 group-hover:text-white transition-colors">
          <BookMarked className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold tracking-wide pr-1">查词典</span>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
      </button>
    </div>
  );
};
