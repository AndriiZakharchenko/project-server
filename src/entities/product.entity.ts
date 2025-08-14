import {
  Entity, OneToMany, PrimaryKey, Property,
} from '@mikro-orm/core';
import uuid from 'uuid';
import { CartItems } from './cartItem.entity';

@Entity()
export class Products {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuid.v4();

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
