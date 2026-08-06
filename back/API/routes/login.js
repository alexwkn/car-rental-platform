import Router from 'express';
import {login} from '../controler/login.js';
const router = Router();


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     description: |
 *       This endpoint allows a **client** or **manager** to log in.
 *       - Both client and manager passwords are hashed (argon2) and compared
 *
 *       Returns a **JWT token** valid for 1 hour.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: Successful authentication — JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

router.post('/', login);



export default router;