import { RequestContext } from '@mikro-orm/core';
import { Carts, Users } from '../entities';
import { IUser } from '../types';

export class UserRepository {
  static getUserById(id: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Users, { id });
  }

  static getUserByEmail(email: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Users, { email });
  }

  static async registerUser({ role, email, password }: IUser) {
    const em = RequestContext.getEntityManager();
    const user = em!.create(Users, {
      role,
      email,
      password,
    });

    return em!.persistAndFlush(user);
  }

  static loginUser({ email, password }: IUser) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Users, { email, password });
  }
}
