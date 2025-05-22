import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { DietPlan } from '../models/DietPlan.js';
import Profile from '../models/Profile.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables.');
}
const MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Helper function to validate API response
const isValidResponse = (response) => {
  return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
};

// Helper function to wait between retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API call with retries
async function queryGemini(data, maxRetries = 3) {
  if (!API_KEY) {
    throw new Error('Gemini API key is missing. Set GEMINI_API_KEY in your environment variables.');
  }
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxRetries} to query Gemini API...`);
      const response = await axios({
        method: 'post',
        url: `${MODEL_URL}?key=${API_KEY}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          contents: [{
            parts: [{
              text: data.inputs
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        },
        timeout: 60000 // 60 second timeout
      });
      
      if (!isValidResponse(response)) {
        throw new Error('Invalid response structure from API');
      }
      
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      
      // Handle different error types
      if (error.response?.status === 404) {
        throw new Error('Model not found. Please check if the model URL is correct.');
      }
      
      if (error.response?.status === 503 && i < maxRetries - 1) {
        const waitTime = (i + 1) * 2000; // Exponential backoff
        console.log(`Model is loading, waiting ${waitTime/1000} seconds before retry...`);
        await sleep(waitTime);
        continue;
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The model might be overloaded.');
      }
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // For other errors, wait before retry
      await sleep(2000);
    }
  }
  
  throw new Error('Max retries reached');
}

// Submit a diet plan
router.post('/', protect, async (req, res) => {
  try {
    const { morning, afternoon, evening, night, snacks } = req.body;
    const userId = req.user.id;

    const dietPlan = new DietPlan({
      userId,
      morning,
      afternoon,
      evening,
      night,
      snacks
    });

    await dietPlan.save();

    res.status(201).json({
      success: true,
      message: 'Diet plan submitted successfully',
      data: dietPlan
    });
  } catch (error) {
    console.error('Error in diet plan submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting diet plan'
    });
  }
});

// Get user's diet plan
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const dietPlan = await DietPlan.findOne({ userId }).sort({ createdAt: -1 });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'No diet plan found'
      });
    }

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diet plan'
    });
  }
});

