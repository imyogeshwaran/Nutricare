import Profile from '../models/Profile.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await Profile.findOne({ user: userId }).populate('user', 'name email mobile');

    // If profile doesn't exist, create one
    if (!profile) {
      profile = await Profile.create({
        user: userId,
        personalInfo: {},
        medicalInfo: {}
      });
    }

    res.status(200).json({
      name: profile.user.name,
      email: profile.user.email,
      mobile: profile.user.mobile,
      ...profile.toObject()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update personal information
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, age, sex, height, weight, bloodGroup, deficiencies, conditionDuration } = req.body;
    
    // Validate input
    if (age && (age < 0 || age > 120)) {
      return res.status(400).json({ message: 'Age must be between 0 and 120' });
    }
    
    if (height && height < 0) {
      return res.status(400).json({ message: 'Height must be positive' });
    }
    
    if (weight && weight < 0) {
      return res.status(400).json({ message: 'Weight must be positive' });
    }
    
    // Find and update profile
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { 
        'personalInfo.name': name,
        'personalInfo.age': age,
        'personalInfo.sex': sex,
        'personalInfo.height': height,
        'personalInfo.weight': weight,
        'personalInfo.bloodGroup': bloodGroup,
        'personalInfo.deficiencies': deficiencies,
        'personalInfo.conditionDuration': conditionDuration
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json(profile.personalInfo);
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update medical information
export const updateMedicalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      bloodPressure,
      sugarLevel,
      diseases,
      symptoms,
      allergies,
      medications
    } = req.body;
    
    // Validate input
    if (bloodPressure) {
      if (bloodPressure.systolic < 0) {
        return res.status(400).json({ message: 'Systolic pressure must be positive' });
      }
      if (bloodPressure.diastolic < 0) {
        return res.status(400).json({ message: 'Diastolic pressure must be positive' });
      }
    }
    
    if (sugarLevel && sugarLevel < 0) {
      return res.status(400).json({ message: 'Sugar level must be positive' });
    }
    
    // Build update object
    const updateObj = {};
    
    if (bloodPressure) {
      updateObj['medicalInfo.bloodPressure'] = bloodPressure;
    }
    
    if (sugarLevel !== undefined) {
      updateObj['medicalInfo.sugarLevel'] = sugarLevel;
    }
    
    if (diseases) {
      updateObj['medicalInfo.diseases'] = diseases;
    }
    
    if (symptoms) {
      updateObj['medicalInfo.symptoms'] = symptoms;
    }
    
    if (allergies) {
      updateObj['medicalInfo.allergies'] = allergies;
    }
    
    if (medications) {
      updateObj['medicalInfo.medications'] = medications;
    }
    
    // Find and update profile
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      updateObj,
      { new: true, upsert: true }
    );
    
    res.status(200).json(profile.medicalInfo);
  } catch (error) {
    console.error('Update medical info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};