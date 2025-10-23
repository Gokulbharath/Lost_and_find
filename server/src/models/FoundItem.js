const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Electronics', 'Books', 'ID Cards', 'Clothing', 'Others'],
      message: 'Category must be one of: Electronics, Books, ID Cards, Clothing, Others'
    }
  },
  found_date: {
    type: Date,
    required: [true, 'Found date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Found date cannot be in the future'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  contact_info: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true,
    maxlength: [500, 'Contact information cannot exceed 500 characters']
  },
  image_url: {
    type: String,
    default: null,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'returned', 'closed'],
      message: 'Status must be one of: available, returned, closed'
    },
    default: 'available'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

foundItemSchema.index({ user_id: 1 });
foundItemSchema.index({ status: 1 });
foundItemSchema.index({ category: 1 });
foundItemSchema.index({ created_at: -1 });
foundItemSchema.index({ title: 'text', description: 'text', location: 'text' });

foundItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

foundItemSchema.methods.isOwner = function(userId) {
  return this.user_id.toString() === userId.toString();
};

module.exports = mongoose.model('FoundItem', foundItemSchema);

