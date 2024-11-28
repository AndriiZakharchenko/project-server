import {
  Entity, OneToOne, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Carts } from './cart.entity';

@Entity()
export class Users {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    name!: string;

  @Property()
    email!: string;

  @Property()
    password!: string;

  @OneToOne(() => Carts)
    cart!: Carts;
}
