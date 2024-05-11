import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Leaderboards.css";

const Leaderboards = ({ language }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/leaderboards");
      const data = response.data.slice(0, 100); // Limitando a 100 usuarios
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  return (
    <div className="leaderboards-container">
      <h1 className="leaderboards-header">{language === 'es' ? 'Tablas de Clasificación' : 'Leaderboards'}</h1>
      <table className="leaderboards-table">
        <thead>
          <tr>
            <th>{language === 'es' ? 'Posición' : 'Position'}</th>
            <th>{language === 'es' ? 'Nombre de Usuario' : 'Username'}</th>
            <th>{language === 'es' ? 'Ganancias' : 'Earnings'}</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.nickname}</td>
              <td>{entry.earningsLosses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;
