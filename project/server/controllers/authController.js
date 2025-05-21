import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Configuration for nodemailer
const createTransporter = async () => {
  try {
    // Use Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Only for development
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('Email server connection verified');
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw new Error('Failed to configure email service');
  }
};

// Generate JWT token with improved security
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || '2025!@#$',
    { 
      expiresIn: '30d',
      algorithm: 'HS256'
    }
  );
};

// Enhanced OTP generation and sending
const sendOTP = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"NutriCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #0D9488; margin-bottom: 20px;">Verify Your Email</h2>
          <p style="font-size: 16px; color: #333;">Your verification code is:</p>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0; border-radius: 5px;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Enhanced register function with better validation
export const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Enhanced input validation
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        fields: { name: !name, email: !email, password: !password, mobile: !mobile }
      });
    }

    // Enhanced password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        field: 'password'
      });
    }

    // Enhanced mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ 
        message: 'Invalid mobile number format. Please provide a valid 10-digit number.',
        field: 'mobile'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile: mobile }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email.toLowerCase() ? 
          'An account with this email already exists' : 
          'An account with this mobile number already exists',
        field: existingUser.email === email.toLowerCase() ? 'email' : 'mobile'
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user with enhanced security
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      mobile,
      membershipDate: new Date(),
      loginAttempts: {
        count: 0,
        lastAttempt: null,
        lockUntil: null
      }
    });

    // Set OTP
    user.setOTP(otp);
    await user.save();

    // Create user profile
    await Profile.create({
      user: user._id,
      personalInfo: { 
        name, 
        mobile,
        email: email.toLowerCase()
      },
      medicalInfo: {}
    });

    // Send verification email
    try {
      await sendOTP(email, otp);
    } catch (error) {
      // If email fails, delete the user and profile
      await User.deleteOne({ _id: user._id });
      await Profile.deleteOne({ user: user._id });
      throw new Error('Failed to send verification email');
    }

    res.status(201).json({ 
      message: 'Registration successful. Please check your email for verification code.',
      requiresOtp: true,
      email: email.toLowerCase()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: error.message || 'Registration failed. Please try again.' 
    });
  }
};

// Enhanced login with security features
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password',
        fields: { email: !email, password: !password }
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password'
      });
    }
    
    // Check account lock
    if (user.loginAttempts?.lockUntil && user.loginAttempts.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.loginAttempts.lockUntil - new Date()) / 1000 / 60);
      return res.status(429).json({
        message: `Account is temporarily locked. Please try again in ${remainingTime} minutes.`,
        lockUntil: user.loginAttempts.lockUntil
      });
    }
    
    // Verify password with attempt tracking
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      if (error.message.includes('Account is temporarily locked')) {
        const remainingTime = Math.ceil((user.loginAttempts.lockUntil - new Date()) / 1000 / 60);
        return res.status(429).json({
          message: `Account is temporarily locked. Please try again in ${remainingTime} minutes.`,
          lockUntil: user.loginAttempts.lockUntil
        });
      }
      throw error;
    }
    
    // Handle unverified account
    if (!user.verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.setOTP(otp);
      await user.save();
      
      try {
        await sendOTP(email, otp);
      } catch (error) {
        console.error('Failed to send OTP:', error);
        return res.status(500).json({
          message: 'Failed to send verification code. Please try again.',
          error: 'email_send_failed'
        });
      }
      
      return res.status(200).json({ 
        message: 'Account not verified. Please check your email for verification code.',
        requiresOtp: true,
        email: email.toLowerCase()
      });
    }
    
    // Generate token and send response
    const token = generateToken(user._id);
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// Enhanced OTP verification
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        message: 'Please provide both email and OTP',
        fields: { email: !email, otp: !otp }
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found'
      });
    }
    
    const isValid = user.isOTPValid(otp);
    await user.save(); // Save attempt count

    if (!isValid) {
      if (user.otp.attempts >= 3) {
        return res.status(429).json({
          message: 'Maximum OTP attempts reached. Please request a new code.',
          error: 'max_attempts_reached'
        });
      }
      
      if (user.otp.expiresAt <= new Date()) {
        return res.status(400).json({
          message: 'OTP has expired. Please request a new code.',
          error: 'otp_expired'
        });
      }
      
      return res.status(400).json({ 
        message: 'Invalid verification code',
        attemptsLeft: 3 - user.otp.attempts
      });
    }
    
    user.verified = true;
    user.clearOTP();
    await user.save();
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: true
      },
      token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate input
    if (!email) {
      return res.status(400).json({ 
        message: 'Please provide email address',
        field: 'email'
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        field: 'email'
      });
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.setOTP(otp);
    await user.save();
    
    // Send OTP to user's email
    await sendOTP(email, otp);
    
    res.status(200).json({ 
      message: 'OTP resent successfully. Please check your email.',
      email
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
};