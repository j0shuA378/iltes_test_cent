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

/**
 * Standard neutral default guest user for new visitors on clean browsers.
 * Never hardcode personal names so other users opening the site are never defaulted to Joshua.
 */
export function getDefaultUser(): UserAccount {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 178); // Default 178 days from today

  return {
    id: 'user_guest',
    username: 'guest',
    displayName: '访客学员',
    avatar: '🎓',
    currentBand: 0, // All users start at 0 initial baseline
    targetBand: 7.0,
    hasCompletedPlacement: false,
    examDate: futureDate.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
}

/**
 * Helper to test if an account is an unused default template with no test or mistake data
 */
function isUnusedPlaceholder(acc: UserAccount): boolean {
  if (acc.id === 'user_guest') return true;
  if (acc.id === 'user_default_joshua' && !acc.hasCompletedPlacement && acc.currentBand === 0) {
    try {
      const testKey = `user_${acc.id}_test_results`;
      const tests = localStorage.getItem(testKey);
      const mistakeKey = `user_${acc.id}_mistakes`;
      const mistakes = localStorage.getItem(mistakeKey);
      const hasTests = tests && tests !== '[]' && JSON.parse(tests).length > 0;
      const hasMistakes = mistakes && mistakes !== '[]' && JSON.parse(mistakes).length > 0;
      return !hasTests && !hasMistakes;
    } catch {
      return true;
    }
  }
  return false;
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
    let accounts: UserAccount[] = JSON.parse(raw);
    if (!accounts || accounts.length === 0) {
      const defaultUser = getDefaultUser();
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([defaultUser]));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, defaultUser.id);
      return [defaultUser];
    }

    // Auto-clean: If real accounts exist alongside unused guest or unused legacy templates,
    // filter out the unused placeholder to prevent polluting other users' devices.
    if (accounts.length > 1) {
      const realAccounts = accounts.filter(a => !isUnusedPlaceholder(a));
      if (realAccounts.length > 0 && realAccounts.length !== accounts.length) {
        accounts = realAccounts;
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
        
        // Ensure active user is one of the valid accounts
        const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
        if (!accounts.some(a => a.id === activeId)) {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, accounts[0].id);
        }
      }
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
    const id = accounts[0]?.id || 'user_guest';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
    return id;
  } catch {
    return 'user_guest';
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
    throw new Error('用户档案未找到');
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
  let accounts = getAccounts();
  const trimmedName = params.username.trim();

  // Check username uniqueness (case-insensitive)
  const exists = accounts.some(a => a.username.toLowerCase() === trimmedName.toLowerCase());
  if (exists) {
    throw new Error('该用户名已被占用，请使用其他用户名');
  }

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 178);

  const newUser: UserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: trimmedName,
    displayName: params.displayName?.trim() || trimmedName,
    avatar: params.avatar || '🎓',
    currentBand: 0, // All newly registered users strictly start at 0 before diagnostic placement
    targetBand: params.targetBand ?? 7.0,
    hasCompletedPlacement: false,
    examDate: params.examDate || futureDate.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    passwordHash: params.password ? btoa(params.password) : undefined
  };

  // If previous accounts list only contained an unused placeholder (guest or unused template),
  // replace it with the newly registered user so the device belongs cleanly to the new user.
  if (accounts.length === 1 && isUnusedPlaceholder(accounts[0])) {
    accounts = [newUser];
  } else {
    // Filter out any unused guest placeholders
    accounts = accounts.filter(a => a.id !== 'user_guest');
    accounts.push(newUser);
  }

  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newUser.id);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: newUser }));
  }

  return newUser;
}

export function loginUser(username: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  let accounts = getAccounts();
  const trimmed = username.trim().toLowerCase();
  const user = accounts.find(a => a.username.toLowerCase() === trimmed);

  if (!user) {
    return { success: false, error: '未在此设备找到该学员档案，请先在上方注册新账号' };
  }

  if (user.passwordHash && password) {
    if (btoa(password) !== user.passwordHash) {
      return { success: false, error: '密码错误，请重新输入' };
    }
  }

  // Clean up any unused guest placeholder if present
  if (accounts.length > 1) {
    accounts = accounts.filter(a => a.id !== 'user_guest');
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  setActiveUser(user.id);
  return { success: true, user };
}

/**
 * Remove an account from this device / browser, erasing its sandbox data.
 */
export function removeAccount(userId: string): { success: boolean; newActiveUser?: UserAccount; error?: string } {
  let accounts = getAccounts();
  
  // Erase all user-scoped data in localStorage
  const prefix = `user_${userId}_`;
  const keysToDelete: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) {
      keysToDelete.push(k);
    }
  }
  keysToDelete.forEach(k => localStorage.removeItem(k));

  const updated = accounts.filter(a => a.id !== userId);

  let newActive: UserAccount;
  if (updated.length === 0) {
    newActive = getDefaultUser();
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([newActive]));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newActive.id);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
    const activeId = getActiveUserId();
    if (activeId === userId || !updated.some(a => a.id === activeId)) {
      newActive = updated[0];
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newActive.id);
    } else {
      newActive = updated.find(a => a.id === activeId) || updated[0];
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: newActive }));
  }

  return { success: true, newActiveUser: newActive };
}

/**
 * Sign out from current active account and revert to guest mode
 */
export function logoutActiveUser(): UserAccount {
  const accounts = getAccounts();
  let guest = accounts.find(a => a.id === 'user_guest');
  if (!guest) {
    guest = getDefaultUser();
    accounts.unshift(guest);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }
  
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, guest.id);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: guest }));
  }

  return guest;
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
