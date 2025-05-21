import { create } from 'zustand';
import api from '../utils/api';

interface FoodItem {
  name: string;
  quantity: string;
  duration: string;
  nutrition: {
    calories: number;
    fat: number;
    protein: number;
    carbs: number;
    vitamins: string[];
    minerals: string[];
  };
  benefits: string[];
}

interface CategoryRecommendation {
  category: string;
  items: FoodItem[];
}

interface Recommendation {
  id: string;
  healthConditions: string[];
  deficiencies: string[];
  foodRecommendations: CategoryRecommendation[];
  expectedBenefits: string[];
  precautions: string[];
  createdAt: string;
}

interface RecommendationState {
  recommendations: Recommendation[];
  currentRecommendation: Recommendation | null;
  loading: boolean;
  error: string | null;
  
  fetchRecommendations: () => Promise<void>;
  fetchRecommendationById: (id: string) => Promise<void>;
  generateRecommendation: () => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  currentRecommendation: null,
  loading: false,
  error: null,
  
  fetchRecommendations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/recommendations');
      set({ recommendations: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch recommendations', 
        loading: false 
      });
    }
  },
  
  fetchRecommendationById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/recommendations/${id}`);
      set({ currentRecommendation: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch recommendation', 
        loading: false 
      });
    }
  },
  
  generateRecommendation: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/recommendations/generate');
      set((state) => ({ 
        recommendations: [response.data, ...state.recommendations], 
        currentRecommendation: response.data,
        loading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to generate recommendation', 
        loading: false 
      });
    }
  }
}));