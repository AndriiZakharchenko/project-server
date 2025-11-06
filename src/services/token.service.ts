import jwt from 'jsonwebtoken';
import { UserDTOType } from '../types';
import { ERROR_MESSAGES } from '../constants';
import { TokenRepository, UserRepository } from '../repositories';
import UserDTO from '../dtos/user.dto';

export class TokenService {
  static generateTokens(payload: UserDTOType) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN!, { expiresIn: '1min' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN!, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        return { data: null, error: { message: ERROR_MESSAGES['401'].TOKEN_NOT_FOUND } };
      }

      const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN!) as UserDTOType;
      const tokenFromDb = await TokenRepository.findToken(refreshToken);

      if (!userData || !userData?.id || !tokenFromDb) {
        return { data: null, error: { message: ERROR_MESSAGES['403'].INVALID_TOKEN } };
      }

      const user = await UserRepository.getUserById(userData.id);
      if (!user) {
        return { data: null, error: { message: ERROR_MESSAGES['404'].USER_NOT_FOUND } };
      }

      const userPayload = new UserDTO(user);
      const tokens = this.generateTokens({ ...userPayload });
      await TokenRepository.saveUserToken(userPayload.id!, tokens.refreshToken);

      return { data: { user, tokens }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Invalid refresh token' } };
    }
  }
}
