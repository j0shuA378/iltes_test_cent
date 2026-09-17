/**
 * Authentication & Student Accounts API Client
 */

import { request } from './client';
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
  const data = await request<{ success: boolean; user: UserAccount }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.user;
}

export async function apiLoginUser(username: string, password?: string): Promise<UserAccount> {
  const data = await request<{ success: boolean; user: UserAccount }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  return data.user;
}

export async function apiRecoverUser(recoveryToken: string): Promise<UserAccount> {
  const data = await request<{ success: boolean; user: UserAccount }>('/api/auth/recover', {
    method: 'POST',
    body: JSON.stringify({ recoveryToken })
  });
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
