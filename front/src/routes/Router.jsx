import { createBrowserRouter } from "react-router-dom";

import { Home, Profile, Order, Favorite, Offer, Review, Vehicule } from "../pages/index.js";
import {ROUTES} from './routesPath.js'

const router = createBrowserRouter([
    {
        path: ROUTES.HOME_ROUTE,
        element: <Home/>
    },
    {
        path: ROUTES.PROFILE_ROUTE,
        element: <Profile/>
    },
    {
        path: ROUTES.ORDER_ROUTE,
        element: <Order/>
    },
    {
        path: ROUTES.FAVORITE_ROUTE,
        element: <Favorite/>
    },
    {
        path: ROUTES.OFFER_ROUTE,
        element: <Offer/>
    },
    {
        path: ROUTES.REVIEW_ROUTE,
        element: <Review/>
    },
    {
        path: ROUTES.VEHICULE_ROUTE,
        element: <Vehicule/>
    }
]);

export default router;