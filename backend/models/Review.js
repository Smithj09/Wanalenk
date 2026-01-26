import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Target user ID is required']
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author ID is required']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    trim: true
  },
  context: {
    type: String,
    enum: ['JOB_APPLICATION', 'PRODUCT_PURCHASE', 'GENERAL'],
    default: 'GENERAL'
  },
  contextId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  response: {
    text: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters'],
      default: ''
    },
    respondedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reviewSchema.index({ targetUserId: 1 });
reviewSchema.index({ authorId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ context: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ targetUserId: 1, authorId: 1 }, { unique: true });

// Pre-save middleware to validate author cannot review themselves
reviewSchema.pre('save', function(next) {
  if (this.targetUserId.toString() === this.authorId.toString()) {
    return next(new Error('Users cannot review themselves'));
  }
  next();
});

// Method to add response
reviewSchema.methods.addResponse = function(responseText) {
  this.response.text = responseText;
  this.response.respondedAt = new Date();
  return this.save();
};

// Static method to get average rating for a user
reviewSchema.statics.getAverageRating = async function(targetUserId) {
  const result = await this.aggregate([
    { $match: { targetUserId: targetUserId, isVisible: true } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  return result.length > 0 
    ? { average: Math.round(result[0].average * 10) / 10, count: result[0].count }
    : { average: 0, count: 0 };
};

export default mongoose.model('Review', reviewSchema);