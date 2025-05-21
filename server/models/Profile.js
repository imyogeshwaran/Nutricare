import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    name: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: 0,
      max: 120
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    height: {
      type: Number, // in cm
      min: 0
    },
    weight: {
      type: Number, // in kg
      min: 0
    },
    bloodGroup: {
      type: String,
      trim: true
    },
    deficiencies: [{
      type: String,
      trim: true
    }],
    conditionDuration: {
      type: String,
      trim: true
    }
  },
  medicalInfo: {
    bloodPressure: {
      systolic: {
        type: Number,
        min: 0
      },
      diastolic: {
        type: Number,
        min: 0
      }
    },
    sugarLevel: {
      type: Number,
      min: 0
    },
    diseases: [{
      type: String,
      trim: true
    }],
    symptoms: [{
      type: String,
      trim: true
    }],
    allergies: [{
      type: String,
      trim: true
    }],
    medications: [{
      type: String,
      trim: true
    }]
  }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;