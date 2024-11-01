import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';
import { IProductModel } from '../types';

const ProductSchema: Schema = new Schema({
  id: { type: String, default: () => randomUUID() },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<IProductModel>('Product', ProductSchema);
