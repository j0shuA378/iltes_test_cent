import type { 
  BankCategory, 
  ModuleType, 
  QuestionType, 
  ReadingTest, 
  ReadingPassage,
  ListeningTest, 
  ListeningSection,
  WritingTask, 
  SpeakingTopic,
  RandomDrillConfig,
  RandomDrillType
} from '../types/ielts';
import { 
  getReadingTestsByBank, 
  getListeningTestsByBank, 
  getWritingTasksByBank, 
  getSpeakingTopicsByBank 
} from './questionBankService';
import { getMistakes } from './storage';

/**
 * Utility to shuffle an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick a random element from an array
 */
function randomChoice<T>(array: T[]): T | null {
  if (!array || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * 1. Full Mock Test: Pick a random test from the bank
 */
export function getRandomFullTest(module: ModuleType, bankCategory: BankCategory = 'all'): {
  module: ModuleType;
  testId: string;
  testTitle: string;
  source: string;
} | null {
  switch (module) {
    case 'reading': {
      const tests = getReadingTestsByBank(bankCategory);
      const chosen = randomChoice(tests);
      if (!chosen) return null;
      return { module: 'reading', testId: chosen.id, testTitle: chosen.title, source: chosen.source };
    }
    case 'listening': {
      const tests = getListeningTestsByBank(bankCategory);
      const chosen = randomChoice(tests);
      if (!chosen) return null;
      return { module: 'listening', testId: chosen.id, testTitle: chosen.title, source: chosen.source };
    }
    case 'writing': {
      const tasks = getWritingTasksByBank(bankCategory);
      const chosen = randomChoice(tasks);
      if (!chosen) return null;
      return { module: 'writing', testId: chosen.id, testTitle: chosen.title, source: chosen.source || 'Official Writing Bank' };
    }
    case 'speaking': {
      const topics = getSpeakingTopicsByBank(bankCategory);
      const chosen = randomChoice(topics);
      if (!chosen) return null;
      return { module: 'speaking', testId: chosen.id, testTitle: chosen.title, source: chosen.source || 'Official Speaking Bank' };
    }
  }
}

/**
 * 2. Single Passage or Section Quick Drill (15-20 mins)
 */
export function getRandomSinglePassage(bankCategory: BankCategory = 'all'): {
  testId: string;
  passageIndex: number;
  passageTitle: string;
  testTitle: string;
  questionCount: number;
} | null {
  const tests = getReadingTestsByBank(bankCategory);
  if (!tests.length) return null;

  const validTests = tests.filter(t => t.passages && t.passages.length > 0);
  if (!validTests.length) return null;

  const test = randomChoice(validTests)!;
  const passageIndex = Math.floor(Math.random() * test.passages.length);
  const passage = test.passages[passageIndex];

  return {
    testId: test.id,
    passageIndex,
    passageTitle: passage.title,
    testTitle: test.title,
    questionCount: passage.questions.length
  };
}

export function getRandomSingleSection(bankCategory: BankCategory = 'all'): {
  testId: string;
  sectionIndex: number;
  sectionTitle: string;
  testTitle: string;
  questionCount: number;
} | null {
  const tests = getListeningTestsByBank(bankCategory);
  if (!tests.length) return null;

  const validTests = tests.filter(t => t.sections && t.sections.length > 0);
  if (!validTests.length) return null;

  const test = randomChoice(validTests)!;
  const sectionIndex = Math.floor(Math.random() * test.sections.length);
  const section = test.sections[sectionIndex];

  return {
    testId: test.id,
    sectionIndex,
    sectionTitle: section.title,
    testTitle: test.title,
    questionCount: section.questions.length
  };
}

/**
 * 3. Question-Type Focused Random Selection
 * Returns test ID with highest concentration of this question type
 */
export function getTestFocusingOnQuestionType(
  module: 'reading' | 'listening', 
  questionType: QuestionType, 
  bankCategory: BankCategory = 'all'
): { testId: string; testTitle: string; matchCount: number } | null {
  if (module === 'reading') {
    const tests = getReadingTestsByBank(bankCategory);
    const scored = tests.map(t => {
      const matchCount = t.passages.flatMap(p => p.questions).filter(q => q.type === questionType).length;
      return { test: t, matchCount };
    }).filter(item => item.matchCount > 0);

    if (!scored.length) {
      // Fallback to any random test
      const anyTest = randomChoice(tests);
      return anyTest ? { testId: anyTest.id, testTitle: anyTest.title, matchCount: 0 } : null;
    }

    // Pick from top matching tests
    scored.sort((a, b) => b.matchCount - a.matchCount);
    const topCandidates = scored.slice(0, Math.min(3, scored.length));
    const chosen = randomChoice(topCandidates)!;
    return { testId: chosen.test.id, testTitle: chosen.test.title, matchCount: chosen.matchCount };
  } else {
    const tests = getListeningTestsByBank(bankCategory);
    const scored = tests.map(t => {
      const matchCount = t.sections.flatMap(s => s.questions).filter(q => q.type === questionType).length;
      return { test: t, matchCount };
    }).filter(item => item.matchCount > 0);

    if (!scored.length) {
      const anyTest = randomChoice(tests);
      return anyTest ? { testId: anyTest.id, testTitle: anyTest.title, matchCount: 0 } : null;
    }

    scored.sort((a, b) => b.matchCount - a.matchCount);
    const topCandidates = scored.slice(0, Math.min(3, scored.length));
    const chosen = randomChoice(topCandidates)!;
    return { testId: chosen.test.id, testTitle: chosen.test.title, matchCount: chosen.matchCount };
  }
}

/**
 * 4. Ebbinghaus Mistake-Weighted Adaptive Random Test
 * Detects user's most problematic question types or weakest test areas and recommends a targeted test
 */
export function getAdaptiveMistakeWeightedDrill(module: 'reading' | 'listening', bankCategory: BankCategory = 'all'): {
  testId: string;
  testTitle: string;
  reason: string;
  weakQuestionType?: QuestionType;
} | null {
  const mistakes = getMistakes().filter(m => m.module === module && !m.isResolved);
  
  // If no unresolved mistakes, fall back to pure random
  if (mistakes.length === 0) {
    const randomTest = getRandomFullTest(module, bankCategory);
    if (!randomTest) return null;
    return {
      testId: randomTest.testId,
      testTitle: randomTest.testTitle,
      reason: '错题本暂无积压，已为您随机推荐官方优质全真试卷。'
    };
  }

  // Count mistake frequencies by questionType
  const freq: Record<string, number> = {};
  mistakes.forEach(m => {
    freq[m.questionType] = (freq[m.questionType] || 0) + 1;
  });

  const sortedTypes = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const weakestType = sortedTypes[0]?.[0] as QuestionType;

  if (weakestType) {
    const target = getTestFocusingOnQuestionType(module, weakestType, bankCategory);
    if (target) {
      return {
        testId: target.testId,
        testTitle: target.testTitle,
        reason: `检测到您在【${getQuestionTypeLabel(weakestType)}】存在 ${freq[weakestType]} 道积压错题，已自适应匹配重点包含该题型的试卷。`,
        weakQuestionType: weakestType
      };
    }
  }

  const fallback = getRandomFullTest(module, bankCategory);
  if (!fallback) return null;
  return {
    testId: fallback.testId,
    testTitle: fallback.testTitle,
    reason: '根据您的错题沉淀，智能自适应抽取综合强化卷。'
  };
}

export function getQuestionTypeLabel(type: QuestionType): string {
  switch (type) {
    case 'true_false_not_given': return 'TFNG 判断题';
    case 'yes_no_not_given': return 'YNNG 观点判断题';
    case 'matching_headings': return '段落小标题匹配 (Headings)';
    case 'matching_information': return '信息段落配对 (Matching Info)';
    case 'summary_completion': return '摘要填空 (Summary)';
    case 'sentence_completion': return '句子/短语填空';
    case 'multiple_choice': return '多项/单项选择题';
    case 'short_answer': return '简短问答题';
    default: return type;
  }
}
