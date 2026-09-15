import { getAccounts, getActiveUserId, setActiveUser, getDefaultUser } from './authService';
import { READING_TESTS } from '../data/readingTests';
import { LISTENING_TESTS } from '../data/listeningTests';
import { WRITING_TASKS } from '../data/writingTasks';
import { SPEAKING_TOPICS } from '../data/speakingTopics';
import { CORE_VOCABULARY } from '../data/vocabularyData';
import type { UserAccount } from '../types/auth';
import type { TestResult, MistakeRecord, UserProfile } from '../types/ielts';

const ADMIN_SESSION_KEY = 'ielts_admin_authenticated';
const DEFAULT_ADMIN_PIN = 'admin888';

export interface StudentDetail extends UserAccount {
  testCount: number;
  latestScore: number;
  averageScore: number;
  mistakeCount: number;
  unresolvedMistakes: number;
  vocabReviewedCount: number;
  examCountdownDays: number;
  hasProfile: boolean;
}

export interface AdminDashboardMetrics {
  totalStudents: number;
  totalExamsTaken: number;
  averageOverallScore: number;
  averageReadingScore: number;
  averageListeningScore: number;
  totalMistakesRecorded: number;
  totalUnresolvedMistakes: number;
  totalCoreVocabCount: number;
  totalEbbinghausReviews: number;
  activeCambridgePapersCount: number;
  storageUsageBytes: number;
  recentExams: Array<{
    studentName: string;
    module: string;
    testTitle: string;
    band: number;
    score: number;
    completedAt: string;
  }>;
}

/**
 * Admin Authentication
 */
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function verifyAdminPin(pin: string): boolean {
  if (pin.trim() === DEFAULT_ADMIN_PIN || pin.trim() === 'admin') {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch {}
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {}
}

/**
 * Gather aggregated metrics across all user sandboxes
 */
export function getAdminDashboardMetrics(): AdminDashboardMetrics {
  const accounts = getAccounts();
  let totalExams = 0;
  let totalMistakes = 0;
  let totalUnresolvedMistakes = 0;
  let totalEbbinghausReviews = 0;
  let readingScores: number[] = [];
  let listeningScores: number[] = [];
  let allBands: number[] = [];
  const recentExams: AdminDashboardMetrics['recentExams'] = [];

  accounts.forEach(acc => {
    // 1. Test results for this student
    const resultsKey = 'user_' + acc.id + '_test_results';
    try {
      const raw = localStorage.getItem(resultsKey);
      if (raw) {
        const results: TestResult[] = JSON.parse(raw);
        totalExams += results.length;
        results.forEach(r => {
          allBands.push(r.band);
          if (r.module === 'reading') readingScores.push(r.band);
          if (r.module === 'listening') listeningScores.push(r.band);
          recentExams.push({
            studentName: acc.displayName || acc.username,
            module: r.module,
            testTitle: r.testTitle,
            band: r.band,
            score: r.score,
            completedAt: r.completedAt
          });
        });
      }
    } catch {}

    // 2. Mistakes for this student
    const mistakesKey = 'user_' + acc.id + '_mistakes';
    try {
      const raw = localStorage.getItem(mistakesKey);
      if (raw) {
        const mistakes: MistakeRecord[] = JSON.parse(raw);
        totalMistakes += mistakes.length;
        totalUnresolvedMistakes += mistakes.filter(m => !m.isResolved).length;
      }
    } catch {}

    // 3. Ebbinghaus reviews for this student
    const ebKey = 'user_' + acc.id + '_ebbinghaus_records';
    try {
      const raw = localStorage.getItem(ebKey);
      if (raw) {
        const records = JSON.parse(raw);
        Object.values(records).forEach((item: any) => {
          if (item?.reviewCount) {
            totalEbbinghausReviews += item.reviewCount;
          }
        });
      }
    } catch {}
  });

  // Sort recent exams by date desc
  recentExams.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const avg = (arr: number[]) => arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)) : 0;

  // Approximate storage calculation
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) {
      totalBytes += k.length + (localStorage.getItem(k)?.length || 0);
    }
  }

  return {
    totalStudents: accounts.length,
    totalExamsTaken: totalExams,
    averageOverallScore: avg(allBands),
    averageReadingScore: avg(readingScores),
    averageListeningScore: avg(listeningScores),
    totalMistakesRecorded: totalMistakes,
    totalUnresolvedMistakes: totalUnresolvedMistakes,
    totalCoreVocabCount: CORE_VOCABULARY.length,
    totalEbbinghausReviews: totalEbbinghausReviews,
    activeCambridgePapersCount: READING_TESTS.length + LISTENING_TESTS.length + WRITING_TASKS.length + SPEAKING_TOPICS.length,
    storageUsageBytes: totalBytes,
    recentExams: recentExams.slice(0, 8)
  };
}

/**
 * Get detailed profile for every student
 */
