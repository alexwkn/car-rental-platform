import { createContext, useState, useContext, useEffect } from "react";
import requestLogin from "../API/controller/login.js";
import apiClient from "../API/http.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser && parsedUser.jwt) {
          setUser(parsedUser);
          apiClient.defaults.headers.Authorization = `Bearer ${parsedUser.jwt}`;
        }
      }
    } catch (err) {
      console.error("Erreur stockage user :", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);


  const login = async ({ email, password }) => {
    try {
      const jwt = await requestLogin(email, password);
      const loggedUser = { email, jwt };

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      apiClient.defaults.headers.Authorization = `Bearer ${jwt}`;
    } catch (e) {
      console.error("Login error:", e);
      throw e;
    }
  };


  const logout = () => {
    setUser(null);
    delete apiClient.defaults.headers.Authorization;
    localStorage.removeItem("user");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

export default AuthProvider;