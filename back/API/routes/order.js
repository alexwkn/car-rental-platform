import Router from 'express';
import{getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controler/order.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();
/**
 * @swagger
 * /order:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Order
 *      responses:
 *          200:
 *              description: List of all orders
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          500:
 *              description: Server error
 */
router.get('/', manager, getAllOrders);
/**
 * @swagger
 * /order/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Order
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the order to retrieve
 *      responses:
 *          200:
 *              description: Order data
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Order not found
 *          500:
 *              description: Server error
 */
router.get('/:id', manager, getOrderById);
/**
 * @swagger
 * /order:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Order
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateOrderSchema'
 *      responses:
 *          201:
 *              description: Order created
 *          400:
 *              description: Validation error
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          500:
 *              description: Server error
 */
router.post('/', manager, createOrder);
/**
 * @swagger
 * /order/{id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Order
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the order to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateOrderSchema'
 *      responses:
 *          204:
 *              description: Order updated
 *          400:
 *              description: Validation error
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          404:
 *              description: Order not found
 *          500:
 *              description: Server error
 */
router.patch('/:id', manager, updateOrder);
/**
 * @swagger
 * /order/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Order
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the order to delete
 *      responses:
 *          204:
 *              description: Order deleted
 *          400:
 *              description: Invalid ID
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          404:
 *              description: Order not found
 *          500:
 *              description: Server error
 */
router.delete('/:id', manager, deleteOrder);

export default router;

