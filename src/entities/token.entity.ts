import {
  Entity, OneToOne, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Tokens {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    user_id!: string;

  @Property()
    refresh_token!: string;
}
