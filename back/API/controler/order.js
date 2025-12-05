import prisma from "../../database/databaseORM.js";
import { OrderValidator } from "../middleware/validator/order.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *         order_date:
 *           type: string
 *           format: date-time
 *         date_of_return:
 *           type: string
 *           format: date
 *         fuel_level_return:
 *           type: number
 *         payment_status:
 *           type: string
 *           enum: [pending, completed, failed]
 *         offer_id:
 *           type: integer
 *         customer_id:
 *           type: integer
 */




export const getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { 
                order_id: parseInt(req.params.id) 
            }
        });
        if (order) {
            res.send(order);
        } else {
            res.status(404).send('Order not found');
        }
    }catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
        orderBy:{
            order_id:"asc"
        }
    });

    if (orders.length > 0) {
        res.status(200).json(orders);
    } else {
        res.status(404).send('No orders found');
    }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};



export const createOrder = async (req, res) => {
    try {
        const validatedData = await OrderValidator.validate(req.body);

        const order_date = validatedData.order_date || new Date();

        const payload = {
            order_date: order_date.toISOString(),
            date_of_return: validatedData.date_of_return.toISOString(), 
            fuel_level_return: validatedData.fuel_level_return,
            payment_status: validatedData.payment_status,
            offer_id: validatedData.offer_id,
            customer_id: validatedData.customer_id,
        };

        const newOrder = await prisma.order.create({
            data: payload,
        });
        res.status(201).json({
        message: 'Order created successfully',
        data: newOrder,
        });
    } catch (err) {
        if (err.messages) {
            return res.status(422).json({
                message: 'Validation error',
                errors: err.messages,
            });
        }
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err,
        });
    }
};
export const updateOrder = async (req, res) => {


    try {
        const existingOrder = await prisma.order.findUnique({
            where: { order_id: parseInt(req.params.id) },
        });
               
        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
         
        const bodyToValidate = { 
            order_date: req.body.order_date || existingOrder.order_date.toISOString(), 
            date_of_return: req.body.date_of_return ||existingOrder.date_of_return.toISOString(),
            fuel_level_return: req.body.fuel_level_return || existingOrder.fuel_level_return,
            payment_status: req.body.payment_status || existingOrder.payment_status,
            offer_id: req.body.offer_id || existingOrder.offer_id,
            customer_id: req.body.customer_id || existingOrder.customer_id,
    
        }; 

        const validatedData = await OrderValidator.validate(bodyToValidate);

        const updatedOrder = await prisma.order.update({
            where: { order_id: parseInt(req.params.id) },
            data: validatedData
        });
        return res.status(200).json({
        message: 'Order updated successfully',
        data: updatedOrder,
        });
    } catch (err) {
    if (err.messages) {
        return res.status(422).json({
            message: 'Validation error',
            errors: err.messages,
        });
    }
    return res.status(500).json({
      message: 'Server error',
      error: err.message || err,
    });
    }
};

export const deleteOrder = async (req, res) => {
        try {
        const orderId = parseInt(req.params.id);

        // vérifier que la commande existe
        const existingOrder = await prisma.order.findUnique({
            where: { order_id: orderId },
        });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // supprimer la commande
        const deletedOrder = await prisma.order.delete({
            where: { order_id: orderId },
        });

        return res.status(200).json({
            message: 'Order deleted successfully',
            data: deletedOrder,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err,
        });
    }
};