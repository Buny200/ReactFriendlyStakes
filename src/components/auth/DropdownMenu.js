import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import "../../css/DropdownMenu.css";

const DropdownMenu = ({ language }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = () => {
    setShowMenu(false); 
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleMenu}>
        {language === 'es' ? "🎰 Apuestas Personalizadas" : "🎰 Custom Bets"} <FiChevronDown />
      </button>
      {showMenu && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/custom-bets/create" onClick={handleMenuItemClick}>
              {language === 'es' ? "🎲 Crear apuesta" : "🎲 Create Bet"}
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/join" onClick={handleMenuItemClick}>
              {language === 'es' ? "🤝 Unirse a una apuesta" : "🤝 Join a Bet"}
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/all" onClick={handleMenuItemClick}>
              {language === 'es' ? "🔍 Ver todas las apuestas" : "🔍 View All Bets"}
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/in" onClick={handleMenuItemClick}>
              {language === 'es' ? "📝 Ver todas las apuestas en las que participo" : "📝 View Bets I'm In"}
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/created-by-me" onClick={handleMenuItemClick}>
              {language === 'es' ? "📝 Ver creadas por mí" : "📝 View Bets Created by Me"}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
