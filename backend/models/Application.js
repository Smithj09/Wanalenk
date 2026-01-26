import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required']
  },
  status: {
    type: String,
    enum: ['PENDING', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    default: ''
  },
  documents: [{
    filename: String,
    originalName: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  interviewDate: {
    type: Date,
    default: null
  },
  interviewLocation: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ userId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

// Pre-save middleware to update lastUpdated
applicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for application age
applicationSchema.virtual('daysSinceApplied').get(function() {
  const diffTime = Math.abs(new Date() - this.appliedAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update status with timestamp
applicationSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.notes = notes;
  this.lastUpdated = new Date();
  return this.save();
};

export default mongoose.model('Application', applicationSchema);