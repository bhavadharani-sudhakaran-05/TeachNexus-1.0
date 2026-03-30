const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { sendEmail } = require('../utils/emailUtils');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm, userType } = req.body;

    console.log('📝 Registration attempt - Received data:', { firstName, lastName, email, userType });

    // Validation
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      console.warn('❌ Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== passwordConfirm) {
      console.warn('❌ Passwords do not match');
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    console.log('🔍 Checking if email already exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn('❌ Email already in use:', email);
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Create user
    console.log('👤 Creating user in database...');
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType: userType || 'teacher',
    });
    console.log('✅ User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    // Try to send welcome email (optional, won't break if fails)
    try {
      if (process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD) {
        await sendEmail({
          email: user.email,
          subject: '🎉 Welcome to TeachNexus!',
          html: `<h2>Welcome, ${user.firstName}!</h2><p>Your TeachNexus journey begins now. Set up your profile to get started!</p>`,
        });
      }
    } catch (emailError) {
      console.warn('Email not sent (email service not configured):', emailError.message);
      // Don't fail registration if email fails
    }

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('❌ Registration error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    return res.status(500).json({
      message: error.message || 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.name : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Error logging in' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = generateToken(user._id);

    // Try to send reset email (optional)
    try {
      if (process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendEmail({
          email: user.email,
          subject: '🔐 Password Reset Request',
          html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 24 hours.</p>`,
        });
      }
    } catch (emailError) {
      console.warn('Password reset email not sent:', emailError.message);
    }

    return res.status(200).json({
      message: 'Password reset email sent (or would be if email is configured)',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Error sending reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // In production, validate the token properly
    // For now, this is a placeholder
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
};
