/**
 * IELTS Master HTTP Client
 * Lightweight, robust API client with timeout, JWT auth, and offline graceful failure.
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  status?: number;
}

const DEFAULT_TIMEOUT_MS = 6000;
const TOKEN_STORAGE_KEY = 'ielts_auth_token';

/**
 * Store JWT token in localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * Retrieve stored JWT token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Clear stored JWT token (logout)
 */
export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function request<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // Attach JWT token if available
  const token = getAuthToken();
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders,
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errMessage = `HTTP ${res.status} ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.error) {
          errMessage = errJson.error;
        }
      } catch {}
      throw new Error(errMessage);
    }

    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('请求超时，请检查后端服务是否启动');
    }
    throw err;
  }
}
