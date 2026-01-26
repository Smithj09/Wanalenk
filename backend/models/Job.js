import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Institution ID is required']
  },
  institutionName: {
    type: String,
    required: [true, 'Institution name is required']
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['Education', 'Business', 'Health', 'Technology', 'Agriculture', 'Government', 'NGOs'],
    required: [true, 'Category is required']
  },
  requiredDocuments: [{
    type: String,
    trim: true
  }],
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  salary: {
    type: String,
    default: 'Negotiable'
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  employmentType: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER'],
    default: 'FULL_TIME'
  },
  experienceLevel: {
    type: String,
    enum: ['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'],
    default: 'ENTRY'
  },
  skills: [{
    type: String,
    trim: true
  }],
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required']
  },
  contactPhone: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ institutionId: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for checking if job is expired
jobSchema.virtual('isExpired').get(function() {
  return this.deadline < new Date();
});

// Method to increment views
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment application count
jobSchema.methods.incrementApplications = function() {
  this.applicationCount += 1;
  return this.save();
};

export default mongoose.model('Job', jobSchema);