import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  verified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: {
      type: String
    },
    expiresAt: {
      type: Date
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  membershipDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`Password comparison result for ${this.email}: ${isMatch ? 'Success' : 'Failed'}`);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Set OTP and expiration
userSchema.methods.setOTP = function(otpCode) {
  this.otp = {
    code: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0
  };
};

// Check if OTP is valid
userSchema.methods.isOTPValid = function(otpCode) {
  console.log(`Validating OTP for user ${this.email}`);
  
  if (!this.otp) {
    console.log('OTP validation failed: No OTP stored for user');
    return false;
  }
  
  // Check if OTP has expired
  if (this.otp.expiresAt <= new Date()) {
    console.log(`OTP validation failed: Code expired at ${this.otp.expiresAt}`);
    return false;
  }
  
  // Check if too many attempts
  if (this.otp.attempts >= 3) {
    console.log('OTP validation failed: Too many attempts');
    return false;
  }
  
  // Increment attempts
  this.otp.attempts += 1;
  
  // Check if OTP matches
  const isValid = this.otp.code === otpCode;
  if (!isValid) {
    console.log('OTP validation failed: Codes do not match');
    return false;
  }
  
  console.log('OTP validation successful');
  return true;
};

// Clear OTP after use
userSchema.methods.clearOTP = function() {
  this.otp = undefined;
};

// Reset OTP attempts
userSchema.methods.resetOTPAttempts = function() {
  if (this.otp) {
    this.otp.attempts = 0;
  }
};

const User = mongoose.model('User', userSchema);

export default User;