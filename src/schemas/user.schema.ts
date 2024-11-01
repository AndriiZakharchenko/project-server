import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';
import { IUserModel } from '../types';

const UserSchema: Schema = new Schema({
  id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<IUserModel>('User', UserSchema);
