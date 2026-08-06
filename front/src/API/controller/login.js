import apiClient from "../http";
import API_ROUTES from '/src/API/apiRoutes.js';
import { toApiError } from "../apiError.js";

export const requestLogin = async (email, password) => {
    try {
        const response = await apiClient.post(`${API_ROUTES.LOGIN_ROUTE}`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw toApiError(error);
    }
};

export default requestLogin;