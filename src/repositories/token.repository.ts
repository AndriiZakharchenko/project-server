import { RequestContext } from '@mikro-orm/core';
import { Tokens } from '../entities';
import { ERROR_MESSAGES } from '../constants';

export class TokenRepository {
  static async saveUserToken(user_id: string, refresh_token: string) {
    const em = RequestContext.getEntityManager();
    const tokenData = await em!.findOne(Tokens, { user_id });

    if (tokenData) {
      tokenData.refresh_token = refresh_token;
      await em!.persistAndFlush(tokenData);

      return tokenData;
    }

    const token = em!.create(Tokens, { user_id, refresh_token });
    await em!.persistAndFlush(token);

    return token;
  }

  static findToken(refresh_token: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Tokens, { refresh_token });
  }

  static async removeToken(refresh_token: string) {
    const em = RequestContext.getEntityManager();
    const tokenData = await em!.findOne(Tokens, { refresh_token });

    if (tokenData) {
      await em!.removeAndFlush(tokenData);
      return tokenData;
    }

    return null;
  }
}
