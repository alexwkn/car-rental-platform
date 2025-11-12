import Router from 'express';
import{getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controler/order.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();
router.get('/', manager, getAllOrders);
router.get('/:id', manager, getOrderById);
router.post('/', manager, createOrder);
router.patch('/:id', manager, updateOrder);
router.delete('/:id', manager, deleteOrder);

export default router;

