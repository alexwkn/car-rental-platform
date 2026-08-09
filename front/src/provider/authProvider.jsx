import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import requestLogin from "../API/controller/login.js";
import apiClient from "../API/http.js";
import API_ROUTES from "../API/apiRoutes.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // est-ce que user déjà connecté
        const { data } = await apiClient.get(API_ROUTES.ME_ROUTE);
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async ({ email, password }) => {
    await requestLogin(email, password);
    const { data } = await apiClient.get(API_ROUTES.ME_ROUTE);
    setUser(data);
  };

  const logout = async () => {
    try {
      await apiClient.post(API_ROUTES.LOGOUT_ROUTE);
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes =  {
  children: Proptypes.node.isRequired,
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
