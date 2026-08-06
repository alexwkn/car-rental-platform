import Router from 'express';
import { createAccount, createAccountWithVehicule } from '../controler/createAccount.js';

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

/**
 * @swagger
 * /createAccount/with-vehicule:
 *   post:
 *     summary: Create a new user profile together with a first vehicule
 *     description: |
 *       Même chose que /createAccount, mais crée aussi un premier véhicule pour ce
 *       compte dans la même écriture (nested write Prisma) — pratique pour un
 *       renter qui s'inscrit avec un véhicule déjà en main.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountWithVehiculeSchema'
 *     responses:
 *       201:
 *         description: Account and vehicule created successfully
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/with-vehicule', createAccountWithVehicule);

export default router;