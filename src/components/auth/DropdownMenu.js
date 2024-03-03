import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import "../../css/DropdownMenu.css";

const DropdownMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = () => {
    setShowMenu(false); // Cierra el menú cuando se hace clic en una opción
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleMenu}>
        🎰 Apuestas Personalizadas <FiChevronDown />
      </button>
      {showMenu && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/custom-bets/create" onClick={handleMenuItemClick}>
              🎲 Crear apuesta
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/join" onClick={handleMenuItemClick}>
              🤝 Unirse a una apuesta
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/all" onClick={handleMenuItemClick}>
              🔍 Ver todas las apuestas
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/in" onClick={handleMenuItemClick}>
              📝 Ver todas las apuestas en las que participo
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/created-by-me" onClick={handleMenuItemClick}>
              📝 Ver creadas por mí
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
