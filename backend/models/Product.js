import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Institution ID is required']
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    enum: ['Education', 'Business', 'Health', 'Technology', 'Agriculture', 'Government', 'NGOs'],
    required: [true, 'Category is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative']
  },
  condition: {
    type: String,
    enum: ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'],
    default: 'GOOD'
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required']
  },
  contactPhone: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ institutionId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ location: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(this.price);
});

// Method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to update rating
productSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

export default mongoose.model('Product', productSchema);