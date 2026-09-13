import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  Calendar, 
  Tag, 
  Award,
  Clock
} from 'lucide-react';
import { READING_TESTS } from '../../data/readingTests';
import { LISTENING_TESTS } from '../../data/listeningTests';
import { WRITING_TASKS } from '../../data/writingTasks';
import { SPEAKING_TOPICS } from '../../data/speakingTopics';

export interface SearchResultItem {
  id: string;
  module: 'reading' | 'listening' | 'writing' | 'speaking';
  title: string;
  source: string;
  year?: string;
  category: string;
  description: string;
  tags?: string[];
  questionCount?: number;
}

interface QuestionBankSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTest: (module: string, testId: string) => void;
}

export const QuestionBankSearchModal: React.FC<QuestionBankSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTest
}) => {
  const [query, setQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Aggregate all items into unified searchable items
  const allItems: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [];

    // Reading
    READING_TESTS.forEach(rt => {
      const qCount = rt.passages.reduce((acc, p) => acc + p.questions.length, 0);
      list.push({
        id: rt.id,
        module: 'reading',
        title: rt.title,
        source: rt.source,
        year: rt.year || '2024',
        category: `包含 ${rt.passages.length} 篇学术长难篇章`,
        description: rt.passages.map(p => `Passage ${p.id}: ${p.title}`).join(' | '),
        tags: rt.tags || ['Headings', 'TFNG', 'Summary'],
        questionCount: qCount
      });
    });

    // Listening
    LISTENING_TESTS.forEach(lt => {
      const qCount = lt.sections.reduce((acc, s) => acc + s.questions.length, 0);
      list.push({
        id: lt.id,
        module: 'listening',
        title: lt.title,
        source: lt.source,
        year: lt.year || '2024',
        category: `包含 Section 1 - ${lt.sections.length} 仿真音频`,
        description: lt.sections.map(s => `Section ${s.sectionNumber}: ${s.title}`).join(' | '),
        tags: lt.tags || ['Gap Filling', 'MCQ'],
        questionCount: qCount
      });
    });

    // Writing
    WRITING_TASKS.forEach(wt => {
      list.push({
        id: wt.id,
        module: 'writing',
        title: `[${wt.type.toUpperCase()}] ${wt.title}`,
        source: wt.source || 'Cambridge IELTS Collection',
        year: wt.year || '2024-2025',
        category: wt.category,
        description: wt.prompt.slice(0, 120) + '...',
        tags: wt.tags || [wt.type.toUpperCase(), wt.category],
        questionCount: 1
      });
    });

    // Speaking
    SPEAKING_TOPICS.forEach(st => {
      list.push({
        id: st.id,
        module: 'speaking',
        title: `[Part ${st.part}] ${st.title}`,
        source: st.source || 'Official Speaking Pool',
        year: st.year || '2025',
        category: st.category,
        description: st.cueCard 
          ? `Cue card: ${st.cueCard.topic}` 
          : (st.questions?.slice(0, 2).join('; ') || ''),
        tags: st.tags || [`Part ${st.part}`, st.category],
        questionCount: st.questions?.length || 1
      });
    });

    return list;
  }, []);

  // Filtered results
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (selectedModule !== 'all' && item.module !== selectedModule) return false;
      if (selectedSource === 'cam19' && !item.source.toLowerCase().includes('19')) return false;
      if (selectedSource === 'cam18' && !item.source.toLowerCase().includes('18')) return false;
      if (selectedSource === 'cdi' && !item.source.toLowerCase().includes('cdi') && !item.source.toLowerCase().includes('season')) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
      );
    });
  }, [allItems, query, selectedModule, selectedSource]);

  if (!isOpen) return null;

  const getModuleBadge = (module: string) => {
    switch (module) {
      case 'reading':
        return { label: '学术阅读', bg: 'bg-indigo-100 text-indigo-800', icon: BookOpen };
      case 'listening':
        return { label: '机考听力', bg: 'bg-sky-100 text-sky-800', icon: Headphones };
      case 'writing':
        return { label: '写作题库', bg: 'bg-amber-100 text-amber-800', icon: PenTool };
      case 'speaking':
        return { label: '口语真题', bg: 'bg-rose-100 text-rose-800', icon: Mic };
      default:
        return { label: module, bg: 'bg-slate-100 text-slate-800', icon: Sparkles };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">雅思全科真题库检索中心 (2024-2026 最新更新)</h2>
              <p className="text-xs text-slate-400">一键搜索 Cambridge 18/19 最新真题、机考回忆考题与高频题卡</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              placeholder="搜索任何题库关键词（如：Space, EV, Rewilding, Termite, AI, Park, Line Chart, Cambridge 19）..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-red-500 shadow-sm"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Module filters */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: '全部科目' },
                { id: 'reading', label: '阅读' },
                { id: 'listening', label: '听力' },
                { id: 'writing', label: '写作' },
                { id: 'speaking', label: '口语' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedModule === m.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Source / Year filter pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">真题来源:</span>
              {[
                { id: 'all', label: '全部' },
                { id: 'cam19', label: 'Cambridge 19 最新' },
                { id: 'cam18', label: 'Cambridge 18' },
                { id: 'cdi', label: '2025/2026 机考库' },
              ].map(src => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSource(src.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    selectedSource === src.id
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="px-5 py-2 bg-slate-100 text-[11px] text-slate-500 flex items-center justify-between shrink-0 border-b border-slate-200">
          <span>找到 {filteredItems.length} 条匹配试卷 / 题目</span>
          <span>点击「立即进入模考」可直接跳转并开始该科真题训练</span>
        </div>

        {/* Scrollable Results List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">未找到符合该筛选条件的真题试卷</p>
              <p className="text-xs text-slate-400">尝试更换搜索词（如 "Cambridge", "Environment", "Task 1"）</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const badge = getModuleBadge(item.module);
              const Icon = badge.icon;

              return (
                <div 
                  key={`${item.module}_${item.id}`}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-red-300 hover:shadow-md transition-all group space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${badge.bg}`}>
                          <Icon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {item.source} · {item.year}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTest(item.module, item.id);
                        onClose();
                      }}
                      className="shrink-0 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1 group-hover:scale-105"
                    >
                      <span>进入练习</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
