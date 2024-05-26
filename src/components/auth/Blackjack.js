import React, { useState, useEffect } from "react";
import "../../css/Blackjack.css";

const BlackJack = ({ updateUserBalance, language }) => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [playerFinished, setPlayerFinished] = useState(false);
  const [playerStand, setPlayerStand] = useState(false);
  const [betAmount, setBetAmount] = useState(0.5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setUserBalance] = useState(null);
  useEffect(() => {
    if (gameOver) {
      finishGame();
      fetchUserBalance();
    }
  }, [gameOver]);

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
      setUserBalance(data);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const calculateWinnings = (playerHand, dealerHand, betAmount) => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerHand.length === 2 && playerValue === 21) {
      return betAmount * 1.5 + betAmount;
    } else if (playerValue > 21) {
      return 0;
    } else if (dealerValue > 21) {
      return betAmount * 2;
    } else if (playerValue > dealerValue) {
      return betAmount * 2;
    } else if (playerValue === dealerValue) {
      return betAmount;
    } else {
      return 0;
    }
  };

  const finishGame = async () => {
    try {
      if (betAmount > 0 && betAmount <= balance) {
        const userId = window.sessionStorage.getItem("USER_ID");
        const winnings = calculateWinnings(playerHand, dealerHand, betAmount);
        const response = await fetch(
          `http://localhost:8080/api/blackjack/place-bet/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ betAmount, winnings }),
          }
        );
        if (!response.ok) {
          throw new Error(
            language === "en"
              ? "Error sending results to backend"
              : "Error al enviar los resultados al backend"
          );
        }
        updateUserBalance(); // Actualizar el balance después de la partida
      } else {
        setErrorMessage(
          language === "en"
            ? "Enter a valid bet amount."
            : "Ingrese una cantidad de apuesta válida."
        );
      }
    } catch (error) {
      console.error("Error sending results to backend:", error);
      setErrorMessage(
        language === "en"
          ? "Error sending results to backend"
          : "Error al enviar los resultados al backend"
      );
    }
    updateUserBalance();
    fetchUserBalance(); // Actualizar el balance después de la partida
  };

  const startGame = () => {
    if (betAmount <= 0 || betAmount > balance) {
      setErrorMessage(
        language === "en"
          ? "Bet amount must be greater than zero and not exceed your current balance."
          : "La cantidad de la apuesta debe ser mayor que cero y no exceder tu balance actual."
      );
      return;
    }
    fetchUserBalance(); // Actualizar el balance antes de iniciar el juego
    if (gameOver) {
      setMessage("");
      setGameOver(false);
      setPlayerHand([]);
      setDealerHand([]);
      setPlayerFinished(false);
      setPlayerStand(false);
      const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
      const ranks = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
      ];
      const newDeck = [];
      suits.forEach((suit) => {
        ranks.forEach((rank) => {
          newDeck.push({ rank: rank, suit: suit });
        });
      });
      setDeck(newDeck);
      setPlayerHand(() => [dealCard(newDeck), dealCard(newDeck)]);
      setDealerHand(() => [dealCard(newDeck), dealCard(newDeck)]);
    }
  };

  const dealCard = (deck) => {
    const index = Math.floor(Math.random() * deck.length);
    const card = deck[index];
    const newDeck = [...deck.slice(0, index), ...deck.slice(index + 1)];
    setDeck(newDeck);
    return card;
  };

  const hit = () => {
    if (!gameOver && !playerStand && !playerFinished) {
      const newHand = [...playerHand, dealCard(deck)];
      setPlayerHand(newHand);
      if (calculateHandValue(newHand) > 21) {
        setGameOver(true);
        setMessage(
          language === "en"
            ? "You busted! You lost!"
            : "¡Te pasaste de 21! ¡Perdiste!"
        );
      }
    }
  };

  const stand = () => {
    if (!gameOver) {
      let newDealerHand = [...dealerHand];
      while (calculateHandValue(newDealerHand) < 17) {
        newDealerHand = [...newDealerHand, dealCard(deck)];
      }
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(newDealerHand);
      if (
        (dealerValue > 21 && playerValue <= 21) ||
        playerValue > dealerValue
      ) {
        setMessage(language === "en" ? "You won!" : "¡Ganaste!");
      } else if (playerValue === dealerValue) {
        setMessage(language === "en" ? "Draw" : "Empate");
      } else {
        setMessage(language === "en" ? "You lost!" : "¡Perdiste!");
      }
      setPlayerFinished(true);
      setPlayerStand(true);
      resolveDealerHand();
      setDealerHand(newDealerHand);
    }
  };

  const resolveDealerHand = () => {
    setGameOver(true);
  };

  const calculateHandValue = (hand) => {
    let sum = 0;
    let hasAce = false;
    hand.forEach((card) => {
      if (card.rank === "A") {
        hasAce = true;
      }
      sum += getValue(card.rank);
    });
    if (hasAce && sum + 10 <= 21) {
      sum += 10;
    }
    return sum;
  };

  const getValue = (rank) => {
    if (rank === "J" || rank === "Q" || rank === "K") {
      return 10;
    } else if (rank === "A") {
      return 1;
    } else {
      return parseInt(rank);
    }
  };

  const handleBetChange = (event) => {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount) && amount >= 0.5) {
      setBetAmount(amount);
    }
  };

  return (
    <div className="blackjack-container">
      <h1>{language === "en" ? "Blackjack" : "Blackjack"}</h1>
      <div className="compact-input-container">
        <label htmlFor="betAmount">
          {language === "en"
            ? "Bet Amount (Minimum 0.5):"
            : "Cantidad de apuesta (Mínimo 0.5):"}
        </label>
        <input
          type="number"
          id="betAmount"
          name="betAmount"
          min="0.5"
          step="0.5"
          value={betAmount}
          onChange={handleBetChange}
        />
      </div>

      <div className="hands">
        <div className="hand">
          <h2>{language === "en" ? "Player" : "Jugador"}</h2>
          {playerHand.map((card, index) => (
            <div key={index} className="card">
              {card.rank} {card.suit}
            </div>
          ))}
          <div className="message">{message}</div>
          <button
            onClick={hit}
            disabled={gameOver || playerStand || playerFinished}
          >
            {language === "en" ? "Hit" : "Pedir Carta"}
          </button>
          <button
            onClick={stand}
            disabled={gameOver || playerStand || playerFinished}
          >
            {language === "en" ? "Stand" : "Plantarse"}
          </button>
        </div>
        <div className="hand">
          <h2>{language === "en" ? "Dealer" : "Crupier"}</h2>
          {dealerHand.map((card, index) => (
            <div key={index} className="card">
              {card.rank} {card.suit}
            </div>
          ))}
        </div>
      </div>
      {!isLoggedIn && <div className="error-message">{errorMessage}</div>}
      <button
        onClick={startGame}
        disabled={!gameOver || !isLoggedIn || balance < betAmount}
      >
        {language === "en" ? "Start Game" : "Iniciar Juego"}
      </button>
    </div>
  );
};

export default BlackJack;
