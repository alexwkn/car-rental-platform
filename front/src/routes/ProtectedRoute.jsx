import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider.jsx";
import { ROUTES } from "./routesPath.js";

// Redirige vers la page de connexion si l'utilisateur n'est pas connecté
const ProtectedRoute = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to={ROUTES.LOGIN_ROUTE} replace />;
};

export default ProtectedRoute;
