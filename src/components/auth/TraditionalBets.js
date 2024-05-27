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
        {language === "es" ? "Casino 🎰" : "Casino 🎰"} <FiChevronDown />
      </button>
      {showMenu && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/traditional-Bets/Coinflip" onClick={handleMenuItemClick}>
              {language === "es" ? "Coinflip 🎲" : "Coinflip 🎲"}
            </Link>
          </li>
          <li>
            <Link to="/traditional-Bets/roulette" onClick={handleMenuItemClick}>
              {language === "es" ? "Ruleta 🎡" : "Roulette 🎡"}
            </Link>
          </li>
          <li>
            <Link to="/traditional-Bets/Blackjack" onClick={handleMenuItemClick}>
              {language === "es" ? "BlackJack 🎫" : "BlackJack 🎫"}
            </Link>
          </li>
          <li>
            <Link to="/traditional-Bets/Keno" onClick={handleMenuItemClick}>
              {language === "es" ? "Keno 💰" : "Keno 💰"}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
