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

CartSchema.pre<ICartModel>('save', async function calculateTotal(next) {
  await this.populate('cart.items.product');

  if (!this.cart.items || JSON.stringify(this.cart.items) === '[]') {
    this.total = 0;
    return next();
  }

  this.total = this.cart.items.reduce((acc, item) => acc + (item.product.price * item.count), 0);
  return next();
});

export default mongoose.model<ICartModel>('Cart', CartSchema);
