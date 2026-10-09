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
 * Generate an Apple-style, human-readable user recovery marker/token, e.g. "MK-8E2A-9D4F"
 */
export function generateRecoveryToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MK-${part1}-${part2}`;
}

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
    recoveryToken: 'MK-GUEST-0000',
    vaultKey: 'user_vault_user_guest',
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
      // Use the same key format as storage.ts getUserKey(): 'user_{userId}_{base}'
      const testKey = `user_${acc.id}_test_results`;
      const tests = localStorage.getItem(testKey);
      const mistakeKey = `user_${acc.id}_mistakes`;
      const mistakes = localStorage.getItem(mistakeKey);
      const hasTests = tests && tests !== '[]' && JSON.parse(tests).length > 0;
      const hasMistakes = mistakes && mistakes !== '[]' && JSON.parse(mistakes).length > 0;
      if (!hasTests && !hasMistakes) {
        // Also check for keys without the double prefix (legacy format)
        const altTestKey = `${acc.id}_test_results`;
        const altTests = localStorage.getItem(altTestKey);
        const altHasTests = altTests && altTests !== '[]' && JSON.parse(altTests).length > 0;
        return !altHasTests;
      }
      return false;
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

    // Auto-migrate: Ensure every existing account has a recovery token & vault key
    let accountsModified = false;
    accounts.forEach(a => {
      if (!a.recoveryToken) {
        a.recoveryToken = a.id === 'user_guest' ? 'MK-GUEST-0000' : generateRecoveryToken();
        accountsModified = true;
      }
      if (!a.vaultKey) {
        a.vaultKey = `user_vault_${a.id}`;
        accountsModified = true;
      }
    });
    if (accountsModified) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
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

/**
 * Cryptographic SHA-256 implementation (synchronous, zero-dependency) for offline security.
 */
function sha256Hex(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;
  for (let i = 0; i < ascii.length; i++) {
    words[i >> 2] = (words[i >> 2] || 0) | ((ascii.charCodeAt(i) & 0xff) << ((3 - (i % 4)) * 8));
  }
  words[asciiBitLength >> 5] = (words[asciiBitLength >> 5] || 0) | (0x80 << ((3 - ((asciiBitLength >> 3) % 4)) * 8));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const w = new Array(64);
  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t++) {
      w[t] = words[i + t] || 0;
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rightRotate(w[t - 15], 7) ^ rightRotate(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rightRotate(w[t - 2], 17) ^ rightRotate(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let t = 0; t < 64; t++) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + s1 + ch + k[t] + w[t]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const toHex = (n: number) => ('00000000' + (n >>> 0).toString(16)).slice(-8);
  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
}

function legacyFnvHash(password: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < password.length; i++) {
    hash ^= password.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return 'shash_' + (hash >>> 0).toString(16) + '_' + password.length;
}

/**
 * Robust salted SHA-256 for local offline password verification.
 */
export function hashLocalPassword(password: string): string {
  return 'sha256_' + sha256Hex('ielts_master_salt_' + password);
}

/**
 * Verify account password supporting modern SHA-256 hash, legacy shash_, legacy base64, and server placeholder migration.
 */
export function verifyUserPassword(user: UserAccount, inputPassword: string): boolean {
  if (!user.passwordHash) return true;
  if (!inputPassword) return false;

  // Modern salted SHA-256 hash
  if (user.passwordHash.startsWith('sha256_')) {
    return hashLocalPassword(inputPassword) === user.passwordHash;
  }

  // Legacy local FNV hash: auto-upgrade to sha256_ on successful verify
  if (user.passwordHash.startsWith('shash_')) {
    if (legacyFnvHash(inputPassword) === user.passwordHash) {
      user.passwordHash = hashLocalPassword(inputPassword);
      const accounts = getAccounts();
      const idx = accounts.findIndex(a => a.id === user.id);
      if (idx !== -1) {
        accounts[idx].passwordHash = user.passwordHash;
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      }
      return true;
    }
    return false;
  }

  // Legacy placeholder migration from server refactor
  if (user.passwordHash === '__hashed_server_side__') {
    user.passwordHash = hashLocalPassword(inputPassword);
    const accounts = getAccounts();
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx !== -1) {
      accounts[idx].passwordHash = user.passwordHash;
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    }
    return true;
  }

  // Legacy base64
  try {
    if (btoa(inputPassword) === user.passwordHash) {
      user.passwordHash = hashLocalPassword(inputPassword);
      const accounts = getAccounts();
      const idx = accounts.findIndex(a => a.id === user.id);
      if (idx !== -1) {
        accounts[idx].passwordHash = user.passwordHash;
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      }
      return true;
    }
  } catch {}

  return false;
}

export function registerUser(params: {
  username: string;
  displayName?: string;
  password?: string;
  avatar?: string;
  currentBand?: number;
  targetBand?: number;
  examDate?: string;
  targetCenter?: string;
  targetSession?: string;
  testType?: 'computer' | 'paper';
  dailyGoalMinutes?: number;
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

  const recoveryToken = generateRecoveryToken();
  const now = Date.now();
  const userId = `user_${now}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: UserAccount = {
    id: userId,
    username: trimmedName,
    displayName: params.displayName?.trim() || trimmedName,
    avatar: params.avatar || '🎓',
    recoveryToken,
    vaultKey: `user_vault_${userId}`,
    currentBand: params.currentBand ?? 0, // All newly registered users strictly start at 0 before diagnostic placement
    targetBand: params.targetBand ?? 7.0,
    hasCompletedPlacement: false,
    examDate: params.examDate || futureDate.toISOString().split('T')[0],
    targetCenter: params.targetCenter,
    targetSession: params.targetSession,
    testType: params.testType,
    dailyGoalMinutes: params.dailyGoalMinutes || 150,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    passwordHash: params.password ? hashLocalPassword(params.password) : undefined
  };

  // Initialize a fresh, isolated local sandbox vault for this new user
  try {
    const emptyList = JSON.stringify([]);
    const emptyObj = JSON.stringify({});
    localStorage.setItem(`user_${newUser.id}_test_results`, emptyList);
    localStorage.setItem(`user_${newUser.id}_mistakes`, emptyList);
    localStorage.setItem(`user_${newUser.id}_writing_submissions`, emptyList);
    localStorage.setItem(`user_${newUser.id}_speaking_recordings`, emptyList);
    localStorage.setItem(`user_${newUser.id}_vocab_progress`, emptyObj);
    localStorage.setItem(`user_${newUser.id}_study_plan_tasks`, emptyObj);
    localStorage.setItem(`user_${newUser.id}_ebbinghaus_records`, emptyObj);
    localStorage.setItem(`user_${newUser.id}_profile`, JSON.stringify({
      targetOverall: newUser.targetBand,
      targetListening: 7.5,
      targetReading: 7.5,
      targetWriting: 6.5,
      targetSpeaking: 6.5,
      examDate: newUser.examDate,
      targetCenter: newUser.targetCenter,
      targetSession: newUser.targetSession,
      testType: newUser.testType,
      dailyGoalMinutes: newUser.dailyGoalMinutes || 150,
      completedMinutesToday: 0,
      lastStudyDate: new Date().toISOString().split('T')[0],
      streakDays: 0,
      apiProvider: 'gemini'
    }));
  } catch {}

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

