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
    },
    lastAttempt: {
      type: Date
    }
  },
  loginAttempts: {
    count: {
      type: Number,
      default: 0
    },
    lastAttempt: {
      type: Date
    },
    lockUntil: {
      type: Date
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

// Hash password before saving with stronger salt rounds
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12); // Increased from 10 to 12
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Enhanced password comparison with attempt tracking
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Check if account is locked
    if (this.loginAttempts.lockUntil && this.loginAttempts.lockUntil > new Date()) {
      throw new Error('Account is temporarily locked. Please try again later.');
    }

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    
    if (!isMatch) {
      // Increment login attempts
      this.loginAttempts.count += 1;
      this.loginAttempts.lastAttempt = new Date();
      
      // Lock account if more than 5 failed attempts within 15 minutes
      if (this.loginAttempts.count >= 5) {
        this.loginAttempts.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await this.save();
    } else {
      // Reset login attempts on successful login
      if (this.loginAttempts.count > 0) {
        this.loginAttempts.count = 0;
        this.loginAttempts.lockUntil = null;
        await this.save();
      }
    }
    
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

// Enhanced OTP validation with attempt tracking
userSchema.methods.isOTPValid = function(otpCode) {
  if (!this.otp?.code || !this.otp?.expiresAt) {
    console.log('OTP validation failed: No valid OTP stored');
    return false;
  }

  // Check if too many attempts (max 3)
  if (this.otp.attempts >= 3) {
    console.log('OTP validation failed: Max attempts reached');
    return false;
  }

  // Check if OTP has expired
  if (this.otp.expiresAt <= new Date()) {
    console.log('OTP validation failed: Code expired');
    return false;
  }

  // Update attempts
  this.otp.attempts += 1;
  this.otp.lastAttempt = new Date();
  
  // Compare OTP
  return this.otp.code === otpCode;
};

// Clear OTP after successful verification
userSchema.methods.clearOTP = function() {
  this.otp = {
    code: null,
    expiresAt: null,
    attempts: 0,
    lastAttempt: null
  };
};

// Set new OTP
userSchema.methods.setOTP = function(otpCode) {
  this.otp = {
    code: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0,
    lastAttempt: null
  };
};

const User = mongoose.model('User', userSchema);

export default User;