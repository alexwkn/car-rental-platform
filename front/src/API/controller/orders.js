import apiClient from "../http";
import API_ROUTES from "../apiRoutes.js";

const getAllOrders = async () => {
    try {
        const { data } = await apiClient.get(API_ROUTES.ORDER_ROUTE);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};
const getOrderById = async (id) => {
    try {
        const { data } = await apiClient.get(`${API_ROUTES.ORDER_ROUTE}/${id}`);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }   
};

const addOrder = async (order) => {
    try {
        order.order_id = parseInt(order.order_id);
        order.offer_id = parseInt(order.offer_id);
        const { data } = await apiClient.post(`${API_ROUTES.ORDER_ROUTE}`, order);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const updateOrder = async (updatedOrder) => {
    try {
        if (updatedOrder.order_id)
            updatedOrder.order_id = parseFloat(updatedOrder.order_id);
        if (updatedOrder.offer_id)
            updatedOrder.offer_id = parseFloat(updatedOrder.offer_id);
        const { data } = await apiClient.patch(
            `${API_ROUTES.ORDER_ROUTE}/${updatedOrder.order_id}`,
            updatedOrder
        );
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const deleteOrder = async (id) => {
    try {
        await apiClient.delete(`${API_ROUTES.ORDER_ROUTE}/${id}`);
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};
export { getAllOrders, getOrderById, addOrder, updateOrder, deleteOrder };