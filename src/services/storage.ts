import { UserProfile, TestResult, MistakeRecord, WritingSubmission, SpeakingRecording } from '../types/ielts';
import { getActiveUserId, getActiveUser } from './authService';

const BASE_KEYS = {
  PROFILE: 'profile',
  RESULTS: 'test_results',
  MISTAKES: 'mistakes',
  WRITING_SUBMISSIONS: 'writing_submissions',
  SPEAKING_RECORDINGS: 'speaking_recordings',
  VOCAB_PROGRESS: 'vocab_progress',
  STUDY_PLAN_CONFIG: 'study_plan_config',
  STUDY_PLAN_TASKS: 'study_plan_tasks',
  EBBINGHAUS_RECORDS: 'ebbinghaus_records'
};

// Helper to generate user-scoped localStorage key
export function getUserKey(key: string, userId?: string): string {
  const uid = userId || getActiveUserId();
  return `user_${uid}_${key}`;
}

// Default Initial Profile based on active user
export function getDefaultProfile(): UserProfile {
  const user = getActiveUser();
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
    completedMinutesToday: 35,
    lastStudyDate: new Date().toISOString().split('T')[0],
    streakDays: 4,
    apiProvider: 'gemini',
  };
}

export function getUserProfile(): UserProfile {
  try {
    const key = getUserKey(BASE_KEYS.PROFILE);
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Check legacy migration
      const legacy = localStorage.getItem('ielts_user_profile');
      if (legacy && getActiveUserId() === 'user_default_joshua') {
        localStorage.setItem(key, legacy);
        return JSON.parse(legacy);
      }
      const defaultProf = getDefaultProfile();
      saveUserProfile(defaultProf);
      return defaultProf;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultProfile();
  }
}

export function saveUserProfile(profile: UserProfile): void {
  const key = getUserKey(BASE_KEYS.PROFILE);
  localStorage.setItem(key, JSON.stringify(profile));
}

