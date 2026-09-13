export type ModuleType = 'reading' | 'listening' | 'writing' | 'speaking';

export interface UserProfile {
  targetOverall: number;
  targetListening: number;
  targetReading: number;
  targetWriting: number;
  targetSpeaking: number;
  examDate: string; // YYYY-MM-DD
  dailyGoalMinutes: number;
  completedMinutesToday: number;
  lastStudyDate: string;
  streakDays: number;
  apiKey?: string; // Optional user-provided LLM key for writing/speaking evaluation
  apiProvider?: 'gemini' | 'openai' | 'deepseek';
}

// Reading & Listening Question Types
export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false_not_given' 
  | 'yes_no_not_given' 
  | 'matching_headings' 
  | 'summary_completion' 
  | 'sentence_completion' 
  | 'matching_information'
  | 'short_answer';

export interface Question {
  id: number; // Question number e.g. 1 to 40
  type: QuestionType;
  prompt: string;
  options?: string[]; // For multiple choice or matching
  correctAnswer: string | string[]; // Can have alternative spellings
  explanation: string;
  paragraphReference?: string; // E.g., 'Paragraph B'
  userAnswer?: string;
  isFlagged?: boolean;
}

export interface ReadingPassage {
  id: number;
  title: string;
  subtitle?: string;
  paragraphs: { id: string; text: string }[];
  questions: Question[];
}

export interface ReadingTest {
  id: string;
  title: string;
  source: string; // e.g., 'Cambridge IELTS 19'
  year?: string;
  difficulty?: 'Medium' | 'Hard' | 'Authentic Exam';
  tags?: string[];
  durationMinutes: number; // usually 60
  passages: ReadingPassage[];
}

// Listening
export interface ListeningSection {
  sectionNumber: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  audioPrompt: string; // Spoken text for speech synthesis or fallback audio
  audioUrl?: string;
  transcript: { speaker: string; text: string; time?: string }[];
  questions: Question[];
}

export interface ListeningTest {
  id: string;
  title: string;
  source: string;
  year?: string;
  difficulty?: 'Medium' | 'Hard' | 'Authentic Exam';
  tags?: string[];
  sections: ListeningSection[];
}

// Writing
export interface WritingTask {
  id: string;
  type: 'task1' | 'task2';
  title: string;
  category: string; // 'Line Chart', 'Bar Chart', 'Education', 'Technology', etc.
  prompt: string;
  year?: string;
  source?: string;
  tags?: string[];
  chartDescription?: string;
  chartSvg?: string; // Inline SVG visual for Task 1
  minWords: number; // 150 for Task 1, 250 for Task 2
  recommendedMinutes: number; // 20 or 40
  sampleBand9: string;
  sampleAnalysis: string;
  keyVocabulary: string[];
}

export interface WritingSubmission {
  id: string;
  taskId: string;
  taskType: 'task1' | 'task2';
  taskTitle: string;
  content: string;
  wordCount: number;
  submittedAt: string;
  timeSpentSeconds: number;
  scores: {
    overall: number;
    tr: number; // Task Response / Achievement
    cc: number; // Coherence & Cohesion
    lr: number; // Lexical Resource
    gra: number; // Grammatical Range & Accuracy
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    grammarSuggestions: string[];
    enhancedVersion?: string;
  };
}

// Speaking
export interface SpeakingTopic {
  id: string;
  part: 1 | 2 | 3;
  title: string;
  category: string;
  year?: string;
  source?: string;
  tags?: string[];
  questions?: string[]; // For Part 1 and 3
  cueCard?: { // For Part 2
    topic: string;
    points: string[];
    followUp: string;
  };
  highBandSample: string;
  vocabularyAndIdioms: { term: string; definition: string; example: string }[];
}

export interface SpeakingRecording {
  id: string;
  topicId: string;
  topicTitle: string;
  part: 1 | 2 | 3;
  createdAt: string;
  durationSeconds: number;
  audioBlobUrl?: string;
  notes?: string;
  selfScore?: number;
}

// Vocabulary & Synonyms
export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  chinese: string;
  example: string;
  category: 'Academic' | 'Environment' | 'Technology' | 'Society' | 'Education' | 'Listening_Campus';
  synonyms: string[];
  status: 'unfamiliar' | 'learning' | 'mastered';
  isStarred?: boolean;
}

export interface SynonymPair {
  id: string;
  coreWord: string;
  chinese: string;
  synonyms: string[];
  sampleSentence: string;
  frequency: 'High' | 'Essential' | 'Advanced';
}

// Mistake Notebook
export interface MistakeRecord {
  id: string;
  module: 'reading' | 'listening';
  testTitle: string;
  questionNumber: number;
  questionText: string;
  questionType: QuestionType;
  userAnswer: string;
  correctAnswer: string | string[];
  explanation: string;
  createdAt: string;
  reviewedCount: number;
  isResolved: boolean;
}

// Test Result Record
export interface TestResult {
  id: string;
  module: 'reading' | 'listening';
  testId: string;
  testTitle: string;
  score: number; // Out of 40
  band: number; // e.g. 7.5
  completedAt: string;
  timeSpentSeconds: number;
  answers: Record<number, string>;
}
