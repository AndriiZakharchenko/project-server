import {
  Entity, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

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
}
