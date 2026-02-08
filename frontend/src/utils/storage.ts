import { STORAGE_KEYS } from './constants';

// Token storage functions
export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  return null;
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  return null;
};

export const clearAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
};

export const clearRefreshToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

export const clearAllTokens = (): void => {
  clearAccessToken();
  clearRefreshToken();
};

// User storage functions
export const setUser = (user: Record<string, unknown>): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

export const getUser = (): Record<string, unknown> | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const clearUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Clear all auth data
export const clearAuthStorage = (): void => {
  clearAllTokens();
  clearUser();
};
