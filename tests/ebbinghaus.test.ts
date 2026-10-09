import { describe, it, expect } from 'vitest';
import { calculateRetention } from '../src/services/ebbinghausService';
import type { EbbinghausItem } from '../src/types/auth';

describe('Ebbinghaus Forgetting Curve Service', () => {
  it('should return 96% retention for mastered Stage 6 items', () => {
    const item: EbbinghausItem = {
      id: 'vocab_1',
      type: 'vocab',
      title: 'mitigate',
      stage: 6,
      easeFactor: 2.5,
      intervalMs: 30 * 24 * 60 * 60 * 1000,
      nextReviewAt: new Date(Date.now() + 100000).toISOString(),
      lastReviewedAt: new Date().toISOString(),
      reviewCount: 6,
      history: []
    };

    expect(calculateRetention(item)).toBe(96);
  });

  it('should calculate high retention right after a review in early stage', () => {
    const item: EbbinghausItem = {
      id: 'vocab_2',
      type: 'vocab',
      title: 'ubiquitous',
      stage: 1,
      easeFactor: 2.5,
      intervalMs: 24 * 60 * 60 * 1000,
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastReviewedAt: new Date().toISOString(),
      reviewCount: 1,
      history: []
    };

    expect(calculateRetention(item)).toBeGreaterThanOrEqual(95);
  });

  it('should decay retention over elapsed time according to exponential formula', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const item: EbbinghausItem = {
      id: 'vocab_3',
      type: 'vocab',
      title: 'paradigm',
      stage: 0, // Stability is only 0.25 days
      easeFactor: 2.5,
      intervalMs: 20 * 60 * 1000,
      nextReviewAt: new Date().toISOString(),
      lastReviewedAt: threeDaysAgo,
      reviewCount: 0,
      history: []
    };

    // After 3 days with S=0.25 days, retention should hit minimum floor (18%)
    expect(calculateRetention(item)).toBe(18);
  });
});
