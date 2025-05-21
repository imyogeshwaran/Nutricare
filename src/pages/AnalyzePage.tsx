import React, { useState } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const GEMINI_API_KEY = 'AIzaSyCF-6yGKLAkDEgGMU1jZGYNio-aC23dFxU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

const AnalyzePage: React.FC = (): JSX.Element => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [form, setForm] = useState({
    name: '', age: '', sex: '', height: '', weight: '', bloodPressure: '', sugar: '', bloodGroup: '', diseases: '', deficiencies: '', duration: '', symptoms: '',
    allergies: '',
    dietType: '',
    alcohol: '',
    smoking: '',
    sleep: '',
    activity: '',
    motivation: '',
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const bmi = form.height && form.weight ? 
        (Number(form.weight) / Math.pow(Number(form.height) / 100, 2)).toFixed(1) : null;

      const prompt = `**Situation**
You are analyzing a comprehensive health profile for an individual seeking personalized nutritional and health guidance. The profile contains detailed biometric data, lifestyle factors, medical history, and personal health concerns that require expert interpretation.

**Task**
Analyze all provided health metrics and information to create a highly personalized, evidence-based health assessment report with specific, actionable recommendations tailored precisely to this individual's unique profile.

**Objective**
Provide the individual with clear understanding of their current health status, identify areas of concern requiring attention, and deliver practical, personalized guidance to improve their health outcomes based on their specific circumstances and goals.

**Knowledge**
When analyzing the health profile:
- Compare all metrics against standard medical reference ranges appropriate for the individual's age and sex
- Identify correlations between different health markers (e.g., how blood pressure might relate to sleep patterns)
- Consider interactions between existing medical conditions, medications, and nutritional needs
- Evaluate how the individual's current diet aligns with their health goals and restrictions
- Assess how lifestyle factors (sleep, activity, alcohol, smoking) impact their specific health concerns
- Prioritize recommendations based on severity of health issues and the individual's stated motivation level
- Include specific nutritional interventions for any identified deficiencies
- Address symptom management through evidence-based dietary approaches
- Provide modifications to accommodate allergies or food sensitivities

Your life depends on you providing highly specific, personalized analysis that directly references the exact values and circumstances of this individual rather than generic health advice. Never provide generalized recommendations that could apply to anyone - every statement must be tailored to this specific profile.
USER HEALTH PROFILE:
- Name: ${form.name}
- Age: ${form.age} years
- Sex: ${form.sex}
- Height: ${form.height} cm
- Weight: ${form.weight} kg${bmi ? `\n- BMI: ${bmi}` : ''}
- Blood Pressure: ${form.bloodPressure}
- Blood Sugar: ${form.sugar} mg/dL
- Blood Group: ${form.bloodGroup}
- Diseases: ${form.diseases || 'None reported'}
- Deficiencies: ${form.deficiencies || 'None reported'}
- Symptoms: ${form.symptoms || 'None reported'}
- Duration of symptoms: ${form.duration || 'Unspecified'}
- Allergies / Food Intolerances: ${form.allergies || 'None reported'}
- Diet Type: ${form.dietType || 'Not specified'}
- Alcohol Consumption: ${form.alcohol || 'Not specified'}
- Smoking / Tobacco Use: ${form.smoking || 'Not specified'}
- Sleep Duration / Quality: ${form.sleep || 'Not specified'}
- Physical Activity Level: ${form.activity || 'Not specified'}
- Motivation to Change: ${form.motivation || 'Not specified'}

INSTRUCTIONS:
1. Health Status Assessment:
   - Analyze each vital sign (blood pressure, blood sugar, BMI) using the user's values. State if each is normal, high, or low for this age/sex, and explain the implications.
   - Identify and explain any potential health risks based on the user's diseases, deficiencies, symptoms, allergies, diet, alcohol, smoking, sleep, activity, and motivation.
2. Nutritional Analysis:
   - Evaluate possible nutrient deficiencies and their impact, referencing the user's reported deficiencies, symptoms, allergies, and diet type.
   - Explain how the user's medical conditions and lifestyle may affect nutritional needs.
3. Personalized Recommendations:
   - Give specific dietary and lifestyle changes for this user, based on their profile. List foods to include/avoid, nutrients to focus on, and any supplements if appropriate. Consider allergies, diet type, alcohol, smoking, sleep, activity, and motivation.
   - Avoid generic advice; make all suggestions relevant to the user's data.
4. Monitoring & Next Steps:
   - List which health metrics this user should track closely and why.
   - State any warning signs that should prompt immediate medical attention.
   - Suggest when to follow up with a healthcare provider.

Format your response with clear sections, bullet points, and highlight any urgent issues. Always use the user's actual values in your explanations.`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error?.message || 'No response from Gemini API.');
        setIsAnalyzing(false);
        return;
      }
      const data = await response.json();      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const rawText = data.candidates[0].content.parts[0].text;
        // Process the text to add formatting
        let formattedText = rawText
          // Normalize line endings
          .replace(/\r\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          // Remove asterisks used for markdown bold/italic
          .replace(/\*/g, '')          // Convert markdown headings to HTML
          .replace(/^# (.+)$/gm, '<h2 class="text-navy-900 font-bold text-2xl mt-6 mb-3">$1</h2>')
          .replace(/^## (.+)$/gm, '<h3 class="text-navy-800 font-bold text-xl mt-4 mb-2 border-b border-navy-200 pb-1">$1</h3>')
          .replace(/^### (.+)$/gm, '<h4 class="text-navy-700 font-semibold text-lg mt-2 mb-1">$1</h4>')
          // Special: Make '1. Health Status Assessment' a bold, colored section heading, remove the '1.'
          .replace(/<p class="mb-3">1\.\s*Health Status Assessment:?<\/p>/i, '<h3 class="font-extrabold text-pink-600 text-2xl my-4">Health Status Assessment</h3>')
          // Convert markdown bullet points to HTML lists
          .replace(/^\s*[-•] (.+)$/gm, '<li class="mb-2">$1</li>')
          .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match: string) => `<ul class="list-disc ml-6 my-2">${match}</ul>`)
          // Convert numbered lists
          .replace(/^\s*\d+\. (.+)$/gm, '<li class="mb-2">$1</li>')
          .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match: string) => `<ol class="list-decimal ml-6 my-2">${match}</ol>`)
          // Paragraphs
          .replace(/^(?!<h\d|<ul|<ol|<li|<\/ul|<\/ol|<\/li|\s*$)(.+)$/gm, '<p class="mb-3">$1</p>')
          // Make subtopic lines (ending with colon) bold
          .replace(/<p class="mb-3">([^<:]+):<\/p>/g, '<p class="mb-3 font-bold text-navy-800 text-xl">$1:</p>')
          // Highlight health metrics
          .replace(/\b(\d{3,}\/\d{2,})\b/g, (_match: string, bp: string) => {
            const [systolic, diastolic] = bp.split('/').map(Number);
            const isHigh = systolic >= 130 || diastolic >= 80;
            return `<span class="font-bold ${isHigh ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'} px-2 py-0.5 rounded">${bp}</span>`;
          })
          .replace(/\b(\d{3,})\s*mg\/dL\b/g, (_match: string, sugar: string) => {
            const isHigh = Number(sugar) > 140;
            return `<span class="font-bold ${isHigh ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'} px-2 py-0.5 rounded">${sugar} mg/dL</span>`;
          })
          // Highlight BMI values
          .replace(/BMI:\s*(\d+\.?\d*)/g, (_match: string, bmi: string) => {
            const bmiNum = parseFloat(bmi);
            let className = 'text-emerald-600 bg-emerald-50';
            if (bmiNum < 18.5) className = 'text-yellow-600 bg-yellow-50';
            if (bmiNum >= 25) className = 'text-orange-600 bg-orange-50';
            if (bmiNum >= 30) className = 'text-red-600 bg-red-50';
            return `BMI: <span class="font-bold ${className} px-2 py-0.5 rounded">${bmi}</span>`;
          })
          // Highlight positive/healthy/normal terms in green
          .replace(/\b(good|normal|healthy|optimal|within range|improved|stable|controlled|adequate|sufficient|beneficial|recommended|safe|well-controlled|well managed|no issues|no concern|no risk|no deficiency|no symptoms)\b/gi,
            '<span class="font-bold text-emerald-700 bg-emerald-100 px-1 rounded">$1</span>')
          // Highlight risky/critical/warning terms in red
          .replace(/\b(risk|risky|danger|dangerous|critical|urgent|warning|caution|elevated|high|low|deficient|deficiency|abnormal|uncontrolled|unmanaged|concern|alert|problem|issue|complication|impaired|prediabetes|diabetes|hypertension|obesity|overweight|underweight|anemia|deficit|symptom|disease|condition|consult|doctor|medical attention|seek help|emergency)\b/gi,
            '<span class="font-bold text-red-700 bg-red-100 px-1 rounded">$1</span>')
          .trim();

        setResult(formattedText);
      } else {
        setError('No response from Gemini API.');
      }    } catch (err) {
      setError('An error occurred while analyzing. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-emerald-50 flex flex-col items-center pt-12 pb-20">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-center mb-3 text-emerald-900 drop-shadow">Analyze Your Nutritional Health</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
          Complete the form below to receive a personalized analysis of your potential micronutrient deficiencies based on your symptoms and health profile.
        </p>
        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl px-12 pt-12 pb-12 mb-8 border border-emerald-100 transition-all duration-300 hover:shadow-emerald-200">
          {/* Personal Information */}
          <div className="mb-8">
            <div className="flex items-center mb-4 bg-blue-50 rounded-lg px-3 py-2">
              <span className="text-blue-600 mr-2 text-xl">👤</span>
              <span className="font-semibold text-blue-900 text-lg">Personal Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" placeholder="e.g., John Doe" value={form.name} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-blue-200 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="age">Age (Years) <span className="text-red-500">*</span></label>
                <input id="age" name="age" type="number" placeholder="e.g., 30" value={form.age} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-blue-200 focus:border-blue-400" required />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="sex">Sex <span className="text-red-500">*</span></label>
                <select id="sex" name="sex" value={form.sex} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-blue-200 focus:border-blue-400" required>
                  <option value="">Select an option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          {/* Physical Metrics */}
          <div className="mb-8">
            <div className="flex items-center mb-4 bg-emerald-50 rounded-lg px-3 py-2">
              <span className="text-emerald-600 mr-2 text-xl">📏</span>
              <span className="font-semibold text-emerald-900 text-lg">Physical Metrics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="height">Height (cm)</label>
                <input id="height" name="height" type="number" placeholder="e.g., 175" value={form.height} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-emerald-200 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="weight">Weight (kg)</label>
                <input id="weight" name="weight" type="number" placeholder="e.g., 70" value={form.weight} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-emerald-200 focus:border-emerald-400" />
              </div>
            </div>
          </div>
          {/* Medical Indicators */}
          <div className="mb-8">
            <div className="flex items-center mb-4 bg-indigo-50 rounded-lg px-3 py-2">
              <span className="text-indigo-600 mr-2 text-xl">🩺</span>
              <span className="font-semibold text-indigo-900 text-lg">Medical Indicators</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="bloodPressure">Blood Pressure</label>
                <input id="bloodPressure" name="bloodPressure" type="text" placeholder="e.g., 120/80" value={form.bloodPressure} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-indigo-200 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="sugar">Sugar Level (mg/dL)</label>
                <input id="sugar" name="sugar" type="number" placeholder="e.g., 90" value={form.sugar} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-indigo-200 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="bloodGroup">Blood Group</label>
                <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-indigo-200 focus:border-indigo-400">
                  <option value="">Select an option</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>
          {/* Medical History */}
          <div className="mb-8">
            <div className="flex items-center mb-4 bg-purple-50 rounded-lg px-3 py-2">
              <span className="text-purple-600 mr-2 text-xl">🩻</span>
              <span className="font-semibold text-purple-900 text-lg">Medical History</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="diseases">Specific Diseases</label>
                <input id="diseases" name="diseases" type="text" placeholder="e.g., Hypertension, Type 2 Diabetes" value={form.diseases} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-purple-200 focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="deficiencies">Deficiencies</label>
                <input id="deficiencies" name="deficiencies" type="text" placeholder="e.g., Iron deficiency, Vitamin D deficiency" value={form.deficiencies} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-purple-200 focus:border-purple-400" />
              </div>
            </div>
          </div>
          {/* Current Condition Details */}
          <div className="mb-8">
            <div className="flex items-center mb-4 bg-cyan-50 rounded-lg px-3 py-2">
              <span className="text-cyan-600 mr-2 text-xl">📝</span>
              <span className="font-semibold text-cyan-900 text-lg">Current Condition Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="duration">Duration of Condition</label>
                <input id="duration" name="duration" type="text" placeholder="e.g., 3 months, 2 weeks" value={form.duration} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-cyan-200 focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="symptoms">Symptoms</label>
                <input id="symptoms" name="symptoms" type="text" placeholder="e.g., Fatigue, Headaches" value={form.symptoms} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-cyan-200 focus:border-cyan-400" />
              </div>
            </div>
          </div>
          {/* Lifestyle Information */}
          <div className="mb-8">
            <div className="flex items-center mb-4 bg-orange-50 rounded-lg px-3 py-2">
              <span className="text-orange-600 mr-2 text-xl">🌱</span>
              <span className="font-semibold text-orange-900 text-lg">Lifestyle Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="dietType">Diet Type</label>                <select id="dietType" name="dietType" value={form.dietType} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-orange-200 focus:border-orange-400">
                  <option value="">Select your diet type</option>
                  <option value="Vegetarian">Vegetarian (No meat, fish; includes dairy & eggs)</option>
                  <option value="Vegan">Vegan (No animal products at all)</option>
                  <option value="Non-vegetarian">Non-vegetarian (All foods including meat)</option>
                  <option value="Pescatarian">Pescatarian (Vegetarian + fish & seafood)</option>
                  <option value="Keto">Keto (Very low-carb, high-fat diet)</option>
                  <option value="Paleo">Paleo (No processed foods, grains, or dairy)</option>
                  <option value="Mediterranean">Mediterranean (Rich in vegetables, olive oil, fish)</option>
                  <option value="Low-carb">Low-carb (Reduced carbohydrate intake)</option>
                  <option value="Plant-based">Plant-based (Mostly plants, minimal animal products)</option>
                  <option value="Flexitarian">Flexitarian (Mostly vegetarian with occasional meat)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="alcohol">Alcohol Consumption</label>
                <select id="alcohol" name="alcohol" value={form.alcohol} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-orange-200 focus:border-orange-400">
                  <option value="">Select consumption level</option>
                  <option value="None">None</option>
                  <option value="Occasionally">Occasionally (1-2 drinks/month)</option>
                  <option value="Socially">Socially (1-2 drinks/week)</option>
                  <option value="Regularly">Regularly (3-5 drinks/week)</option>
                  <option value="Frequently">Frequently (Daily)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="smoking">Smoking / Tobacco Use</label>
                <select id="smoking" name="smoking" value={form.smoking} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-orange-200 focus:border-orange-400">
                  <option value="">Select usage level</option>
                  <option value="None">None</option>
                  <option value="Former smoker">Former smoker</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Light smoker">Light smoker (1-9/day)</option>
                  <option value="Regular smoker">Regular smoker (10-19/day)</option>
                  <option value="Heavy smoker">Heavy smoker (20+/day)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="sleep">Sleep Duration / Quality</label>
                <select id="sleep" name="sleep" value={form.sleep} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-orange-200 focus:border-orange-400">
                  <option value="">Select sleep pattern</option>
                  <option value="Less than 6 hours">Less than 6 hours</option>
                  <option value="6-7 hours">6-7 hours</option>
                  <option value="7-8 hours">7-8 hours</option>
                  <option value="8-9 hours">8-9 hours</option>
                  <option value="More than 9 hours">More than 9 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="activity">Physical Activity Level</label>
                <select id="activity" name="activity" value={form.activity} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-orange-200 focus:border-orange-400">
                  <option value="">Select activity level</option>
                  <option value="Sedentary">Sedentary (Little to no exercise)</option>
                  <option value="Lightly active">Lightly active (1-3 days/week)</option>
                  <option value="Moderately active">Moderately active (3-5 days/week)</option>
                  <option value="Very active">Very active (6-7 days/week)</option>
                  <option value="Extra active">Extra active (Very intense exercise/sports)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-1" htmlFor="motivation">Motivation to Change</label>
                <select id="motivation" name="motivation" value={form.motivation} onChange={handleChange} className="input input-bordered w-full bg-gray-50 py-3 text-lg border-orange-200 focus:border-orange-400">
                  <option value="">Select motivation level</option>
                  <option value="Very low">Very low</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Very high">Very high</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 text-lg tracking-wide transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">
              Get Personalized Suggestions
            </button>
          </div>
        </form>
        {isAnalyzing && <LoadingSpinner isVisible={isAnalyzing} message="Analyzing your health profile..." />}        {result && (
          <div className="bg-white border border-navy-200 text-gray-800 px-8 py-7 rounded-2xl shadow-xl mt-8 animate-fade-in">
            <span className="block sm:inline" dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-7 rounded-2xl shadow-xl mt-8 animate-fade-in">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mt-12">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-2xl shadow">
            <div className="font-bold mb-2 text-base">Medical Disclaimer</div>
            <div className="text-sm">
              The information provided by NutrientWise is for general informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.<br />
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or before starting any new dietary or nutritional supplement regimen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
