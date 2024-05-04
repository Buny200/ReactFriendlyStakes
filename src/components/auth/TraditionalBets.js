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
    setShowMenu(false); 
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleMenu}>
        🎰 Apuestas Tradicionales <FiChevronDown />
      </button>
      {showMenu && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/traditional-Bets/Coinflip" onClick={handleMenuItemClick}>
            🎲 Coinflip
            </Link>
          </li>
          <li>
            <Link to="/traditional-Bets/roulette" onClick={handleMenuItemClick}>
            🎡 Ruleta
            </Link>
          </li>
          <li>
            <Link to="/traditional-Bets/Blackjack" onClick={handleMenuItemClick}>
            🎫 BlackJack
            </Link>
          </li>
          <li>
            <Link to="/traditional-Bets/Keno" onClick={handleMenuItemClick}>
            💰 Keno
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
