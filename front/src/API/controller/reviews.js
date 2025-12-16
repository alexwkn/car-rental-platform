import apiClient from "../http";
import API_ROUTES from "../apiRoutes.js";

const getAllReviews = async () => {
    try {
        const { data } = await apiClient.get(API_ROUTES.REVIEWS_ROUTE);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};
const getReviewById = async (id) => {
    try {
        const { data } = await apiClient.get(`${API_ROUTES.REVIEWS_ROUTE}/${id}`);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};
const addReview = async (review) => {
    try {
        review.review_id = parseInt(review.review_id);
        review.user_id = parseInt(review.user_id);
        const { data } = await apiClient.post(`${API_ROUTES.REVIEWS_ROUTE}`, review);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const updateReview = async (updatedReview) => {
    try {
        if (updatedReview.review_id)
            updatedReview.review_id = parseFloat(updatedReview.review_id);
        if (updatedReview.user_id)
            updatedReview.user_id = parseFloat(updatedReview.user_id);
        const { data } = await apiClient.patch(
            `${API_ROUTES.REVIEWS_ROUTE}/${updatedReview.review_id}`,
            updatedReview
        );
        return data;
    }
    catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};
const deleteReview = async (id) => {
    try {
        await apiClient.delete(`${API_ROUTES.REVIEWS_ROUTE}/${id}`);
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};
export { getAllReviews, getReviewById, addReview, updateReview, deleteReview };