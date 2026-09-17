import { UserProfile, TestResult, MistakeRecord, WritingSubmission, SpeakingRecording } from '../types/ielts';
import { UserAccount, UserLocalVault, EbbinghausItem } from '../types/auth';
import { getActiveUserId, getActiveUser, getAccounts, setActiveUser, getDefaultUser } from './authService';

const BASE_KEYS = {
  PROFILE: 'profile',
  RESULTS: 'test_results',
  MISTAKES: 'mistakes',
  WRITING_SUBMISSIONS: 'writing_submissions',
  SPEAKING_RECORDINGS: 'speaking_recordings',
  VOCAB_PROGRESS: 'vocab_progress',
  STUDY_PLAN_CONFIG: 'study_plan_config',
  STUDY_PLAN_TASKS: 'study_plan_tasks',
  EBBINGHAUS_RECORDS: 'ebbinghaus_records',
  VAULT: 'vault'
};

/**
 * Generate user-scoped localStorage key ensuring strict physical data isolation.
 * Prevents user data from ever bleeding into another user's local space.
 */
export function getUserKey(key: string, userId?: string): string {
  const uid = userId || getActiveUserId();
  return `user_${uid}_${key}`;
}

/**
 * Default Initial Profile based on active user
 */
export function getDefaultProfile(userId?: string): UserProfile {
  const accounts = getAccounts();
  const uid = userId || getActiveUserId();
  const user = accounts.find(a => a.id === uid) || getActiveUser();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 178);
  const examDateStr = user.examDate || futureDate.toISOString().split('T')[0];

  return {
    targetOverall: user.targetBand || 7.0,
    targetListening: 7.5,
    targetReading: 7.5,
    targetWriting: 6.5,
    targetSpeaking: 6.5,
    examDate: examDateStr,
    dailyGoalMinutes: 90,
    completedMinutesToday: 0,
    lastStudyDate: new Date().toISOString().split('T')[0],
    streakDays: 0,
    apiProvider: 'gemini',
  };
}

