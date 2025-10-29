import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExchangeRequestSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    item_id: { type: Schema.Types.ObjectId, required: true },
    item_type: { type: String, enum: ['lost', 'found'], required: true },
    accept: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('ExchangeRequest', ExchangeRequestSchema);
