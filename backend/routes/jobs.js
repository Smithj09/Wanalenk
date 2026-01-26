import express from 'express';
import { body, validationResult } from 'express-validator';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all jobs with filtering and pagination
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    location, 
    search, 
    employmentType,
    experienceLevel,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const query = { isActive: true };
  
  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (employmentType) query.employmentType = employmentType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { institutionName: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter out expired jobs
  query.deadline = { $gt: new Date() };

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const jobs = await Job.find(query)
    .populate('institutionId', 'name avatar')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Job.countDocuments(query);

  res.json({
    jobs,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get job by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('institutionId', 'name avatar bio rating');
  
  if (!job) {
    return res.status(404).json({ 
      error: 'Job not found' 
    });
  }

  // Increment views if user is authenticated
  if (req.user) {
    await job.incrementViews();
  }

  res.json({ job });
}));

// Create new job (Institution only)
router.post('/', authenticate, authorize('INSTITUTION'), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').isIn(['Education', 'Business', 'Health', 'Technology', 'Agriculture', 'Government', 'NGOs']).withMessage('Invalid category'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const jobData = {
    ...req.body,
    institutionId: req.user._id,
    institutionName: req.user.institutionName || req.user.name
  };

  const job = new Job(jobData);
  await job.save();

  // Populate institution info
  await job.populate('institutionId', 'name avatar');

  res.status(201).json({
    message: 'Job created successfully',
    job
  });
}));

// Update job (Institution owner or Admin)
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    return res.status(404).json({ 
      error: 'Job not found' 
    });
  }

  // Check if user owns the job or is admin
  if (job.institutionId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. You can only update your own jobs.' 
    });
  }

  const allowedUpdates = [
    'title', 'description', 'category', 'requiredDocuments', 'deadline',
    'salary', 'location', 'employmentType', 'experienceLevel', 'skills',
    'contactEmail', 'contactPhone', 'isActive'
  ];
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      job[field] = req.body[field];
    }
  });

  await job.save();
  await job.populate('institutionId', 'name avatar');

  res.json({
    message: 'Job updated successfully',
    job
  });
}));

// Delete job (Institution owner or Admin)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    return res.status(404).json({ 
      error: 'Job not found' 
    });
  }

  // Check if user owns the job or is admin
  if (job.institutionId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. You can only delete your own jobs.' 
    });
  }

  // Delete related applications
  await Application.deleteMany({ jobId: job._id });
  
  await Job.findByIdAndDelete(req.params.id);

  res.json({ 
    message: 'Job deleted successfully' 
  });
}));

// Get jobs by institution
router.get('/institution/:institutionId', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const jobs = await Job.find({ institutionId: req.params.institutionId })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Job.countDocuments({ institutionId: req.params.institutionId });

  res.json({
    jobs,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get user's jobs (for institutions)
router.get('/user/my-jobs', authenticate, authorize('INSTITUTION'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const query = { institutionId: req.user._id };
  if (status === 'active') query.isActive = true;
  if (status === 'expired') query.deadline = { $lt: new Date() };
  if (status === 'inactive') query.isActive = false;

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Job.countDocuments(query);

  res.json({
    jobs,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get job statistics
router.get('/:id/stats', authenticate, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    return res.status(404).json({ 
      error: 'Job not found' 
    });
  }

  // Check if user owns the job or is admin
  if (job.institutionId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  const applications = await Application.find({ jobId: job._id });
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    interviewing: applications.filter(app => app.status === 'INTERVIEWING').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    views: job.views
  };

  res.json({ stats });
}));

export default router;