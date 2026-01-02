import axios from 'axios';
import { Platform } from 'react-native';

// Resolve baseURL for different environments (Android emulator vs iOS vs device)
const envBase = process.env.EXPO_PUBLIC_BASE_API_ROUTE;
const resolvedBaseURL = (() => {
    // Android emulator cannot reach localhost: use 10.0.2.2
    if (Platform.OS === 'android') {
        if (!envBase || /localhost/i.test(envBase)) {
            return 'http://10.0.2.2:3001';
        }
        return envBase;
    }

})();

export const API = axios.create({
    baseURL: resolvedBaseURL,
    withCredentials: false,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 8000,
});

// Dev logging to debug 404/connection issues
if (__DEV__) {
    API.interceptors.request.use((config) => {
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
        console.log('[API]', config.method?.toUpperCase(), fullUrl);
        return config;
    });
    API.interceptors.response.use(
        (response) => response,
        (error) => {
            const cfg = error?.config || {};
            const fullUrl = `${cfg.baseURL || ''}${cfg.url || ''}`;
            console.log('[API ERROR]', error?.response?.status, fullUrl);
            return Promise.reject(error);
        }
    );
}

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers['Authorization'];
    }
};

export const fetcher = url => API.get(url).then(res => res.data);

export const apiRequest = async (method, url, data = null, extraConfig = {}) => {
  try {
    const m = method.toLowerCase();

    const isFormData =
      data && typeof data === "object" && typeof data.append === "function";

    const config = {
      method: m,
      url,
      ...extraConfig,
      headers: {
        ...(extraConfig.headers || {}),
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
      },
    };

    if (data !== null && ["post", "put", "patch", "delete"].includes(m)) {
      config.data = data;
    }

    const response = await API(config);
    return response;
  } catch (error) {
    // Tu relances l’erreur pour que l’écran puisse faire Alert / logs
    throw error;
  }
};

export default {API, fetcher, setAuthToken, apiRequest};