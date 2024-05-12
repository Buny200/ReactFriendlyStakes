import React, { useState } from 'react';
import axios from 'axios';

import "../../css/ForgotPassword.css";
const ForgotPasswordPage = ({ language }) => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:8080/auth/forgot-password', { email });
      setSuccessMessage(language === 'es' ? 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.' : 'An email with instructions to reset your password has been sent.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      setSuccessMessage('');
      setErrorMessage(language === 'es' ? 'Se ha producido un error al solicitar el restablecimiento de contraseña. Por favor, inténtelo de nuevo más tarde.' : 'An error occurred while requesting password reset. Please try again later.');
    }
  };

  return (
    <div>
      <h2>{language === 'es' ? 'Solicitud de Restablecimiento de Contraseña' : 'Password Reset Request'}</h2>
      <p>{language === 'es' ? 'Por favor, introduce tu dirección de correo electrónico. Te enviaremos un correo electrónico con instrucciones para restablecer tu contraseña.' : 'Please enter your email address. We will send you an email with instructions to reset your password.'}</p>
      <input type="email" value={email} onChange={handleEmailChange} placeholder={language === 'es' ? 'Correo electrónico' : 'Email'} />
      <button onClick={handleForgotPassword}>{language === 'es' ? 'Enviar Solicitud' : 'Submit Request'}</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
