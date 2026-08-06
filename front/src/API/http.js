import axios from "axios";
import axiosRetry from "axios-retry";
import API_ROUTES from "./apiRoutes.js";

const apiClient = axios.create({
  baseURL: API_ROUTES.API_ROUTE,
  withCredentials: true,
});

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export default apiClient;
