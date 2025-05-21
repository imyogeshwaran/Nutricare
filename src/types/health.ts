// Personal Information Types
export interface PersonalInfo {
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
}

// Physical Metrics Types
export interface PhysicalMetrics {
  height: number; // in cm
  weight: number; // in kg
  bmi?: number; // calculated field
}

// Medical Indicators Types
export interface MedicalIndicators {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  sugarLevel: {
    fasting: number;
    postPrandial?: number;
  };
}

// Medical History Types
export interface MedicalHistory {
  diseases: string[];
  symptoms: string[];
  allergies: string[];
  medications?: string[];
}

// Complete Health Profile
export interface HealthProfile {
  personalInfo: PersonalInfo;
  physicalMetrics: PhysicalMetrics;
  medicalIndicators: MedicalIndicators;
  medicalHistory: MedicalHistory;
  lastUpdated: Date;
}

// Nutritional Information Types
export interface NutritionalInfo {
  calories: number;
  macronutrients: {
    protein: number; // in grams
    fat: number; // in grams
    carbohydrates: number; // in grams
  };
  micronutrients: {
    vitamins: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
    minerals: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

// Food Recommendation Types
export interface FoodRecommendation {
  category: 'fruits' | 'vegetables' | 'meat' | 'cereals' | 'pulses';
  items: Array<{
    name: string;
    quantity: {
      amount: number;
      unit: string;
    };
    frequency: string; // e.g., 'daily', 'twice a day', 'weekly'
    duration: {
      amount: number;
      unit: 'days' | 'weeks' | 'months';
    };
    nutritionalInfo: NutritionalInfo;
    benefits: string[];
    precautions?: string[];
  }>;
}

// Complete Recommendation
export interface NutritionalRecommendation {
  patientId: string;
  healthProfile: HealthProfile;
  recommendations: FoodRecommendation[];
  generalGuidelines: string[];
  dietaryRestrictions: string[];
  expectedBenefits: string[];
  createdAt: Date;
  validUntil: Date;
}
