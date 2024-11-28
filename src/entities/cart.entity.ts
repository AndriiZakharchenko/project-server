import {
  Entity, OneToOne, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Users } from './user.entity';
// import { Products } from './product.entity';
// import { CartItem } from './cartItem.entity';

@Entity()
export class Carts {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    total!: number;

  @OneToOne(() => Users)
    user!: Users;
}
// cart = new Collection<CartItem>(this);
// @OneToMany(() => CartItem, (cartItem) => cartItem.cart)

// const CartSchema: Schema = new Schema({
//   cart: {
//     id: { type: String, required: true },
//     items: [{
//       product: { type: Schema.Types.ObjectId, ref: 'Product' },
//       count: { type: Number, required: true },
//     }],
//   },
//   total: { type: Number, default: 0 },
// });

// export default mongoose.model<ICartModel>('Cart', CartSchema);
