const API_ROUTES = {
  API_ROUTE: import.meta.env.VITE_API_ROUTE || "http://localhost:3001",
  LOGIN_ROUTE: "/login",
  VEHICLES_ROUTE: "/vehicules",
  REVIEWS_ROUTE: "/reviews",
  PROFILE_ROUTE: "/profiles",
  ORDER_ROUTE: "/orders",
  OFFER_ROUTE: "/offers",
  FAVORITE_ROUTE: "/favorite",
};

export default API_ROUTES;
