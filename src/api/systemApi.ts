/**
 * System Health & Metrics API Client
 */

import { request } from './client';

export interface HealthInfo {
  status: string;
  serverTime: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    type: string;
    registeredUsersCount: number;
    totalVaultStorageBytes: number;
  };
}

export async function apiCheckHealth(): Promise<HealthInfo | null> {
  try {
    return await request<HealthInfo>('/api/health');
  } catch {
    return null;
  }
}

export async function apiGetAdminMetrics(): Promise<any> {
  try {
    return await request('/api/admin/metrics');
  } catch {
    return null;
  }
}
