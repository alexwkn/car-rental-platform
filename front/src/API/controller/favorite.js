import apiClient from "../http.js";
import API_ROUTES from "../apiRoutes.js";



const getAllFavorites = async () => {
    try {
        const { data } = await apiClient.get(API_ROUTES.FAVORITE_ROUTE);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const addFavorite = async (favorite) => {
    try {
        favorite.user_id = parseInt(favorite.user_id);
        favorite.offer_id = parseInt(favorite.offer_id);
        const { data } = await apiClient.post(`${API_ROUTES.FAVORITE_ROUTE}`, favorite);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const deleteFavorite = async (id) => {
    try {
        await apiClient.delete(`${API_ROUTES.FAVORITE_ROUTE}/${id}`);
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const getFavoriteById = async (id) => {
    try {
        const { data } = await apiClient.get(`${API_ROUTES.FAVORITE_ROUTE}/${id}`);
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

const updateFavorite = async (updatedFavorite) => {
    try {
        if (updatedFavorite.user_id)
            updatedFavorite.user_id = parseFloat(updatedFavorite.user_id);
        if (updatedFavorite.offer_id)
            updatedFavorite.offer_id = parseFloat(updatedFavorite.offer_id);
        const { data } = await apiClient.patch(
            `${API_ROUTES.FAVORITE_ROUTE}/${updatedFavorite.favorite_id}`,
            updatedFavorite
        );
        return data;
    } catch (e) {
        throw new Error(
            "Une erreur est survenue, réessayez ultérieurement: " + e.message
        );
    }
};

export {
    getAllFavorites,
    addFavorite,
    deleteFavorite,
    getFavoriteById,
    updateFavorite
};      
