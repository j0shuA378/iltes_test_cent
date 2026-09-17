import type { BankCategory, ModuleType, ReadingTest, ListeningTest, WritingTask, SpeakingTopic } from '../types/ielts';
import { READING_TESTS } from '../data/readingTests';
import { LISTENING_TESTS } from '../data/listeningTests';
import { WRITING_TASKS } from '../data/writingTasks';
import { SPEAKING_TOPICS } from '../data/speakingTopics';

export interface BankInfo {
  id: BankCategory;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  year: string;
  officialBadge: string;
  themeColor: string; // e.g. '#0071e3'
  accentBg: string; // e.g. 'bg-[#0071e3]/10 text-[#0071e3]'
}

export const BANK_COLLECTIONS: BankInfo[] = [
  {
    id: 'all',
    name: '全部题库真题库 (All Collections)',
    shortName: '全部题库',
    subtitle: '聚合剑桥雅思 17-19 官方真题与 2025/2026 机考精选',
    description: '涵盖剑桥官方各卷、机考高频回忆与考官范文，适合全科综合摸底与海量实战。',
    year: '2023-2026',
    officialBadge: '全库集合',
    themeColor: '#1d1d1f',
    accentBg: 'bg-black/[0.04] text-[#1d1d1f]'
  },
  {
    id: 'cam19',
    name: '剑桥雅思 19 官方全真试题 (Cambridge 19)',
    shortName: '剑桥 19',
    subtitle: '2024-2025 官方最新学术真题 · 考前终极冲刺',
    description: '剑桥大学考评院最新发布，真实还原最新学术篇章长度、双语听力发音与大作文辩论题型。',
    year: '2024-2025',
    officialBadge: '官方最新真题',
    themeColor: '#0071e3',
    accentBg: 'bg-[#0071e3]/10 text-[#0071e3]'
  },
  {
    id: 'cam18',
    name: '剑桥雅思 18 官方全真试题 (Cambridge 18)',
    shortName: '剑桥 18',
    subtitle: '2023-2024 黄金模考试题 · 难度对标官方机考',
    description: '涵盖仿生学、生态林业管理、人脑神经学习机制等高频学术篇章与标准听力题卡。',
    year: '2023-2024',
    officialBadge: '官方黄金模考',
    themeColor: '#34c759',
    accentBg: 'bg-[#34c759]/10 text-[#34c759]'
  },
  {
    id: 'cam17',
    name: '剑桥雅思 17 官方经典题库 (Cambridge 17)',
    shortName: '剑桥 17',
    subtitle: '学术经典提分题库 · 强攻判断题与地图题',
    description: '经典学术长难文典范，严密逻辑论证，适合针对 TFNG、配对题和流程图的单项强化。',
    year: '2022-2023',
    officialBadge: '官方经典提分',
    themeColor: '#ff9500',
    accentBg: 'bg-[#ff9500]/10 text-[#ff9500]'
  },
  {
    id: 'cdi_recent',
    name: '2025/2026 机考高频回忆与轮换题库 (CDI Recalls)',
    shortName: '机考精选',
    subtitle: '2025/2026 最新换题季机考高频题 · 聚焦新动向',
    description: '采集自一线考生回忆与教研还原，包含生成式 AI、数字货币、城市空心化等最新热点。',
    year: '2025-2026',
    officialBadge: '机考新题季',
    themeColor: '#af52de',
    accentBg: 'bg-[#af52de]/10 text-[#af52de]'
  }
];

export function getBankInfo(category: BankCategory): BankInfo {
  return BANK_COLLECTIONS.find(b => b.id === category) || BANK_COLLECTIONS[0];
}

/**
 * Infer the bank category of an item based on its bankCategory field, source, id or title
 */
