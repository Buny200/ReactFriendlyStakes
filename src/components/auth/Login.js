import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import '../../css/Login.css';

const Login = ({ setLoggedIn, loggedIn }) => { // Aquí agregamos loggedIn como una prop
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/authenticate', credentials);
      const { token, userId, nickname, email } = response.data; // Assuming the necessary data is returned in response.data
      window.sessionStorage.setItem('TOKEN', token); // Store the token in sessionStorage
      window.sessionStorage.setItem('USER_ID', userId); // Store the userId in sessionStorage
      window.sessionStorage.setItem('NICKNAME', nickname); // Store the nickname in sessionStorage
      window.sessionStorage.setItem('EMAIL', email); // Store the email in sessionStorage
      setLoggedIn(true); // Update the loggedIn state
    } catch (error) {
      console.error(error.response.data.errors[0].detail);
      setError('Usuario o contraseña incorrectos');
    }
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem('TOKEN');
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  // If user is logged in, redirect to a specific route
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Inicio de sesión <span role="img" aria-label="Greeting">👋</span></h2>
      <p className="login-description">Introduce tu cuenta habitual en FriendlyStakes o regístrate si es tu primera vez.</p>
      <form>
        <div className="form-group">
          <input type="email" name="email" placeholder="Correo electrónico" value={credentials.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Contraseña" value={credentials.password} onChange={handleInputChange} />
          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="button" onClick={handleLogin}>Iniciar sesión</button>
      </form>
      <div className="register-link">
        <p>¿No tienes una cuenta?</p>
        <Link to="/register">Crear cuenta</Link>
      </div>
    </div>
  );
};

export default Login;
