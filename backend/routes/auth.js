import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register user
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['ADMIN', 'INSTITUTION', 'USER']).withMessage('Invalid role')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { name, email, password, role, institutionName, bio, location, phone, language } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ 
      error: 'User with this email already exists' 
    });
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    role,
    institutionName: role === 'INSTITUTION' ? institutionName : undefined,
    bio,
    location,
    phone,
    language: language || 'FR'
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'User registered successfully. Please wait for administrator approval.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      language: user.language
    },
    token
  });
}));

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid email or password' 
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ 
      error: 'Invalid email or password' 
    });
  }

  // Check if account is approved
  if (user.status !== 'APPROVED') {
    return res.status(403).json({ 
      error: 'Account not approved. Please wait for administrator approval.' 
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      language: user.language,
      avatar: user.avatar,
      institutionName: user.institutionName
    },
    token
  });
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided' 
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      language: user.language,
      avatar: user.avatar,
      institutionName: user.institutionName,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  });
}));

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('language').optional().isIn(['FR', 'KH']).withMessage('Invalid language')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided' 
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  // Update allowed fields
  const allowedUpdates = ['name', 'bio', 'location', 'phone', 'language'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      language: user.language,
      avatar: user.avatar,
      institutionName: user.institutionName,
      bio: user.bio,
      location: user.location,
      phone: user.phone
    }
  });
}));

// Change password
router.put('/change-password', [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided' 
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select('+password');
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(401).json({ 
      error: 'Current password is incorrect' 
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ 
    message: 'Password changed successfully' 
  });
}));

export default router;