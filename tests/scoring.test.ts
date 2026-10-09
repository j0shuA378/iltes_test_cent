import { describe, it, expect } from 'vitest';
import { 
  calculateReadingBand, 
  calculateListeningBand, 
  calculateOverallBand,
  evaluateWritingOffline 
} from '../src/services/scoring';

describe('IELTS Academic Scoring Engine', () => {
  describe('calculateReadingBand', () => {
    it('should return 9.0 for 39 or 40 out of 40', () => {
      expect(calculateReadingBand(40)).toBe(9.0);
      expect(calculateReadingBand(39)).toBe(9.0);
    });

    it('should return 7.0 for 30-32 out of 40', () => {
      expect(calculateReadingBand(30)).toBe(7.0);
      expect(calculateReadingBand(31)).toBe(7.0);
      expect(calculateReadingBand(32)).toBe(7.0);
    });

    it('should scale proportionally when total questions differs from 40', () => {
      // 10 out of 10 is 40/40 => 9.0
      expect(calculateReadingBand(10, 10)).toBe(9.0);
      // 5 out of 10 is 20/40 => 5.5
      expect(calculateReadingBand(5, 10)).toBe(5.5);
    });

    it('should return 2.0 minimum for low scores', () => {
      expect(calculateReadingBand(0)).toBe(2.0);
      expect(calculateReadingBand(3)).toBe(2.0);
    });
  });

  describe('calculateListeningBand', () => {
    it('should return 9.0 for 39 or 40 out of 40', () => {
      expect(calculateListeningBand(40)).toBe(9.0);
      expect(calculateListeningBand(39)).toBe(9.0);
    });

    it('should return 7.0 for 30-31 out of 40', () => {
      expect(calculateListeningBand(30)).toBe(7.0);
      expect(calculateListeningBand(31)).toBe(7.0);
    });

    it('should return 6.5 for 26-29 out of 40', () => {
      expect(calculateListeningBand(26)).toBe(6.5);
      expect(calculateListeningBand(29)).toBe(6.5);
    });
  });

  describe('calculateOverallBand (IELTS Rounding Rules)', () => {
    it('should round up to the nearest half band when fraction is >= 0.25 and < 0.75', () => {
      // (6.5 + 6.5 + 6.0 + 6.0) / 4 = 6.25 => rounds to 6.5
      expect(calculateOverallBand(6.5, 6.5, 6.0, 6.0)).toBe(6.5);
      // (7.0 + 7.0 + 6.0 + 6.0) / 4 = 6.5 => 6.5
      expect(calculateOverallBand(7.0, 7.0, 6.0, 6.0)).toBe(6.5);
    });

    it('should round up to the whole band when fraction is >= 0.75', () => {
      // (7.0 + 7.0 + 7.0 + 6.0) / 4 = 6.75 => rounds to 7.0
      expect(calculateOverallBand(7.0, 7.0, 7.0, 6.0)).toBe(7.0);
    });

    it('should round down to the whole band when fraction is < 0.25', () => {
      // (6.0 + 6.0 + 6.0 + 6.5) / 4 = 6.125 => rounds to 6.0
      expect(calculateOverallBand(6.0, 6.0, 6.0, 6.5)).toBe(6.0);
    });
  });

  describe('evaluateWritingOffline', () => {
    it('should evaluate word count, paragraphs, and provide scores', () => {
      const sampleEssay = `The problem of traffic congestion in contemporary urban centres has sparked considerable debate. 
      In my view, government investment in public transportation is paramount. 
      Furthermore, alternative measures such as congestion charging can mitigate vehicular density. 
      In conclusion, a combined approach yields the most sustainable outcome.`;

      const evalResult = evaluateWritingOffline(sampleEssay, 250);
      expect(evalResult.wordCount).toBeGreaterThan(30);
      expect(evalResult.paragraphCount).toBeGreaterThanOrEqual(1);
      expect(evalResult.scores.overall).toBeGreaterThanOrEqual(1);
      expect(evalResult.scores.overall).toBeLessThanOrEqual(9);
      expect(Array.isArray(evalResult.feedback.strengths)).toBe(true);
    });
  });
});
