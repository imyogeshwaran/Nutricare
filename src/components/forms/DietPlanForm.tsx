import React from 'react';
import Button from '../ui/Button';

export interface MealPlan {
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
  snacks?: string;
  [key: string]: string | undefined;
}

interface DietPlanFormProps {
  mealPlan: MealPlan;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const DietPlanForm: React.FC<DietPlanFormProps> = ({
  mealPlan,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={mealPlan.name}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Health Metrics */}
        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            value={mealPlan.age}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="Enter your age"
            required
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="height">Height (cm)</label>
          <input
            id="height"
            name="height"
            type="number"
            value={mealPlan.height}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="Enter your height in cm"
            required
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            name="weight"
            type="number"
            value={mealPlan.weight}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="Enter your weight in kg"
            required
          />
        </div>

        {/* Personal Details */}
        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="sex">Sex</label>
          <select
            id="sex"
            name="sex"
            value={mealPlan.sex}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            required
          >
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Health Indicators */}
        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="sugarLevel">Sugar Level (mg/dL)</label>
          <input
            id="sugarLevel"
            name="sugarLevel"
            type="number"
            value={mealPlan.sugarLevel}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., 110"
            required
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="bpLevel">BP Level (mmHg)</label>
          <input
            id="bpLevel"
            name="bpLevel"
            type="text"
            value={mealPlan.bpLevel}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., 120/80"
            required
          />
        </div>

        {/* Diet Preferences */}
        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="dietType">Diet Type</label>
          <select
            id="dietType"
            name="dietType"
            value={mealPlan.dietType}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            required
          >
            <option value="">Select Diet Type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="diabetic">Diabetic</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.2s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="activityLevel">Activity Level</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={mealPlan.activityLevel}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            required
          >
            <option value="">Select Activity Level</option>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Light (exercise 1-3 times/week)</option>
            <option value="moderate">Moderate (exercise 3-5 times/week)</option>
            <option value="active">Active (exercise 6-7 times/week)</option>
            <option value="veryActive">Very Active (intense exercise daily)</option>
          </select>
        </div>
      </div>

      {/* Meal Plans */}
      <div className="space-y-6">
        <div className="fade-slide-in" style={{ animationDelay: '0.3s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="morning">Morning Meal</label>
          <textarea
            id="morning"
            name="morning"
            value={mealPlan.morning}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., 2 eggs, whole wheat toast, orange juice..."
            rows={3}
            required
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.3s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="afternoon">Afternoon Meal</label>
          <textarea
            id="afternoon"
            name="afternoon"
            value={mealPlan.afternoon}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., grilled chicken salad, brown rice..."
            rows={3}
            required
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.3s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="evening">Evening Meal (Optional)</label>
          <textarea
            id="evening"
            name="evening"
            value={mealPlan.evening}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., fish, steamed vegetables, quinoa..."
            rows={3}
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.3s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="night">Night Meal</label>
          <textarea
            id="night"
            name="night"
            value={mealPlan.night}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., dal, roti, salad..."
            rows={3}
            required
          />
        </div>

        <div className="fade-slide-in" style={{ animationDelay: '0.3s' }}>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="snacks">Snacks (Optional)</label>
          <textarea
            id="snacks"
            name="snacks"
            value={mealPlan.snacks}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 input-enhanced"
            placeholder="E.g., fruits, nuts, yogurt..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end fade-slide-in" style={{ animationDelay: '0.4s' }}>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white button-enhanced" disabled={loading}>
          {loading ? 'Analyzing...' : 'Submit Diet Plan'}
        </Button>
      </div>
    </form>
  );
};

export default DietPlanForm;
