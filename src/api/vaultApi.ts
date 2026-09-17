/**
 * Local-First Cloud Vault API Client
 */

import { request } from './client';
import type { UserLocalVault } from '../types/auth';

export async function apiGetVault(userId: string): Promise<UserLocalVault | null> {
  try {
    const data = await request<{ success: boolean; vault: UserLocalVault | null }>(`/api/vault/${userId}`);
    return data.vault;
  } catch {
    return null;
  }
}

export async function apiSyncVault(userId: string, vault: UserLocalVault): Promise<{ success: boolean; lastUpdated?: string }> {
  return await request<{ success: boolean; message: string; lastUpdated: string }>(`/api/vault/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(vault)
  });
}

export async function apiDeleteVault(userId: string): Promise<{ success: boolean }> {
  return await request<{ success: boolean }>(`/api/vault/${userId}`, {
    method: 'DELETE'
  });
}
