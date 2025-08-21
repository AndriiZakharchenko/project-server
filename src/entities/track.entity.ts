import {
  Entity, PrimaryKey, Property, BeforeCreate, BeforeUpdate,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Tracks {
  @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

  @Property()
    artist!: string;

  @Property()
    title!: string;

  @Property()
    album!: string;

  @Property()
    year!: number;

  @Property()
    track_url!: string;
}
