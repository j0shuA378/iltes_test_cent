/**
 * Authentication & Student Accounts API Client
 * Phase 1: Now handles JWT tokens from server responses
 */

import { request, setAuthToken } from './client';
import type { UserAccount } from '../types/auth';

export interface RegisterPayload {
  username: string;
  displayName?: string;
  password?: string;
  avatar?: string;
  targetBand?: number;
  examDate?: string;
}

export async function apiGetUsers(): Promise<UserAccount[]> {
  const data = await request<{ success: boolean; users: UserAccount[] }>('/api/auth/users');
  return data.users || [];
}

export async function apiRegisterUser(payload: RegisterPayload): Promise<UserAccount> {
  const data = await request<{ success: boolean; user: UserAccount; token?: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  // Store JWT token if returned
  if (data.token) {
    setAuthToken(data.token);
  }
  return data.user;
}

export async function apiLoginUser(username: string, password?: string): Promise<UserAccount> {
  const data = await request<{ success: boolean; user: UserAccount; token?: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  // Store JWT token if returned
  if (data.token) {
    setAuthToken(data.token);
  }
  return data.user;
}

export async function apiRecoverUser(recoveryToken: string): Promise<UserAccount> {
  const data = await request<{ success: boolean; user: UserAccount; token?: string }>('/api/auth/recover', {
    method: 'POST',
    body: JSON.stringify({ recoveryToken })
  });
  // Store JWT token if returned
  if (data.token) {
    setAuthToken(data.token);
  }
  return data.user;
}

export async function apiSubmitPlacement(params: {
  userId: string;
  testedBand: number;
  rawScore: number;
  totalQuestions: number;
  levelSummary: string;
}): Promise<UserAccount> {
  const data = await request<{ success: boolean; user: UserAccount }>('/api/auth/placement', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return data.user;
}

/**
 * Admin login: Authenticate with PIN and receive admin JWT
 */
export async function apiAdminLogin(pin: string): Promise<{ token: string }> {
  const data = await request<{ success: boolean; token: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ pin })
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return { token: data.token };
}
