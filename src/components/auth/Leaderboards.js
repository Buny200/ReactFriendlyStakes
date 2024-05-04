import React, { useState, useEffect } from "react";

const Leaderboards = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Aquí puedes realizar una llamada al backend para obtener los datos de la tabla de clasificación
    // Por ejemplo:
    // fetchLeaderboardData();
  }, []);

  // Función para obtener los datos de la tabla de clasificación
  const fetchLeaderboardData = async () => {
    try {
      // Realiza una solicitud HTTP GET al backend para obtener los datos de la tabla de clasificación
      const response = await fetch("http://localhost:8080/api/leaderboards");
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  return (
    <div>
      <h1>Leaderboards</h1>
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Usuario</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;
