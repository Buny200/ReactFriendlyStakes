import React, { useState } from 'react';
import "../../css/Roulette.css";

const europeanNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const Roulette = () => {
  const [position, setPosition] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [winningNumber, setWinningNumber] = useState(null);
  const [totalMoney, setTotalMoney] = useState(1000); // Starting money
  const [selectedBet, setSelectedBet] = useState(null);

  const handleBet = (amount) => {
    setBetAmount(amount);
  };

  const handleBetOption = (option) => {
    setSelectedBet(option);
  };

  const spin = () => {
    const randomIndex = Math.floor(Math.random() * europeanNumbers.length);
    const result = europeanNumbers[randomIndex];
    setWinningNumber(result);
    setPosition(result);

    // Calcular ganancias o pérdidas
    const payout = calculatePayout(result);
    const newTotalMoney = totalMoney + payout - betAmount;
    setTotalMoney(newTotalMoney);

    alert(`El número ganador es ${result}. Ganaste ${payout} fichas.`);
  };

  // Función para calcular el pago según el resultado y la opción de apuesta
  const calculatePayout = (result) => {
    let payout = 0;
    if (selectedBet === 'number' && result === position) {
      payout += betAmount * 35; // Si la apuesta es al número exacto
    } else if (selectedBet === 'even' && result !== 0 && result % 2 === 0) {
      payout += betAmount * 2; // Si la apuesta es par y el número es par
    } else if (selectedBet === 'odd' && result % 2 !== 0) {
      payout += betAmount * 2; // Si la apuesta es impar y el número es impar
    } else if (selectedBet === 'red' && isRedNumber(result)) {
      payout += betAmount * 2; // Si la apuesta es rojo y el número es rojo
    } else if (selectedBet === 'black' && isBlackNumber(result)) {
      payout += betAmount * 2; // Si la apuesta es negro y el número es negro
    }
    return payout;
  };

  // Función para determinar si un número es rojo
  const isRedNumber = (number) => {
    return (number !== 0 && number <= 10) || (number >= 19 && number <= 28);
  };

  // Función para determinar si un número es negro
  const isBlackNumber = (number) => {
    return number !== 0 && !isRedNumber(number);
  };

  return (
    <div className="roulette-container">
      <div className="roulette-wheel">
        <div className="ball" style={{ transform: `rotate(${position * (360 / 37)}deg)` }}></div>
        {Array.from({ length: 37 }, (_, index) => {
          let color = '';
          if (index === 0) {
            color = 'green';
          } else if ((index % 2 === 0 && index <= 10) || (index % 2 !== 0 && index >= 11 && index <= 18) || (index % 2 === 0 && index >= 19 && index <= 28) || (index % 2 !== 0 && index >= 29 && index <= 36)) {
            color = 'red';
          } else {
            color = 'black';
          }
          return (
            <div
              key={index}
              className="roulette-number"
              style={{
                color,
                transform: `rotate(${index * (360 / 37)}deg) translate(180px) rotate(${90 - (360 / 37) / 2}deg)`
              }}
            >
              {europeanNumbers[index]}
            </div>
          );
        })}
      </div>
      <div>Total Money: {totalMoney}</div>
      <div>
        <button onClick={() => handleBetOption('number')}>Bet on Number</button>
        <button onClick={() => handleBetOption('even')}>Bet on Even</button>
        <button onClick={() => handleBetOption('odd')}>Bet on Odd</button>
        <button onClick={() => handleBetOption('red')}>Bet on Red</button>
        <button onClick={() => handleBetOption('black')}>Bet on Black</button>
      </div>
      <div>Bet Amount: {betAmount}</div>

      <button onClick={spin}>Spin</button>
    </div>
  );
};

export default Roulette;
