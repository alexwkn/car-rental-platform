import PropTypes from "prop-types";
import SearchBar from "../components/SearchBar";
import NavBar from "./NavBar";
import "../styles/layout.css";

export default function BackOfficeLayout({ children }) {
  return (
    <div className="App">
      <div className="sidebar">
        <SearchBar
          placeholder="Search Profiles, Vehicules..."
          isGlobal={true}
        />
      </div>

      <main className="main-content">
        <NavBar />
        {children}
      </main>
    </div>
  );
}

BackOfficeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
