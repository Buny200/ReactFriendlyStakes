import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/MyBetsPage.css";

const IamInBetsPage = ({ updateUserBalance, language }) => {
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessages, setSuccessMessages] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [resultsSent, setResultsSent] = useState(false);
  const betsPerPage = 10;
  const [leaveBetMessage, setLeaveBetMessage] = useState("");
  const userId = window.sessionStorage.getItem("USER_ID");

  const fetchBets = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}/bets`
      );
      setBets(response.data.betList);
      const totalBets = response.data.betList.length;
      const totalPages = Math.ceil(totalBets / betsPerPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching bets:", error);
      setErrorMessage(
        language === "es"
          ? "Error al cargar las apuestas. Por favor, inténtalo de nuevo más tarde."
          : "Error loading bets. Please try again later."
      );
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

  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]);
  };

  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleWinnerSelection = (participantId) => {
    const previousSelectedPlayerElement = document.querySelector(
      ".selected-player"
    );
    if (previousSelectedPlayerElement) {
      previousSelectedPlayerElement.classList.remove("selected-player");
    }

    setSelectedWinner(participantId);

    const playerElement = document.getElementById(`player-${participantId}`);
    if (playerElement) {
      playerElement.classList.add("selected-player");
    }
  };

  const handleStartBet = async (creatorId, betId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/bets/${creatorId}/start/${betId}`
      );
      const updatedBets = bets.map((bet) => {
        if (bet.betId === betId) {
          return { ...bet, status: "PENDING" };
        }
        return bet;
      });
      setBets(updatedBets);
      if (selectedBet && selectedBet.betId === betId) {
        setSelectedBet({ ...selectedBet, status: "PENDING" });
      }
      setSuccessMessages((prevState) => ({
        ...prevState,
        [betId]: { startBet: true },
      }));
    } catch (error) {
      console.error("Error starting bet:", error);
      setErrorMessage(
        language === "es"
          ? "Error al iniciar la apuesta. Por favor, inténtalo de nuevo más tarde."
          : "Error starting the bet. Please try again later."
      );
    }
  };

  const handleBetClick = async (betId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bets/${betId}`
      );
      setSelectedBet(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching bet details:", error);
      setErrorMessage(
        language === "es"
          ? "Error al cargar los detalles de la apuesta. Por favor, inténtalo de nuevo más tarde."
          : "Error loading bet details. Please try again later."
      );
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleLeaveBet = async (betId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/bets/${userId}/leave/${betId}`
      );
      fetchBets();
      updateUserBalance();
      setSuccessMessages((prevState) => ({
        ...prevState,
        [betId]: true,
      }));
      setLeaveBetMessage(
        language === "es"
          ? "Te has salido de la apuesta exitosamente."
          : "You have successfully left the bet."
      );
    } catch (error) {
      console.error("Error leaving bet:", error);
      setErrorMessage(
        language === "es"
          ? "Error al salir de la apuesta. Por favor, inténtalo de nuevo más tarde."
          : "Error leaving the bet. Please try again later."
      );
    }
  };

  const handleConfirmWinner = async (betId) => {
    try {
      if (!selectedWinner) {
        throw new Error(
          language === "es"
            ? "Por favor, selecciona un ganador antes de enviar los resultados."
            : "Please select a winner before sending the results."
        );
      }
      const formData = new FormData();
      formData.append("winnerId", selectedWinner);

      if (file1) {
        formData.append("file1", file1);
      }
      if (file2) {
        formData.append("file2", file2);
      }

      const response = await axios.post(
        `http://localhost:8080/api/bets/${userId}/results/${betId}?winnerId=${selectedWinner}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      console.log("Resultados enviados para la apuesta:", betId);
      setResultsSent(true);
      setShowPopup(false);
      setSelectedWinner(null);

      fetchBets();
      setSuccessMessages((prevState) => ({
        ...prevState,
        [betId]: { sendResults: true },
      }));
    } catch (error) {
      console.error("Error sending results:", error);
      setErrorMessage(
        language === "es"
          ? "Error al enviar los resultados. Por favor, inténtalo de nuevo más tarde."
          : "Error sending the results. Please try again later."
      );
    }
  };

  const handleSendResults = async (betId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bets/${betId}`
      );
      setSelectedBet(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error sending results:", error);
      setErrorMessage(
        language === "es"
          ? "Error al enviar los resultados. Por favor, inténtalo de nuevo más tarde."
          : "Error sending the results. Please try again later."
      );
    }
  };

  const handleCancelBet = async (betId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/bets/${window.sessionStorage.getItem(
          "USER_ID"
        )}/delete/${betId}`
      );
      if (response.data) {
        console.log("Apuesta cancelada:", betId);
        fetchBets();
        updateUserBalance();
        setSuccessMessages((prevState) => ({
          ...prevState,
          [betId]: { cancelBet: true },
        }));
        setLeaveBetMessage(
          language === "es"
            ? "Has cancelado la apuesta correctamente."
            : "You have successfully canceled the bet."
        );
      } else {
        setErrorMessage(
          language === "es"
            ? "Hubo un problema al cancelar la apuesta. Por favor, inténtalo de nuevo más tarde."
            : "There was a problem canceling the bet. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error cancelling bet:", error);
      setErrorMessage(
        language === "es"
          ? "Error al cancelar la apuesta. Por favor, inténtalo de nuevo más tarde."
          : "Error canceling the bet. Please try again later."
      );
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
          <h2 className="title">
            {language === "es" ? "Todas tus apuestas" : "All your bets"}
          </h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {bets.length === 0 ? (
            <div className="no-bets-message">
              {language === "es"
                ? "Todavía no participas en ninguna apuesta. ¡Anímate a hacer un depósito y comienza a disfrutar!"
                : "You are not participating in any bets yet. Make a deposit and start enjoying!"
              }
            </div>
          ) : (
            <>
              <div className="filters-container">
                <div className="filters">
                  <span>
                    {language === "es"
                      ? "Filtrar por estado:"
                      : "Filter by status:"}
                  </span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="ALL">
                      {language === "es" ? "Todos" : "All"}
                    </option>
                    <option value="JOINING">
                      {language === "es" ? "Unirse" : "Joining"}
                    </option>
                    <option value="PENDING">
                      {language === "es" ? "Pendiente" : "Pending"}
                    </option>
                    <option value="PENDING_RESULTS">
                      {language === "es" ? "Pendiente" : "Pending"}
                    </option>
                    <option value="VERIFICATION">
                      {language === "es" ? "Verificación" : "Verification"}
                    </option>
                    <option value="FINISH">
                      {language === "es" ? "Finalizado" : "Finished"}
                    </option>
                  </select>
                </div>
              </div>
              <ul className="bet-list">
                {bets.filter(filterBets).map((bet) => (
                  <li
                    key={bet.betId}
                    className="bet-item"
                    onClick={() => handleBetClick(bet.betId)}
                  >
                    <div className="bet-info">
                      <div className="bet-title">
                        <span className="title-prefix">
                          {language === "es"
                            ? "Título de la apuesta: "
                            : "Bet title: "}
                        </span>
                        {bet.title}
                      </div>
                      <div className="bet-details">
                        <p>
                          {language === "es"
                            ? "Creador de la apuesta: "
                            : "Bet creator: "}
                          {bet.creator.userNickname}
                        </p>
                        <p>
                          {language === "es"
                            ? "Fecha de inicio: "
                            : "Start date: "}
                          {new Date(bet.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          {language === "es"
                            ? "Cantidad de la apuesta: "
                            : "Bet amount: "}
                          {bet.betAmount}
                        </p>
                        <p>
                          {language === "es"
                            ? "Número de participantes: "
                            : "Number of participants: "}
                          {bet.participantsNumber}
                        </p>
                        <p>
                          {language === "es" ? "Estado: " : "Status: "}
                          {bet.status}
                        </p>
                        {bet.status === "JOINING" && (
                          <>
                            {bet.creator.userId ===
                            parseInt(
                              window.sessionStorage.getItem("USER_ID")
                            ) ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartBet(
                                      window.sessionStorage.getItem("USER_ID"),
                                      bet.betId
                                    );
                                  }}
                                >
                                  {language === "es"
                                    ? "Comenzar Apuesta"
                                    : "Start Bet"}
                                </button>
                                <button
                                  className="cancel-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelBet(bet.betId);
                                  }}
                                >
                                  {language === "es"
                                    ? "Cancelar Apuesta"
                                    : "Cancel Bet"}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLeaveBet(bet.betId);
                                  }}
                                >
                                  {language === "es"
                                    ? "Salir de la Apuesta"
                                    : "Leave Bet"}
                                </button>
                                <p className="wait-message">
                                  {language === "es"
                                    ? "Espera a que el creador inicie la apuesta"
                                    : "Wait for the creator to start the bet"}
                                </p>
                              </>
                            )}
                          </>
                        )}
                        {bet.status === "PENDING" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendResults(bet.betId);
                              }}
                            >
                              {language === "es"
                                ? "Enviar Resultados"
                                : "Send Results"}
                            </button>
                            {bet.creator.userId ===
                              parseInt(
                                window.sessionStorage.getItem("USER_ID")
                              ) && (
                              <button
                                className="cancel-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelBet(bet.betId);
                                }}
                              >
                                {language === "es"
                                  ? "Cancelar Apuesta"
                                  : "Cancel Bet"}
                              </button>
                            )}
                          </>
                        )}
                        {successMessages[bet.betId] &&
                          successMessages[bet.betId].startBet && (
                            <div className="success-message">
                              {language === "es"
                                ? "¡La apuesta seleccionada se ha iniciado correctamente!"
                                : "The selected bet has been successfully started!"
                              }
                            </div>
                          )}
                        {successMessages[bet.betId] &&
                          successMessages[bet.betId].sendResults && (
                            <div className="success-message">
                              {language === "es"
                                ? "¡Los resultados se han enviado correctamente!"
                                : "Results have been sent successfully!"
                              }
                            </div>
                          )}
                        {leaveBetMessage && (
                          <div className="success-message">
                            {leaveBetMessage}
                          </div>
                        )}
                        {successMessages[bet.betId] &&
                          successMessages[bet.betId].cancelBet && (
                            <div className="success-message">
                              {language === "es"
                                ? "¡Has cancelado la apuesta correctamente!"
                                : "You have successfully canceled the bet!"
                              }
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
                  {language === "es"
                    ? `Página ${currentPage} de ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`
                  }
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
            {language === "es"
              ? "No puedes acceder a esta sección sin iniciar sesión. Para disfrutar de tus apuestas, inicia sesión ahora."
              : "You can't access this section without logging in. Log in now to enjoy your bets."
            }
          </Link>
        </div>
      )}
      {showPopup && selectedBet && (
        <div className="popup" onClick={handlePopupClose}>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles de la Apuesta</h2>
            <p>Título: {selectedBet.title}</p>
            <p>Creador: {selectedBet.creator.nickname}</p>
            <p>
              Fecha de inicio:{" "}
              {new Date(selectedBet.startDate).toLocaleString()}
            </p>
            <p>Cantidad de la apuesta: {selectedBet.betAmount}</p>
            <p>Número de participantes: {selectedBet.participantsNumber}</p>
            <p>Estado: {selectedBet.status}</p>
            <h3>Seleccionar Ganador</h3>
            <ul>
              {selectedBet.participantsList.map((participant) => (
                <li
                  key={participant.userId}
                  id={`player-${participant.userId}`}
                  onClick={() => handleWinnerSelection(participant.userId)}
                >
                  <button>{participant.nickname}</button>
                </li>
              ))}
            </ul>
            <h3>
              Subir Archivos ,ten en cuenta que esto se va a subir a twitter,
              son opcionales puedes no mandarlos
            </h3>
            {selectedBet.creator.userId ===
              parseInt(window.sessionStorage.getItem("USER_ID")) && (
              <>
                <div>
                  <input type="file" onChange={handleFile1Change} />
                </div>
                <div>
                  <input type="file" onChange={handleFile2Change} />
                </div>
              </>
            )}
            <button
              onClick={() => handleConfirmWinner(selectedBet.betId)}
              disabled={!selectedWinner || resultsSent}
            >
              Enviar Resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default IamInBetsPage;
