import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import config from '../config';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, mobile: string) => Promise<{requiresOtp?: boolean, message?: string}>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  setTempEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      tempEmail: null,
      
      setTempEmail: (email: string) => set({ tempEmail: email }),
      
      login: async (email: string, password: string) => {
        try {
          const response = await api.post(`${config.apiUrl}/auth/login`, { email, password });
          
          if (response.data.requiresOtp) {
            return { requiresOtp: true };
          }
          
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true, tempEmail: null });
          return response.data;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },
      
      register: async (name: string, email: string, password: string, mobile: string) => {
        try {
          console.log('Registering user:', { name, email, mobile });
          const response = await api.post(`${config.apiUrl}/auth/register`, { name, email, password, mobile });
          console.log('Registration response:', response.data);
          
          // Set the temporary email for OTP verification
          set({ tempEmail: email });
          
          // Return the response data so the component can handle redirection
          return response.data;
        } catch (error: any) {
          console.error('Registration error:', error);
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      },
      
      verifyOtp: async (email: string, otp: string) => {
        try {
          const response = await api.post(`${config.apiUrl}/auth/verify-otp`, { email, otp });
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true, tempEmail: null });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, tempEmail: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);