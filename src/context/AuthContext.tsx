import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../utils/api';

export interface User {
  phone: string;
  email?: string;
  name?: string;
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, code: string) => Promise<void>;
  sendOTP: (phone: string, email?: string) => Promise<{ message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      // Set default header
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      // Fetch user profile
      fetchUserProfile(savedToken);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      setToken(null);
    }
  };

  const sendOTP = async (phone: string, email?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/send-otp', { phone, email });
      if (!response.data.success) {
        const errorMsg = response.data.error || 'Failed to send OTP';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      return { message: response.data.message || 'OTP sent successfully.' };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to send OTP';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/verify-otp', { phone, code });

      if (!response.data.success) {
        setError(response.data.error || 'Login failed');
        throw new Error(response.data.error);
      }

      const { token: newToken, user: userData } = response.data;

      // Save token
      localStorage.setItem('authToken', newToken);
      setToken(newToken);

      // Set default header
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Set user
      setUser(userData);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    setError(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/auth/profile', data);

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to update profile';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        sendOTP,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
