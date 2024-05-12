import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/MyBetsPage.css";

const MyBetsPage = ({ updateUserBalance, language }) => {
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
      setErrorMessage(language === 'es' ? "Error al cargar las apuestas. Por favor, inténtalo de nuevo más tarde." : "Error fetching bets. Please try again later.");
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
      setErrorMessage(language === 'es' ? "Error al cargar los detalles de la apuesta. Por favor, inténtalo de nuevo más tarde." : "Error fetching bet details. Please try again later.");
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
      setErrorMessage(language === 'es' ? "Error al iniciar la apuesta. Por favor, inténtalo de nuevo más tarde." : "Error starting bet. Please try again later.");
    }
  };

  const handleSendResults = async (betId) => {
    try {
      console.log(language === 'es' ? "Resultados enviados para la apuesta:" : "Results sent for bet:", betId);
    } catch (error) {
      console.error("Error sending results:", error);
      setErrorMessage(language === 'es' ? "Error al enviar los resultados. Por favor, inténtalo de nuevo más tarde." : "Error sending results. Please try again later.");
    }
  };

  const handleCancelBet = async (betId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/bets/${window.sessionStorage.getItem('USER_ID')}/delete/${betId}`);
      if (response.data) {
        console.log(language === 'es' ? "Apuesta cancelada:" : "Bet canceled:", betId);
        fetchBets();
        updateUserBalance();
      } else {
        setErrorMessage(language === 'es' ? "Hubo un problema al cancelar la apuesta. Por favor, inténtalo de nuevo más tarde." : "There was a problem canceling the bet. Please try again later.");
      }
    } catch (error) {
      console.error("Error cancelling bet:", error);
      setErrorMessage(language === 'es' ? "Error al cancelar la apuesta. Por favor, inténtalo de nuevo más tarde." : "Error cancelling bet. Please try again later.");
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
          <h2 className="title">{language === 'es' ? 'Todas tus apuestas' : 'All your bets'}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {bets.length === 0 ? (
            <div className="no-bets-message">{language === 'es' ? 'Todavía no has creado ninguna apuesta. ¡Anímate a hacer un depósito y comienza a disfrutar!' : 'You have not created any bets yet. Get started by making a deposit and start enjoying!'}</div>
          ) : (
            <>
              <div className="filters-container">
                <div className="filters">
                  <span>{language === 'es' ? 'Filtrar por estado:' : 'Filter by status:'}</span>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="ALL">{language === 'es' ? 'Todos' : 'All'}</option>
                    <option value="JOINING">{language === 'es' ? 'Unirse' : 'Joining'}</option>
                    <option value="PENDING">{language === 'es' ? 'Pendiente' : 'Pending'}</option>
                    <option value="VERIFICATION">{language === 'es' ? 'Verificación' : 'Verification'}</option>
                    <option value="FINISH">{language === 'es' ? 'Finalizado' : 'Finish'}</option>
                  </select>
                </div>
              </div>
              <ul className="bet-list">
                {bets.filter(filterBets).map((bet) => (
                  <li key={bet.betId} className="bet-item" onClick={() => handleBetClick(bet.betId)}>
                    <div className="bet-info">
                      <div className="bet-title">
                        <span className="title-prefix">{language === 'es' ? 'Título de la apuesta:' : 'Bet title:'}</span>
                        {bet.title}
                      </div>
                      <div className="bet-details">
                        <p>{language === 'es' ? 'Creador:' : 'Creator:'} {bet.creator.userNickname}</p>
                        <p>{language === 'es' ? 'Fecha de inicio:' : 'Start date:'} {new Date(bet.startDate).toLocaleDateString()}</p>
                        <p>{language === 'es' ? 'Cantidad de la apuesta:' : 'Bet amount:'} {bet.betAmount}</p>
                        <p>{language === 'es' ? 'Número de participantes:' : 'Number of participants:'} {bet.participantsNumber}</p>
                        <p>{language === 'es' ? 'Estado:' : 'Status:'} {bet.status}</p>
                        {bet.status === "JOINING" && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleStartBet(window.sessionStorage.getItem('USER_ID'), bet.betId); }}>{language === 'es' ? 'Comenzar Apuesta' : 'Start Bet'}</button>
                            <button className="cancel-button" onClick={(e) => { e.stopPropagation(); handleCancelBet(bet.betId); }}>{language === 'es' ? 'Cancelar Apuesta' : 'Cancel Bet'}</button>
                          </>
                        )}
                        {bet.status === "PENDING" && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleSendResults(bet.betId); }}>{language === 'es' ? 'Enviar Resultados' : 'Send Results'}</button>
                            <button className="cancel-button" onClick={(e) => { e.stopPropagation(); handleCancelBet(bet.betId); }}>{language === 'es' ? 'Cancelar Apuesta' : 'Cancel Bet'}</button>
                          </>
                        )}
                        {successMessages[bet.betId] && (
                          <div className="success-message">
                            {language === 'es' ? '¡La apuesta seleccionada se ha iniciado correctamente!' : 'The selected bet has been successfully started!'}
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
                  {language === 'es' ? `Página ${currentPage} de ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
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
            {language === 'es' ? 'No puedes acceder a esta sección sin iniciar sesión. Para disfrutar de tus apuestas, inicia sesión y comienza a disfrutar de todo lo que FRIENDLYSTAKES tiene para ofrecerte.' : 'You cannot access this section without logging in. To enjoy your bets, log in and start enjoying everything that FRIENDLYSTAKES has to offer.'}
          </Link>
        </div>
      )}
      {showPopup && selectedBet && (
        <div className="popup" onClick={handlePopupClose}>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <h2>{language === 'es' ? 'Detalles de la Apuesta' : 'Bet Details'}</h2>
            <p>{language === 'es' ? 'Título:' : 'Title:'} {selectedBet.title}</p>
            <p>{language === 'es' ? 'Creador:' : 'Creator:'} {selectedBet.creator.nickname}</p>
            <p>{language === 'es' ? 'Fecha de inicio:' : 'Start date:'} {new Date(selectedBet.startDate).toLocaleString()}</p>
            <p>{language === 'es' ? 'Cantidad de la apuesta:' : 'Bet amount:'} {selectedBet.betAmount}</p>
            <p>{language === 'es' ? 'Número de participantes:' : 'Number of participants:'} {selectedBet.participantsNumber}</p>
            <p>{language === 'es' ? 'Estado:' : 'Status:'} {selectedBet.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBetsPage;
