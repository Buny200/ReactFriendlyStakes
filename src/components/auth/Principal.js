import React from "react";
import { Link } from "react-router-dom";
import kenoImg from "../../photos/Keno.jpg";
import coinflipImg from "../../photos/Coinflip.jpg";
import ruletaImg from "../../photos/Ruleta.jpg";
import BlackjackImg from "../../photos/Blackjack.jpg";
import apuestasImg from "../../photos/Apuestas.jpg";
import '../../css/Principal.css';

const Principal = ({ language }) => {
  return (
    <div>
      <h1>{language === 'es' ? 'Bienvenido a la página de inicio' : 'Welcome to the home page'}</h1>
      <h2>{language === 'es' ? 'Conoce nuestros juegos:' : 'Explore our games:'}</h2>
      <div className="image-links-container">
        <div className="image-link-item">
          <Link to="/traditional-Bets/Keno">
            <img src={kenoImg} alt={language === 'es' ? 'Keno' : 'Keno'} className="image-link" />
            <div className="image-link-text">{language === 'es' ? 'Keno' : 'Keno'}</div>
          </Link>
        </div>
        <div className="image-link-item">
          <Link to="/traditional-Bets/Coinflip">
            <img src={coinflipImg} alt={language === 'es' ? 'Coinflip' : 'Coinflip'} className="image-link" />
            <div className="image-link-text">{language === 'es' ? 'Coinflip' : 'Coinflip'}</div>
          </Link>
        </div>
        <div className="image-link-item">
          <Link to="/traditional-Bets/roulette">
            <img src={ruletaImg} alt={language === 'es' ? 'Ruleta' : 'Roulette'} className="image-link" />
            <div className="image-link-text">{language === 'es' ? 'Ruleta' : 'Roulette'}</div>
          </Link>
        </div>
        <div className="image-link-item">
          <Link to="/traditional-Bets/Blackjack">
            <img src={BlackjackImg} alt={language === 'es' ? 'Blackjack' : 'Blackjack'} className="image-link" />
            <div className="image-link-text">{language === 'es' ? 'Blackjack' : 'Blackjack'}</div>
          </Link>
        </div>
        <div className="image-link-item">
          <Link to="/custom-bets/create">
            <img src={apuestasImg} alt={language === 'es' ? 'Create' : 'Create'} className="image-link" />
            <div className="image-link-text">{language === 'es' ? 'Crear Apuesta' : 'Create Bet'}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Principal;
