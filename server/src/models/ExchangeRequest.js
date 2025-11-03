import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExchangeRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('ExchangeRequest', ExchangeRequestSchema);
