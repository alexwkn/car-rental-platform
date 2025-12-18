import { NavLink } from "react-router-dom";
import { ROUTES } from "../routes/routesPath";
import "../styles/navbar.css";

export default function NavBar() {
  return (
    <div className="navbar">
      <nav>
        <ul>
          <li><NavLink to={ROUTES.HOME_ROUTE}>Home</NavLink></li>
          <li><NavLink to={ROUTES.VEHICULE_ROUTE}>Vehicules</NavLink></li>
          <li><NavLink to={ROUTES.ORDER_ROUTE}>Orders</NavLink></li>
          <li><NavLink to={ROUTES.REVIEW_ROUTE}>Reviews</NavLink></li>
          <li><NavLink to={ROUTES.PROFILE_ROUTE}>Profiles</NavLink></li>
          <li><NavLink to={ROUTES.OFFER_ROUTE}>Offers</NavLink></li>
          <li><NavLink to={ROUTES.FAVORITE_ROUTE}>Favorites</NavLink></li>
        </ul>
      </nav>
    </div>
  );
}
