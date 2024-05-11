import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import "../../css/Login.css";

const Login = ({ setLoggedIn, loggedIn, updateUserBalance, language }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/authenticate",
        credentials
      );
      const { token, userId, nickname, email, surname, name } = response.data;
      window.sessionStorage.setItem("TOKEN", token);
      window.sessionStorage.setItem("USER_ID", userId);
      window.sessionStorage.setItem("NICKNAME", nickname);
      window.sessionStorage.setItem("EMAIL", email);
      window.sessionStorage.setItem("SURNAME", surname);
      window.sessionStorage.setItem("NAME", name);
      setLoggedIn(true);
      updateUserBalance();
    } catch (error) {
      setError(language === 'es' ? "Usuario o contraseña incorrectos" : "Incorrect username or password");
    }
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem("TOKEN");
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <h2 className="login-title">
        {language === 'es' ? 'Inicio de sesión' : 'Login'}{" "}
        <span role="img" aria-label="Greeting">
          👋
        </span>
      </h2>
      <p className="login-description">
        {language === 'es' ? 'Introduce tu cuenta habitual en FriendlyStakes o regístrate si es tu primera vez.' : 'Enter your usual FriendlyStakes account or register if it\'s your first time.'}
      </p>
      <form>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder={language === 'es' ? 'Correo electrónico' : 'Email'}
            value={credentials.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder={language === 'es' ? 'Contraseña' : 'Password'}
            value={credentials.password}
            onChange={handleInputChange}
          />
          <div className="forgot-password">
          <Link to="/forgot-password">{language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}</Link>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="button" onClick={handleLogin}>
          {language === 'es' ? 'Iniciar sesión' : 'Login'}
        </button>
      </form>
      <div className="register-link">
        <p>{language === 'es' ? '¿No tienes una cuenta?' : 'Don\'t have an account?'}</p>
        <Link to="/register">{language === 'es' ? 'Crear cuenta' : 'Create an account'}</Link>
      </div>
    </div>
  );
};

export default Login;
