import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/JoinBetPage.css";

const JoinBetForm = ({ updateUserBalance, language }) => {
  const { betId: defaultBetId } = useParams();
  const [betId, setBetId] = useState(defaultBetId ? parseInt(defaultBetId) : "");
  const [betPassword, setBetPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0); // Inicializar a 0
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está loggeado

  useEffect(() => {
    const checkAndFetch = async () => {
      const isLoggedIn = await checkLoggedIn();
      if (isLoggedIn) {
        fetchUserBalance();
      }
    };
  
    checkAndFetch();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/users/${userId}/balance`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(language === 'es' ? 'Error al obtener el saldo del usuario' : 'Error getting user balance');
      }
      const data = await response.json();
      setUserBalance(data);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setError(error.message); // Manejar el error estableciendo el mensaje de error
    }
  };

  const checkLoggedIn = async () => {
    const userId = window.sessionStorage.getItem("USER_ID");
    if (userId) {
      setIsLoggedIn(true);
      return true;
    } else {
      setIsLoggedIn(false);
      setError(language === 'es' ? "Por ahora no puedes acceder a estas funciones de nuestra web. Prueba a registrarte." : "You cannot access these features of our website at the moment. Try registering.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const betDetailsResponse = await axios.get(`http://localhost:8080/api/bets/${betId}`).catch((error) => {
      console.error('Error fetching bet details:', error);
      setError(language === 'es' ? 'Ocurrió un error al obtener los detalles de la apuesta. Por favor, inténtalo de nuevo más tarde.' : 'An error occurred while fetching bet details. Please try again later.');
      return;
    });
  
    if (!betDetailsResponse) return; // Salir de la función si hubo un error al obtener los detalles de la apuesta
  
    const betAmount = betDetailsResponse.data.betAmount;
  
    // Validar que el monto de la apuesta sea mayor que cero y no exceda el saldo del usuario
    if (betAmount <= 0 || betAmount > userBalance) {
      setError(language === 'es' ? "La cantidad de la apuesta debe ser mayor que cero y no exceder tu balance actual." : "The bet amount must be greater than zero and not exceed your current balance.");
      return;
    }
  
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/bets/join/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          betId: betId,
          betPassword: betPassword
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      // Actualizar el balance del usuario después de unirse a la apuesta
      await updateUserBalance();
      setSuccess(true);
      // Redireccionar u ofrecer algún tipo de feedback al usuario
    } catch (error) {
      console.error('Error joining bet:', error);
      setError(language === 'es' ? 'Ocurrió un error al unirse a la apuesta. Por favor, inténtalo de nuevo más tarde.' : 'An error occurred while joining the bet. Please try again later.');
    }
  };
  return (
    <div className="join-bet-form-container">
      <h2>{language === 'es' ? 'Unirse a una Apuesta' : 'Join a Bet'}</h2>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="join-bet-form">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{language === 'es' ? '¡Te has unido a la apuesta exitosamente!' : 'You have successfully joined the bet!'}</p>}
          <label htmlFor="betId">{language === 'es' ? 'ID de la Apuesta:' : 'Bet ID:'}</label>
          <input
            type="number"
            id="betId"
            value={betId}
            onChange={(e) => setBetId(parseInt(e.target.value))}
            required
            disabled={!isLoggedIn} // Deshabilitar la entrada de datos si el usuario no está loggeado
          />
          <label htmlFor="betPassword">{language === 'es' ? 'Contraseña de la Apuesta:' : 'Bet Password:'}</label>
          <input
            type="password"
            id="betPassword"
            value={betPassword}
            onChange={(e) => setBetPassword(e.target.value)}
            required
            disabled={!isLoggedIn} // Deshabilitar la entrada de datos si el usuario no está loggeado
          />
          <button type="submit" disabled={!isLoggedIn}>{language === 'es' ? 'Unirse' : 'Join'}</button> {/* Deshabilitar el botón si el usuario no está loggeado */}
        </form>
      </div>
    </div>
  );
  
};

export default JoinBetForm;
