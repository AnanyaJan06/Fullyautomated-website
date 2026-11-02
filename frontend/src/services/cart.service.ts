import { apiFetcher } from '@/lib/api';
import { authService } from '@/services/auth.service';
import type {
  AddCartItemPayload,
  ApiResponse,
  CartData,
  WarrantyPlanType,
} from '@/types';

const CART_SESSION_KEY = 'gearup_cart_session_id';
const CART_CACHE_KEY = 'gearup_cart_cache';
export const CART_CHANGE_EVENT = 'gearup-cart-change';

function notifyCartChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sessionId = localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = `gu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
}

function buildCartHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'x-cart-session-id': getOrCreateSessionId(),
  };
  const token = authService.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function saveCartCache(cart: CartData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_CACHE_KEY, JSON.stringify(cart));
  notifyCartChange();
}

export const cartService = {
  getSessionId: getOrCreateSessionId,

  getCachedCart(): CartData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(CART_CACHE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CartData;
    } catch {
      return null;
    }
  },

  async getCart(): Promise<CartData> {
    const sessionId = getOrCreateSessionId();
    const res = await apiFetcher<ApiResponse<{ cart: CartData }>>(
      `/cart?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'GET',
        headers: buildCartHeaders(),
      }
    );
    saveCartCache(res.data.cart);
    return res.data.cart;
  },

  async addItem(payload: AddCartItemPayload): Promise<CartData> {
    const sessionId = getOrCreateSessionId();
    const res = await apiFetcher<ApiResponse<{ cart: CartData }>>('/cart/items', {
      method: 'POST',
      headers: buildCartHeaders(),
      body: JSON.stringify({
        ...payload,
        sessionId,
      }),
    });
    saveCartCache(res.data.cart);
    return res.data.cart;
  },

  async updateItem(
    partId: string,
    payload: { quantity?: number; vin?: string; warrantyPlan?: WarrantyPlanType }
  ): Promise<CartData> {
    const sessionId = getOrCreateSessionId();
    const res = await apiFetcher<ApiResponse<{ cart: CartData }>>(
      `/cart/items/${encodeURIComponent(partId)}`,
      {
        method: 'PATCH',
        headers: buildCartHeaders(),
        body: JSON.stringify({
          ...payload,
          sessionId,
        }),
      }
    );
    saveCartCache(res.data.cart);
    return res.data.cart;
  },

  async updateSettings(payload: {
    shippingType?: 'commercial' | 'residential';
    customerVin?: string;
  }): Promise<CartData> {
    const sessionId = getOrCreateSessionId();
    const res = await apiFetcher<ApiResponse<{ cart: CartData }>>('/cart/settings', {
      method: 'PATCH',
      headers: buildCartHeaders(),
      body: JSON.stringify({
        ...payload,
        sessionId,
      }),
    });
    saveCartCache(res.data.cart);
    return res.data.cart;
  },

  async removeItem(partId: string): Promise<CartData> {
    const sessionId = getOrCreateSessionId();
    const res = await apiFetcher<ApiResponse<{ cart: CartData }>>(
      `/cart/items/${encodeURIComponent(partId)}?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'DELETE',
        headers: buildCartHeaders(),
      }
    );
    saveCartCache(res.data.cart);
    return res.data.cart;
  },

  async clearCart(): Promise<CartData> {
    const sessionId = getOrCreateSessionId();
    const res = await apiFetcher<ApiResponse<{ cart: CartData }>>(
      `/cart?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'DELETE',
        headers: buildCartHeaders(),
      }
    );
    saveCartCache(res.data.cart);
    return res.data.cart;
  },
};
