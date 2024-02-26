import React, { useState } from 'react';
import axios from 'axios';

import "../../css/ForgotPassword.css";
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:8080/auth/forgot-password', { email });
      setSuccessMessage('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      setSuccessMessage('');
      setErrorMessage('Se ha producido un error al solicitar el restablecimiento de contraseña. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div>
      <h2>Solicitud de Restablecimiento de Contraseña</h2>
      <p>Por favor, introduce tu dirección de correo electrónico. Te enviaremos un correo electrónico con instrucciones para restablecer tu contraseña.</p>
      <input type="email" value={email} onChange={handleEmailChange} placeholder="Correo electrónico" />
      <button onClick={handleForgotPassword}>Enviar Solicitud</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
