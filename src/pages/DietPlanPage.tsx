import React, { useState } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import config from '../config';

interface MealPlan {
  name: string;
  age: string;
  height: string;
  weight: string;
  sex: string;
  activityLevel: string;
  sugarLevel: string;
  bpLevel: string;
  dietType: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  snacks: string;
  [key: string]: string; // Add index signature
}

const DietPlanPage: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    name: '',
    age: '',
    height: '',
    weight: '',
    sex: '',
    activityLevel: '',
    sugarLevel: '',
    bpLevel: '',
    dietType: '',
    morning: '',
    afternoon: '',
    evening: '',
    night: '',
    snacks: ''
  });
  
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setMealPlan(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysis('');
    setError(null);
    setLoading(true);

    try {
      const requiredFields = ['name', 'age', 'height', 'weight', 'sex', 'activityLevel', 'sugarLevel', 'bpLevel', 'dietType', 'morning', 'afternoon', 'night'];
      const missingFields = requiredFields.filter(field => !mealPlan[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const numericFields = ['age', 'height', 'weight', 'sugarLevel'];
      for (const field of numericFields) {
        if (isNaN(Number(mealPlan[field]))) {
          throw new Error(`${field} must be a valid number`);
        }
      }

      if (!/^\d{2,3}\/\d{2,3}$/.test(mealPlan.bpLevel)) {
        throw new Error('Blood pressure must be in format "systolic/diastolic" (e.g., 120/80)');
      }

      const response = await fetch(`${config.apiUrl}/diet-plan/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(mealPlan)
      });
      
      let data;
      if (response.ok) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          throw new Error('Received non-JSON response from server.');
        }
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
        } else {
          let errorMsg = data.error || 'Failed to analyze diet plan.';
          if (data.details) errorMsg += `\nDetails: ${data.details}`;
          throw new Error(errorMsg);
        }
      } else {
        // Try to parse error JSON, otherwise show generic error
        try {
          data = await response.json();
          let errorMsg = data.error || 'Failed to analyze diet plan.';
          if (data.details) errorMsg += `\nDetails: ${data.details}`;
          throw new Error(errorMsg);
        } catch (jsonErr) {
          throw new Error('Server error: Unable to analyze diet plan.');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze diet plan.';
      setError(errorMessage);
      console.error('Diet plan analysis error:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatAnalysis = (rawText: string): string => {
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\*/g, '')
      .replace(/^# (.+)$/gm, '<h2 class="text-navy-900 font-bold text-2xl mt-6 mb-3">$1</h2>')
      .replace(/^## (.+)$/gm, '<h3 class="text-navy-800 font-extrabold text-xl mt-4 mb-2">$1</h3>')
      .replace(/^### (.+)$/gm, '<h4 class="text-navy-800 font-bold text-lg mt-2 mb-1">$1</h4>')
      .replace(/^\s*[-•] (.+)$/gm, '<li class="mb-2">$1</li>')
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul class="list-disc ml-6 my-3">${match}</ul>`)
      .replace(/^(?!<h\d|<ul|<li|<\/ul|<\/li|\s*$)(.+)$/gm, '<p class="mb-4">$1</p>')
      .trim();
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">          <h1 className="text-4xl font-bold text-emerald-800 mb-4">Fix Your Diet Plan</h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to get a personalized diet plan based on your health profile, 
            preferences, and nutritional needs. Our analysis will help optimize your daily meals for better health.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-100">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={mealPlan.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sex">
                    Sex <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={mealPlan.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  >
                    <option value="">Select your sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={mealPlan.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Your age in years"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Physical Metrics Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">Physical Metrics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="height">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    value={mealPlan.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Your height in centimeters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    value={mealPlan.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Your weight in kilograms"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Medical Indicators Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">Medical Indicators</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sugarLevel">
                    Blood Sugar Level (mg/dL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sugarLevel"
                    name="sugarLevel"
                    type="number"
                    value={mealPlan.sugarLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="E.g., 110"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bpLevel">
                    Blood Pressure (mmHg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bpLevel"
                    name="bpLevel"
                    type="text"
                    value={mealPlan.bpLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="E.g., 120/80"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Dietary Information Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-orange-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">Dietary Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dietType">
                    Diet Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="dietType"
                    name="dietType"
                    value={mealPlan.dietType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  >
                    <option value="">Select your diet type</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="diabetic">Diabetic</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="activityLevel">
                    Activity Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={mealPlan.activityLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  >
                    <option value="">Select your activity level</option>
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 times/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 times/week)</option>
                    <option value="active">Active (exercise 6-7 times/week)</option>
                    <option value="veryActive">Very Active (intense exercise daily)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Meal Plans Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">Meal Plans</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="morning">
                    Morning Meal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="morning"
                    name="morning"
                    value={mealPlan.morning}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="E.g., 2 eggs, whole wheat toast, orange juice..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="afternoon">
                    Afternoon Meal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="afternoon"
                    name="afternoon"
                    value={mealPlan.afternoon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="E.g., grilled chicken salad, brown rice..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="evening">
                    Evening Meal
                  </label>
                  <textarea
                    id="evening"
                    name="evening"
                    value={mealPlan.evening}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="E.g., fish, steamed vegetables, quinoa..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="night">
                    Night Meal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="night"
                    name="night"
                    value={mealPlan.night}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="E.g., dal, roti, salad..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Diet Plan'}
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-8">
              <LoadingSpinner isVisible={loading} message="Analyzing your health profile..." />
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
              <div className="prose prose-emerald max-w-none" dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanPage;
