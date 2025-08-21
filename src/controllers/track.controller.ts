import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { TrackService } from '../services';
import { getStatus } from '../helpers';

export class TrackController {
  static async addTrack(req: Request, res: Response) {
    const {
      artist, title, album, year,
    } = req.body;
    const file = (req.files?.track_url as UploadedFile);

    const data = await TrackService.addTrack({
      artist,
      title,
      album,
      year,
      track_url: file,
    });

    return res.status(getStatus(data.error)).json(data);
  }

  static async getTracks(req: Request, res: Response) {
    const data = await TrackService.getTracks();
    return res.status(getStatus(data.error)).json(data);
  }
}
