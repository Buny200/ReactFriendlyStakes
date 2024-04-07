import axios from "axios";
import React, { useState, useEffect } from "react";
import whiteCoin from "../../photos/WhiteCoin.jpg";
import redCoin from "../../photos/RedCoin.jpg";
import "../../css/Coinflip.css";

const Coinflip = ({ updateUserBalance }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState(null);
  const [nickname, setNickname] = useState("");
  const [betHistory, setBetHistory] = useState([]);
  const [showCreateBetPopup, setShowCreateBetPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
        setErrorMessage("Debes iniciar sesión para crear una apuesta.");
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
      setSuccessMessage("¡La apuesta se ha creado correctamente!");
      fetchCoinflips();
    } catch (error) {
      console.error("Error al unirse a la apuesta:", error);
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
      console.error("Error fetching user balance:", error);
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
      console.error("Error al obtener el historial de apuestas:", error);
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
      setErrorMessage("Debes seleccionar un lado.");
      return;
    }
    if (!betAmount || isNaN(parseFloat(betAmount)) || parseFloat(betAmount) <= 0) {
      setErrorMessage("Ingresa una cantidad de apuesta válida.");
      return;
    }
    try {
      const betAmountParsed = parseFloat(betAmount);
      if (betAmountParsed <= 0 || betAmountParsed > userBalance) {
        setErrorMessage(
          "La cantidad de la apuesta debe ser mayor que cero y no exceder tu balance actual."
        );
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
      setSuccessMessage("¡La apuesta se ha creado correctamente!");
      fetchCoinflips();
    } catch (error) {
      setErrorMessage("Ooops, algo salió mal. Por favor, inténtalo de nuevo.");
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
        Bienvenido, {isLoggedIn ? nickname : "Desconocido"}
        <button
          className="create-bet-button"
          onClick={handleShowCreateBetPopup}
          disabled={!isLoggedIn}
        >
          Crear Apuesta
        </button>
      </h2>
      <div className="bet-history">
        <h3>Historial de Apuestas</h3>
        <div>
          <label>Filtrar por estado:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="STARTED">Empezados</option>
            <option value="FINISHED">Finalizados</option>
          </select>
          <input
            type="text"
            placeholder="Filtrar por creador"
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por oponente"
            value={opponentFilter}
            onChange={(e) => setOpponentFilter(e.target.value)}
          />
        </div>
        <ul>
          {betHistory.map((coinflip) => (
            <li key={coinflip.coinflipId}>
              <p>Cantidad de Apuesta: {coinflip.coinflipAmount} €</p>
              <p>
                Fecha de Creación:{" "}
                {new Date(coinflip.creationDate).toLocaleDateString()}
              </p>
              <p>
                Creador:{" "}
                {coinflip.creatorId
                  ? coinflip.creatorId.nickname
                  : "Desconocido"}
              </p>
              <p>
                Oponente:{" "}
                {coinflip.opponent
                  ? coinflip.opponent.nickname
                  : (
                      <button onClick={() => handleJoinCoinflip(coinflip.coinflipId)}>
                        Unirse a la partida
                      </button>
                    )
                }
              </p>
              <p>Color elegido por el creador: {coinflip.colorCreator} </p>
              <p>Estado de la apuesta: {coinflip.status} </p>
              <p>Resultado ganador: {" "}
              {coinflip.creatorId
                  ? coinflip.resultWinner
                  : "Desconocido"} </p>

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
      </div>
      {showCreateBetPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Crear Nueva Apuesta</h3>
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
                <label htmlFor="betAmount">Cantidad de apuesta:</label>
                <input
                  type="number"
                  id="betAmount"
                  value={betAmount}
                  onChange={handleBetAmountChange}
                  required
                />
                <button type="submit">Crear Apuesta</button>
              </form>
            )}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <div className="possibility-message">
              <p>Las posibilidades se calculan de la siguiente manera:</p>
              <p>Para el lado rojo, las posibilidades van del 1 al 50.</p>
              <p>Para el lado blanco, las posibilidades van del 51 al 100.</p>
              <p>Siendo las posibilidades equivalentes pero con valores distintos.</p>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowCreateBetPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coinflip;
