import { RequestContext } from '@mikro-orm/core';
import { Users } from '../entities';
import { IUser } from '../types';

export class UserRepository {
  static async registerUser({
    role, email, password, is_activated, activation_link,
  }: IUser) {
    const em = RequestContext.getEntityManager();
    const user = em!.create(Users, {
      role,
      email,
      password,
      is_activated,
      activation_link,
    });

    await em!.persistAndFlush(user);
    return user;
  }

  static loginUser({ email, password }: IUser) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Users, { email, password });
  }

  static getUserByEmail(email: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Users, { email });
  }

  static getUserByActivationLink(link: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Users, { activation_link: link });
  }

  static updateUser(user: IUser) {
    const em = RequestContext.getEntityManager();
    return em!.persistAndFlush(user);
  }
}
