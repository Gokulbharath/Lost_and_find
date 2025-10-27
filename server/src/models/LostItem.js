import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema({
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
  lost_date: {
    type: Date,
    required: [true, 'Lost date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Lost date cannot be in the future'
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
      values: ['lost', 'found', 'closed'],
      message: 'Status must be one of: lost, found, closed'
    },
    default: 'lost'
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

lostItemSchema.index({ user_id: 1 });
lostItemSchema.index({ status: 1 });
lostItemSchema.index({ category: 1 });
lostItemSchema.index({ created_at: -1 });
lostItemSchema.index({ title: 'text', description: 'text', location: 'text' });

lostItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

lostItemSchema.methods.isOwner = function(userId) {
  return this.user_id.toString() === userId.toString();
};

const LostItem = mongoose.model('LostItem', lostItemSchema);
export default LostItem;