import apiClient from "../http";
import API_ROUTES from '/src/API/apiRoutes.js';

export const requestLogin = async (email, password) => {
    try {
        const response = await apiClient.post(`${API_ROUTES.LOGIN_ROUTE}`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la connexion " + error.message);
    }
};

export default requestLogin;