import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const getTokenFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = searchParams.get('token');
      setToken(tokenFromUrl);
    };

    getTokenFromUrl();
  }, []);
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    if (newPassword !== password) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/auth/change-password?token=${token}`, { email,newPassword,password});
      setSuccessMessage('Contraseña restablecida con éxito.');
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setErrorMessage('Error al restablecer la contraseña. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form>
      <div>
          <label>Correo electrónico:</label>
          <input type="Email" value={email} onChange={handleEmail} />
        </div>
        <div>
          <label>Nueva Contraseña:</label>
          <input type="password" value={newPassword} onChange={handleNewPasswordChange} />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input type="password" value={password} onChange={handleConfirmPasswordChange} />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="button" onClick={handleResetPassword}>Restablecer Contraseña</button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
