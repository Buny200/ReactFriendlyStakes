import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Leaderboards.css"; 

const Leaderboards = () => {
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
      <h1 className="leaderboards-header">Leaderboards</h1>
      <table className="leaderboards-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Nickname</th>
            <th>Ganancias</th>
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
