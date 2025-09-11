import { EntityManager } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ITrack } from '../types';
import { tracks as seedTracks } from '../data/tracks';

// Simple in-memory repository backed by seed data for now.
// Can be replaced with MikroORM entity when track entity is introduced.
export class TrackRepository {
  private static tracks: ITrack[] = [...seedTracks];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getTracks(_em?: EntityManager): Promise<ITrack[]> {
    return this.tracks;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async addTrack(track: Omit<ITrack, 'id'>, _em?: EntityManager): Promise<ITrack> {
    const newTrack: ITrack = { id: uuidv4(), ...track };
    this.tracks.push(newTrack);
    return newTrack;
  }
}

