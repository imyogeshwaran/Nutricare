import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  nutrition: {
    calories: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    vitamins: [{
      type: String,
      trim: true
    }],
    minerals: [{
      type: String,
      trim: true
    }]
  },
  benefits: [{
    type: String,
    trim: true
  }]
});

const categoryRecommendationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  items: [foodItemSchema]
});

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  healthConditions: [{
    type: String,
    trim: true
  }],
  deficiencies: [{
    type: String,
    trim: true
  }],
  foodRecommendations: [categoryRecommendationSchema],
  expectedBenefits: [{
    type: String,
    trim: true
  }],
  precautions: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;