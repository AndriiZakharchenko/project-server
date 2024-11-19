import mongoose, { Schema } from 'mongoose';
import { ICartModel } from '../types';

const CartSchema: Schema = new Schema({
  cart: {
    id: { type: String, required: true },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      count: { type: Number, required: true },
    }],
  },
  total: { type: Number, default: 0 },
});

export default mongoose.model<ICartModel>('Cart', CartSchema);
