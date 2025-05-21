import Recommendation from '../models/Recommendation.js';
import Profile from '../models/Profile.js';

// Get all recommendations for a user
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recommendations = await Recommendation.find({ user: userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific recommendation by ID
export const getRecommendationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const recommendation = await Recommendation.findOne({
      _id: id,
      user: userId
    });
    
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    
    res.status(200).json(recommendation);
  } catch (error) {
    console.error('Get recommendation by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate new recommendation
export const generateRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user profile
    const profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Check if profile has required data
    if (!profile.personalInfo || !profile.personalInfo.age || !profile.medicalInfo || !profile.medicalInfo.bloodPressure) {
      return res.status(400).json({ message: 'Profile incomplete. Please complete your health profile first.' });
    }
    
    // Analyze profile and determine health conditions
    const healthConditions = [];
    const deficiencies = [];
    
    // Check blood pressure
    if (profile.medicalInfo.bloodPressure) {
      const { systolic, diastolic } = profile.medicalInfo.bloodPressure;
      
      if (systolic >= 140 || diastolic >= 90) {
        healthConditions.push('Hypertension');
      } else if (systolic >= 120 || diastolic >= 80) {
        healthConditions.push('Pre-hypertension');
      }
    }
    
    // Check blood sugar
    if (profile.medicalInfo.sugarLevel) {
      if (profile.medicalInfo.sugarLevel >= 126) {
        healthConditions.push('Diabetes');
      } else if (profile.medicalInfo.sugarLevel >= 100) {
        healthConditions.push('Pre-diabetes');
      }
    }
    
    // Check BMI
    if (profile.personalInfo.height && profile.personalInfo.weight) {
      const heightInMeters = profile.personalInfo.height / 100;
      const bmi = profile.personalInfo.weight / (heightInMeters * heightInMeters);
      
      if (bmi >= 30) {
        healthConditions.push('Obesity');
      } else if (bmi >= 25) {
        healthConditions.push('Overweight');
      } else if (bmi < 18.5) {
        healthConditions.push('Underweight');
      }
    }
    
    // Add existing conditions from profile
    if (profile.medicalInfo.diseases && profile.medicalInfo.diseases.length > 0) {
      healthConditions.push(...profile.medicalInfo.diseases);
    }
    
    // Simulate nutritional deficiencies based on symptoms
    if (profile.medicalInfo.symptoms) {
      if (profile.medicalInfo.symptoms.includes('Fatigue')) {
        deficiencies.push('Iron deficiency');
      }
      
      if (profile.medicalInfo.symptoms.includes('Muscle cramps')) {
        deficiencies.push('Potassium deficiency');
      }
      
      if (profile.medicalInfo.symptoms.includes('Poor wound healing')) {
        deficiencies.push('Vitamin C deficiency');
      }
    }
    
    // Generate food recommendations based on conditions
    const foodRecommendations = [];
    
    // Fruits category
    const fruitsCategory = {
      category: 'fruits',
      items: []
    };
    
    if (healthConditions.includes('Hypertension') || healthConditions.includes('Pre-hypertension')) {
      fruitsCategory.items.push({
        name: 'Banana',
        quantity: '1 medium banana daily',
        duration: 'Ongoing',
        nutrition: {
          calories: 105,
          fat: 0.4,
          protein: 1.3,
          carbs: 27,
          vitamins: ['B6', 'C'],
          minerals: ['Potassium', 'Magnesium']
        },
        benefits: ['Helps lower blood pressure', 'Supports heart health']
      });
      
      fruitsCategory.items.push({
        name: 'Berries',
        quantity: '1 cup daily',
        duration: 'Ongoing',
        nutrition: {
          calories: 85,
          fat: 0.5,
          protein: 1.1,
          carbs: 21,
          vitamins: ['C', 'K'],
          minerals: ['Manganese']
        },
        benefits: ['Rich in antioxidants', 'Anti-inflammatory properties']
      });
    }
    
    if (healthConditions.includes('Diabetes') || healthConditions.includes('Pre-diabetes')) {
      fruitsCategory.items.push({
        name: 'Apple',
        quantity: '1 medium apple daily',
        duration: 'Ongoing',
        nutrition: {
          calories: 95,
          fat: 0.3,
          protein: 0.5,
          carbs: 25,
          vitamins: ['C', 'K'],
          minerals: ['Potassium']
        },
        benefits: ['Low glycemic index', 'Helps regulate blood sugar']
      });
    }
    
    fruitsCategory.items.push({
      name: 'Citrus Fruits',
      quantity: '1 medium orange or grapefruit daily',
      duration: 'Ongoing',
      nutrition: {
        calories: 60,
        fat: 0.2,
        protein: 1.2,
        carbs: 15,
        vitamins: ['C', 'B1', 'Folate'],
        minerals: ['Potassium']
      },
      benefits: ['Immune support', 'Heart health']
    });
    
    if (fruitsCategory.items.length > 0) {
      foodRecommendations.push(fruitsCategory);
    }
    
    // Vegetables category
    const vegetablesCategory = {
      category: 'vegetables',
      items: []
    };
    
    vegetablesCategory.items.push({
      name: 'Leafy Greens',
      quantity: '2 cups daily',
      duration: 'Ongoing',
      nutrition: {
        calories: 15,
        fat: 0.2,
        protein: 1.5,
        carbs: 3,
        vitamins: ['A', 'C', 'K', 'Folate'],
        minerals: ['Iron', 'Calcium', 'Magnesium']
      },
      benefits: ['Blood pressure regulation', 'Anti-inflammatory']
    });
    
    if (deficiencies.includes('Iron deficiency')) {
      vegetablesCategory.items.push({
        name: 'Spinach',
        quantity: '1 cup cooked daily',
        duration: '3 months',
        nutrition: {
          calories: 41,
          fat: 0.4,
          protein: 5.3,
          carbs: 6.8,
          vitamins: ['A', 'C', 'K', 'Folate'],
          minerals: ['Iron', 'Calcium', 'Magnesium']
        },
        benefits: ['Iron-rich', 'Combats anemia', 'Boosts energy']
      });
    }
    
    if (healthConditions.includes('Hypertension')) {
      vegetablesCategory.items.push({
        name: 'Beets',
        quantity: '1/2 cup cooked, 2-3 times weekly',
        duration: 'Ongoing',
        nutrition: {
          calories: 59,
          fat: 0.2,
          protein: 2.2,
          carbs: 13,
          vitamins: ['C', 'Folate'],
          minerals: ['Potassium', 'Manganese']
        },
        benefits: ['Lowers blood pressure', 'Improves circulation']
      });
    }
    
    foodRecommendations.push(vegetablesCategory);
    
    // Protein sources category
    const proteinCategory = {
      category: 'protein sources',
      items: []
    };
    
    if (healthConditions.includes('Overweight') || healthConditions.includes('Obesity')) {
      proteinCategory.items.push({
        name: 'Lean Chicken Breast',
        quantity: '3-4 oz per serving, 3-4 times weekly',
        duration: 'Ongoing',
        nutrition: {
          calories: 165,
          fat: 3.6,
          protein: 31,
          carbs: 0,
          vitamins: ['B3', 'B6'],
          minerals: ['Selenium', 'Phosphorus']
        },
        benefits: ['High protein, low fat', 'Supports weight management']
      });
    } else {
      proteinCategory.items.push({
        name: 'Fatty Fish (Salmon, Mackerel)',
        quantity: '4-6 oz per serving, twice weekly',
        duration: 'Ongoing',
        nutrition: {
          calories: 206,
          fat: 12.4,
          protein: 22.1,
          carbs: 0,
          vitamins: ['D', 'B12'],
          minerals: ['Selenium', 'Iodine']
        },
        benefits: ['Heart health', 'Anti-inflammatory omega-3 fatty acids']
      });
    }
    
    if (deficiencies.includes('Iron deficiency')) {
      proteinCategory.items.push({
        name: 'Lean Red Meat',
        quantity: '3-4 oz per serving, once weekly',
        duration: '2 months',
        nutrition: {
          calories: 250,
          fat: 15,
          protein: 26,
          carbs: 0,
          vitamins: ['B12', 'B6'],
          minerals: ['Iron', 'Zinc']
        },
        benefits: ['Rich in heme iron', 'Combats iron deficiency']
      });
    }
    
    proteinCategory.items.push({
      name: 'Legumes (Beans, Lentils)',
      quantity: '1/2 cup cooked, 3-4 times weekly',
      duration: 'Ongoing',
      nutrition: {
        calories: 115,
        fat: 0.4,
        protein: 9,
        carbs: 20,
        vitamins: ['Folate', 'B1'],
        minerals: ['Iron', 'Magnesium', 'Potassium']
      },
      benefits: ['Plant-based protein', 'Fiber rich', 'Stabilizes blood sugar']
    });
    
    foodRecommendations.push(proteinCategory);
    
    // Grains category
    const grainsCategory = {
      category: 'grains',
      items: []
    };
    
    if (healthConditions.includes('Diabetes') || healthConditions.includes('Pre-diabetes')) {
      grainsCategory.items.push({
        name: 'Quinoa',
        quantity: '1/2 cup cooked, 2-3 times weekly',
        duration: 'Ongoing',
        nutrition: {
          calories: 120,
          fat: 1.9,
          protein: 4.4,
          carbs: 21.3,
          vitamins: ['B1', 'B6', 'Folate'],
          minerals: ['Magnesium', 'Phosphorus', 'Manganese']
        },
        benefits: ['Low glycemic index', 'Complete protein', 'Rich in minerals']
      });
    }
    
    grainsCategory.items.push({
      name: 'Oats',
      quantity: '1/2 cup dry, daily',
      duration: 'Ongoing',
      nutrition: {
        calories: 150,
        fat: 2.5,
        protein: 5,
        carbs: 27,
        vitamins: ['B1', 'B5'],
        minerals: ['Manganese', 'Phosphorus', 'Magnesium']
      },
      benefits: ['Lowers cholesterol', 'Stabilizes blood sugar', 'Rich in fiber']
    });
    
    if (healthConditions.includes('Hypertension')) {
      grainsCategory.items.push({
        name: 'Brown Rice',
        quantity: '1/2 cup cooked, 2-3 times weekly',
        duration: 'Ongoing',
        nutrition: {
          calories: 108,
          fat: 0.9,
          protein: 2.6,
          carbs: 22.4,
          vitamins: ['B1', 'B3', 'B6'],
          minerals: ['Manganese', 'Magnesium', 'Phosphorus']
        },
        benefits: ['Whole grain', 'High in magnesium', 'Supports heart health']
      });
    }
    
    foodRecommendations.push(grainsCategory);
    
    // Healthy fats category
    const fatsCategory = {
      category: 'healthy fats',
      items: []
    };
    
    if (healthConditions.includes('Hypertension') || healthConditions.includes('Heart Disease')) {
      fatsCategory.items.push({
        name: 'Extra Virgin Olive Oil',
        quantity: '1-2 tablespoons daily',
        duration: 'Ongoing',
        nutrition: {
          calories: 120,
          fat: 14,
          protein: 0,
          carbs: 0,
          vitamins: ['E', 'K'],
          minerals: []
        },
        benefits: ['Heart health', 'Anti-inflammatory', 'Rich in antioxidants']
      });
    }
    
    fatsCategory.items.push({
      name: 'Avocado',
      quantity: '1/2 avocado, 2-3 times weekly',
      duration: 'Ongoing',
      nutrition: {
        calories: 160,
        fat: 15,
        protein: 2,
        carbs: 9,
        vitamins: ['K', 'E', 'C', 'B5', 'B6'],
        minerals: ['Potassium']
      },
      benefits: ['Healthy monounsaturated fats', 'Blood pressure regulation']
    });
    
    fatsCategory.items.push({
      name: 'Nuts (Almonds, Walnuts)',
      quantity: '1/4 cup, 3-4 times weekly',
      duration: 'Ongoing',
      nutrition: {
        calories: 190,
        fat: 18,
        protein: 7,
        carbs: 6,
        vitamins: ['E', 'B2'],
        minerals: ['Magnesium', 'Manganese']
      },
      benefits: ['Heart health', 'Brain health', 'Blood sugar regulation']
    });
    
    foodRecommendations.push(fatsCategory);
    
    // Expected benefits
    const expectedBenefits = [];
    
    if (healthConditions.includes('Hypertension') || healthConditions.includes('Pre-hypertension')) {
      expectedBenefits.push('Lower blood pressure levels');
      expectedBenefits.push('Reduced risk of cardiovascular events');
    }
    
    if (healthConditions.includes('Diabetes') || healthConditions.includes('Pre-diabetes')) {
      expectedBenefits.push('Improved blood sugar control');
      expectedBenefits.push('Reduced insulin resistance');
    }
    
    if (healthConditions.includes('Overweight') || healthConditions.includes('Obesity')) {
      expectedBenefits.push('Gradual, healthy weight loss');
      expectedBenefits.push('Improved metabolic health');
    }
    
    if (deficiencies.includes('Iron deficiency')) {
      expectedBenefits.push('Increased energy levels');
      expectedBenefits.push('Improved oxygen transport in the blood');
    }
    
    expectedBenefits.push('Enhanced overall nutrient intake');
    expectedBenefits.push('Improved digestive health');
    
    // Precautions
    const precautions = [];
    
    if (profile.medicalInfo.allergies && profile.medicalInfo.allergies.length > 0) {
      precautions.push('Avoid foods you are allergic to, even if recommended');
    }
    
    if (healthConditions.includes('Diabetes')) {
      precautions.push('Monitor blood sugar levels regularly while adapting to dietary changes');
    }
    
    if (healthConditions.includes('Hypertension')) {
      precautions.push('Continue taking prescribed medications while implementing dietary changes');
      precautions.push('Monitor blood pressure regularly');
    }
    
    if (profile.medicalInfo.medications && profile.medicalInfo.medications.length > 0) {
      precautions.push('Some foods may interact with medications. Consult your doctor about specific interactions');
    }
    
    precautions.push('Stay hydrated with at least 8 glasses of water daily');
    precautions.push('Introduce dietary changes gradually to allow your body to adjust');
    
    // Create the recommendation
    const recommendation = new Recommendation({
      user: userId,
      healthConditions,
      deficiencies,
      foodRecommendations,
      expectedBenefits,
      precautions
    });
    
    await recommendation.save();
    
    res.status(201).json(recommendation);
  } catch (error) {
    console.error('Generate recommendation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};