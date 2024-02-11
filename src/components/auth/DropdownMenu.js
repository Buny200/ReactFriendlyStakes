import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi"; // Importa el ícono de flecha hacia abajo
import "../../css/DropdownMenu.css";

const DropdownMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  // Función para alternar la visibilidad del menú desplegable
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="dropdown">
      {/* Botón para abrir/cerrar el menú desplegable */}
      <button className="dropdown-toggle" onClick={toggleMenu}>
        🎰 Apuestas Personalizadas <FiChevronDown />
      </button>
      
      {/* Contenedor del menú desplegable */}
      {showMenu && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/custom-bets/create">
              🎲 Crear Apuesta
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/join">
              🤝 Unirse a una apuesta
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/all">
              🔍 Ver todas las Apuestas
            </Link>
          </li>
          <li>
            <Link to="/custom-bets/created">
              📝 Ver Creadas por mí
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
