import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Item", 
    required: true 
  },
  itemType: {
    type: String,
    enum: ['LostItem', 'FoundItem'],
    required: true
  },
  data: Buffer,
  contentType: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

imageSchema.index({ itemId: 1 });
imageSchema.index({ itemType: 1 });

imageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Image = mongoose.model('Image', imageSchema);
export default Image;