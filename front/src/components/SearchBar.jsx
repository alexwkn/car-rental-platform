import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/searchbar.css";

import { ROUTES } from "../routes/routesPath";

import searchIcon from "../assets/searchIcon.svg";
import backIcon from "../assets/leftArrow.svg";
import forwardIcon from "../assets/rightArrow.svg";
import clearIcon from "../assets/cancel_black.svg";

export default function SearchBar({
  placeholder,
  onSearch,
  isGlobal = false,
  debounce = 0,
}) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isGlobal && debounce > 0) {
      const timer = setTimeout(() => {
        onSearch?.(query);
      }, debounce);
      return () => clearTimeout(timer);
    } else if (!isGlobal) {
      onSearch?.(query);
    }
  }, [query, debounce, isGlobal, onSearch]);

  const handleSubmit = () => {
    if (!isGlobal) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMsg("Veuillez entrer un mot-clé.");
      return;
    }

    const newHistory = [...history.slice(0, currentIndex + 1), trimmed];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);

    const normalized = trimmed.toLowerCase();

    const routes = {
      vehicule: ROUTES.VEHICULE_ROUTE,
      vehicules: ROUTES.VEHICULE_ROUTE,
      vehicle: ROUTES.VEHICULE_ROUTE,
      vehicles: ROUTES.VEHICULE_ROUTE,

      profile: ROUTES.PROFILE_ROUTE,
      profiles: ROUTES.PROFILE_ROUTE,

      order: ROUTES.ORDER_ROUTE,
      orders: ROUTES.ORDER_ROUTE,

      favorite: ROUTES.FAVORITE_ROUTE,
      favorites: ROUTES.FAVORITE_ROUTE,

      offer: ROUTES.OFFER_ROUTE,
      offers: ROUTES.OFFER_ROUTE,

      review: ROUTES.REVIEW_ROUTE,
      reviews: ROUTES.REVIEW_ROUTE,

      home: ROUTES.HOME_ROUTE,
    };

    if (routes[normalized]) {
      setErrorMsg("");
      navigate(routes[normalized]);
    } else {
      setErrorMsg(
        `Aucun tableau ne correspond à "${trimmed}". Mots-clés: vehicule/vehicle, profile, order, favorite, offer, review, home.`
      );
    }
  };

  const handleClear = () => {
    setQuery("");
    setErrorMsg("");
  };

  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  return (
    <div className={`search-wrapper ${isGlobal ? "global" : "local"}`}>
      {isGlobal && (
        <div className="search-controls">
          <img
            src={backIcon}
            alt="Back"
            className="search-icon"
            onClick={handleBack}
          />
          <img
            src={forwardIcon}
            alt="Forward"
            className="search-icon"
            onClick={handleForward}
          />
          <img
            src={clearIcon}
            alt="Clear"
            className="search-icon"
            onClick={handleClear}
          />
        </div>
      )}

      <div style={isGlobal ? { flex: 1, width: "100%" } : undefined}>
        <div className={`search-bar ${isGlobal ? "global" : "local"}`}>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <img
            src={searchIcon}
            alt="Search"
            className="search-icon"
            onClick={handleSubmit}
          />
        </div>

        {isGlobal && errorMsg && (
          <p style={{ color: "red", marginTop: "8px", marginLeft: "10px" }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  isGlobal: PropTypes.bool,
  debounce: PropTypes.number,
};
