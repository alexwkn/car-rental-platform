import Router from 'express';
import { getAllOffers, getOfferById, createOffer, updateOffer, deleteOffer } from '../controler/offer.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

/**
 * @swagger
 * /offer:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Offer
 *      responses:
 *          200:
 *              description: List of all offers
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          500:
 *              description: Server error
 */
router.get('/', manager, getAllOffers);
/**
 * @swagger
 * /offer/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Offer
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the offer to retrieve
 *      responses:
 *          200:
 *              description: Offer data
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Offer not found
 *          500:
 *              description: Server error
 */
router.get('/:id', manager, getOfferById);
/**
 * @swagger
 * /offer:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Offer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateOfferSchema'
 *      responses:
 *          201:
 *              description: Offer created
 *          400:
 *              description: Validation error
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          500:
 *              description: Server error
 */
router.post('/', manager, createOffer);
/**
 * @swagger
 * /offer/{id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Offer
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the offer to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateOfferSchema'
 *      responses:
 *          204:
 *              description: Offer updated
 *          400:
 *              description: Validation error
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          404:
 *              description: Offer not found
 *          500:
 *              description: Server error
 */
router.patch('/:id', manager, updateOffer);
/**
 * @swagger
 * /offer/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Offer
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the offer to delete
 *      responses:
 *          204:
 *              description: Offer deleted
 *          400:
 *              description: Invalid ID
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          404:
 *              description: Offer not found
 *          500:
 *              description: Server error
 */
router.delete('/:id', manager, deleteOffer);

export default router;