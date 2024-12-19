import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css"; // Importa el archivo CSS

export const Navbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      navigate(`/coin/${searchInput.trim().toLowerCase()}`);
    } else {
      alert("Por favor ingrese el nombre o ID de la moneda");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <i className="fas fa-coins"></i> CryptoApp
        </Link>

        {/* Links */}
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="nav-link">
              Portafolio
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              Acerca de
            </Link>
          </li>
        </ul>

        {/* Dropdown */}
        <div className="dropdown">
          <button className="dropbtn">
            Más <i className="fas fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to="/contact">Contacto</Link>
            <Link to="/settings">Configuración</Link>
          </div>
        </div>

        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar moneda..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
    </nav>
  );
};