export function getTestResults(): TestResult[] {
  try {
    const key = getUserKey(BASE_KEYS.RESULTS);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const legacy = localStorage.getItem('ielts_test_results');
      if (legacy && getActiveUserId() === 'user_default_joshua') {
        localStorage.setItem(key, legacy);
        return JSON.parse(legacy);
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult): void {
  const results = getTestResults();
  results.unshift(result);
  const key = getUserKey(BASE_KEYS.RESULTS);
  localStorage.setItem(key, JSON.stringify(results));
}

export function getMistakes(): MistakeRecord[] {
  try {
    const key = getUserKey(BASE_KEYS.MISTAKES);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const legacy = localStorage.getItem('ielts_mistakes');
      if (legacy && getActiveUserId() === 'user_default_joshua') {
        localStorage.setItem(key, legacy);
        return JSON.parse(legacy);
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMistake(mistake: MistakeRecord): void {
  const mistakes = getMistakes();
  const index = mistakes.findIndex(m => m.id === mistake.id);
  if (index >= 0) {
    mistakes[index] = mistake;
  } else {
    mistakes.unshift(mistake);
  }
  const key = getUserKey(BASE_KEYS.MISTAKES);
  localStorage.setItem(key, JSON.stringify(mistakes));
}

export function toggleMistakeResolved(id: string): boolean {
  const mistakes = getMistakes();
  const item = mistakes.find(m => m.id === id);
  if (item) {
    item.isResolved = !item.isResolved;
    item.reviewedCount = (item.reviewedCount || 0) + 1;
    const key = getUserKey(BASE_KEYS.MISTAKES);
    localStorage.setItem(key, JSON.stringify(mistakes));
    return item.isResolved;
  }
  return false;
}

export function getWritingSubmissions(): WritingSubmission[] {
  try {
    const key = getUserKey(BASE_KEYS.WRITING_SUBMISSIONS);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWritingSubmission(submission: WritingSubmission): void {
  const list = getWritingSubmissions();
  list.unshift(submission);
  const key = getUserKey(BASE_KEYS.WRITING_SUBMISSIONS);
  localStorage.setItem(key, JSON.stringify(list));
}

export function getSpeakingRecordings(): SpeakingRecording[] {
  try {
    const key = getUserKey(BASE_KEYS.SPEAKING_RECORDINGS);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSpeakingRecording(rec: SpeakingRecording): void {
  const list = getSpeakingRecordings();
  list.unshift(rec);
  const key = getUserKey(BASE_KEYS.SPEAKING_RECORDINGS);
  localStorage.setItem(key, JSON.stringify(list));
}

export function getVocabProgress(): Record<string, { status: 'unfamiliar' | 'learning' | 'mastered'; isStarred?: boolean }> {
  try {
    const key = getUserKey(BASE_KEYS.VOCAB_PROGRESS);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const legacy = localStorage.getItem('ielts_vocab_progress');
      if (legacy && getActiveUserId() === 'user_default_joshua') {
        localStorage.setItem(key, legacy);
        return JSON.parse(legacy);
      }
      return {};
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function updateWordStatus(wordId: string, status: 'unfamiliar' | 'learning' | 'mastered'): void {
  const prog = getVocabProgress();
  prog[wordId] = { ...(prog[wordId] || {}), status };
  const key = getUserKey(BASE_KEYS.VOCAB_PROGRESS);
  localStorage.setItem(key, JSON.stringify(prog));
}

export function toggleWordStar(wordId: string): boolean {
  const prog = getVocabProgress();
  const current = prog[wordId]?.isStarred || false;
  const next = !current;
  prog[wordId] = { ...(prog[wordId] || { status: 'unfamiliar' }), isStarred: next };
  const key = getUserKey(BASE_KEYS.VOCAB_PROGRESS);
  localStorage.setItem(key, JSON.stringify(prog));
  return next;
}

export function getStudyPlanConfig(): any {
  try {
    const key = getUserKey(BASE_KEYS.STUDY_PLAN_CONFIG);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const legacy = localStorage.getItem('ielts_study_plan_config');
      if (legacy && getActiveUserId() === 'user_default_joshua') {
        localStorage.setItem(key, legacy);
        return JSON.parse(legacy);
      }
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStudyPlanConfig(config: any): void {
  const key = getUserKey(BASE_KEYS.STUDY_PLAN_CONFIG);
  localStorage.setItem(key, JSON.stringify(config));
}

export function getCompletedPlanTasks(): Record<string, boolean> {
  try {
    const key = getUserKey(BASE_KEYS.STUDY_PLAN_TASKS);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function togglePlanTask(taskId: string): boolean {
  const tasks = getCompletedPlanTasks();
  const next = !tasks[taskId];
  tasks[taskId] = next;
  const key = getUserKey(BASE_KEYS.STUDY_PLAN_TASKS);
  localStorage.setItem(key, JSON.stringify(tasks));
  return next;
}

export function exportBackupData(): string {
  const backup = {
    user: getActiveUser(),
    profile: getUserProfile(),
    results: getTestResults(),
    mistakes: getMistakes(),
    writingSubmissions: getWritingSubmissions(),
    speakingRecordings: getSpeakingRecordings(),
    vocabProgress: getVocabProgress(),
    studyPlan: getStudyPlanConfig(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveUserProfile(data.profile);
    if (data.results) localStorage.setItem(getUserKey(BASE_KEYS.RESULTS), JSON.stringify(data.results));
    if (data.mistakes) localStorage.setItem(getUserKey(BASE_KEYS.MISTAKES), JSON.stringify(data.mistakes));
    if (data.writingSubmissions) localStorage.setItem(getUserKey(BASE_KEYS.WRITING_SUBMISSIONS), JSON.stringify(data.writingSubmissions));
    if (data.speakingRecordings) localStorage.setItem(getUserKey(BASE_KEYS.SPEAKING_RECORDINGS), JSON.stringify(data.speakingRecordings));
    if (data.vocabProgress) localStorage.setItem(getUserKey(BASE_KEYS.VOCAB_PROGRESS), JSON.stringify(data.vocabProgress));
    return true;
  } catch {
    return false;
  }
}