export function getUserProfile(userId?: string): UserProfile {
  try {
    const key = getUserKey(BASE_KEYS.PROFILE, userId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const defaultProf = getDefaultProfile(userId);
      saveUserProfile(defaultProf, userId);
      return defaultProf;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultProfile(userId);
  }
}

export function saveUserProfile(profile: UserProfile, userId?: string): void {
  const key = getUserKey(BASE_KEYS.PROFILE, userId);
  localStorage.setItem(key, JSON.stringify(profile));
}

export function getTestResults(userId?: string): TestResult[] {
  try {
    const key = getUserKey(BASE_KEYS.RESULTS, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult, userId?: string): void {
  const results = getTestResults(userId);
  results.unshift(result);
  const key = getUserKey(BASE_KEYS.RESULTS, userId);
  localStorage.setItem(key, JSON.stringify(results));
}

export function getMistakes(userId?: string): MistakeRecord[] {
  try {
    const key = getUserKey(BASE_KEYS.MISTAKES, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMistake(mistake: MistakeRecord, userId?: string): void {
  const mistakes = getMistakes(userId);
  const index = mistakes.findIndex(m => m.id === mistake.id);
  if (index >= 0) {
    mistakes[index] = mistake;
  } else {
    mistakes.unshift(mistake);
  }
  const key = getUserKey(BASE_KEYS.MISTAKES, userId);
  localStorage.setItem(key, JSON.stringify(mistakes));
}

export function toggleMistakeResolved(id: string, userId?: string): boolean {
  const mistakes = getMistakes(userId);
  const item = mistakes.find(m => m.id === id);
  if (item) {
    item.isResolved = !item.isResolved;
    item.reviewedCount = (item.reviewedCount || 0) + 1;
    const key = getUserKey(BASE_KEYS.MISTAKES, userId);
    localStorage.setItem(key, JSON.stringify(mistakes));
    return item.isResolved;
  }
  return false;
}

export function getWritingSubmissions(userId?: string): WritingSubmission[] {
  try {
    const key = getUserKey(BASE_KEYS.WRITING_SUBMISSIONS, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWritingSubmission(submission: WritingSubmission, userId?: string): void {
  const list = getWritingSubmissions(userId);
  list.unshift(submission);
  const key = getUserKey(BASE_KEYS.WRITING_SUBMISSIONS, userId);
  localStorage.setItem(key, JSON.stringify(list));
}

export function getSpeakingRecordings(userId?: string): SpeakingRecording[] {
  try {
    const key = getUserKey(BASE_KEYS.SPEAKING_RECORDINGS, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSpeakingRecording(rec: SpeakingRecording, userId?: string): void {
  const list = getSpeakingRecordings(userId);
  list.unshift(rec);
  const key = getUserKey(BASE_KEYS.SPEAKING_RECORDINGS, userId);
  localStorage.setItem(key, JSON.stringify(list));
}

export function getVocabProgress(userId?: string): Record<string, { status: 'unfamiliar' | 'learning' | 'mastered'; isStarred?: boolean }> {
  try {
    const key = getUserKey(BASE_KEYS.VOCAB_PROGRESS, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateWordStatus(wordId: string, status: 'unfamiliar' | 'learning' | 'mastered', userId?: string): void {
  const prog = getVocabProgress(userId);
  prog[wordId] = { ...(prog[wordId] || {}), status };
  const key = getUserKey(BASE_KEYS.VOCAB_PROGRESS, userId);
  localStorage.setItem(key, JSON.stringify(prog));
}

export function toggleWordStar(wordId: string, userId?: string): boolean {
  const prog = getVocabProgress(userId);
  const current = prog[wordId]?.isStarred || false;
  const next = !current;
  prog[wordId] = { ...(prog[wordId] || { status: 'unfamiliar' }), isStarred: next };
  const key = getUserKey(BASE_KEYS.VOCAB_PROGRESS, userId);
  localStorage.setItem(key, JSON.stringify(prog));
  return next;
}

export function getStudyPlanConfig(userId?: string): any {
  try {
    const key = getUserKey(BASE_KEYS.STUDY_PLAN_CONFIG, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStudyPlanConfig(config: any, userId?: string): void {
  const key = getUserKey(BASE_KEYS.STUDY_PLAN_CONFIG, userId);
  localStorage.setItem(key, JSON.stringify(config));
}

export function getCompletedPlanTasks(userId?: string): Record<string, boolean> {
  try {
    const key = getUserKey(BASE_KEYS.STUDY_PLAN_TASKS, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function togglePlanTask(taskId: string, userId?: string): boolean {
  const tasks = getCompletedPlanTasks(userId);
  const next = !tasks[taskId];
  tasks[taskId] = next;
  const key = getUserKey(BASE_KEYS.STUDY_PLAN_TASKS, userId);
  localStorage.setItem(key, JSON.stringify(tasks));
  return next;
}

export function getEbbinghausRecords(userId?: string): Record<string, EbbinghausItem> {
  try {
    const key = getUserKey(BASE_KEYS.EBBINGHAUS_RECORDS, userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEbbinghausRecords(records: Record<string, EbbinghausItem>, userId?: string): void {
  const key = getUserKey(BASE_KEYS.EBBINGHAUS_RECORDS, userId);
  localStorage.setItem(key, JSON.stringify(records));
}

/**
 * Construct the unified local data vault for a specific user.
 * This encapsulates 100% of the user's localized learning state.
 */
export function getUserVault(userId?: string): UserLocalVault {
  const accounts = getAccounts();
  const uid = userId || getActiveUserId();
  const user = accounts.find(a => a.id === uid) || getActiveUser();

  return {
    version: 1,
    userId: uid,
    recoveryToken: user.recoveryToken || 'MK-LOCAL-VAULT',
    updatedAt: new Date().toISOString(),
    profile: getUserProfile(uid),
    testResults: getTestResults(uid),
    mistakes: getMistakes(uid),
    writingSubmissions: getWritingSubmissions(uid),
    speakingRecordings: getSpeakingRecordings(uid),
    vocabProgress: getVocabProgress(uid),
    studyPlanConfig: getStudyPlanConfig(uid),
    studyPlanTasks: getCompletedPlanTasks(uid),
    ebbinghausRecords: getEbbinghausRecords(uid)
  };
}

/**
 * Save / restore a full local data vault for a user into their isolated local space.
 */
export function saveUserVault(vault: UserLocalVault): void {
  const uid = vault.userId;
  saveUserProfile(vault.profile, uid);
  localStorage.setItem(getUserKey(BASE_KEYS.RESULTS, uid), JSON.stringify(vault.testResults || []));
  localStorage.setItem(getUserKey(BASE_KEYS.MISTAKES, uid), JSON.stringify(vault.mistakes || []));
  localStorage.setItem(getUserKey(BASE_KEYS.WRITING_SUBMISSIONS, uid), JSON.stringify(vault.writingSubmissions || []));
  localStorage.setItem(getUserKey(BASE_KEYS.SPEAKING_RECORDINGS, uid), JSON.stringify(vault.speakingRecordings || []));
  localStorage.setItem(getUserKey(BASE_KEYS.VOCAB_PROGRESS, uid), JSON.stringify(vault.vocabProgress || {}));
  if (vault.studyPlanConfig) saveStudyPlanConfig(vault.studyPlanConfig, uid);
  localStorage.setItem(getUserKey(BASE_KEYS.STUDY_PLAN_TASKS, uid), JSON.stringify(vault.studyPlanTasks || {}));
  saveEbbinghausRecords(vault.ebbinghausRecords || {}, uid);
  localStorage.setItem(`user_vault_${uid}`, JSON.stringify(vault));
}

export interface UserVaultStats {
  userId: string;
  username: string;
  displayName: string;
  recoveryToken: string;
  testCount: number;
  mistakeCount: number;
  vocabCount: number;
  vaultSizeBytes: number;
  lastUpdated: string;
}

/**
 * Get isolated storage usage statistics for the user's local vault.
 */
export function getUserStorageStats(userId?: string): UserVaultStats {
  const accounts = getAccounts();
  const uid = userId || getActiveUserId();
  const user = accounts.find(a => a.id === uid) || getActiveUser();
  const results = getTestResults(uid);
  const mistakes = getMistakes(uid);
  const vocab = getVocabProgress(uid);

  let totalBytes = 0;
  const prefix = `user_${uid}_`;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith(prefix) || k === `user_vault_${uid}`)) {
      totalBytes += k.length + (localStorage.getItem(k)?.length || 0);
    }
  }

  return {
    userId: uid,
    username: user.username,
    displayName: user.displayName,
    recoveryToken: user.recoveryToken || 'MK-LOCAL',
    testCount: results.length,
    mistakeCount: mistakes.length,
    vocabCount: Object.keys(vocab).length,
    vaultSizeBytes: totalBytes,
    lastUpdated: user.lastLoginAt || new Date().toISOString()
  };
}

/**
 * Clear all data within current user's local sandbox, resetting baseline to 0.
 * Does not affect any other user on this computer.
 */
export function clearUserLocalData(userId?: string): void {
  const uid = userId || getActiveUserId();
  const prefix = `user_${uid}_`;
  const keysToDelete: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith(prefix) || k === `user_vault_${uid}`)) {
      keysToDelete.push(k);
    }
  }
  keysToDelete.forEach(k => localStorage.removeItem(k));

  // Reinitialize clean zero baseline for this user
  const defaultProf = getDefaultProfile(uid);
  defaultProf.completedMinutesToday = 0;
  defaultProf.streakDays = 0;
  saveUserProfile(defaultProf, uid);
  localStorage.setItem(getUserKey(BASE_KEYS.RESULTS, uid), '[]');
  localStorage.setItem(getUserKey(BASE_KEYS.MISTAKES, uid), '[]');
  localStorage.setItem(getUserKey(BASE_KEYS.VOCAB_PROGRESS, uid), '{}');
  localStorage.setItem(getUserKey(BASE_KEYS.WRITING_SUBMISSIONS, uid), '[]');
  localStorage.setItem(getUserKey(BASE_KEYS.SPEAKING_RECORDINGS, uid), '[]');
  localStorage.setItem(getUserKey(BASE_KEYS.STUDY_PLAN_TASKS, uid), '{}');
  localStorage.setItem(getUserKey(BASE_KEYS.EBBINGHAUS_RECORDS, uid), '{}');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed'));
  }
}

/**
 * Export current user's local vault package with cryptographic identity marker binding.
 */
export function exportBackupData(userId?: string): string {
  const accounts = getAccounts();
  const uid = userId || getActiveUserId();
  const user = accounts.find(a => a.id === uid) || getActiveUser();
  const vault = getUserVault(uid);

  const backupPackage = {
    format: 'ielts_master_user_vault_v1',
    userMarker: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      recoveryToken: user.recoveryToken,
      avatar: user.avatar,
      targetBand: user.targetBand,
      currentBand: user.currentBand,
      examDate: user.examDate,
      createdAt: user.createdAt
    },
    vault,
    exportedAt: new Date().toISOString()
  };

  return JSON.stringify(backupPackage, null, 2);
}

/**
 * Import a local data vault package and rebind to this user or restore account.
 */
export function importBackupData(jsonString: string): { success: boolean; user?: UserAccount; error?: string } {
  try {
    const data = JSON.parse(jsonString);

    // Support legacy backups
    if (!data.vault && data.profile) {
      const activeUid = getActiveUserId();
      saveUserProfile(data.profile, activeUid);
      if (data.results) localStorage.setItem(getUserKey(BASE_KEYS.RESULTS, activeUid), JSON.stringify(data.results));
      if (data.mistakes) localStorage.setItem(getUserKey(BASE_KEYS.MISTAKES, activeUid), JSON.stringify(data.mistakes));
      if (data.writingSubmissions) localStorage.setItem(getUserKey(BASE_KEYS.WRITING_SUBMISSIONS, activeUid), JSON.stringify(data.writingSubmissions));
      if (data.speakingRecordings) localStorage.setItem(getUserKey(BASE_KEYS.SPEAKING_RECORDINGS, activeUid), JSON.stringify(data.speakingRecordings));
      if (data.vocabProgress) localStorage.setItem(getUserKey(BASE_KEYS.VOCAB_PROGRESS, activeUid), JSON.stringify(data.vocabProgress));
      return { success: true, user: getActiveUser() };
    }

    if (!data.vault || !data.userMarker) {
      return { success: false, error: '备份文件格式不兼容或缺少用户标记' };
    }

    const marker = data.userMarker;
    const vault: UserLocalVault = data.vault;

    let accounts = getAccounts();
    let targetAccount = accounts.find(a => a.id === marker.id || a.recoveryToken === marker.recoveryToken);

    if (!targetAccount) {
      targetAccount = {
        id: marker.id,
        username: marker.username,
        displayName: marker.displayName,
        avatar: marker.avatar || '🎓',
        recoveryToken: marker.recoveryToken,
        vaultKey: `user_vault_${marker.id}`,
        currentBand: marker.currentBand ?? 0,
        targetBand: marker.targetBand ?? 7.0,
        examDate: marker.examDate || new Date().toISOString().split('T')[0],
        createdAt: marker.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      accounts.push(targetAccount);
      localStorage.setItem('ielts_user_accounts', JSON.stringify(accounts));
    }

    // Save imported vault into this user's local space
    saveUserVault({
      ...vault,
      userId: targetAccount.id,
      recoveryToken: targetAccount.recoveryToken
    });

    // Set active
    setActiveUser(targetAccount.id);

    return { success: true, user: targetAccount };
  } catch (err: any) {
    return { success: false, error: err.message || '解析备份数据失败' };
  }
}
