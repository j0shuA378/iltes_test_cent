import { UserProfile } from './ielts';

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar: string; // Emoji avatar or preset identifier
  currentBand: number; // 0 for untested/initial baseline (e.g. 0.0)
  targetBand: number;  // e.g. 7.0
  examDate: string;    // YYYY-MM-DD
  createdAt: string;   // ISO string
  lastLoginAt: string; // ISO string
  passwordHash?: string; // Optional simple password/PIN
  hasCompletedPlacement?: boolean;
  placementScore?: {
    testedBand: number;
    rawScore: number;
    totalQuestions: number;
    completedAt: string;
    levelSummary: string;
  };
}

export type MemoryStage = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface EbbinghausItem {
  id: string;              // e.g. vocab_substantial or mistake_r_1_...
  userId: string;
  type: 'vocab' | 'mistake';
  title: string;           // Word name or Question summary
  subtitle?: string;       // Word definition or Question prompt snippet
  stage: MemoryStage;      // 0 to 6
  lastReviewedAt: string;  // ISO string
  nextReviewAt: string;    // ISO string
  reviewCount: number;
  retentionRate: number;   // 0 to 100%
  history: {
    reviewedAt: string;
    stageBefore: MemoryStage;
    stageAfter: MemoryStage;
    feedback: 'forgot' | 'hard' | 'good' | 'easy';
  }[];
}

export interface EbbinghausStats {
  totalItems: number;
  dueTodayCount: number;
  masteredCount: number;
  learningCount: number;
  averageRetention: number; // e.g. 85%
}
