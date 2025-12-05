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
 *       - Client passwords are hashed and compared  
 *       - Manager passwords are stored as plain text (per your initialization script)  
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
 *       404:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

router.post('/', login);



export default router;