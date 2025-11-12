import prisma from "../../database/databaseORM.js";
//import { createOrderSchema,updateOrderSchema } from "../middleware/validator/order.js";

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

export const createOrder = async (req, res) => {};
export const updateOrder = async (req, res) => {};

export const deleteOrder = async (req, res) => {};