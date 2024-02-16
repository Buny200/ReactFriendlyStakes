import React, { useState, useEffect } from "react";
import "../../css/CreateBetPage.css";
{/* aqui tendras que habilitar el tipo texto en vez de numerico  */}
const CreateBetForm = ({ updateUserBalance }) => {
  const [formData, setFormData] = useState({
    title: "",
    betAmount: "0.00",
    betPassword: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userBalance, setUserBalance] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está loggeado

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validar la entrada del usuario para permitir solo valores numéricos y decimales
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({
        ...formData,
        [name]: value
      });
      setErrorMessage(""); // Limpiar el mensaje de error cuando el usuario comienza a escribir nuevamente
    } else {
      setErrorMessage("Por favor, introduce un valor numérico válido.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const betAmount = parseFloat(formData.betAmount);
    if (betAmount <= 0 || betAmount > userBalance) {
      setErrorMessage("La cantidad de la apuesta debe ser mayor que cero y no exceder tu balance actual.");
      return;
    }
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/users/${userId}/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, userId}),
      });
      const data = await response.json();
      console.log("Apuesta creada:", data);
      setSuccessMessage("¡La apuesta se ha creado correctamente!");
      setFormData({
        title: "",
        betAmount: "0.00",
        betPassword: ""
      });
      // Actualizar el balance del usuario después de crear la apuesta
      updateUserBalance();
    } catch (error) {
      console.error("Error al crear la apuesta:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Crear Apuesta</h1>
      { errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required disabled={!isLoggedIn} />
        </div>
        
        <div className="form-group">
          <label htmlFor="betAmount">Cantidad de Apuesta:</label>
          <input type="text" id="betAmount" name="betAmount" value={formData.betAmount} onChange={handleChange} required disabled={!isLoggedIn} />
        </div>
        
        <div className="form-group">
          <label htmlFor="betPassword">Contraseña de la Apuesta:</label>
          <input type="password" id="betPassword" name="betPassword" value={formData.betPassword} onChange={handleChange} required disabled={!isLoggedIn} />
        </div>
        
        <button type="submit" className="submit-button" disabled={!isLoggedIn}>Crea tu Apuesta</button>
      </form>
      {/* Mostrar el mensaje de éxito si existe */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default CreateBetForm;
