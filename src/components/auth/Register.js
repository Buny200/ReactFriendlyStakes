import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../css/Register.css';

const Register = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    surname: '',
    dni: '',
    nickname: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidDNI = (dni) => {
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    return dniRegex.test(dni);
  };

  const handleRegister = async () => {
    setErrorMessage('');
    if (!isValidDNI(formData.dni)) {
      setErrorMessage(language === 'es' ? 'DNI no válido. Debe tener 8 dígitos seguidos de una letra.' : 'Invalid DNI. It should have 8 digits followed by a letter.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/auth/register', formData);
      console.log(response.data);
      setSuccessMessage(language === 'es' ? 'Te hemos enviado un correo electrónico para verificar tu cuenta.' : 'We have sent you an email to verify your account.');
    } catch (error) {
      console.error(error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/forgot-password', { email: forgotPasswordEmail });
      console.log(response.data);
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="register-container">
      <h2>{language === 'es' ? 'Crea tu cuenta FriendlyStakes' : 'Create your FriendlyStakes account'}</h2>
      <form className="register-form">
        <div className="form-group">
          <label htmlFor="name">{language === 'es' ? 'Nombre' : 'Name'}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">{language === 'es' ? 'Correo Electrónico' : 'Email'}</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">{language === 'es' ? 'Contraseña' : 'Password'}</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">{language === 'es' ? 'Fecha de Nacimiento' : 'Date of Birth'}</label>
          <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="surname">{language === 'es' ? 'Apellido' : 'Surname'}</label>
          <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="dni">DNI</label>
          <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="nickname">{language === 'es' ? 'Nickname' : 'Nickname'}</label>
          <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleInputChange} />
        </div>
        <button type="button" onClick={handleRegister}>{language === 'es' ? 'Registrarse' : 'Register'}</button>
        <button type="button" onClick={handleForgotPassword}>{language === 'es' ? 'Olvidé mi contraseña' : 'Forgot my password'}</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
      <Link to="/login" className="login-link">{language === 'es' ? '¿Ya tienes una cuenta? Inicia sesión' : 'Already have an account? Log in'}</Link>
    </div>
  );
};

export default Register;
