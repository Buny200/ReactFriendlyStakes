import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPasswordPage = ({ language }) => {
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
      setErrorMessage(language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/auth/change-password?token=${token}`, { email,newPassword,password});
      setSuccessMessage(language === 'es' ? 'Contraseña restablecida con éxito.' : 'Password reset successfully.');
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setErrorMessage(language === 'es' ? 'Error al restablecer la contraseña. Por favor, inténtelo de nuevo.' : 'Error resetting password. Please try again.');
    }
  };

  return (
    <div>
      <h2>{language === 'es' ? 'Restablecer Contraseña' : 'Reset Password'}</h2>
      <form>
        <div>
          <label>{language === 'es' ? 'Correo electrónico:' : 'Email:'}</label>
          <input type="Email" value={email} onChange={handleEmail} />
        </div>
        <div>
          <label>{language === 'es' ? 'Nueva Contraseña:' : 'New Password:'}</label>
          <input type="password" value={newPassword} onChange={handleNewPasswordChange} />
        </div>
        <div>
          <label>{language === 'es' ? 'Confirmar Contraseña:' : 'Confirm Password:'}</label>
          <input type="password" value={password} onChange={handleConfirmPasswordChange} />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="button" onClick={handleResetPassword}>{language === 'es' ? 'Restablecer Contraseña' : 'Reset Password'}</button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
