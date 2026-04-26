import axios from 'axios';

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    if (hostname === 'phone-place.onrender.com') {
      return `${protocol}//phone-place-api.onrender.com/api`;
    }
  }

  // In development the Vite proxy rewrites /api → http://localhost:5000.
  return '/api';
}

const api = axios.create({
  // In production VITE_API_URL points to the Render backend URL.
  // If it isn't set on Render, fall back to the known backend service URL.
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SupportChatContext {
  page?: string;
  pathname?: string;
  orderId?: string;
  productId?: string;
  productSummary?: {
    id: string;
    name: string;
    category: string;
    price: number;
    stockStatus: string;
    compatibleWith: string[];
  };
}

export async function requestSupportReply(
  message: string,
  context: SupportChatContext,
  token?: string | null
) {
  const url = token ? '/ai/support/account' : '/ai/support';
  const response = await api.post(
    url,
    { message, context },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined
  );

  return response.data as {
    success: boolean;
    reply: string;
    intent: string;
    usedModel: boolean;
  };
}

export default api;
