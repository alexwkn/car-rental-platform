import axios from "axios";
import API_ROUTES from "./apiRoutes.js";

const apiClient = axios.create({
  baseURL: API_ROUTES.API_ROUTE,
});

export default apiClient;
