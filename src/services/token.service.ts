import jwt from 'jsonwebtoken';
import { UserDTOType } from '../types';

export class TokenService {
  static generateTokens(payload: UserDTOType) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN!, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN!, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }
}
