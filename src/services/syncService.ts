/**
 * Hybrid Local-First Synchronization Engine
 * Bridges browser localStorage sandbox with Node.js Express Cloud Vault.
 * Phase 3 Optimization: Adaptive heartbeat with exponential backoff,
 * visibility API awareness, and navigator.onLine integration.
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
let heartbeatTimer: any = null;
let consecutiveFailures = 0;
let lastPingTimestamp = 0;

/**
 * Perform a health check and latency ping
 */
export async function pingBackend(): Promise<boolean> {
  // If the browser itself is offline, skip network request
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    syncStatus.value = 'offline';
    serverLatency.value = null;
    serverInfo.value = null;
    return false;
  }

  const start = performance.now();
  lastPingTimestamp = Date.now();
  try {
    const health = await apiCheckHealth();
    const duration = Math.round(performance.now() - start);
    if (health && health.status === 'ok') {
      serverLatency.value = duration;
      serverInfo.value = health;
      consecutiveFailures = 0;
      if (syncStatus.value === 'offline') {
        syncStatus.value = 'connected';
      }
      return true;
    }
  } catch {}

  consecutiveFailures++;
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ielts_sync_status', { 
        detail: { status: 'synced', time: lastSyncTime.value } 
      }));
    }
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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ielts_vault_updated', { detail: { userId } }));
      }
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
 * Schedule next heartbeat using adaptive interval:
 * - 60s when connected
 * - Exponential backoff up to 3 minutes when offline
 * - Paused when document is hidden to conserve bandwidth and CPU
 */
function scheduleNextHeartbeat(): void {
  clearTimeout(heartbeatTimer);

  // If document is hidden, don't run timer; visibilitychange will trigger on return
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
    return;
  }

  // Base interval: 60s, backoff on consecutive failures: 60s -> 120s -> 180s
  const interval = consecutiveFailures === 0 
    ? 60000 
    : Math.min(60000 * Math.pow(1.5, consecutiveFailures), 180000);

  heartbeatTimer = setTimeout(async () => {
    await pingBackend();
    scheduleNextHeartbeat();
  }, interval);
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
    scheduleNextHeartbeat();
  });

  if (typeof window !== 'undefined') {
    // Listen to local mutations
    window.addEventListener('ielts_vault_updated', () => {
      scheduleCloudSync();
    });
    window.addEventListener('ielts_mistakes_updated', () => {
      scheduleCloudSync();
    });

    // Network recovery listener: immediate ping and sync
    window.addEventListener('online', () => {
      consecutiveFailures = 0;
      pingBackend().then(online => {
        if (online) syncActiveUserToCloud();
        scheduleNextHeartbeat();
      });
    });

    window.addEventListener('offline', () => {
      syncStatus.value = 'offline';
    });

    // Page visibility listener: resume heartbeat when user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // If it's been more than 60s since last ping, ping now
        if (Date.now() - lastPingTimestamp > 60000) {
          pingBackend();
        }
        scheduleNextHeartbeat();
      } else {
        clearTimeout(heartbeatTimer);
      }
    });
  }
}
