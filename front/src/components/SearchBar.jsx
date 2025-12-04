import PropTypes from 'prop-types'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/searchbar.css';
import { ROUTES } from "../routes/routesPath";

import searchIcon from '../assets/searchIcon.svg';
import backIcon from '../assets/leftArrow.svg';
import forwardIcon from '../assets/rightArrow.svg';
import clearIcon from '../assets/cancel_black.svg';

function SearchBar({ placeholder, onSearch, isGlobal = false, debounce = 0 }) {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isGlobal && debounce > 0) {
            const timer = setTimeout(() => {
                if (onSearch) onSearch(query);
            }, debounce);
            return () => clearTimeout(timer);
        } else if (!isGlobal && onSearch) {
            onSearch(query);
        }
    }, [query, debounce, isGlobal, onSearch]);

    const handleSubmit = () => {
        if (isGlobal && query.trim()) {
            const newHistory = [...history.slice(0, currentIndex + 1), query];
            setHistory(newHistory);
            setCurrentIndex(newHistory.length - 1);

            const normalized = query.trim().toLowerCase();
            const routes = {
                vehicule: ROUTES.VEHICULE_ROUTE,
                profile: ROUTES.PROFILE_ROUTE,
                order: ROUTES.ORDER_ROUTE,
                favorite: ROUTES.FAVORITE_ROUTE,
                offer: ROUTES.OFFER_ROUTE,
                review: ROUTES.REVIEW_ROUTE,
                home: ROUTES.HOME_ROUTE
            };

            if (routes[normalized]) {
                navigate(routes[normalized]);
            } else {
                navigate(`/search?q=${encodeURIComponent(query)}`);
            }
        }
    };

    const handleClear = () => setQuery('');
    const handleBack = () => {
        if (currentIndex > 0) {
            const prevQuery = history[currentIndex - 1];
            setQuery(prevQuery);
            setCurrentIndex(currentIndex - 1);
        }
    };
    const handleForward = () => {
        if (currentIndex < history.length - 1) {
            const nextQuery = history[currentIndex + 1];
            setQuery(nextQuery);
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className={`search-wrapper ${isGlobal ? 'global' : 'local'}`}>
            {isGlobal && (
                <div className="search-controls">
                    <img src={backIcon} alt="Back" className="search-icon" onClick={handleBack} />
                    <img src={forwardIcon} alt="Forward" className="search-icon" onClick={handleForward} />
                    <img src={clearIcon} alt="Clear" className="search-icon" onClick={handleClear} />
                </div>
            )}

            <div className={`search-bar ${isGlobal ? 'global' : 'local'}`}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                <img src={searchIcon} alt="Search" className="search-icon" onClick={handleSubmit}/>
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

export default SearchBar;
