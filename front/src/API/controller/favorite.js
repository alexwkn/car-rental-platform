import apiClient from "../http.js";
import API_ROUTES from "../apiRoutes.js";
import { toApiError } from "../apiError.js";



const getAllFavorites = async () => {
    try {
        const { data } = await apiClient.get(API_ROUTES.FAVORITE_ROUTE);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const addFavorite = async (favorite) => {
    try {
        favorite.profile_id = parseInt(favorite.profile_id);
        favorite.vehicule_id = parseInt(favorite.vehicule_id);
        const { data } = await apiClient.post(`${API_ROUTES.FAVORITE_ROUTE}`, favorite);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const deleteFavorite = async (id) => {
    try {
        await apiClient.delete(`${API_ROUTES.FAVORITE_ROUTE}/${id}`);
    } catch (e) {
        throw toApiError(e);
    }
};

const getFavoriteById = async (id) => {
    try {
        const { data } = await apiClient.get(`${API_ROUTES.FAVORITE_ROUTE}/${id}`);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const updateFavorite = async (updatedFavorite) => {
    try {
        if (updatedFavorite.profile_id)
            updatedFavorite.profile_id = parseFloat(updatedFavorite.profile_id);
        if (updatedFavorite.vehicule_id)
            updatedFavorite.vehicule_id = parseFloat(updatedFavorite.vehicule_id);
        const { data } = await apiClient.patch(
            `${API_ROUTES.FAVORITE_ROUTE}/${updatedFavorite.favorite_id}`,
            updatedFavorite
        );
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

export {
    getAllFavorites,
    addFavorite,
    deleteFavorite,
    getFavoriteById,
    updateFavorite
};
