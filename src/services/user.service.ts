import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userInfo } from 'node:os';
import { IUser } from '../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import UserDTO from '../dtos/user.dto';
import { TokenRepository, UserRepository } from '../repositories';
import { logger } from '../helpers';
import { MailService } from './mail.service';
import { TokenService } from './token.service';

export class UserService {
  static async registerUser({ email, password }: { email: string; password: string }) {
    try {
      // Check if all required fields are present
      if (!(email && password)) {
        return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_DATA } };
      }

      // Check if a candidate already exists
      const candidate = await UserRepository.getUserByEmail(email);
      if (candidate) {
        return { data: null, error: { message: ERROR_MESSAGES[409].USER_FOUND } };
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      const activationLinkId = uuidv4();
      const activationLink = `${process.env.LOCAL_URL}/api/activate/${activationLinkId}`;
      const user = await UserRepository.registerUser({
        role: 'viewer',
        email,
        password: encryptedPassword,
        activation_link: activationLinkId,
        is_activated: false,
      });

      const userPayload = new UserDTO(user);
      const tokens = TokenService.generateTokens({ ...userPayload });
      await TokenRepository.saveUserToken(user.id, tokens.refreshToken);
      await MailService.sendActivationMail(email, activationLink);

      return { data: { user, tokens }, error: null };
    } catch (error) {
      console.log('Registration error:', error);
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
      console.log('Login error', error);
      logger.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async activateLink(link: string) {
    try {
      const user = await UserRepository.getUserByActivationLink(link);

      if (!user) {
        return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_ACTIVATION_LINK } };
      }

      user.is_activated = true;
      await UserRepository.updateUser(user);

      return { data: { message: SUCCESS_MESSAGES[200].ACCOUNT_ACTIVATED }, error: null };
    } catch (error) {
      logger.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