export function inferBankCategory(item: { bankCategory?: BankCategory; source?: string; title?: string; id?: string }): BankCategory {
  if (item.bankCategory && item.bankCategory !== 'all') {
    return item.bankCategory;
  }

  const s = `${item.source || ''} ${item.title || ''} ${item.id || ''}`.toLowerCase();
  if (s.includes('19') || s.includes('cam19') || s.includes('cambridge 19')) return 'cam19';
  if (s.includes('18') || s.includes('cam18') || s.includes('cambridge 18')) return 'cam18';
  if (s.includes('17') || s.includes('cam17') || s.includes('cambridge 17')) return 'cam17';
  if (s.includes('cdi') || s.includes('回忆') || s.includes('2025') || s.includes('2026') || s.includes('轮换')) return 'cdi_recent';

  return 'cam19'; // Default fallback
}

/**
 * Filter Reading Tests by bank category
 */
export function getReadingTestsByBank(category: BankCategory = 'all'): ReadingTest[] {
  if (category === 'all') return READING_TESTS;
  return READING_TESTS.filter(t => inferBankCategory(t) === category);
}

/**
 * Filter Listening Tests by bank category
 */
export function getListeningTestsByBank(category: BankCategory = 'all'): ListeningTest[] {
  if (category === 'all') return LISTENING_TESTS;
  return LISTENING_TESTS.filter(t => inferBankCategory(t) === category);
}

/**
 * Filter Writing Tasks by bank category
 */
export function getWritingTasksByBank(category: BankCategory = 'all'): WritingTask[] {
  if (category === 'all') return WRITING_TASKS;
  return WRITING_TASKS.filter(t => inferBankCategory(t) === category);
}

/**
 * Filter Speaking Topics by bank category
 */
export function getSpeakingTopicsByBank(category: BankCategory = 'all'): SpeakingTopic[] {
  if (category === 'all') return SPEAKING_TOPICS;
  return SPEAKING_TOPICS.filter(t => inferBankCategory(t) === category);
}

/**
 * Get comprehensive statistics across all question banks
 */
export function getBankStatistics() {
  const stats: Record<BankCategory, {
    readingCount: number;
    listeningCount: number;
    writingCount: number;
    speakingCount: number;
    totalQuestions: number;
  }> = {
    all: { readingCount: 0, listeningCount: 0, writingCount: 0, speakingCount: 0, totalQuestions: 0 },
    cam19: { readingCount: 0, listeningCount: 0, writingCount: 0, speakingCount: 0, totalQuestions: 0 },
    cam18: { readingCount: 0, listeningCount: 0, writingCount: 0, speakingCount: 0, totalQuestions: 0 },
    cam17: { readingCount: 0, listeningCount: 0, writingCount: 0, speakingCount: 0, totalQuestions: 0 },
    cdi_recent: { readingCount: 0, listeningCount: 0, writingCount: 0, speakingCount: 0, totalQuestions: 0 }
  };

  // Reading
  READING_TESTS.forEach(t => {
    const cat = inferBankCategory(t);
    const qCount = t.passages.reduce((acc, p) => acc + p.questions.length, 0);
    stats.all.readingCount++;
    stats.all.totalQuestions += qCount;
    if (stats[cat]) {
      stats[cat].readingCount++;
      stats[cat].totalQuestions += qCount;
    }
  });

  // Listening
  LISTENING_TESTS.forEach(t => {
    const cat = inferBankCategory(t);
    const qCount = t.sections.reduce((acc, s) => acc + s.questions.length, 0);
    stats.all.listeningCount++;
    stats.all.totalQuestions += qCount;
    if (stats[cat]) {
      stats[cat].listeningCount++;
      stats[cat].totalQuestions += qCount;
    }
  });

  // Writing
  WRITING_TASKS.forEach(t => {
    const cat = inferBankCategory(t);
    stats.all.writingCount++;
    stats.all.totalQuestions += 1;
    if (stats[cat]) {
      stats[cat].writingCount++;
      stats[cat].totalQuestions += 1;
    }
  });

  // Speaking
  SPEAKING_TOPICS.forEach(t => {
    const cat = inferBankCategory(t);
    const qCount = t.questions?.length || 1;
    stats.all.speakingCount++;
    stats.all.totalQuestions += qCount;
    if (stats[cat]) {
      stats[cat].speakingCount++;
      stats[cat].totalQuestions += qCount;
    }
  });

  return stats;
}
