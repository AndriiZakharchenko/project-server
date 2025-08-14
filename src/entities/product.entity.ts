import {
  Entity, OneToMany, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { CartItems } from './cartItem.entity';

@Entity()
export class Products {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    title!: string;

  @Property()
    description!: string;

  @Property()
    price!: number;

  @Property()
    image_url!: string;

  @OneToMany(() => CartItems, (cartItem) => cartItem.product)
    product!: CartItems;
}
