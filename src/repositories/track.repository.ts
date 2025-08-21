import { RequestContext } from '@mikro-orm/core';
import { Tracks } from '../entities';
import { ITrack } from '../types';

export class TrackRepository {
  static async addTrack({
    artist, title, album, year, track_url,
  }: ITrack) {
    const em = RequestContext.getEntityManager();

    const track = em!.create(Tracks, {
      artist,
      title,
      album,
      year,
      track_url,
    });

    await em!.persistAndFlush(track);
    return track;
  }

  static async getTracks() {
    const em = RequestContext.getEntityManager();
    return em!.find(Tracks, {});
  }
}
