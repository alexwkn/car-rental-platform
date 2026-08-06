import apiClient from "../http";
import API_ROUTES from "../apiRoutes.js";
import { toApiError } from "../apiError.js";

const getAllReviews = async () => {
    try {
        const { data } = await apiClient.get(API_ROUTES.REVIEWS_ROUTE);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};
const getReviewById = async (id) => {
    try {
        const { data } = await apiClient.get(`${API_ROUTES.REVIEWS_ROUTE}/${id}`);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};
const addReview = async (review) => {
    try {
        review.review_id = parseInt(review.review_id);
        const { data } = await apiClient.post(`${API_ROUTES.REVIEWS_ROUTE}`, review);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const updateReview = async (updatedReview) => {
    try {
        if (updatedReview.review_id)
            updatedReview.review_id = parseFloat(updatedReview.review_id);
        const { data } = await apiClient.patch(
            `${API_ROUTES.REVIEWS_ROUTE}/${updatedReview.review_id}`,
            updatedReview
        );
        return data;
    }
    catch (e) {
        throw toApiError(e);
    }
};
const deleteReview = async (id) => {
    try {
        await apiClient.delete(`${API_ROUTES.REVIEWS_ROUTE}/${id}`);
    } catch (e) {
        throw toApiError(e);
    }
};
export { getAllReviews, getReviewById, addReview, updateReview, deleteReview };