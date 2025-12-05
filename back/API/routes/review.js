import Router from 'express';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../controler/review.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Endpoints for managing reviews (manager only)
 */
/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews (manager only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

router.get('/', manager, getAllReviews);
/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID (manager only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get('/:id', manager, getReviewById);
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review (manager only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewSchema'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       422:
 *         description: Validation error (VineJS)
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.post('/', manager, createReview); 
/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update a review (manager only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewSchema'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       422:
 *         description: Validation error (VineJS)
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

router.patch('/:id', manager, updateReview);
/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review (manager only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.delete('/:id', manager, deleteReview);

export default router;