import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';
import { IOrderModel } from '../types';

const OrderSchema: Schema = new Schema({
  id: { type: String, default: randomUUID() },
  userId: { type: String, required: true },
  cartId: { type: String, default: randomUUID() },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      count: { type: Number, required: true },
    },
  ],
  payment: {
    type: { type: String, required: true },
    address: { type: String, required: true },
    creditCard: { type: String, required: true },
  },
  delivery: {
    type: { type: String, required: true },
    address: { type: String, required: true },
  },
  comments: { type: String, required: false },
  status: { type: String, required: true },
  total: { type: Number, required: true },
});

export default mongoose.model<IOrderModel>('Order', OrderSchema);
