import axios from "axios";
import React, { useState, useEffect } from "react";
import whiteCoin from "../../photos/WhiteCoin.jpg";
import redCoin from "../../photos/RedCoin.jpg";
import "../../css/Coinflip.css";

const Coinflip = ({ updateUserBalance, language }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState(null);
  const [nickname, setNickname] = useState("");
  const [betHistory, setBetHistory] = useState([]);
  const [showCreateBetPopup, setShowCreateBetPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const betsPerPage = 10;
  const [userBalance, setUserBalance] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [opponentFilter, setOpponentFilter] = useState("");

  useEffect(() => {
    const storedNickname = window.sessionStorage.getItem("NICKNAME");
    setNickname(storedNickname);
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const userId = window.sessionStorage.getItem("USER_ID");
      if (userId) {
        setIsLoggedIn(true);
        return true;
      } else {
        setIsLoggedIn(false);
        setErrorMessage(language === 'es' ? "Debes iniciar sesión para crear una apuesta." : "You must log in to create a bet.");
        return false;
      }
    };

    checkLoggedIn();
    fetchUserBalance();
  }, []);

  useEffect(() => {
    fetchCoinflips();
  }, [currentPage, statusFilter, creatorFilter, opponentFilter]);

  const handleJoinCoinflip = async (coinflipId) => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/coinflip/join/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          coinflipId: coinflipId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      await updateUserBalance();
      setSuccessMessage(language === 'es' ? "¡La apuesta se ha creado correctamente!" : "The bet has been created successfully!");
      fetchCoinflips();
    } catch (error) {
      console.error(language === 'es' ? "Error al unirse a la apuesta:" : "Error joining the bet:", error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/users/${userId}/balance`, {
        method: "GET",
      });
      const data = await response.json();
      setUserBalance(data);
    } catch (error) {
      console.error(language === 'es' ? "Error al obtener el saldo del usuario:" : "Error fetching user balance:", error);
    }
  };

  const fetchCoinflips = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/coinflip/all`);
      let filteredBets = response.data;
      if (statusFilter) {
        filteredBets = filteredBets.filter(bet => bet.status === statusFilter);
      }
      if (creatorFilter) {
        filteredBets = filteredBets.filter(bet => bet.creatorId.nickname === creatorFilter);
      }
      if (opponentFilter) {
        filteredBets = filteredBets.filter(bet => (bet.opponent && bet.opponent.nickname) === opponentFilter);
      }
      setBetHistory(filteredBets);
      const totalBets = filteredBets.length;
      const totalPages = Math.ceil(totalBets / betsPerPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(language === 'es' ? "Error al obtener el historial de apuestas:" : "Error fetching bet history:", error);
    }
  };

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCreateCoinflip = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!selectedSide) {
      setErrorMessage(language === 'es' ? "Debes seleccionar un lado." : "You must select a side.");
      return;
    }
    if (!betAmount || isNaN(parseFloat(betAmount)) || parseFloat(betAmount) <= 0) {
      setErrorMessage(language === 'es' ? "Ingresa una cantidad de apuesta válida." : "Enter a valid bet amount.");
      return;
    }
    try {
      const betAmountParsed = parseFloat(betAmount);
      if (betAmountParsed <= 0 || betAmountParsed > userBalance) {
        setErrorMessage(language === 'es' ? "La cantidad de la apuesta debe ser mayor que cero y no exceder tu balance actual." : "The bet amount must be greater than zero and not exceed your current balance.");
        return;
      }
      const color = selectedSide === "blanco" ? "WHITE" : "RED";
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/coinflip/create/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          creatorId: userId,
          colorCreator: color,
          coinflipAmount: betAmountParsed,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      await updateUserBalance();
      setSuccessMessage(language === 'es' ? "¡La apuesta se ha creado correctamente!" : "The bet has been created successfully!");
      fetchCoinflips();
    } catch (error) {
      setErrorMessage(language === 'es' ? "Ooops, algo salió mal. Por favor, inténtalo de nuevo." : "Oops, something went wrong. Please try again.");
    }
  };

  const handleBetAmountChange = (event) => {
    setBetAmount(event.target.value);
  };

  const handleSideClick = (side) => {
    setSelectedSide(side === selectedSide ? null : side);
  };

  const handleShowCreateBetPopup = () => {
    setShowCreateBetPopup(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="coinflip-container">
      <h2>
        {language === 'es' ? `Bienvenido, ${isLoggedIn ? nickname : "Desconocido"}` : `Welcome, ${isLoggedIn ? nickname : "Unknown"}`}
        <button
          className="create-bet-button"
          onClick={handleShowCreateBetPopup}
          disabled={!isLoggedIn}
        >
          {language === 'es' ? "Crear Apuesta" : "Create Bet"}
        </button>
      </h2>
      <div className="bet-history">
        <h3>{language === 'es' ? "Historial de Apuestas" : "Bet History"}</h3>
        <div>
          <label>{language === 'es' ? "Filtrar por estado:" : "Filter by status:"}</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">{language === 'es' ? "Todos" : "All"}</option>
            <option value="STARTED">{language === 'es' ? "Empezados" : "Started"}</option>
            <option value="FINISHED">{language === 'es' ? "Finalizados" : "Finished"}</option>
          </select>
          <input
            type="text"
            placeholder={language === 'es' ? "Filtrar por creador" : "Filter by creator"}
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder={language === 'es' ? "Filtrar por oponente" : "Filter by opponent"}
            value={opponentFilter}
            onChange={(e) => setOpponentFilter(e.target.value)}
          />
        </div>
        <ul>
          {betHistory.map((coinflip) => (
            <li key={coinflip.coinflipId}>
              <p>{language === 'es' ? `Cantidad de Apuesta: ${coinflip.coinflipAmount} €` : `Bet Amount: ${coinflip.coinflipAmount} €`}</p>
              <p>{language === 'es' ? "Fecha de Creación:" : "Creation Date:"} {new Date(coinflip.creationDate).toLocaleDateString()}</p>
              <p>{language === 'es' ? "Creador:" : "Creator:"} {coinflip.creatorId ? coinflip.creatorId.nickname : language === 'es' ? "Desconocido" : "Unknown"}</p>
              <p>{language === 'es' ? "Oponente:" : "Opponent:"} {coinflip.opponent ? coinflip.opponent.nickname : (
                <button
                  onClick={() => handleJoinCoinflip(coinflip.coinflipId)}
                  disabled={coinflip.creatorId.userId == window.sessionStorage.getItem("USER_ID") ? true : false}
                >
                  {language === 'es' ? "Unirse a la partida" : "Join the game"}
                </button>
              )}</p>
              <p>{language === 'es' ? "Color elegido por el creador:" : "Color chosen by the creator:"} {coinflip.colorCreator}</p>
              <p>{language === 'es' ? "Estado de la apuesta:" : "Bet Status:"} {coinflip.status}</p>
              {coinflip.creatorId && coinflip.resultWinner &&
              <p>{language === 'es' ? "Resultado ganador:" : "Winning result:"} {language === 'es' ? `El ganador ha sido el ${coinflip.resultWinner <= 50 ? "Rojo" : "Blanco"}. Enhorabuena, ${coinflip.colorCreator.toLowerCase() === (coinflip.resultWinner <= 50 ? "red" : "white") ? coinflip.creatorId.nickname : coinflip.opponent.nickname}!!!!`
               : `The winner has been the ${coinflip.resultWinner <= 50 ? "Red" : "White"} side. Congratulations, ${coinflip.colorCreator.toLowerCase() === (coinflip.resultWinner <= 50 ? "red" : "white") ? coinflip.creatorId.nickname : coinflip.opponent.nickname}!!!!`}</p>
              }
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
      </div>
      {showCreateBetPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{language === 'es' ? "Crear Nueva Apuesta" : "Create New Bet"}</h3>
            <div className="coin-buttons">
              <button
                onClick={() => handleSideClick("rojo")}
                className={selectedSide === "rojo" ? "selected" : ""}
              >
                <img src={redCoin} className="redCoin" alt="Rojo" />
              </button>
              <button
                onClick={() => handleSideClick("blanco")}
                className={selectedSide === "blanco" ? "selected" : ""}
              >
                <img src={whiteCoin} className="WhiteCoin" alt="Blanco" />
              </button>
            </div>
            {selectedSide && (
              <form onSubmit={handleCreateCoinflip}>
                <label htmlFor="betAmount">{language === 'es' ? "Cantidad de apuesta:" : "Bet Amount:"}</label>
                <input
                  type="number"
                  id="betAmount"
                  value={betAmount}
                  onChange={handleBetAmountChange}
                  required
                />
                <button type="submit">{language === 'es' ? "Crear Apuesta" : "Create Bet"}</button>
              </form>
            )}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <div className="possibility-message">
              <p>{language === 'es' ? "Las posibilidades se calculan de la siguiente manera:" : "The chances are calculated as follows:"}</p>
              <p>{language === 'es' ? "Para el lado rojo, las posibilidades van del 1 al 50." : "For the red side, the odds range from 1 to 50."}</p>
              <p>{language === 'es' ? "Para el lado blanco, las posibilidades van del 51 al 100." : "For the white side, the odds range from 51 to 100."}</p>
              <p>{language === 'es' ? "Siendo las posibilidades equivalentes pero con valores distintos." : "Being the odds equivalent but with different values."}</p>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowCreateBetPopup(false)}
            >
              {language === 'es' ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coinflip;
