import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  activityLevel: {
    type: String,
    required: true
  },
  sugarLevel: {
    type: String,
    required: true
  },
  bpLevel: {
    type: String,
    required: true
  },
  dietType: {
    type: String,
    required: true
  },
  morning: {
    type: String,
    required: true
  },
  afternoon: {
    type: String,
    required: true
  },
  evening: {
    type: String,
    required: true
  },
  night: {
    type: String,
    required: true
  },
  snacks: {
    type: String
  }
}, {
  timestamps: true
});

export const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
