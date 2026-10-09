import { describe, it, expect } from 'vitest';
import { analyzeStudyCommitment } from '../src/services/aiStudyPlanService';
import { generateRealExamSessions, OFFICIAL_TEST_CENTERS } from '../src/data/ieltsExamCenters';

describe('AI Study Plan & Daily Hours Engine', () => {
  it('should calculate higher daily hours when days remaining is short', () => {
    // 30 days vs 120 days for the same 1.5 score delta (5.5 -> 7.0)
    const shortPlan = analyzeStudyCommitment({
      currentBand: 5.5,
      targetBand: 7.0,
      daysRemaining: 30,
      examDate: '2026-11-09'
    });

    const longPlan = analyzeStudyCommitment({
      currentBand: 5.5,
      targetBand: 7.0,
      daysRemaining: 120,
      examDate: '2027-02-09'
    });

    expect(shortPlan.recommendedDailyHours).toBeGreaterThan(longPlan.recommendedDailyHours);
    expect(shortPlan.requiredTotalHours).toBe(longPlan.requiredTotalHours);
    expect(shortPlan.intensityTier).toBe('overload');
    expect(longPlan.intensityTier).toBe('golden');
  });

  it('should correctly allocate daily study minutes across 4 subjects', () => {
    const plan = analyzeStudyCommitment({
      currentBand: 6.0,
      targetBand: 7.5,
      daysRemaining: 90,
      examDate: '2027-01-09'
    });

    const { subjectBreakdown, recommendedDailyMinutes } = plan;
    const totalAllocated = 
      subjectBreakdown.listeningMinutes +
      subjectBreakdown.readingMinutes +
      subjectBreakdown.writingMinutes +
      subjectBreakdown.speakingMinutes;

    expect(totalAllocated).toBe(recommendedDailyMinutes);
    // Writing should have substantial allocation
    expect(subjectBreakdown.writingMinutes).toBeGreaterThan(0);
  });

  it('should provide computer test specific tips when computer center is selected', () => {
    const plan = analyzeStudyCommitment({
      currentBand: 5.5,
      targetBand: 7.0,
      daysRemaining: 60,
      examDate: '2026-12-09',
      targetCenter: '上海嘉地广场机考中心',
      testType: 'computer'
    });

    expect(plan.computerTestTips).toBeDefined();
    expect(plan.computerTestTips?.length).toBeGreaterThan(0);
    expect(plan.computerTestTips?.[0]).toContain('机考听力');
  });
});

describe('Official IELTS Test Centers & Real Sessions Generator', () => {
  it('should include major accredited test centers across China', () => {
    expect(OFFICIAL_TEST_CENTERS.length).toBeGreaterThanOrEqual(10);
    const cities = OFFICIAL_TEST_CENTERS.map(c => c.city);
    expect(cities).toContain('北京');
    expect(cities).toContain('上海');
    expect(cities).toContain('广州');
    expect(cities).toContain('深圳');
    expect(cities).toContain('成都');
  });

  it('should generate real upcoming sessions with chronological order', () => {
    const sessions = generateRealExamSessions(undefined, 90);
    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions[0].daysUntilExam).toBeLessThanOrEqual(sessions[sessions.length - 1].daysUntilExam);
    expect(sessions[0].fee).toBe(2170);
  });
});
