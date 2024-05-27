import React, { useState, useEffect } from "react";
import "../../css/Keno.css";

const Keno = ({ updateUserBalance, language }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [hits, setHits] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkLoggedIn = async () => {
      const userId = window.sessionStorage.getItem("USER_ID");
      if (userId) {
        setIsLoggedIn(true);
        return true;
      } else {
        setIsLoggedIn(false);
        setErrorMessage(
          language === "es"
            ? "Debes iniciar sesión para crear una apuesta."
            : "You must log in to place a bet."
        );
        return false;
      }
    };

    checkLoggedIn();
    fetchUserBalance();
  }, [language]);

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
      setUserBalance(data);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const handleNumberSelection = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      if (selectedNumbers.length < 20) {
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        setSelectedNumbers([...selectedNumbers.slice(1), number]);
      }
    }
  };

  const handleBetAmountChange = (event) => {
    setBetAmount(parseInt(event.target.value));
  };

  const placeBet = async () => {
    if (betAmount > 0 && betAmount <= balance) {
      const drawn = drawNumbers();
      const hits = selectedNumbers.filter((number) =>
        drawn.includes(number)
      ).length;
      const winnings = calculateWinnings(hits, betAmount);
      setDrawnNumbers(drawn);
      setHits(hits);
      setUserBalance(balance - betAmount + winnings);
      setErrorMessage("");

      try {
        const userId = window.sessionStorage.getItem("USER_ID");
        const response = await fetch(
          `http://localhost:8080/api/keno/place-bet/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ betAmount, hits, winnings }),
          }
        );
        if (!response.ok) {
          throw new Error(
            language === "es"
              ? "Error al enviar los resultados al backend"
              : "Error sending results to backend"
          );
        }
        updateUserBalance();
      } catch (error) {
        console.error("Error al enviar los resultados al backend:", error);
        setErrorMessage(
          language === "es"
            ? "Error al enviar los resultados al backend"
            : "Error sending results to backend"
        );
      }
    } else {
      setErrorMessage(
        language === "es"
          ? "Ingrese una cantidad de apuesta válida."
          : "Please enter a valid bet amount."
      );
    }
    updateUserBalance();
  };

  const drawNumbers = () => {
    // En el juego real, los números se eligen aleatoriamente, pero aquí simularemos el sorteo
    const numbers = [];
    while (numbers.length < 20) {
      const randomNum = Math.floor(Math.random() * 80) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    return numbers;
  };

  const calculateWinnings = (hits, betAmount) => {
    // Calculamos el multiplicador de ganancias basado en el número de aciertos
    let multiplier = 1;
    if (hits === 0) {
      multiplier = 0;
    } else if (hits <= 3 && hits >= 1) {
      multiplier = 0.4;
    } else if (hits <= 5 && hits > 3) {
      multiplier = 0.8;
    } else if (hits <= 10 && hits >= 6) {
      multiplier = 1.3;
    } else if (hits <= 15 && hits >= 11) {
      multiplier = 1.5;
    } else {
      multiplier = 4;
    }

    // Calculamos las ganancias multiplicando el multiplicador por la cantidad apostada
    const winnings = multiplier * betAmount;

    return winnings;
  };

  return (
    <div className="keno-game">
      <h1>{language === "es" ? "Keno" : "Keno"}</h1>
      <div className="number-selection">
        <h2>
          {language === "es"
            ? "Selecciona tus números (1-80):"
            : "Select your numbers (1-80):"}
        </h2>
        <div className="numbers">
          {[...Array(80).keys()].map((number) => (
            <button
              key={number + 1}
              className={selectedNumbers.includes(number + 1) ? "selected" : ""}
              onClick={() => handleNumberSelection(number + 1)}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
      <div>
        <input
          type="number"
          value={betAmount}
          onChange={handleBetAmountChange}
          placeholder={language === "es" ? "Cantidad de apuesta" : "Bet amount"}
        />
        <button
          onClick={placeBet}
          disabled={!isLoggedIn || selectedNumbers.length !== 20}
        >
          {language === "es" ? "Apostar" : "Bet"}
        </button>
        {isLoggedIn && selectedNumbers.length !== 20 && (
          <div className="error-message">
            {language === "es"
              ? "Debes seleccionar exactamente 20 números."
              : "You must select exactly 20 numbers."}
          </div>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

      </div>
      <div className="drawn-numbers">
        {drawnNumbers.length > 0 && (
          <>
            <h2>
              {language === "es" ? "Números sorteados:" : "Drawn numbers:"}
            </h2>
            <p>{drawnNumbers.join(", ")}</p>
          </>
        )}
        <p>
          {language === "es" ? "Aciertos:" : "Hits:"} {hits}
        </p>
        <p>
          {language === "es" ? "Saldo actual:" : "Current balance:"} $
          {typeof balance === 'number' ? balance.toFixed(2) : "0.00"}
        </p>
      </div>
    </div>
  );
};

export default Keno;
