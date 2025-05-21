import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

interface ProfileState {
  profile: {
    personalInfo: {
      name: string;
      age: number;
      sex: string;
      height: number;
      weight: number;
    };
    medicalInfo: {
      bloodPressure: {
        systolic: number;
        diastolic: number;
      };
      sugarLevel: number;
      diseases: string[];
      symptoms: string[];
      allergies: string[];
      medications: string[];
    };
  } | null;
  loading: boolean;
  error: string | null;
  
  fetchProfile: () => Promise<void>;
  updatePersonalInfo: (data: any) => Promise<void>;
  updateMedicalInfo: (data: any) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,
      
      fetchProfile: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/profile');
          set({ profile: response.data, loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to fetch profile', 
            loading: false 
          });
        }
      },
      
      updatePersonalInfo: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put('/profile/personal', data);
          
          set((state) => ({
            profile: state.profile ? {
              ...state.profile,
              personalInfo: response.data
            } : response.data,
            loading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to update personal info', 
            loading: false 
          });
        }
      },
      
      updateMedicalInfo: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put('/profile/medical', data);
          
          set((state) => ({
            profile: state.profile ? {
              ...state.profile,
              medicalInfo: response.data
            } : response.data,
            loading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to update medical info', 
            loading: false 
          });
        }
      },
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);