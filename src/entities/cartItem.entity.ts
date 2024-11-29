import {
  Entity,
  Property,
  ManyToOne, PrimaryKey,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Carts } from './cart.entity';
import { Products } from './product.entity';

@Entity()
export class CartItems {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    count!: number;

  @ManyToOne(() => Carts)
    cart!: Carts;

  @ManyToOne(() => Products)
    product!: Products;
}
