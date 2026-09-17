/**
 * Hybrid Local-First Synchronization Engine
 * Bridges browser localStorage sandbox with Node.js Express Cloud Vault.
 */

import { ref } from 'vue';
import { apiCheckHealth, type HealthInfo } from '../api/systemApi';
import { apiGetVault, apiSyncVault } from '../api/vaultApi';
import { getUserVault, saveUserVault } from './storage';
import { getActiveUser } from './authService';

export type SyncStatus = 'connected' | 'offline' | 'syncing' | 'synced' | 'error';

export const syncStatus = ref<SyncStatus>('offline');
export const lastSyncTime = ref<string | null>(null);
export const serverLatency = ref<number | null>(null);
export const serverInfo = ref<HealthInfo | null>(null);

let syncDebounceTimer: any = null;

/**
 * Perform a health check and latency ping
 */
export async function pingBackend(): Promise<boolean> {
  const start = performance.now();
  try {
    const health = await apiCheckHealth();
    const duration = Math.round(performance.now() - start);
    if (health && health.status === 'ok') {
      serverLatency.value = duration;
      serverInfo.value = health;
      if (syncStatus.value === 'offline') {
        syncStatus.value = 'connected';
      }
      return true;
    }
  } catch {}

  syncStatus.value = 'offline';
  serverLatency.value = null;
  serverInfo.value = null;
  return false;
}

/**
 * Sync active user's local sandbox vault to the cloud
 */
export async function syncActiveUserToCloud(): Promise<boolean> {
  const user = getActiveUser();
  if (!user || user.id === 'user_guest') {
    return false; // Skip guest sync
  }

  const isOnline = await pingBackend();
  if (!isOnline) {
    return false;
  }

  syncStatus.value = 'syncing';
  try {
    const localVault = getUserVault(user.id);
    await apiSyncVault(user.id, localVault);
    syncStatus.value = 'synced';
    lastSyncTime.value = new Date().toLocaleTimeString();
    window.dispatchEvent(new CustomEvent('ielts_sync_status', { 
      detail: { status: 'synced', time: lastSyncTime.value } 
    }));
    return true;
  } catch (err) {
    console.warn('Sync to cloud failed, staying on local sandbox:', err);
    syncStatus.value = 'connected';
    return false;
  }
}

/**
 * Hydrate local sandbox from cloud vault if local is empty (e.g. logging into a fresh device)
 */
export async function hydrateFromCloud(userId: string): Promise<boolean> {
  const isOnline = await pingBackend();
  if (!isOnline) return false;

  try {
    const cloudVault = await apiGetVault(userId);
    if (cloudVault && cloudVault.testResults) {
      cloudVault.userId = userId;
      saveUserVault(cloudVault);
      window.dispatchEvent(new CustomEvent('ielts_vault_updated', { detail: { userId } }));
      return true;
    }
  } catch (err) {
    console.warn('Hydration from cloud failed:', err);
  }
  return false;
}

/**
 * Trigger debounced background sync when local data changes
 */
export function scheduleCloudSync(): void {
  clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(() => {
    syncActiveUserToCloud();
  }, 2000);
}

/**
 * Initialize sync engine and background heartbeat
 */
export function initSyncEngine(): void {
  // Initial ping
  pingBackend().then(online => {
    if (online) {
      syncActiveUserToCloud();
    }
  });

  // Heartbeat every 30 seconds
  setInterval(() => {
    pingBackend();
  }, 30000);

  // Listen to local mutations
  window.addEventListener('ielts_vault_updated', () => {
    scheduleCloudSync();
  });
  window.addEventListener('ielts_mistakes_updated', () => {
    scheduleCloudSync();
  });
}
