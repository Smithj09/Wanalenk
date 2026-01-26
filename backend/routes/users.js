import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, status, search } = req.query;
  
  const query = {};
  
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    users,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get user by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  // Get user's average rating
  const ratingStats = await Review.getAverageRating(user._id);

  res.json({
    user: {
      ...user.toObject(),
      rating: ratingStats
    }
  });
}));

// Update user status (Admin only)
router.patch('/:id/status', authenticate, authorize('ADMIN'), [
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid status')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  user.status = req.body.status;
  await user.save();

  res.json({ 
    message: `User status updated to ${req.body.status}`,
    user: user.toObject()
  });
}));

// Update user role (Admin only)
router.patch('/:id/role', authenticate, authorize('ADMIN'), [
  body('role').isIn(['ADMIN', 'INSTITUTION', 'USER']).withMessage('Invalid role')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  user.role = req.body.role;
  await user.save();

  res.json({ 
    message: `User role updated to ${req.body.role}`,
    user: user.toObject()
  });
}));

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ 
      error: 'Cannot delete your own account' 
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ 
    message: 'User deleted successfully' 
  });
}));

// Get user statistics (Admin only)
router.get('/stats/overview', authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const pendingUsers = await User.countDocuments({ status: 'PENDING' });
  const approvedUsers = await User.countDocuments({ status: 'APPROVED' });
  const institutionUsers = await User.countDocuments({ role: 'INSTITUTION' });
  const regularUsers = await User.countDocuments({ role: 'USER' });

  // Recent users (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentUsers = await User.countDocuments({ 
    createdAt: { $gte: sevenDaysAgo } 
  });

  res.json({
    totalUsers,
    pendingUsers,
    approvedUsers,
    institutionUsers,
    regularUsers,
    recentUsers
  });
}));

// Get user's reviews
router.get('/:id/reviews', authenticate, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const reviews = await Review.find({ targetUserId: req.params.id, isVisible: true })
    .populate('authorId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments({ targetUserId: req.params.id, isVisible: true });

  res.json({
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

export default router;