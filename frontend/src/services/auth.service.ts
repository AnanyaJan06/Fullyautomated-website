import { apiFetcher } from '@/lib/api';
import {
  ApiResponse,
  AuthResponse,
  SigninPayload,
  SignupPayload,
  User,
} from '@/types';

const TOKEN_STORAGE_KEY = 'gearup_auth_token';
const USER_STORAGE_KEY = 'gearup_auth_user';
export const AUTH_CHANGE_EVENT = 'gearup-auth-change';

function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export const authService = {
  async signup(payload: SignupPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await apiFetcher<ApiResponse<AuthResponse>>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data?.token && res.data?.user) {
      this.saveSession(res.data.token, res.data.user);
    }
    return res;
  },

  async signin(payload: SigninPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await apiFetcher<ApiResponse<AuthResponse>>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data?.token && res.data?.user) {
      this.saveSession(res.data.token, res.data.user);
    }
    return res;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const token = this.getToken();
    return apiFetcher<ApiResponse<{ user: User }>>('/auth/me', {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },

  saveSession(token: string, user: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    notifyAuthChange();
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    notifyAuthChange();
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