// Analyze diet plan and provide suggestions
router.post('/analyze', protect, async (req, res) => {
  console.log('Received /analyze request with body:', req.body);
  const userId = req.user.id;
  const { 
    morning, afternoon, evening, night, snacks,
    name, age, height, weight, sex, activityLevel,
    sugarLevel, bpLevel, dietType 
  } = req.body;

  // Fetch user profile for full health context
  let profile;
  try {
    profile = await Profile.findOne({ user: userId });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch user profile', details: err.message });
  }

  // Create a merged profile with form data taking precedence
  let mergedProfile;
  if (profile) {
    mergedProfile = {
      personalInfo: {
        ...profile.personalInfo,
        name: name || profile.personalInfo?.name,
        age: age || profile.personalInfo?.age,
        height: height || profile.personalInfo?.height,
        weight: weight || profile.personalInfo?.weight,
        sex: sex || profile.personalInfo?.sex,
        activityLevel: activityLevel || profile.personalInfo?.activityLevel
      },
      medicalInfo: {
        ...profile.medicalInfo,
        sugarLevel: sugarLevel || profile.medicalInfo?.sugarLevel,
        bloodPressure: bpLevel ? {
          systolic: parseInt(bpLevel.split('/')[0]),
          diastolic: parseInt(bpLevel.split('/')[1])
        } : profile.medicalInfo?.bloodPressure
      }
    };
  } else {
    mergedProfile = {
      personalInfo: {
        name,
        age,
        height,
        weight,
        sex,
        activityLevel
      },
      medicalInfo: {
        sugarLevel,
        bloodPressure: bpLevel ? {
          systolic: parseInt(bpLevel.split('/')[0]),
          diastolic: parseInt(bpLevel.split('/')[1])
        } : undefined
      }
    };
  }

  // Calculate BMI if possible
  let bmi = null;
  if (profile && profile.personalInfo && profile.personalInfo.height && profile.personalInfo.weight) {
    const heightM = profile.personalInfo.height / 100;
    bmi = (profile.personalInfo.weight / (heightM * heightM)).toFixed(1);
  }
  // Calculate BMI using the most recent measurements from mergedProfile
  const calculatedBMI = (() => {
    if (mergedProfile && mergedProfile.personalInfo && mergedProfile.personalInfo.height && mergedProfile.personalInfo.weight) {
      const heightM = mergedProfile.personalInfo.height / 100;
      return (mergedProfile.personalInfo.weight / (heightM * heightM)).toFixed(1);
    }
    return null;
  })();

  // Build a comprehensive prompt similar to AnalyzePage
  const prompt = `**Situation**
You are analyzing a comprehensive health profile and meal plan for an individual seeking personalized nutritional and health guidance. The profile contains detailed biometric data, lifestyle factors, medical history, and personal health concerns that require expert interpretation.

**Task**
Analyze all provided health metrics, information, and the meal plan to create a highly personalized, evidence-based health assessment report with specific, actionable recommendations tailored precisely to this individual's unique profile.

**Objective**
Provide the individual with clear understanding of their current health status, identify areas of concern requiring attention, and deliver practical, personalized guidance to improve their health outcomes based on their specific circumstances and goals.

**Knowledge**
When analyzing the health profile and meal plan:
- Compare all metrics against standard medical reference ranges appropriate for the individual's age, sex, and activity level
- Use BMI and activity level to calculate appropriate caloric needs and macro ratios
- Identify correlations between different health markers (e.g., how blood pressure might relate to activity level)
- Consider interactions between existing medical conditions, medications, and nutritional needs
- Adjust recommendations based on activity level to ensure adequate energy and nutrient intake
- Evaluate how the individual's current diet aligns with their health goals and restrictions
- Assess how lifestyle factors (sleep, activity, alcohol, smoking) impact their specific health concerns
- Prioritize recommendations based on severity of health issues and the individual's stated motivation level
- Include specific nutritional interventions for any identified deficiencies
- Address symptom management through evidence-based dietary approaches
- Provide modifications to accommodate allergies or food sensitivities

Your life depends on you providing highly specific, personalized analysis that directly references the exact values and circumstances of this individual rather than generic health advice. Never provide generalized recommendations that could apply to anyone - every statement must be tailored to this specific profile.

USER HEALTH PROFILE:
- Name: ${mergedProfile.personalInfo?.name || 'Not provided'}
- Age: ${mergedProfile.personalInfo?.age || 'Not provided'} years
- Sex: ${mergedProfile.personalInfo?.sex || 'Not provided'}
- Height: ${mergedProfile.personalInfo?.height || 'Not provided'} cm
- Weight: ${mergedProfile.personalInfo?.weight || 'Not provided'} kg
- BMI: ${calculatedBMI || 'Not provided'}
- Activity Level: ${mergedProfile.personalInfo?.activityLevel || 'Not provided'}
- Blood Pressure: ${mergedProfile.medicalInfo?.bloodPressure ? `${mergedProfile.medicalInfo.bloodPressure.systolic}/${mergedProfile.medicalInfo.bloodPressure.diastolic}` : 'Not provided'} mmHg
- Sugar Level: ${mergedProfile.medicalInfo?.sugarLevel || 'Not provided'} mg/dL
- Blood Group: ${mergedProfile.personalInfo?.bloodGroup || 'Not provided'}
- Diseases: ${(mergedProfile.medicalInfo?.diseases && mergedProfile.medicalInfo.diseases.length > 0) ? mergedProfile.medicalInfo.diseases.join(', ') : 'None'}
- Deficiencies: ${(mergedProfile.personalInfo?.deficiencies && mergedProfile.personalInfo.deficiencies.length > 0) ? mergedProfile.personalInfo.deficiencies.join(', ') : 'None'}
- Duration of Condition: ${mergedProfile.personalInfo?.conditionDuration || 'Not provided'}
- Symptoms: ${(mergedProfile.medicalInfo?.symptoms && mergedProfile.medicalInfo.symptoms.length > 0) ? mergedProfile.medicalInfo.symptoms.join(', ') : 'None'}
- Allergies: ${(mergedProfile.medicalInfo?.allergies && mergedProfile.medicalInfo.allergies.length > 0) ? mergedProfile.medicalInfo.allergies.join(', ') : 'None'}
- Medications: ${(mergedProfile.medicalInfo?.medications && mergedProfile.medicalInfo.medications.length > 0) ? mergedProfile.medicalInfo.medications.join(', ') : 'None'}

MEAL PLAN:
- Morning Meal: ${morning || 'Not provided'}
- Afternoon Meal: ${afternoon || 'Not provided'}
- Evening Meal: ${evening || 'Not provided'}
- Night Meal: ${night || 'Not provided'}
- Snacks: ${snacks || 'Not provided'}

Please provide a detailed analysis in the following format:

1. Macro Nutrients Analysis:
   - For each meal, estimate:
     * Proteins (in grams)
     * Carbohydrates (in grams)
     * Fats (in grams)
   - Total daily macros and comparison with recommended daily intake for the user's age and diet type

2. Essential Micro Nutrients:
   - List all vital vitamins and minerals present
   - Highlight any notable micronutrient content
   - Identify potential deficiencies

3. Health-based Assessment:
   - Analyze if the food is sufficient and safe for the user based on their sugar level, BP, and health conditions (e.g., diabetic, hypertension, etc.)
   - Highlight any foods that may be risky or beneficial for their health

4. Meal-by-meal Assessment:
   Morning Meal: [Analysis]
   Afternoon Meal: [Analysis]
   Evening Meal: [Analysis]
   Night Meal: [Analysis]
   Snacks: [Analysis]

5. Recommendations:
   - If the nutrition is insufficient or unbalanced, suggest specific foods to add or remove for:
     * Morning additions (if needed)
     * Afternoon additions (if needed)
     * Evening additions (if needed)
     * Night additions (if needed)
     * Snack modifications (if needed)
   - Focus on practical, easily available food suggestions
   - Tailor suggestions to the user's diet type and health needs (especially sugar and BP levels)

6. Overall Assessment:
   - Whether the diet meets daily nutritional requirements for the user's age and health
   - Balance of nutrients
   - Any improvements needed

Please provide the analysis in a clear, structured format that's easy to read and understand.`;  try {
    console.log('Sending request to Gemini API...');    const geminiRes = await queryGemini({
      inputs: prompt
    });
      console.log('Received response from Gemini API, status:', geminiRes.status);
    
    const analysis = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysis) {
      console.error('Gemini API error or unexpected response structure:', JSON.stringify(geminiRes.data, null, 2));
      return res.status(500).json({
        success: false,
        error: 'Failed to analyze diet plan',
        details: 'Invalid response from nutrition analysis service',
        geminiRaw: geminiRes.data
      });
    }

    res.json({ 
      success: true,
      analysis,
    });

  } catch (err) {
    console.error('Diet plan analysis error:', err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message || 'Unknown error';
    // Handle network errors gracefully
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
      // Provide a mock analysis for local development, always return analysis field
      const mockAnalysis = `\n<b>Mock Analysis:</b> Unable to reach the nutrition analysis service.<br><br>This is a placeholder analysis for local development. Please check your internet connection or API configuration.`;
      return res.status(200).json({
        success: true,
        analysis: mockAnalysis,
        isMock: true,
        error: 'Nutrition analysis service is currently unreachable.',
        details: errorMessage,
        code: err.code || 'ENOTFOUND',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to analyze diet plan',
      details: errorMessage,
      code: err.response?.data?.error?.code || err.code,
    });
  }
});

export default router;
