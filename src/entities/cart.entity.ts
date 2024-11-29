import {
  Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Users } from './user.entity';
import { CartItems } from './cartItem.entity';

@Entity()
export class Carts {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @OneToMany(() => CartItems, (cartItem) => cartItem.cart)
    items = new Collection<CartItems>(this);

  @Property()
    total!: number;

  @OneToOne(() => Users, { nullable: false })
    user!: Users;
}
// {
//   cart: {
//     id: { type: String, required: true },
//     items: [{
//       product: { type: Schema.Types.ObjectId, ref: 'Product' },
//       count: { type: Number, required: true },
//     }],
//   },
//   total: { type: Number, default: 0 },
// }
