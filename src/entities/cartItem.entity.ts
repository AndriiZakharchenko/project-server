import {
  Entity,
  Property,
  ManyToOne, PrimaryKey,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Carts } from './cart.entity';
import { Products } from './product.entity';
// @ManyToOne(() => Carts, { primary: true })
//   cart!: Carts;
// @ManyToOne(() => Products, { primary: true })
//   product!: Products;

@Entity()
export class CartItem {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    count!: number;
}
