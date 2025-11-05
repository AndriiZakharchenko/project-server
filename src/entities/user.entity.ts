import {
  Collection, Entity, PrimaryKey, Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Tokens } from './index';

@Entity()
export class Users {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    role!: string;

  @Property()
    email!: string;

  @Property()
    password!: string;

  @Property()
    is_activated!: boolean;

  @Property()
    activation_link!: string;
}
