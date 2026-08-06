import prisma from "../../database/databaseORM.js";
import { OrderValidator } from "../middleware/validator/order.js";
import logger from "../../utils/logger.js";

const formatDate = (d) => d ? new Date(d).toISOString().slice(0,10) : null;
const isoDate = (d) => d ? new Date(d) : null;
const formatOrder = (o) => ({
    ...o,
    order_date: formatDate(o.order_date),
    date_of_return: formatDate(o.date_of_return),
});


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
            res.send(formatOrder(order));
        } else {
            res.status(404).send('Order not found');
        }
    }catch (err) {
        logger.error(err.message, { stack: err.stack });
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

    res.status(200).json(orders.map(formatOrder));
    } catch (err) {
        logger.error(err.message, { stack: err.stack });
        res.status(500).send('Server error');
    }
};



export const createOrder = async (req, res) => {
    try {
        const validatedData = req.validated;

        const order_date = validatedData.order_date ? isoDate(validatedData.order_date) : new Date();
        const date_of_return = isoDate(validatedData.date_of_return);

        if (date_of_return <= order_date) {
            return res.status(422).json({
                message: 'Validation error',
                errors: [{ message: 'date_of_return must be after order_date' }],
            });
        }

        const payload = {
            order_date: order_date,
            date_of_return: date_of_return,
            fuel_level_return: validatedData.fuel_level_return,
            payment_status: validatedData.payment_status,
            offer_id: validatedData.offer_id,
            customer_id: req.session.id,
        };

        const newOrder = await prisma.$transaction(async (prisma) => {
            const existingOrderForOffer = await prisma.order.findFirst({
                where: { offer_id: payload.offer_id },
            });

            if (existingOrderForOffer) {
                throw new Error("OFFER_ALREADY_BOOKED");
            }

            return prisma.order.create({ data: payload });
        });

        res.status(201).json({
        message: 'Order created successfully',
        data: formatOrder(newOrder),
        });
    } catch (err) {
        if (err.message === "OFFER_ALREADY_BOOKED") {
            return res.status(409).json({
                message: 'This offer is already booked',
            });
        }
        logger.error(err.message, { stack: err.stack });
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
            order_date: req.body.order_date ?? formatDate(existingOrder.order_date), 
            date_of_return: req.body.date_of_return ?? formatDate(existingOrder.date_of_return),
            fuel_level_return: req.body.fuel_level_return ?? existingOrder.fuel_level_return,
            payment_status: req.body.payment_status ?? existingOrder.payment_status,
            offer_id: req.body.offer_id ?? existingOrder.offer_id,
            customer_id: req.body.customer_id ?? existingOrder.customer_id,
    
        }; 

        const validatedData = await OrderValidator.validate(bodyToValidate);

        const updatedOrder = await prisma.order.update({
            where: { order_id: parseInt(req.params.id) },
            data: {
                ...validatedData,
                order_date: validatedData.order_date ? isoDate(validatedData.order_date) : existingOrder.order_date,
                date_of_return: validatedData.date_of_return ? isoDate(validatedData.date_of_return) : existingOrder.date_of_return,
            }
        });
        return res.status(200).json({
        message: 'Order updated successfully',
        data: formatOrder(updatedOrder),
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
        logger.error(`[deleteOrder] ${err.message}`, { stack: err.stack });
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err,
        });
    }
};

// Récupérer les réservations en cours pour un utilisateur spécifique
export const getCurrentOrders = async (req, res) => {
    try {
        const userId = req.session.id; // ID de l'utilisateur depuis le JWT

        const orders = await prisma.order.findMany({
            where: {
                customer_id: userId,
                payment_status: { not: 'completed' } // Exclure les réservations complétées
            },
            include: {
                offer: {
                    include: {
                        vehicule: true
                    }
                }
            },
            orderBy: {
                order_date: 'desc'
            }
        });

        if (orders.length > 0) {
            res.status(200).json(orders.map(formatOrder));
        } else {
            res.status(200).json([]);
        }
    } catch (err) {
        logger.error(`[getCurrentOrders] ${err.message}`, { stack: err.stack });
        res.status(500).send('Server error');
    }
};

// Récupérer l'historique des réservations pour un utilisateur spécifique
export const getOrderHistory = async (req, res) => {
    try {
        const userId = req.session.id; // ID de l'utilisateur depuis le JWT

        const orders = await prisma.order.findMany({
            where: {
                customer_id: userId,
                payment_status: 'completed'
            },
            include: {
                offer: true
            },
            orderBy: {
                date_of_return: 'desc'
            }
        });

        if (orders.length > 0) {
            res.status(200).json(orders.map(formatOrder));
        } else {
            res.status(200).json([]);
        }
    } catch (err) {
        logger.error(`[getOrderHistory] ${err.message}`, { stack: err.stack });
        res.status(500).send('Server error');
    }
};

export const completeOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const { fuel_level_return, date_of_return } = req.body;

        const existingOrder = await prisma.order.findUnique({
            where: { order_id: orderId }
        });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const completedOrder = await prisma.order.update({
            where: { order_id: orderId },
            data: {
                fuel_level_return: fuel_level_return ? parseFloat(fuel_level_return) : null,
                date_of_return: date_of_return ? new Date(date_of_return) : existingOrder.date_of_return,
                payment_status: 'completed'
            },
            include: {
                offer: true
            }
        });

        return res.status(200).json({
            message: 'Order completed successfully',
            data: formatOrder(completedOrder)
        });
    } catch (err) {
        logger.error(`[completeOrder] ${err.message}`, { stack: err.stack });
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err
        });
    }
};