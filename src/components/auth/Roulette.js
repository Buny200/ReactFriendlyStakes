import React, { useState, useEffect } from 'react';
import "../../css/Roulette.css";

const europeanNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const Roulette = () => {
  const [position, setPosition] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [totalMoney, setTotalMoney] = useState(1000); // Starting money
  const [selectedBet, setSelectedBet] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedNumber, setHighlightedNumber] = useState(null);
  const [winningNumber, setWinningNumber] = useState(null);
  const [showResult, setShowResult] = useState(false); // State to control showing the result

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      setShowResult(false);
      let passCounter = 0; 
      let counterWinner = 0; 
      const interval = setInterval(() => {
        setHighlightedNumber(europeanNumbers[passCounter]);
        if(passCounter===37){
          passCounter=0;
        }
        if (europeanNumbers[passCounter] === winningNumber) {
          counterWinner++;
          passCounter++;
          if (counterWinner === 2) { 
            clearInterval(interval); // Stop the roulette if the winning number has passed twice
            setIsSpinning(false);
            const payout = calculatePayout(winningNumber);
            const newTotalMoney = totalMoney + payout - betAmount;
            setTotalMoney(newTotalMoney);
            setShowResult(true);
          }
        } else {
          passCounter++;
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpinning, winningNumber, totalMoney, betAmount]);

  const spin = () => {
    setIsSpinning(true);
    let passCounter = 0; 
    const randomWinningNumber = getRandomNumber();
    setWinningNumber(randomWinningNumber); 
    const interval = setInterval(() => {
      setHighlightedNumber(europeanNumbers[passCounter]);
      if (randomWinningNumber !== null && europeanNumbers[passCounter] === randomWinningNumber) {
        passCounter++;
        if (passCounter === 2) {
          clearInterval(interval); 
          setIsSpinning(false);
          const payout = calculatePayout(randomWinningNumber);
          const newTotalMoney = totalMoney + payout - betAmount;
          setTotalMoney(newTotalMoney);
          setShowResult(true);
        }
      } else {
        passCounter++;
      }
    }, 100);
  };

  const calculatePayout = (result) => {
    let payout = 0;
    if (selectedBet === 'number' && result === position) {
      payout += betAmount * 35; 
    } else if (selectedBet === 'even' && result !== 0 && result % 2 === 0) {
      payout += betAmount * 2; 
    } else if (selectedBet === 'odd' && result % 2 !== 0) {
      payout += betAmount * 2; 
    } else if (selectedBet === 'red' && isRedNumber(result)) {
      payout += betAmount * 2; 
    } else if (selectedBet === 'black' && isBlackNumber(result)) {
      payout += betAmount * 2; 
    }
    return payout;
  };

  const isRedNumber = (number) => {
    return (number !== 0 && number <= 10) || (number >= 19 && number <= 28);
  };

  const isBlackNumber = (number) => {
    return number !== 0 && !isRedNumber(number);
  };

  const getRandomNumber = () => {
    return europeanNumbers[Math.floor(Math.random() * europeanNumbers.length)];
  };

  return (
    <div className="roulette-container">
      <div className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}>
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
              className={`roulette-number ${highlightedNumber === europeanNumbers[index] ? 'highlighted' : ''} ${showResult && winningNumber === europeanNumbers[index] ? 'selected' : ''}`}
              style={{
                color,
                transform: `rotate(${index * (360 / 37)}deg) translate(180px) rotate(${90 - (360 / 37) / 2}deg)`,
              }}
            >
              {europeanNumbers[index]}
            </div>
          );
        })}
      </div>
      <div>Total Money: {totalMoney}</div>

      <button onClick={spin} disabled={isSpinning}>Spin</button>
      
      {/* Show the result only when showResult is true */}
      {showResult && <div>El número ganador es {winningNumber}. Ganaste {calculatePayout(winningNumber)} fichas.</div>}
    </div>
  );
};

export default Roulette;