export function getAllStudents(): StudentDetail[] {
  const accounts = getAccounts();
  return accounts.map(acc => {
    let testCount = 0;
    let latestScore = 0;
    let avgScore = 0;
    let mistakeCount = 0;
    let unresolvedMistakes = 0;
    let vocabReviewedCount = 0;

    // Results
    try {
      const raw = localStorage.getItem('user_' + acc.id + '_test_results');
      if (raw) {
        const results: TestResult[] = JSON.parse(raw);
        testCount = results.length;
        if (results.length > 0) {
          latestScore = results[0].band;
          const sum = results.reduce((acc, r) => acc + r.band, 0);
          avgScore = Number((sum / results.length).toFixed(1));
        }
      }
    } catch {}

    // Mistakes
    try {
      const raw = localStorage.getItem('user_' + acc.id + '_mistakes');
      if (raw) {
        const mistakes: MistakeRecord[] = JSON.parse(raw);
        mistakeCount = mistakes.length;
        unresolvedMistakes = mistakes.filter(m => !m.isResolved).length;
      }
    } catch {}

    // Vocab
    try {
      const raw = localStorage.getItem('user_' + acc.id + '_vocab_progress');
      if (raw) {
        const v = JSON.parse(raw);
        vocabReviewedCount = Object.keys(v).length;
      }
    } catch {}

    // Exam countdown
    const examDate = acc.examDate ? new Date(acc.examDate) : new Date();
    const countdown = Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    // Profile check
    const hasProfile = !!localStorage.getItem('user_' + acc.id + '_profile');

    return {
      ...acc,
      testCount,
      latestScore,
      averageScore: avgScore,
      mistakeCount,
      unresolvedMistakes,
      vocabReviewedCount,
      examCountdownDays: countdown,
      hasProfile
    };
  });
}

/**
 * Delete a student account and erase their scoped storage sandbox
 */
export function deleteStudentAccount(userId: string): { success: boolean; error?: string } {
  const accounts = getAccounts();
  if (accounts.length <= 1) {
    const prefix = 'user_' + userId + '_';
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        localStorage.removeItem(k);
      }
    }
    const guest = getDefaultUser();
    localStorage.setItem('ielts_user_accounts', JSON.stringify([guest]));
    setActiveUser(guest.id);
    return { success: true };
  }

  const index = accounts.findIndex(a => a.id === userId);
  if (index === -1) {
    return { success: false, error: '学员未找到' };
  }

  // Erase all user-scoped data in localStorage
  const prefix = 'user_' + userId + '_';
  const keysToDelete: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) {
      keysToDelete.push(k);
    }
  }
  keysToDelete.forEach(k => localStorage.removeItem(k));

  // Update accounts
  accounts.splice(index, 1);
  localStorage.setItem('ielts_user_accounts', JSON.stringify(accounts));

  // If deleted user was active, switch to first account
  if (getActiveUserId() === userId) {
    setActiveUser(accounts[0].id);
  }

  return { success: true };
}

/**
 * Admin update student account
 */
export function updateStudentAccount(
  userId: string, 
  updates: { 
    displayName?: string; 
    targetBand?: number; 
    currentBand?: number; 
    examDate?: string;
    newPassword?: string;
  }
): boolean {
  const accounts = getAccounts();
  const found = accounts.find(a => a.id === userId);
  if (!found) return false;

  if (updates.displayName !== undefined) found.displayName = updates.displayName;
  if (updates.targetBand !== undefined) found.targetBand = updates.targetBand;
  if (updates.currentBand !== undefined) found.currentBand = updates.currentBand;
  if (updates.examDate !== undefined) found.examDate = updates.examDate;
  if (updates.newPassword !== undefined) {
    found.passwordHash = updates.newPassword ? btoa(updates.newPassword) : undefined;
  }

  localStorage.setItem('ielts_user_accounts', JSON.stringify(accounts));
  return true;
}

/**
 * Export full system database to a single structured JSON
 */
export function exportFullDatabaseBackup(): string {
  const backup: Record<string, any> = {
    exportedAt: new Date().toISOString(),
    version: '2.0.0',
    app: 'IELTS Master Portal',
    accounts: getAccounts(),
    activeUserId: getActiveUserId(),
    sandboxes: {}
  };

  // Collect all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) {
      backup.sandboxes[k] = localStorage.getItem(k);
    }
  }

  return JSON.stringify(backup, null, 2);
}

/**
 * Restore full system database from JSON backup
 */
export function restoreDatabaseBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.accounts || !Array.isArray(data.accounts)) {
      return { success: false, message: '无效的备份文件：缺少学员账户数据结构。' };
    }

    // Restore sandboxes
    if (data.sandboxes && typeof data.sandboxes === 'object') {
      Object.entries(data.sandboxes).forEach(([k, v]) => {
        if (typeof v === 'string') {
          localStorage.setItem(k, v);
        }
      });
    }

    // Restore accounts
    localStorage.setItem('ielts_user_accounts', JSON.stringify(data.accounts));
    if (data.activeUserId) {
      localStorage.setItem('ielts_active_user_id', data.activeUserId);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ielts_auth_changed'));
    }

    return { success: true, message: '成功恢复 ' + data.accounts.length + ' 位学员档案及全部历史题库成绩。' };
  } catch (err: any) {
    return { success: false, message: '解析备份文件失败: ' + (err.message || '格式错误') };
  }
}
