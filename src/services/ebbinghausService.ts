import { EbbinghausItem, MemoryStage, EbbinghausStats } from '../types/auth';
import { getUserKey } from './storage';
import { getActiveUserId } from './authService';

const STORAGE_KEY = 'ebbinghaus_records';

// Ebbinghaus interval definitions (in milliseconds)
const STAGE_INTERVALS_MS: Record<MemoryStage, number> = {
  0: 20 * 60 * 1000,              // Stage 0: 20 minutes
  1: 1 * 24 * 60 * 60 * 1000,      // Stage 1: 1 day
  2: 2 * 24 * 60 * 60 * 1000,      // Stage 2: 2 days
  3: 4 * 24 * 60 * 60 * 1000,      // Stage 3: 4 days
  4: 7 * 24 * 60 * 60 * 1000,      // Stage 4: 7 days
  5: 15 * 24 * 60 * 60 * 1000,     // Stage 5: 15 days
  6: 30 * 24 * 60 * 60 * 1000      // Stage 6: 30 days (Mastered)
};

// Memory stability parameter S in days for Retention formula R = exp(-t/S)
const STAGE_STABILITY_DAYS: Record<MemoryStage, number> = {
  0: 0.25,
  1: 1.2,
  2: 2.8,
  3: 5.5,
  4: 10.0,
  5: 22.0,
  6: 45.0
};

