import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { UserService } from '../services';
import { ICustomRequest } from '../types';

export class UserController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: password123
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *                 default: user
   *     responses:
   *       201:
   *         description: User successfully registered
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   description: Success message
   *                 error:
   *                   type: null
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: User already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async registerUser(req: Request, res: Response) {
    const data = await UserService.registerUser(req.body);
    return res.status(getStatus(data.error)).json(data);
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Authenticate user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Successful authentication
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: token=jwt_token; HttpOnly; Path=/
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   nullable: true
   *                   description: JWT token or null
   *                 error:
   *                   type: null
   *       400:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async loginUser(req: ICustomRequest, res: Response) {
    const { data, error } = await UserService.loginUser(req.body);

    if (data) {
      req.user = data.user;

      res.cookie('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 20 * 1000,
      });
    }

    return res.status(getStatus(error)).json({ data: data?.token || null, error });
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Authentication]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Successfully logged out
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
   */
  static logoutUser(req: ICustomRequest, res: Response) {
    res.clearCookie('token');
    return res.status(200).json();
  }

  /**
   * @swagger
   * /api/auth/check:
   *   get:
   *     summary: Check user authentication
   *     tags: [Authentication]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Current user information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *                 error:
   *                   type: null
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Invalid token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async check(req: ICustomRequest, res: Response) {
    return res.status(200).json({ data: req.user || null, error: null });
  }
}
