import { UserProfile, TestResult, MistakeRecord, WritingSubmission, SpeakingRecording, VocabWord } from '../types/ielts';

const STORAGE_KEYS = {
  PROFILE: 'ielts_user_profile',
  RESULTS: 'ielts_test_results',
  MISTAKES: 'ielts_mistakes',
  WRITING_SUBMISSIONS: 'ielts_writing_submissions',
  SPEAKING_RECORDINGS: 'ielts_speaking_recordings',
  VOCAB_PROGRESS: 'ielts_vocab_progress',
  STARRED_WORDS: 'ielts_starred_words',
};

// Default Initial Profile
export function getDefaultProfile(): UserProfile {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 45); // Default 45 days from today
  const examDateStr = futureDate.toISOString().split('T')[0];

  return {
    targetOverall: 7.5,
    targetListening: 8.0,
    targetReading: 8.0,
    targetWriting: 6.5,
    targetSpeaking: 7.0,
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
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
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
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getTestResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult): void {
  const results = getTestResults();
  results.unshift(result);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

export function getMistakes(): MistakeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISTAKES);
    return raw ? JSON.parse(raw) : [];
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
  localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
}

export function toggleMistakeResolved(id: string): void {
  const mistakes = getMistakes();
  const item = mistakes.find(m => m.id === id);
  if (item) {
    item.isResolved = !item.isResolved;
    item.reviewedCount = (item.reviewedCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }
}

export function getWritingSubmissions(): WritingSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WRITING_SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWritingSubmission(sub: WritingSubmission): void {
  const list = getWritingSubmissions();
  list.unshift(sub);
  localStorage.setItem(STORAGE_KEYS.WRITING_SUBMISSIONS, JSON.stringify(list));
}

export function getSpeakingRecordings(): SpeakingRecording[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPEAKING_RECORDINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSpeakingRecording(rec: SpeakingRecording): void {
  const list = getSpeakingRecordings();
  list.unshift(rec);
  localStorage.setItem(STORAGE_KEYS.SPEAKING_RECORDINGS, JSON.stringify(list));
}

export function getVocabProgress(): Record<string, { status: 'unfamiliar' | 'learning' | 'mastered'; isStarred?: boolean }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCAB_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateWordStatus(wordId: string, status: 'unfamiliar' | 'learning' | 'mastered'): void {
  const prog = getVocabProgress();
  prog[wordId] = { ...(prog[wordId] || {}), status };
  localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(prog));
}

export function toggleWordStar(wordId: string): boolean {
  const prog = getVocabProgress();
  const current = prog[wordId]?.isStarred || false;
  const next = !current;
  prog[wordId] = { ...(prog[wordId] || { status: 'unfamiliar' }), isStarred: next };
  localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(prog));
  return next;
}

export function exportBackupData(): string {
  const backup = {
    profile: getUserProfile(),
    results: getTestResults(),
    mistakes: getMistakes(),
    writingSubmissions: getWritingSubmissions(),
    speakingRecordings: getSpeakingRecordings(),
    vocabProgress: getVocabProgress(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveUserProfile(data.profile);
    if (data.results) localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(data.results));
    if (data.mistakes) localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(data.mistakes));
    if (data.writingSubmissions) localStorage.setItem(STORAGE_KEYS.WRITING_SUBMISSIONS, JSON.stringify(data.writingSubmissions));
    if (data.speakingRecordings) localStorage.setItem(STORAGE_KEYS.SPEAKING_RECORDINGS, JSON.stringify(data.speakingRecordings));
    if (data.vocabProgress) localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(data.vocabProgress));
    return true;
  } catch {
    return false;
  }
}

export function getStudyPlanConfig(): any {
  try {
    const raw = localStorage.getItem('ielts_study_plan_config');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStudyPlanConfig(config: any): void {
  localStorage.setItem('ielts_study_plan_config', JSON.stringify(config));
}

export function getCompletedPlanTasks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem('ielts_study_plan_tasks');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function togglePlanTask(taskId: string): boolean {
  const tasks = getCompletedPlanTasks();
  const next = !tasks[taskId];
  tasks[taskId] = next;
  localStorage.setItem('ielts_study_plan_tasks', JSON.stringify(tasks));
  return next;
}