/**
 * Rebind / restore user account and their local vault using their unique recovery marker or username
 */
export function recoverUserByToken(tokenOrUsername: string): { success: boolean; user?: UserAccount; error?: string } {
  const accounts = getAccounts();
  const q = tokenOrUsername.trim().toLowerCase();
  if (!q) {
    return { success: false, error: '请输入恢复标记 (如 MK-XXXX-YYYY) 或用户名' };
  }

  const found = accounts.find(a => 
    (a.recoveryToken && a.recoveryToken.toLowerCase() === q) || 
    a.username.toLowerCase() === q || 
    a.id.toLowerCase() === q
  );

  if (!found) {
    return { 
      success: false, 
      error: `未在此设备找到恢复标记为 "${tokenOrUsername}" 的学员档案。请核对标记或直接注册新学员。` 
    };
  }

  setActiveUser(found.id);
  return { success: true, user: found };
}

export function loginUser(username: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  let accounts = getAccounts();
  const trimmed = username.trim().toLowerCase();
  const user = accounts.find(a => a.username.toLowerCase() === trimmed);

  if (!user) {
    return { success: false, error: '未在此设备找到该学员档案，请先在上方注册新账号' };
  }

  // Password verification
  if (user.passwordHash) {
    if (!password) {
      return { success: false, error: '此账号受密码保护，请输入密码登录' };
    }
    if (!verifyUserPassword(user, password)) {
      return { success: false, error: '密码不正确，请核对后重试' };
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
    const planKey = `user_${userId}_study_plan_config`;
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

/**
 * Update user goal, target test center, exam date and AI study plan commitment.
 * Synchronizes UserAccount, UserProfile, and StudyPlanConfig across local vaults.
 */
export function updateUserGoalAndExamSchedule(
  userId: string,
  params: {
    targetBand: number;
    currentBand?: number;
    examDate: string;
    targetCenter?: string;
    targetSession?: string;
    testType?: 'computer' | 'paper';
    dailyHours?: number;
    dailyGoalMinutes?: number;
    targetListening?: number;
    targetReading?: number;
    targetWriting?: number;
    targetSpeaking?: number;
    aiAnalysisSummary?: string;
  }
): UserAccount {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === userId);
  if (index === -1) {
    throw new Error('用户档案不存在');
  }

  const existing = accounts[index];
  const updatedUser: UserAccount = {
    ...existing,
    targetBand: params.targetBand,
    currentBand: params.currentBand !== undefined ? params.currentBand : existing.currentBand,
    examDate: params.examDate,
    targetCenter: params.targetCenter || existing.targetCenter,
    targetSession: params.targetSession || existing.targetSession,
    testType: params.testType || existing.testType,
    dailyGoalMinutes: params.dailyGoalMinutes || Math.round((params.dailyHours || 2.5) * 60)
  };

  accounts[index] = updatedUser;
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));

  // 1. Sync User Profile
  try {
    const profileKey = `user_${userId}_profile`;
    const rawProf = localStorage.getItem(profileKey);
    const prof = rawProf ? JSON.parse(rawProf) : {};
    prof.targetOverall = params.targetBand;
    prof.examDate = params.examDate;
    if (params.targetCenter) prof.targetCenter = params.targetCenter;
    if (params.targetSession) prof.targetSession = params.targetSession;
    if (params.testType) prof.testType = params.testType;
    if (params.targetListening) prof.targetListening = params.targetListening;
    if (params.targetReading) prof.targetReading = params.targetReading;
    if (params.targetWriting) prof.targetWriting = params.targetWriting;
    if (params.targetSpeaking) prof.targetSpeaking = params.targetSpeaking;
    if (params.dailyGoalMinutes) prof.dailyGoalMinutes = params.dailyGoalMinutes;
    localStorage.setItem(profileKey, JSON.stringify(prof));
  } catch {}

  // 2. Sync Study Plan Config
  try {
    const planKey = `user_${userId}_study_plan_config`;
    const rawPlan = localStorage.getItem(planKey);
    const plan = rawPlan ? JSON.parse(rawPlan) : {};

    // Calculate dynamic totalDays from today to examDate
    const today = new Date();
    const exam = new Date(params.examDate);
    const diffDays = Math.max(1, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    plan.targetBand = params.targetBand;
    if (params.currentBand !== undefined) plan.currentBand = params.currentBand;
    plan.totalDays = diffDays;
    plan.examDate = params.examDate;
    if (params.targetCenter) plan.targetCenter = params.targetCenter;
    if (params.targetSession) plan.targetSession = params.targetSession;
    if (params.testType) plan.testType = params.testType;
    if (params.dailyHours) plan.dailyHours = params.dailyHours;
    if (params.targetListening) plan.targetListening = params.targetListening;
    if (params.targetReading) plan.targetReading = params.targetReading;
    if (params.targetWriting) plan.targetWriting = params.targetWriting;
    if (params.targetSpeaking) plan.targetSpeaking = params.targetSpeaking;
    if (params.aiAnalysisSummary) plan.aiAnalysisSummary = params.aiAnalysisSummary;
    localStorage.setItem(planKey, JSON.stringify(plan));
  } catch {}

  // 3. Dispatch global sync events
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ielts_auth_changed', { detail: updatedUser }));
    window.dispatchEvent(new CustomEvent('ielts_vault_updated', { detail: { userId } }));
  }

  return updatedUser;
}

