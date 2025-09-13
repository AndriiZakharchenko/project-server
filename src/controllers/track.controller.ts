import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { getStatus } from '../helpers';
import { TrackService } from '../services';

export class TrackController {
  /**
   * @swagger
   * /api/tracks:
   *   post:
   *     summary: Add a new track
   *     tags: [Tracks]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - artist
   *             properties:
   *               title:
   *                 type: string
   *                 description: Track title
   *                 example: "Track Name"
   *               artist:
   *                 type: string
   *                 description: Artist name
   *                 example: "Artist Name"
   *               album:
   *                 type: string
   *                 description: Album name
   *                 example: "Album Name"
   *               year:
   *                 type: integer
   *                 description: Release year
   *                 example: 2024
   *               track_url:
   *                 type: string
   *                 format: binary
   *                 description: Track audio file
   *     responses:
   *       201:
   *         description: Track successfully added
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Track'
   *                 error:
   *                   type: null
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async addTrack(req: Request, res: Response) {
    const {
      artist, title, album, year,
    } = req.body;
    const file = (req.files?.track_url as UploadedFile);

    const data = await TrackService.addTrack({
      artist,
      title,
      album,
      year: Number(year),
      track_url: file,
    });

    return res.status(getStatus(data.error)).json(data);
  }

  /**
   * @swagger
   * /api/tracks:
   *   get:
   *     summary: Get all tracks list
   *     tags: [Tracks]
   *     responses:
   *       200:
   *         description: Tracks list
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Track'
   *                 error:
   *                   type: null
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getTracks(req: Request, res: Response) {
    const data = await TrackService.getTracks();
    return res.status(getStatus(data.error)).json(data);
  }
}
