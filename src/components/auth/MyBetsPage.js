import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/MyBetsPage.css";

const MyBetsPage = () => {
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está loggeado
  const betsPerPage = 10;

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const userId = window.sessionStorage.getItem("USER_ID");
        const response = await axios.get(`http://localhost:8080/api/users/${userId}/bets`);
        setBets(response.data.betList); // Ajustando a la estructura del DTO
        const totalBets = response.data.betList.length; // Ajustando a la estructura del DTO
        const totalPages = Math.ceil(totalBets / betsPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching bets:", error);
      }
    };

    const checkLoggedIn = async () => {
      const userId = window.sessionStorage.getItem("USER_ID");
      if (userId) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoggedIn();
    fetchBets();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBetClick = async (betId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bets/${betId}`);
      setSelectedBet(response.data); // Suponiendo que response.data contiene los detalles de la apuesta
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching bet details:", error);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const firstBetIndex = (currentPage - 1) * betsPerPage;
  const lastBetIndex = Math.min(firstBetIndex + betsPerPage, bets.length);
  const currentBets = bets.slice(firstBetIndex, lastBetIndex);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2 className="title">Todas las Apuestas Activas</h2>
          <ul className="bet-list">
            {currentBets.map((bet) => (
              <li key={bet.betId} className="bet-item" onClick={() => handleBetClick(bet.betId)}>
                <div className="bet-info">
                  <div className="bet-title">
                    <span className="title-prefix">Título de la apuesta: </span>
                    {bet.title}
                  </div>
                  <div className="bet-details">
                    <p>Creador: {bet.creator.userNickname}</p> {/* Ajustando a la estructura del DTO */}
                    <p>Fecha de inicio: {new Date(bet.startDate).toLocaleDateString()}</p>
                    <p>Monto de la apuesta: {bet.betAmount}</p>
                    <p>Número de participantes: {bet.participantsNumber}</p>
                    <p>Estado: {bet.status}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
          </div>
        </>
      ) : (
        <div className="error-message">
          <Link to="/login" className="error-message-link">
            No puedes acceder a esta sección sin iniciar sesión. Para disfrutar de tus apuestas, inicia sesión y comienza a disfrutar de todo lo que FRIENDLYSTAKES tiene para ofrecerte.
          </Link>
        </div>
      )}
      {showPopup && selectedBet && (
        <div className="popup" onClick={handlePopupClose}>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles de la Apuesta</h2>
            <p>Título: {selectedBet.title}</p>
            <p>Creador: {selectedBet.creator.nickname}</p>
            <p>Fecha de inicio: {new Date(selectedBet.startDate).toLocaleString()}</p>
            <p>Monto de la apuesta: {selectedBet.betAmount}</p>
            <p>Número de participantes: {selectedBet.participantsNumber}</p>
            <p>Estado: {selectedBet.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBetsPage;
