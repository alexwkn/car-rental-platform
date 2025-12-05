import Router from 'express';
import { getAllFavorites, getFavoriteById, createFavorite, deleteFavorite,updateFavorite } from '../controler/favorite.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Favorite
 *   description: Endpoints for managing favorites (manager only)
 */

/**
 * @swagger
 * /favorite:
 *   get:
 *     summary: Get all favorites (manager only)
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       404:
 *         description: No favorites found
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get('/', manager, getAllFavorites);
/**
 * @swagger
 * /favorite/{id}:
 *   get:
 *     summary: Get a favorite by ID (manager only)
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Favorite ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       404:
 *         description: Favorite not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get('/:id', manager, getFavoriteById);
/**
 * @swagger
 * /favorite:
 *   post:
 *     summary: Create a new favorite (manager only)
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFavoriteSchema'
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Favorite'
 *       422:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.post('/', manager, createFavorite);
/**
 * @swagger
 * /favorite/{id}:
 *   patch:
 *     summary: Update a favorite (manager only)
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Favorite ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFavoriteSchema'
 *     responses:
 *       200:
 *         description: Favorite updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Favorite'
 *       404:
 *         description: Favorite not found
 *       422:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.patch('/:id', manager, updateFavorite);
/**
 * @swagger
 * /favorite/{id}:
 *   delete:
 *     summary: Delete a favorite (manager only)
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Favorite ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite deleted successfully
 *       404:
 *         description: Favorite not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.delete('/:id', manager, deleteFavorite);

export default router;