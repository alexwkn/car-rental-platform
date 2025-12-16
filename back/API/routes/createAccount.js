import Router from 'express';
import { createAccount } from '../controler/createAccount.js';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication and account creation
 */


/**
 * @swagger
 * /createAccount:
 *   post:
 *     summary: Create a new user profile (client or renter)
 *     description: |
 *       This endpoint registers a new user.  
 *       - Password is hashed  
 *       - A JWT token is automatically issued  
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountSchema'
 *     responses:
 *       201:
 *         description: Account created successfully — returns the created profile with a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAccountResponse'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

const router = Router();
router.post('/', createAccount);

export default router;