import React, { useState, useEffect } from "react";
import "../../css/Roulette.css";

const europeanNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const Roulette = ({ updateUserBalance, language }) => {
  const [position, setPosition] = useState(0);
  const [betAmount, setBetAmount] = useState("");
  const [selectedBet, setSelectedBet] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightedNumber, setHighlightedNumber] = useState(null);
  const [winningNumber, setWinningNumber] = useState(null);
  const [showResult, setShowResult] = useState(false); // Estado para controlar la visualización del resultado
  const [currentBets, setCurrentBets] = useState([]); // Estado para rastrear las apuestas actuales
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(null);
  const userId = window.sessionStorage.getItem("USER_ID");

  useEffect(() => {
    const checkLoggedIn = async () => {
      const userId = window.sessionStorage.getItem("USER_ID");
      if (userId) {
        setIsLoggedIn(true);
        return true;
      } else {
        setIsLoggedIn(false);
        setErrorMessage(
          language === "en"
            ? "You must log in to play."
            : "Debes iniciar sesión para jugar."
        );
        return false;
      }
    };

    checkLoggedIn();
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/balance`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      setShowResult(false);
      let passCounter = 0;
      let counterWinner = 0;
      const spinLogic = async () => {
        setHighlightedNumber(europeanNumbers[passCounter]);
        passCounter = (passCounter + 1) % 37;
        if (europeanNumbers[passCounter] === winningNumber) {
          counterWinner++;
          if (counterWinner === 2) {
            clearInterval(interval); // Detener la ruleta si el número ganador ha pasado dos veces
            setIsSpinning(false);
            const totalBetAmount = currentBets.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );
            try {
              const response = await fetch(
                `http://localhost:8080/api/roulette/place-bet/${userId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    betAmount: totalBetAmount,
                    winnings: calculatePayout(winningNumber),
                  }),
                }
              );
              if (!response.ok) {
                throw new Error(
                  language === "en"
                    ? "Error placing bet"
                    : "Error al realizar la apuesta"
                );
              }
              updateUserBalance(); // Actualizar saldo del usuario después de la partida
              fetchUserBalance(); // Actualizar saldo del usuario después de la partida
              const payout = calculatePayout(winningNumber);
              const newBalance = balance + payout - totalBetAmount;
              setBalance(newBalance);
              setShowResult(true);
              setHighlightedNumber(null); // Borrar número resaltado
            } catch (error) {
              console.error("Error placing bet:", error);
              // Manejar el error, mostrar un mensaje, etc.
            } finally {
              setCurrentBets([]); // Reiniciar las apuestas actuales
            }
          }
        }
      };
      const interval = setInterval(spinLogic, 100);
      return () => clearInterval(interval);
    }
  }, [isSpinning, winningNumber, currentBets, balance]); // Agregar currentBets como dependencia

  const spin = async () => {
    if (currentBets.length === 0) {
      setErrorMessage(
        language === "en"
          ? "Please place a bet before spinning."
          : "Por favor, realiza una apuesta antes de girar."
      );
      return;
    }

    setIsSpinning(true);
    const randomWinningNumber = getRandomNumber();
    setWinningNumber(randomWinningNumber);
  };

  const calculatePayout = (result) => {
    let payout = 0;
    currentBets.forEach((bet) => {
      if (bet.type === "number" && result === bet.value) {
        payout += bet.amount * 35;
      } else if (bet.type === "even" && result !== 0 && result % 2 === 0) {
        payout += bet.amount * 2;
      } else if (bet.type === "odd" && result % 2 !== 0) {
        payout += bet.amount * 2;
      } else if (bet.type === "red" && isRedNumber(result)) {
        payout += bet.amount * 2;
      } else if (bet.type === "black" && isBlackNumber(result)) {
        payout += bet.amount * 2;
      }
    });
    return payout;
  };

  const isRedNumber = (number) => {
    const redNumbers = [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ];
    return redNumbers.includes(number);
  };

  const isBlackNumber = (number) => {
    const blackNumbers = [
      2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
    ];
    return blackNumbers.includes(number);
  };

  const getRandomNumber = () => {
    return europeanNumbers[Math.floor(Math.random() * europeanNumbers.length)];
  };

  const handleBet = async (betType, value) => {
    if (!isLoggedIn) {
      setErrorMessage(
        language === "en"
          ? "You must log in to place bets."
          : "Debes iniciar sesión para realizar apuestas."
      );
      return;
    }

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
      setErrorMessage(
        language === "en"
          ? "Invalid bet amount"
          : "Cantidad de apuesta no válida"
      );
      return;
    }

    const newBet = { type: betType, value, amount: parseInt(betAmount, 10) };
    setCurrentBets([...currentBets, newBet]);
    setBalance(balance - betAmount);
    setBetAmount("");
  };

  const cancelBet = (index) => {
    const updatedBets = [...currentBets];
    const canceledBet = updatedBets.splice(index, 1);
    setBalance(balance + canceledBet[0].amount); // Reembolsar el monto apostado
    setCurrentBets(updatedBets);
  };

  return (
    <div className="roulette-container">
      <div className={`roulette-wheel ${isSpinning ? "spinning" : ""}`}>
        <div
          className="ball"
          style={{ transform: `rotate(${position * (360 / 37)}deg)` }}
        ></div>
        {Array.from({ length: 37 }, (_, index) => {
          let color = "";
          if (index === 0) {
            color = "green";
          } else if (
            (index % 2 === 0 && index <= 10) ||
            (index % 2 !== 0 && index >= 11 && index <= 18) ||
            (index % 2 === 0 && index >= 19 && index <= 28) ||
            (index % 2 !== 0 && index >= 29 && index <= 36)
          ) {
            color = "red";
          } else {
            color = "black";
          }
          return (
            <div
              key={index}
              className={`roulette-number ${
                highlightedNumber === europeanNumbers[index]
                  ? "highlighted"
                  : ""
              } ${
                showResult && winningNumber === europeanNumbers[index]
                  ? "selected"
                  : ""
              }`}
              style={{
                color,
                transform: `rotate(${
                  index * (360 / 37)
                }deg) translate(180px) rotate(${90 - 360 / 37 / 2}deg)`,
              }}
            >
              {europeanNumbers[index]}
            </div>
          );
        })}
      </div>
      <div>
        {language === "en" ? "Total Money" : "Dinero Total"}: {balance}
      </div>

      <button onClick={spin} disabled={isSpinning} className="spin-button">
        {language === "en" ? "Spin" : "Girar"}
      </button>

      {/* Betting Table */}
      <div className="betting-table">
        {europeanNumbers.map((number, index) => (
          <div
            key={index}
            className={`bet-button ${
              number === 0 ? "green" : isRedNumber(number) ? "red" : "black"
            }`}
            onClick={() => handleBet("number", number)}
          >
            {number}
          </div>
        ))}
      </div>

      <div className="betting-options">
        <button onClick={() => handleBet("even", null)}>
          {language === "en" ? "Even" : "Par"}
        </button>
        <button onClick={() => handleBet("odd", null)}>
          {language === "en" ? "Odd" : "Impar"}
        </button>
        <button onClick={() => handleBet("red", null)}>
          {language === "en" ? "Red" : "Rojo"}
        </button>
        <button onClick={() => handleBet("black", null)}>
          {language === "en" ? "Black" : "Negro"}
        </button>
      </div>

      <div className="bet-input">
        <input
          type="number"
          value={betAmount}
          onChange={(e) => {
            setBetAmount(e.target.value);
            setErrorMessage(""); // Limpiar el mensaje de error cuando se cambia el valor
          }}
          placeholder="Enter bet amount"
          min="1"
        />
      </div>

      {showResult && (
        <div className="result">
          {language === "en" ? "The winning number is" : "El número ganador es"}{" "}
          {winningNumber}. {language === "en" ? "You won" : "Ganaste"}{" "}
          {calculatePayout(winningNumber)}{" "}
          {language === "en" ? "chips." : "fichas."}
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div>
        <h3>{language === "en" ? "Current Bets" : "Apuestas Actuales"}</h3>
        <table>
          <thead>
            <tr>
              <th>{language === "en" ? "Bet Type" : "Tipo de Apuesta"}</th>
              <th>{language === "en" ? "Value" : "Valor"}</th>
              <th>{language === "en" ? "Amount" : "Cantidad"}</th>
              <th>{language === "en" ? "Cancel" : "Cancelar"}</th>
            </tr>
          </thead>
          <tbody>
            {currentBets.map((bet, index) => (
              <tr key={index}>
                <td>{bet.type}</td>
                <td>{bet.value !== null ? bet.value : "N/A"}</td>
                <td>{bet.amount}</td>
                <td>
                  <button
                    className="cancel-button"
                    onClick={() => cancelBet(index)}
                  >
                    {language === "en" ? "Cancel" : "Cancelar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roulette;
