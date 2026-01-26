import express from 'express';
import { body, validationResult } from 'express-validator';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Create a review
router.post('/', authenticate, [
  body('targetUserId').isMongoId().withMessage('Valid target user ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('context').optional().isIn(['JOB_APPLICATION', 'PRODUCT_PURCHASE', 'GENERAL']).withMessage('Invalid context'),
  body('contextId').optional().isMongoId().withMessage('Valid context ID is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { targetUserId, rating, comment, context, contextId } = req.body;

  // Check if target user exists
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ 
      error: 'Target user not found' 
    });
  }

  // Check if user is trying to review themselves
  if (targetUserId === req.user._id.toString()) {
    return res.status(400).json({ 
      error: 'You cannot review yourself' 
    });
  }

  // Check if user has already reviewed this target
  const existingReview = await Review.findOne({
    targetUserId,
    authorId: req.user._id
  });
  
  if (existingReview) {
    return res.status(400).json({ 
      error: 'You have already reviewed this user' 
    });
  }

  // Create review
  const review = new Review({
    targetUserId,
    authorId: req.user._id,
    authorName: req.user.name,
    rating,
    comment,
    context: context || 'GENERAL',
    contextId: contextId || null
  });

  await review.save();

  // Populate author info
  await review.populate('authorId', 'name avatar');

  res.status(201).json({
    message: 'Review submitted successfully',
    review
  });
}));

// Get reviews for a user
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, rating } = req.query;
  
  const query = { 
    targetUserId: req.params.userId, 
    isVisible: true 
  };
  
  if (rating) query.rating = parseInt(rating);

  const reviews = await Review.find(query)
    .populate('authorId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments(query);

  // Get average rating
  const ratingStats = await Review.getAverageRating(req.params.userId);

  res.json({
    reviews,
    rating: ratingStats,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get reviews by current user
router.get('/my-reviews', authenticate, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const reviews = await Review.find({ authorId: req.user._id })
    .populate('targetUserId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments({ authorId: req.user._id });

  res.json({
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Update a review (Author only)
router.put('/:id', authenticate, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return res.status(404).json({ 
      error: 'Review not found' 
    });
  }

  // Check if user is the author
  if (review.authorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ 
      error: 'Access denied. You can only update your own reviews.' 
    });
  }

  // Update allowed fields
  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;
  
  await review.save();

  // Populate author and target info
  await review.populate('authorId', 'name avatar');
  await review.populate('targetUserId', 'name avatar');

  res.json({
    message: 'Review updated successfully',
    review
  });
}));

// Delete a review (Author or Admin)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return res.status(404).json({ 
      error: 'Review not found' 
    });
  }

  // Check if user is the author or admin
  if (review.authorId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  await Review.findByIdAndDelete(req.params.id);

  res.json({ 
    message: 'Review deleted successfully' 
  });
}));

// Add response to review (Target user only)
router.patch('/:id/response', authenticate, [
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Response must be between 1 and 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return res.status(404).json({ 
      error: 'Review not found' 
    });
  }

  // Check if user is the target of the review
  if (review.targetUserId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ 
      error: 'Access denied. You can only respond to reviews about you.' 
    });
  }

  await review.addResponse(req.body.text);

  // Populate author and target info
  await review.populate('authorId', 'name avatar');
  await review.populate('targetUserId', 'name avatar');

  res.json({
    message: 'Response added successfully',
    review
  });
}));

// Hide/unhide review (Target user or Admin)
router.patch('/:id/visibility', authenticate, [
  body('isVisible').isBoolean().withMessage('isVisible must be a boolean')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return res.status(404).json({ 
      error: 'Review not found' 
    });
  }

  // Check if user is the target or admin
  if (review.targetUserId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  review.isVisible = req.body.isVisible;
  await review.save();

  res.json({
    message: `Review ${req.body.isVisible ? 'made visible' : 'hidden'} successfully`,
    review
  });
}));

// Get recent reviews
router.get('/recent/recent', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const reviews = await Review.find({ isVisible: true })
    .populate('authorId', 'name avatar')
    .populate('targetUserId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({ reviews });
}));

// Get review statistics for user
router.get('/stats/user/:userId', asyncHandler(async (req, res) => {
  const ratingStats = await Review.getAverageRating(req.params.userId);
  
  const ratingDistribution = await Review.aggregate([
    { $match: { targetUserId: req.params.userId, isVisible: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    averageRating: ratingStats.average,
    totalReviews: ratingStats.count,
    ratingDistribution
  });
}));

export default router;