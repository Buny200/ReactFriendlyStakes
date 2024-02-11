import React from "react";
import { Link } from "react-router-dom";

function CustomBets() {
  return (
    <div>
      <h2>Apuestas Personalizadas</h2>
      <ul>
        <li>
          <Link to="/custom-bets/create">Crear Apuesta Personalizada</Link>
        </li>
        <li>
          <Link to="/custom-bets/active">Ver Activas</Link>
        </li>
        <li>
          <Link to="/custom-bets/created">Ver Creadas</Link>
        </li>
      </ul>
    </div>
  );
}

export default CustomBets;
