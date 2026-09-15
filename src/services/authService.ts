import { UserAccount } from '../types/auth';

const STORAGE_KEYS = {
  ACCOUNTS: 'ielts_user_accounts',
  ACTIVE_USER_ID: 'ielts_active_user_id'
};

export const AVATAR_OPTIONS = [
  { id: 'grad', emoji: '🎓', label: '学术帽' },
  { id: 'cat', emoji: '🐱', label: '学霸猫' },
  { id: 'target', emoji: '🎯', label: '7分必过' },
  { id: 'owl', emoji: '🦉', label: '夜读猫头鹰' },
  { id: 'rocket', emoji: '🚀', label: '极速破局' },
  { id: 'crown', emoji: '👑', label: '考官高分' },
  { id: 'lion', emoji: '🦁', label: '无畏攻坚' },
  { id: 'sparkles', emoji: '✨', label: '敏捷自律' }
];

export function getDefaultUser(): UserAccount {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 178); // Default 178 days from today

  return {
    id: 'user_default_joshua',
    username: 'Joshua',
    displayName: 'Joshua',
    avatar: '🎓',
    currentBand: 0, // All users start at 0 initial baseline
    targetBand: 7.0,
    hasCompletedPlacement: false,
    examDate: futureDate.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
}

export function getAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      const defaultUser = getDefaultUser();
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([defaultUser]));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, defaultUser.id);
      return [defaultUser];
    }
    const accounts: UserAccount[] = JSON.parse(raw);
    if (!accounts || accounts.length === 0) {
      const defaultUser = getDefaultUser();
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([defaultUser]));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, defaultUser.id);
      return [defaultUser];
    }
    return accounts;
  } catch {
    const defaultUser = getDefaultUser();
    return [defaultUser];
  }
}

export function getActiveUserId(): string {
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    if (activeId) return activeId;
    const accounts = getAccounts();
    const id = accounts[0]?.id || 'user_default_joshua';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
    return id;
  } catch {
    return 'user_default_joshua';
  }
}

export function getActiveUser(): UserAccount {
  const accounts = getAccounts();
  const activeId = getActiveUserId();
  const found = accounts.find(a => a.id === activeId);
  if (found) return found;
  return accounts[0] || getDefaultUser();
}

export function setActiveUser(userId: string): UserAccount {
  const accounts = getAccounts();
  const found = accounts.find(a => a.id === userId);
  if (!found) {
    throw new Error('User not found');
  }

  found.lastLoginAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  
  // Dispatch custom event for UI reactivity
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: found }));
  }

  return found;
}

export function registerUser(params: {
  username: string;
  displayName?: string;
  password?: string;
  avatar?: string;
  currentBand?: number;
  targetBand?: number;
  examDate?: string;
}): UserAccount {
  const accounts = getAccounts();
  const trimmedName = params.username.trim();

  // Check username uniqueness
  const exists = accounts.some(a => a.username.toLowerCase() === trimmedName.toLowerCase());
  if (exists) {
    throw new Error('用户名已被占用，请使用其他用户名');
  }

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 178);

  const newUser: UserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: trimmedName,
    displayName: params.displayName || trimmedName,
    avatar: params.avatar || '🎓',
    currentBand: 0, // All newly registered users strictly start at 0 before diagnostic placement
    targetBand: params.targetBand ?? 7.0,
    hasCompletedPlacement: false,
    examDate: params.examDate || futureDate.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    passwordHash: params.password ? btoa(params.password) : undefined
  };

  const updated = [...accounts, newUser];
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newUser.id);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: newUser }));
  }

  return newUser;
}

export function loginUser(username: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  const accounts = getAccounts();
  const trimmed = username.trim().toLowerCase();
  const user = accounts.find(a => a.username.toLowerCase() === trimmed);

  if (!user) {
    return { success: false, error: '用户不存在，请先注册账号' };
  }

  if (user.passwordHash && password) {
    if (btoa(password) !== user.passwordHash) {
      return { success: false, error: '密码错误，请重新输入' };
    }
  }

  setActiveUser(user.id);
  return { success: true, user };
}

export function updateActiveUserProfile(updates: Partial<UserAccount>): UserAccount {
  const accounts = getAccounts();
  const activeId = getActiveUserId();
  const index = accounts.findIndex(a => a.id === activeId);

  if (index === -1) {
    throw new Error('Active user not found');
  }

  accounts[index] = { ...accounts[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: accounts[index] }));
  }

  return accounts[index];
}

export function updateUserPlacement(
  userId: string, 
  placement: { 
    testedBand: number; 
    rawScore: number; 
    totalQuestions: number; 
    levelSummary: string;
  }
): UserAccount {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === userId);
  if (index === -1) {
    throw new Error('User not found');
  }

  const updatedUser: UserAccount = {
    ...accounts[index],
    currentBand: placement.testedBand,
    hasCompletedPlacement: true,
    placementScore: {
      ...placement,
      completedAt: new Date().toISOString()
    }
  };

  accounts[index] = updatedUser;
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));

  // Also sync the study plan config for this user
  try {
    const planKey = `user_${userId}_ielts_study_plan_config`;
    const rawPlan = localStorage.getItem(planKey);
    if (rawPlan) {
      const plan = JSON.parse(rawPlan);
      plan.currentBand = placement.testedBand;
      localStorage.setItem(planKey, JSON.stringify(plan));
    } else {
      localStorage.setItem(planKey, JSON.stringify({
        currentBand: placement.testedBand,
        targetBand: updatedUser.targetBand,
        targetListening: Math.min(9.0, placement.testedBand + 3.0),
        targetReading: Math.min(9.0, placement.testedBand + 3.0),
        targetWriting: Math.min(9.0, placement.testedBand + 2.0),
        targetSpeaking: Math.min(9.0, placement.testedBand + 2.0),
        totalDays: 178,
        currentDay: 1,
        dailyHours: 2.5
      }));
    }
  } catch {}

  // Dispatch event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: updatedUser }));
  }

  return updatedUser;
}
