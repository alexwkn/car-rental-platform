import { createBrowserRouter, Navigate } from "react-router-dom";

import { Login, Home, Profile, Order, Favorite, Offer, Review, Vehicule } from "../pages/index.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { ROUTES } from "./routesPath.js";

const router = createBrowserRouter([
    {
        path: ROUTES.ROOT_ROUTE,
        element: <Navigate to={ROUTES.LOGIN_ROUTE} replace />
    },
    {
        path: ROUTES.LOGIN_ROUTE,
        element: <Login/>
    },
    {
        element: <ProtectedRoute/>,
        children: [
            { path: ROUTES.HOME_ROUTE, element: <Home/> },
            { path: ROUTES.PROFILE_ROUTE, element: <Profile/> },
            { path: ROUTES.ORDER_ROUTE, element: <Order/> },
            { path: ROUTES.FAVORITE_ROUTE, element: <Favorite/> },
            { path: ROUTES.OFFER_ROUTE, element: <Offer/> },
            { path: ROUTES.REVIEW_ROUTE, element: <Review/> },
            { path: ROUTES.VEHICULE_ROUTE, element: <Vehicule/> }
        ]
    },
    {
        path: "*",
        element: <Navigate to={ROUTES.LOGIN_ROUTE} replace />
    }
]);

export default router;
