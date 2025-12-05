import Router from 'express';
import { getAllOffers, getOfferById, createOffer, updateOffer, deleteOffer } from '../controler/offer.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Offer
 *   description: Endpoints for managing rental offers
 */

/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get all offers (manager only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offer'
 *       404:
 *         description: No offers found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get('/', manager, getAllOffers);
/**
 * @swagger
 * /offers/{id}:
 *   get:
 *     summary: Get an offer by ID (manager only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Offer ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       404:
 *         description: Offer not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

router.get('/:id', manager, getOfferById);
/**
 * @swagger
 * /offers:
 *   post:
 *     summary: Create a new offer (manager only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOfferSchema'
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offer created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Offer'
 *       422:
 *         description: Validation error
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.post('/', manager, createOffer);
/**
 * @swagger
 * /offers/{id}:
 *   patch:
 *     summary: Update an offer (manager only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Offer ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOfferSchema'
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Offer'
 *       404:
 *         description: Offer not found
 *       400:
 *         description: Invalid ID or validation error
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.patch('/:id', manager, updateOffer);
/**
 * @swagger
 * /offers/{id}:
 *   delete:
 *     summary: Delete an offer (manager only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Offer ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *       404:
 *         description: Offer not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.delete('/:id', manager, deleteOffer);

export default router;