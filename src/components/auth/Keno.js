import React, { useState, useEffect } from "react";
import "../../css/Keno.css";

const Keno = ({ updateUserBalance }) => {
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
        setErrorMessage("Debes iniciar sesión para crear una apuesta.");
        return false;
      }
    };
  
    checkLoggedIn();
    fetchUserBalance();
  }, []);
  


  const fetchUserBalance = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/users/${userId}/balance`, {
        method: 'GET'
      });
      const data = await response.json();
      setUserBalance(data);
    } catch (error) {
      console.error('Error fetching user balance:', error);
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
          throw new Error("Error al enviar los resultados al backend");
        }
        updateUserBalance();
      } catch (error) {
        console.error("Error al enviar los resultados al backend:", error);
        setErrorMessage("Error al enviar los resultados al backend");
      }
    } else {
      setErrorMessage("Ingrese una cantidad de apuesta válida.");
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
      <h1>Keno</h1>
      <div className="number-selection">
        <h2>Selecciona tus números (1-80):</h2>
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
          placeholder="Cantidad de apuesta"
        />
        <button
          onClick={placeBet}
          disabled={!isLoggedIn || selectedNumbers.length !== 20}
        >
          Apostar
        </button>
        {selectedNumbers.length !== 20 && (
          <p className="error-message">
            Debes seleccionar exactamente 20 números.
          </p>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="drawn-numbers">
        {drawnNumbers.length > 0 && (
          <>
            <h2>Números sorteados:</h2>
            <p>{drawnNumbers.join(", ")}</p>
          </>
        )}
        <p>Aciertos: {hits}</p>
        <p>Saldo actual: ${balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Keno;
