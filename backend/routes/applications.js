import express from 'express';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply for a job
router.post('/', authenticate, authorize('USER'), [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('coverLetter').optional().trim().isLength({ max: 2000 }).withMessage('Cover letter cannot exceed 2000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { jobId, coverLetter, documents } = req.body;

  // Check if job exists and is active
  const job = await Job.findOne({ _id: jobId, isActive: true });
  if (!job) {
    return res.status(404).json({ 
      error: 'Job not found or no longer available' 
    });
  }

  // Check if job deadline hasn't passed
  if (job.deadline < new Date()) {
    return res.status(400).json({ 
      error: 'Application deadline has passed' 
    });
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({ 
    jobId, 
    userId: req.user._id 
  });
  
  if (existingApplication) {
    return res.status(400).json({ 
      error: 'You have already applied for this job' 
    });
  }

  // Create application
  const application = new Application({
    jobId,
    userId: req.user._id,
    userName: req.user.name,
    coverLetter: coverLetter || '',
    documents: documents || []
  });

  await application.save();

  // Increment job application count
  await job.incrementApplications();

  // Populate job and user info
  await application.populate('jobId', 'title institutionName');
  await application.populate('userId', 'name email');

  res.status(201).json({
    message: 'Application submitted successfully',
    application
  });
}));

// Get user's applications
router.get('/my-applications', authenticate, authorize('USER'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const query = { userId: req.user._id };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate('jobId', 'title institutionName category location deadline')
    .sort({ appliedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Application.countDocuments(query);

  res.json({
    applications,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get applications for a job (Institution owner or Admin)
router.get('/job/:jobId', authenticate, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const job = await Job.findById(req.params.jobId);
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

  const query = { jobId: req.params.jobId };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate('userId', 'name email avatar bio')
    .sort({ appliedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Application.countDocuments(query);

  res.json({
    applications,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Update application status (Institution owner or Admin)
router.patch('/:id/status', authenticate, [
  body('status').isIn(['PENDING', 'INTERVIEWING', 'ACCEPTED', 'REJECTED']).withMessage('Invalid status'),
  body('feedback').optional().trim().isLength({ max: 1000 }).withMessage('Feedback cannot exceed 1000 characters'),
  body('interviewDate').optional().isISO8601().withMessage('Valid interview date is required'),
  body('interviewLocation').optional().trim().isLength({ max: 200 }).withMessage('Interview location cannot exceed 200 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const application = await Application.findById(req.params.id)
    .populate('jobId');
  
  if (!application) {
    return res.status(404).json({ 
      error: 'Application not found' 
    });
  }

  // Check if user owns the job or is admin
  if (application.jobId.institutionId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  const { status, feedback, interviewDate, interviewLocation, notes } = req.body;

  await application.updateStatus(status, notes);
  
  // Update additional fields
  if (feedback !== undefined) application.feedback = feedback;
  if (interviewDate !== undefined) application.interviewDate = interviewDate;
  if (interviewLocation !== undefined) application.interviewLocation = interviewLocation;
  
  await application.save();

  // Populate user info for response
  await application.populate('userId', 'name email');

  res.json({
    message: 'Application status updated successfully',
    application
  });
}));

// Add rating to application (User who applied)
router.patch('/:id/rating', authenticate, authorize('USER'), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const application = await Application.findById(req.params.id);
  
  if (!application) {
    return res.status(404).json({ 
      error: 'Application not found' 
    });
  }

  // Check if user owns the application
  if (application.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  // Check if application is accepted
  if (application.status !== 'ACCEPTED') {
    return res.status(400).json({ 
      error: 'You can only rate accepted applications' 
    });
  }

  application.rating = req.body.rating;
  await application.save();

  res.json({
    message: 'Rating added successfully',
    application
  });
}));

// Get application by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('jobId', 'title institutionName category')
    .populate('userId', 'name email avatar bio');
  
  if (!application) {
    return res.status(404).json({ 
      error: 'Application not found' 
    });
  }

  // Check if user has access to this application
  const isOwner = application.userId._id.toString() === req.user._id.toString();
  const isJobOwner = application.jobId.institutionId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';
  
  if (!isOwner && !isJobOwner && !isAdmin) {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  res.json({ application });
}));

// Delete application (User who applied or Admin)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  
  if (!application) {
    return res.status(404).json({ 
      error: 'Application not found' 
    });
  }

  // Check if user owns the application or is admin
  if (application.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied' 
    });
  }

  await Application.findByIdAndDelete(req.params.id);

  res.json({ 
    message: 'Application deleted successfully' 
  });
}));

// Get application statistics for user
router.get('/stats/user', authenticate, authorize('USER'), asyncHandler(async (req, res) => {
  const applications = await Application.find({ userId: req.user._id });
  
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    interviewing: applications.filter(app => app.status === 'INTERVIEWING').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length
  };

  res.json({ stats });
}));

// Get application statistics for institution
router.get('/stats/institution', authenticate, authorize('INSTITUTION'), asyncHandler(async (req, res) => {
  const jobs = await Job.find({ institutionId: req.user._id });
  const jobIds = jobs.map(job => job._id);
  
  const applications = await Application.find({ jobId: { $in: jobIds } });
  
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    interviewing: applications.filter(app => app.status === 'INTERVIEWING').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    totalJobs: jobs.length
  };

  res.json({ stats });
}));

export default router;