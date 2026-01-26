import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    category, 
    location, 
    search, 
    minPrice,
    maxPrice,
    condition,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const query = { isAvailable: true };
  
  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (condition) query.condition = condition;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const products = await Product.find(query)
    .populate('institutionId', 'name avatar rating')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get product by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('institutionId', 'name avatar bio rating');
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Product not found' 
    });
  }

  // Increment views if user is authenticated
  if (req.user) {
    await product.incrementViews();
  }

  res.json({ product });
}));

// Create new product (Institution only)
router.post('/', authenticate, authorize('INSTITUTION'), [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name must be between 2 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['Education', 'Business', 'Health', 'Technology', 'Agriculture', 'Government', 'NGOs']).withMessage('Invalid category'),
  body('imageUrl').isURL().withMessage('Valid image URL is required'),
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

  const productData = {
    ...req.body,
    institutionId: req.user._id
  };

  const product = new Product(productData);
  await product.save();

  // Populate institution info
  await product.populate('institutionId', 'name avatar');

  res.status(201).json({
    message: 'Product created successfully',
    product
  });
}));

// Update product (Institution owner or Admin)
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Product not found' 
    });
  }

  // Check if user owns the product or is admin
  if (product.institutionId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. You can only update your own products.' 
    });
  }

  const allowedUpdates = [
    'name', 'description', 'price', 'category', 'imageUrl', 'images',
    'stock', 'condition', 'tags', 'location', 'contactEmail', 
    'contactPhone', 'isAvailable'
  ];
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();
  await product.populate('institutionId', 'name avatar');

  res.json({
    message: 'Product updated successfully',
    product
  });
}));

// Delete product (Institution owner or Admin)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Product not found' 
    });
  }

  // Check if user owns the product or is admin
  if (product.institutionId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. You can only delete your own products.' 
    });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({ 
    message: 'Product deleted successfully' 
  });
}));

// Get products by institution
router.get('/institution/:institutionId', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  
  const products = await Product.find({ institutionId: req.params.institutionId })
    .populate('institutionId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments({ institutionId: req.params.institutionId });

  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get user's products (for institutions)
router.get('/user/my-products', authenticate, authorize('INSTITUTION'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, status } = req.query;
  
  const query = { institutionId: req.user._id };
  if (status === 'available') query.isAvailable = true;
  if (status === 'sold') query.isAvailable = false;

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Update product rating
router.patch('/:id/rating', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Product not found' 
    });
  }

  await product.updateRating(req.body.rating);

  res.json({
    message: 'Rating updated successfully',
    rating: product.rating
  });
}));

// Get featured products (highest rated)
router.get('/featured/featured', optionalAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  
  const products = await Product.find({ isAvailable: true })
    .populate('institutionId', 'name avatar rating')
    .sort({ 'rating.average': -1, views: -1 })
    .limit(limit);

  res.json({ products });
}));

// Get similar products
router.get('/:id/similar', optionalAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ 
      error: 'Product not found' 
    });
  }

  const similarProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isAvailable: true
  })
    .populate('institutionId', 'name avatar')
    .sort({ 'rating.average': -1 })
    .limit(limit);

  res.json({ products: similarProducts });
}));

export default router;