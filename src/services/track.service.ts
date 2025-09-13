import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ERROR_MESSAGES } from '../constants';
import { TrackRepository } from '../repositories';
import { logger } from '../helpers';
import { ITrackRaw } from '../types';

export class TrackService {
  static async addTrack({
    artist, title, album, year, track_url,
  }: ITrackRaw) {
    try {
      const fileName = `${uuidv4()}.mp3`;
      await track_url.mv(path.resolve(__dirname, '..', 'static', 'tracks', fileName));

      const track = await TrackRepository.addTrack({
        artist, title, album, year, track_url: fileName,
      });

      return { data: track, error: null };
    } catch (error) {
      logger.error(error);
      return { data: [], error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async getTracks() {
    try {
      const tracks = await TrackRepository.getTracks();

      if (!tracks || JSON.stringify(tracks) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[404].TRACK_NOT_FOUND } };
      }

      return { data: tracks, error: null };
    } catch (error) {
      logger.error(error);
      return { data: [], error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
