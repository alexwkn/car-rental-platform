import apiClient from "../http";
import API_ROUTES from "../apiRoutes.js";
import { toApiError } from "../apiError.js";

const getAllVehicules = async () => {
    try {
        const { data } = await apiClient.get(API_ROUTES.VEHICLES_ROUTE);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const getVehiculeById = async (id) => {
    try {
        const { data } = await apiClient.get(`${API_ROUTES.VEHICLES_ROUTE}/${id}`);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const addVehicule = async (vehicule) => {
    try {
        vehicule.vehicule_id = parseInt(vehicule.vehicule_id);
        vehicule.owner_id = parseInt(vehicule.owner_id);
        const { data } = await apiClient.post(`${API_ROUTES.VEHICLES_ROUTE}`, vehicule);
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};

const updateVehicule = async (updatedVehicule) => {
    try {
        if (updatedVehicule.vehicule_id)
            updatedVehicule.vehicule_id = parseFloat(updatedVehicule.vehicule_id);
        if (updatedVehicule.owner_id)
            updatedVehicule.owner_id = parseFloat(updatedVehicule.owner_id);
        const { data } = await apiClient.patch(
            `${API_ROUTES.VEHICLES_ROUTE}/${updatedVehicule.vehicule_id}`,
            updatedVehicule
        );
        return data;
    } catch (e) {
        throw toApiError(e);
    }
};
const deleteVehicule = async (id) => {
    try {
        await apiClient.delete(`${API_ROUTES.VEHICLES_ROUTE}/${id}`);
    } catch (e) {
        throw toApiError(e);
    }
};

export {
    getAllVehicules,
    getVehiculeById,
    addVehicule,
    updateVehicule,
    deleteVehicule,
};