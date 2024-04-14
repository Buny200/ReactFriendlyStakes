import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/MyBetsPage.css";

const MyBetsPage = ({ updateUserBalance }) => {
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessages, setSuccessMessages] = useState({});
  const [filter, setFilter] = useState("ALL");

  const betsPerPage = 10;

  const fetchBets = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await axios.get(`http://localhost:8080/api/users/${userId}/bets-created`);
      setBets(response.data.betList);
      const totalBets = response.data.betList.length;
      const totalPages = Math.ceil(totalBets / betsPerPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching bets:", error);
      setErrorMessage("Error al cargar las apuestas. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  useEffect(() => {
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
      setSelectedBet(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching bet details:", error);
      setErrorMessage("Error al cargar los detalles de la apuesta. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleStartBet = async (creatorId, betId) => {
    try {
      await axios.post(`http://localhost:8080/api/bets/${creatorId}/start/${betId}`);
      const updatedBets = bets.map(bet => {
        if (bet.betId === betId) {
          return { ...bet, status: "PENDING" };
        }
        return bet;
      });
      setBets(updatedBets);
      if (selectedBet && selectedBet.betId === betId) {
        setSelectedBet({ ...selectedBet, status: "PENDING" });
      }
      setSuccessMessages(prevState => ({
        ...prevState,
        [betId]: true
      }));
    } catch (error) {
      console.error("Error starting bet:", error);
      setErrorMessage("Error al iniciar la apuesta. Por favor, inténtalo de nuevo más tarde.");
    }
  };
  //FUNCTION ENVIAR RESULTADOS
  const handleSendResults = async (betId) => {
    try {
      console.log("Resultados enviados para la apuesta:", betId);
    } catch (error) {
      console.error("Error sending results:", error);
      setErrorMessage("Error al enviar los resultados. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  const handleCancelBet = async (betId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/bets/${window.sessionStorage.getItem('USER_ID')}/delete/${betId}`);
      if (response.data) {
        console.log("Apuesta cancelada:", betId);
        fetchBets(); // Obtener las apuestas actualizadas después de cancelar una apuesta
        updateUserBalance();
      } else {
        setErrorMessage("Hubo un problema al cancelar la apuesta. Por favor, inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error cancelling bet:", error);
      setErrorMessage("Error al cancelar la apuesta. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  const filterBets = (bet) => {
    if (filter === "ALL") {
      return true;
    } else {
      return bet.status === filter;
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2 className="title">Todas tus apuestas </h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {bets.length === 0 ? (
            <div className="no-bets-message">Todavía no has creado ninguna apuesta. ¡Anímate a hacer un depósito y comienza a disfrutar!</div>
          ) : (
            <>
              <div className="filters-container">
                <div className="filters">
                  <span>Filtrar por estado:</span>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="ALL">Todos</option>
                    <option value="JOINING">Unirse</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="VERIFICATION">Verificación</option>
                    <option value="FINISH">Finalizado</option>
                  </select>
                </div>
              </div>
              <ul className="bet-list">
                {bets.filter(filterBets).map((bet) => (
                  <li key={bet.betId} className="bet-item" onClick={() => handleBetClick(bet.betId)}>
                    <div className="bet-info">
                      <div className="bet-title">
                        <span className="title-prefix">Título de la apuesta: </span>
                        {bet.title}
                      </div>
                      <div className="bet-details">
                        <p>Creador: {bet.creator.userNickname}</p>
                        <p>Fecha de inicio: {new Date(bet.startDate).toLocaleDateString()}</p>
                        <p>Cantidad de la apuesta: {bet.betAmount}</p>
                        <p>Número de participantes: {bet.participantsNumber}</p>
                        <p>Estado: {bet.status}</p>
                        {bet.status === "JOINING" && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleStartBet(window.sessionStorage.getItem('USER_ID'), bet.betId); }}>Comenzar Apuesta</button>
                            <button className="cancel-button" onClick={(e) => { e.stopPropagation(); handleCancelBet(bet.betId); }}>Cancelar Apuesta</button>
                          </>
                        )}
                        {bet.status === "PENDING" && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleSendResults(bet.betId); }}>Enviar Resultados</button>
                            <button className="cancel-button" onClick={(e) => { e.stopPropagation(); handleCancelBet(bet.betId); }}>Cancelar Apuesta</button>
                          </>
                        )}
                        {successMessages[bet.betId] && (
                          <div className="success-message">
                            ¡La apuesta seleccionada se ha iniciado correctamente!
                          </div>
                        )}
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
          )}
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
            <p>Cantidad de la apuesta: {selectedBet.betAmount}</p>
            <p>Número de participantes: {selectedBet.participantsNumber}</p>
            <p>Estado: {selectedBet.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBetsPage;
