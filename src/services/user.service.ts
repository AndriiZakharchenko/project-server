import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../types';
import { ERROR_MESSAGES } from '../constants';
import { UserRepository } from '../repositories';
import { logger } from '../helpers';

export class UserService {
  static async registerUser({
    role, email, password,
  }: IUser) {
    try {
      // Check if all required fields are present
      if (!(role && email && password)) {
        return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_DATA } };
      }

      // Check if user already exists
      const user = await UserRepository.getUserByEmail(email);
      if (user) {
        return { data: null, error: { message: ERROR_MESSAGES[409].USER_FOUND } };
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      await UserRepository.registerUser({
        role, email, password: encryptedPassword,
      });

      return { data: null, error: { message: ERROR_MESSAGES[201].USER_CREATED } };
    } catch (error) {
      logger.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async loginUser({ email, password }: IUser) {
    try {
      // Check if all required fields are present
      if (!(email && password)) {
        return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_DATA } };
      }

      const user = await UserRepository.getUserByEmail(email);
      // Check if user exists
      if (!user || JSON.stringify(user) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[404].USER_NOT_FOUND } };
      }

      // Check if password is correct
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user.id, email, role: user.role },
          process.env.PRIVATE_KEY!,
          {
            expiresIn: '15m',
          },
        );

        return { data: { user, token }, error: null };
      }

      // Return error if credentials are invalid
      return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_CREDENTIALS } };
    } catch (error) {
      logger.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
