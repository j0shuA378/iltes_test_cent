import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateRetention, 
  recordEbbinghausReview, 
  getEbbinghausItem, 
  getDueEbbinghausItems, 
  getEbbinghausStats,
  STAGE_DESCRIPTIONS 
} from '../src/services/ebbinghausService';
import { getUserKey } from '../src/services/storage';
import type { EbbinghausItem } from '../src/types/auth';

describe('Ebbinghaus Forgetting Curve Service', () => {
  it('should return 96% retention for mastered Stage 6 items', () => {
    const item: EbbinghausItem = {
      id: 'vocab_1',
      userId: 'test_user',
      type: 'vocab',
      title: 'mitigate',
      stage: 6,
      nextReviewAt: new Date(Date.now() + 100000).toISOString(),
      lastReviewedAt: new Date().toISOString(),
      reviewCount: 6,
      retentionRate: 96,
      history: []
    };

    expect(calculateRetention(item)).toBe(96);
  });

  it('should calculate high retention right after a review in early stage', () => {
    const item: EbbinghausItem = {
      id: 'vocab_2',
      userId: 'test_user',
      type: 'vocab',
      title: 'ubiquitous',
      stage: 1,
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastReviewedAt: new Date().toISOString(),
      reviewCount: 1,
      retentionRate: 100,
      history: []
    };

    expect(calculateRetention(item)).toBeGreaterThanOrEqual(95);
  });

  it('should decay retention over elapsed time according to exponential formula', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const item: EbbinghausItem = {
      id: 'vocab_3',
      userId: 'test_user',
      type: 'vocab',
      title: 'paradigm',
      stage: 0, // Stability is only 0.25 days
      nextReviewAt: new Date().toISOString(),
      lastReviewedAt: threeDaysAgo,
      reviewCount: 0,
      retentionRate: 100,
      history: []
    };

    // After 3 days with S=0.25 days, retention should hit minimum floor (18%)
    expect(calculateRetention(item)).toBe(18);
  });

  describe('STAGE_DESCRIPTIONS completeness', () => {
    it('should provide valid metadata for all 7 memory stages', () => {
      const stages = [0, 1, 2, 3, 4, 5, 6] as const;
      stages.forEach(stage => {
        const desc = STAGE_DESCRIPTIONS[stage];
        expect(desc).toBeDefined();
        expect(desc.label).toContain(`Stage ${stage}`);
        expect(desc.desc.length).toBeGreaterThan(5);
        expect(desc.color).toBeDefined();
      });
    });
  });

  describe('recordEbbinghausReview state transitions', () => {
    let mockStore: Record<string, string> = {};

    beforeEach(() => {
      mockStore = {};
      globalThis.localStorage = {
        getItem: (k: string) => mockStore[k] || null,
        setItem: (k: string, v: string) => { mockStore[k] = String(v); },
        removeItem: (k: string) => { delete mockStore[k]; },
        clear: () => { mockStore = {}; },
        key: (i: number) => Object.keys(mockStore)[i] || null,
        get length() { return Object.keys(mockStore).length; }
      } as any;
    });

    it('should advance stage by 1 when feedback is "good"', () => {
      const item = recordEbbinghausReview('test_item_1', 'vocab', 'ephemeral', 'good', '短暂的');
      expect(item.stage).toBe(1);
      expect(item.reviewCount).toBe(1);
      expect(item.history.length).toBe(1);
      expect(item.history[0].stageBefore).toBe(0);
      expect(item.history[0].stageAfter).toBe(1);
      expect(item.history[0].feedback).toBe('good');
    });

    it('should advance stage by 2 when feedback is "easy"', () => {
      const item = recordEbbinghausReview('test_item_2', 'vocab', 'lucid', 'easy', '清晰的');
      expect(item.stage).toBe(2);
      expect(item.reviewCount).toBe(1);
      expect(item.history[0].stageBefore).toBe(0);
      expect(item.history[0].stageAfter).toBe(2);
    });

    it('should drop stage by 1 when feedback is "hard"', () => {
      // First advance to stage 2
      recordEbbinghausReview('test_item_3', 'vocab', 'tenuous', 'easy');
      // Then mark as hard
      const updated = recordEbbinghausReview('test_item_3', 'vocab', 'tenuous', 'hard');
      expect(updated.stage).toBe(1);
      expect(updated.reviewCount).toBe(2);
    });

    it('should reset stage to 0 when feedback is "forgot"', () => {
      // Advance to stage 3
      recordEbbinghausReview('test_item_4', 'vocab', 'cogent', 'easy'); // stage 2
      recordEbbinghausReview('test_item_4', 'vocab', 'cogent', 'good'); // stage 3
      // Forget
      const forgotten = recordEbbinghausReview('test_item_4', 'vocab', 'cogent', 'forgot');
      expect(forgotten.stage).toBe(0);
    });

    it('should cap maximum stage at 6 (mastered)', () => {
      for (let i = 0; i < 8; i++) {
        recordEbbinghausReview('test_item_max', 'vocab', 'ubiquitous', 'easy');
      }
      const item = getEbbinghausItem('test_item_max');
      expect(item?.stage).toBe(6);
    });

    it('should filter due items correctly based on nextReviewAt', () => {
      const now = Date.now();
      recordEbbinghausReview('due_item', 'vocab', 'due_word', 'forgot');
      
      const storageKey = getUserKey('ebbinghaus_records');
      const records = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (records['due_item']) {
        records['due_item'].nextReviewAt = new Date(now - 10000).toISOString();
        localStorage.setItem(storageKey, JSON.stringify(records));
      }

      const due = getDueEbbinghausItems();
      expect(due.some(i => i.id === 'due_item')).toBe(true);
    });

    it('should compute comprehensive Ebbinghaus statistics accurately', () => {
      recordEbbinghausReview('stat_item_1', 'vocab', 'word_1', 'good'); // stage 1 (learning)
      recordEbbinghausReview('stat_item_2', 'vocab', 'word_2', 'easy'); // stage 2 (learning)

      const stats = getEbbinghausStats();
      expect(stats.totalItems).toBeGreaterThanOrEqual(2);
      expect(stats.learningCount).toBeGreaterThanOrEqual(2);
      expect(stats.averageRetention).toBeGreaterThanOrEqual(18);
      expect(stats.averageRetention).toBeLessThanOrEqual(100);
    });
  });
});
