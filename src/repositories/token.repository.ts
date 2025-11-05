import { RequestContext } from '@mikro-orm/core';
import { Tokens } from '../entities';

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
}
