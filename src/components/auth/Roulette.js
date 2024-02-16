import React, { useState } from 'react';
import "../../css/Roulette.css";

const Roulette = () => {
  const [position, setPosition] = useState(0);
  const [betAmount, setBetAmount] = useState(0);

  const handleBet = (amount) => {
    setBetAmount(amount);
    // Implementa lógica para realizar apuestas
  };

  const spin = () => {
    const numbers = document.querySelectorAll('.roulette-number');
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const degrees = randomIndex * (360 / numbers.length);

    const wheel = document.querySelector('.roulette-wheel');
    wheel.style.transition = 'transform 5s ease-out';
    wheel.style.transform = `rotate(${3600 + degrees}deg)`; // Hacemos 10 giros completos más para mayor realismo
    
    const ball = document.querySelector('.ball');
    ball.style.transition = 'transform 5s ease-out';
    ball.style.transform = `translateY(-150px) rotate(7200deg)`; // Hacemos 20 giros completos más para mayor realismo

    setTimeout(() => {
      setPosition(numbers[randomIndex].innerText);
      alert(`El número ganador es ${numbers[randomIndex].innerText}`);
    }, 5000);
  };

  return (
    <div className="roulette-container">
      <div className="roulette-wheel">
        {Array.from({ length: 37 }, (_, index) => {
          const color = index === 0 ? 'green' : (index % 2 === 0 ? 'red' : 'black');
          return <div key={index} className="roulette-number" style={{ color }}>{index}</div>;
        })}
        <div className="ball"></div>
      </div>
      <div>Position: {position}</div>
      <div>Bet Amount: {betAmount}</div>
      <button onClick={() => handleBet(10)}>Bet 10</button>
      <button onClick={() => handleBet(20)}>Bet 20</button>
      <button onClick={spin}>Spin</button>
    </div>
  );
};

export default Roulette;