export const STAGE_DESCRIPTIONS: Record<MemoryStage, { label: string; desc: string; color: string; bg: string }> = {
  0: { label: 'Stage 0 · 新学引入', desc: '遗忘极速期，建议20分钟内复现', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  1: { label: 'Stage 1 · 初次巩固', desc: '阻断第一波急剧遗忘，1天后复核', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  2: { label: 'Stage 2 · 强化记忆', desc: '进入次级记忆突触，2天后复习', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
  3: { label: 'Stage 3 · 深度编码', desc: '形成结构化理解，4天后复核', color: 'text-sky-500', bg: 'bg-sky-50 border-sky-200' },
  4: { label: 'Stage 4 · 周期提取', desc: '脱离机械复现，1周后抽测', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  5: { label: 'Stage 5 · 稳固长时', desc: '神经连接稳定，半个月后复习', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  6: { label: 'Stage 6 · 永久掌握', desc: '考场秒级本能反应，牢固永久记忆', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' }
};

function getRawRecords(): Record<string, EbbinghausItem> {
  try {
    const key = getUserKey(STORAGE_KEY);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRawRecords(records: Record<string, EbbinghausItem>): void {
  const key = getUserKey(STORAGE_KEY);
  localStorage.setItem(key, JSON.stringify(records));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_ebbinghaus_updated'));
  }
}

// Calculate current memory retention rate percentage using R = exp(-t/S)
export function calculateRetention(item: EbbinghausItem): number {
  if (item.stage === 6) return 96; // Mastered
  const now = Date.now();
  const last = new Date(item.lastReviewedAt).getTime();
  const elapsedDays = Math.max(0, (now - last) / (1000 * 60 * 60 * 24));
  const stability = STAGE_STABILITY_DAYS[item.stage] || 1;
  
  // Formula: R = e^(-t / S)
  const retention = Math.exp(-elapsedDays / stability) * 100;
  return Math.min(100, Math.max(18, Math.round(retention)));
}

export function getEbbinghausItems(type?: 'vocab' | 'mistake'): EbbinghausItem[] {
  const records = getRawRecords();
  const list = Object.values(records);
  if (type) {
    return list.filter(i => i.type === type);
  }
  return list;
}

export function getEbbinghausItem(id: string): EbbinghausItem | null {
  const records = getRawRecords();
  return records[id] || null;
}

// Register or update review result for an item
export function recordEbbinghausReview(
  itemId: string,
  type: 'vocab' | 'mistake',
  title: string,
  feedback: 'forgot' | 'hard' | 'good' | 'easy',
  subtitle?: string
): EbbinghausItem {
  const records = getRawRecords();
  const existing = records[itemId];
  const now = new Date();
  const currentStage: MemoryStage = existing ? existing.stage : 0;
  let nextStage: MemoryStage = currentStage;

  switch (feedback) {
    case 'forgot':
      // Reset to 0 (urgent re-learn)
      nextStage = 0;
      break;
    case 'hard':
      // Drop 1 stage or stay at 0
      nextStage = Math.max(0, currentStage - 1) as MemoryStage;
      break;
    case 'good':
      // Advance 1 stage
      nextStage = Math.min(6, currentStage + 1) as MemoryStage;
      break;
    case 'easy':
      // Advance 2 stages
      nextStage = Math.min(6, currentStage + 2) as MemoryStage;
      break;
  }

  const intervalMs = STAGE_INTERVALS_MS[nextStage];
  const nextReviewDate = new Date(now.getTime() + intervalMs);

  const updatedItem: EbbinghausItem = {
    id: itemId,
    userId: getActiveUserId(),
    type,
    title,
    subtitle: subtitle || existing?.subtitle,
    stage: nextStage,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewDate.toISOString(),
    reviewCount: (existing?.reviewCount || 0) + 1,
    retentionRate: 100, // Just reviewed
    history: [
      ...(existing?.history || []),
      {
        reviewedAt: now.toISOString(),
        stageBefore: currentStage,
        stageAfter: nextStage,
        feedback
      }
    ].slice(-20) // Keep last 20
  };

  records[itemId] = updatedItem;
  saveRawRecords(records);
  return updatedItem;
}

// Get items that are due for review (nextReviewAt <= now)
export function getDueEbbinghausItems(type?: 'vocab' | 'mistake'): EbbinghausItem[] {
  const all = getEbbinghausItems(type);
  const nowTime = Date.now();
  return all.filter(item => {
    // If never reviewed or next review date passed
    const nextTime = new Date(item.nextReviewAt).getTime();
    return nextTime <= nowTime;
  });
}

// Aggregate Ebbinghaus statistics for active user
export function getEbbinghausStats(): EbbinghausStats {
  const all = getEbbinghausItems();
  if (all.length === 0) {
    return {
      totalItems: 0,
      dueTodayCount: 0,
      masteredCount: 0,
      learningCount: 0,
      averageRetention: 92
    };
  }

  const due = getDueEbbinghausItems();
  const mastered = all.filter(i => i.stage >= 5);
  const learning = all.filter(i => i.stage < 5);

  let totalRetention = 0;
  all.forEach(i => {
    totalRetention += calculateRetention(i);
  });

  return {
    totalItems: all.length,
    dueTodayCount: due.length,
    masteredCount: mastered.length,
    learningCount: learning.length,
    averageRetention: Math.round(totalRetention / all.length)
  };
}

// Seed initial Ebbinghaus items for a user if empty
export function seedInitialEbbinghausItems(vocabWords: { id: string; word: string; chinese: string }[]): void {
  const records = getRawRecords();
  if (Object.keys(records).length > 0) return;

  const now = Date.now();
  // Seed first 8 high-frequency words across different initial stages
  const sample = vocabWords.slice(0, 8);
  sample.forEach((w, idx) => {
    // Assign stages: 0, 1, 2, 3
    const stage = (idx % 4) as MemoryStage;
    // Set some due now, some due in future
    const isDue = idx % 2 === 0;
    const intervalMs = STAGE_INTERVALS_MS[stage];
    const nextReview = isDue ? new Date(now - 1000 * 60) : new Date(now + intervalMs);

    records[`vocab_${w.id}`] = {
      id: `vocab_${w.id}`,
      userId: getActiveUserId(),
      type: 'vocab',
      title: w.word,
      subtitle: w.chinese,
      stage,
      lastReviewedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      nextReviewAt: nextReview.toISOString(),
      reviewCount: 1,
      retentionRate: stage === 0 ? 35 : stage === 1 ? 65 : 85,
      history: []
    };
  });

  saveRawRecords(records);
}
