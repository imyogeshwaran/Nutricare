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

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || '2025!@#$',
    { expiresIn: '30d' }
  );
};

// Generate and send OTP
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
    
    console.log('Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent successfully! ID:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Register new user
export const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, mobile } = req.body;

    // Validate input
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        fields: { name: !name, email: !email, password: !password, mobile: !mobile }
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ 
        message: 'Invalid mobile number format. Please provide a valid 10-digit number.',
        field: 'mobile'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'An account with this email already exists',
        field: 'email'
      });
    }

    // Generate OTP - 6 digits only
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const user = new User({
      name,
      email,
      password,
      mobile,
      membershipDate: new Date(),
    });

    // Set OTP
    user.setOTP(otp);
    await user.save();

    // Create empty profile for the user
    await Profile.create({
      user: user._id,
      personalInfo: { name, mobile },
      medicalInfo: {}
    });

    // Send OTP to user's email
    await sendOTP(email, otp);

    res.status(201).json({ 
      message: 'Registration successful. Please check your email for verification code.',
      requiresOtp: true,
      email
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.message === 'Failed to send verification email') {
      return res.status(500).json({ 
        message: 'Registration successful but failed to send verification email. Please try logging in to resend the code.',
        requiresOtp: true,
        email: req.body.email
      });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password',
        fields: { email: !email, password: !password }
      });
    }
    
    console.log(`Login attempt for email: ${email}`);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({ 
        message: 'Invalid email or password',
        field: 'email'
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for user ${email}`);
      return res.status(401).json({ 
        message: 'Invalid email or password',
        field: 'password'
      });
    }
    
    console.log(`Password verification successful for user ${email}`);
    
    // Check if user is verified
    if (!user.verified) {
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      user.setOTP(otp);
      await user.save();
      
      // Send OTP to user's email
      await sendOTP(email, otp);
      
      return res.status(200).json({ 
        message: 'Account not verified. Please check your email for verification code.',
        requiresOtp: true,
        email
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ 
        message: 'Please provide both email and OTP',
        fields: { email: !email, otp: !otp }
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
    
    // Validate OTP
    if (!user.isOTPValid(otp)) {
      return res.status(400).json({ 
        message: 'Invalid or expired OTP',
        field: 'otp'
      });
    }
    
    // Mark user as verified and clear OTP
    user.verified = true;
    user.clearOTP();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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