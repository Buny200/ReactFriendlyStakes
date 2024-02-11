// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import friendlyImage from '../src/photos/FRIENDLY.jpg';
import userImage from '../src/photos/usuario.png';
import './App.css';

Modal.setAppElement('#root');

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado

  // Función para verificar si el usuario está logueado al cargar la aplicación
  useEffect(() => {
    // Aquí puedes agregar tu lógica para verificar si el usuario está logueado, por ejemplo, comprobar si hay un token de sesión almacenado
    const userIsLoggedIn = checkIfUserIsLoggedIn(); // Función para comprobar si el usuario está logueado (debes implementarla)
    setLoggedIn(userIsLoggedIn);
  }, []);

  // Función para comprobar si el usuario está logueado (debes implementarla según la lógica de tu aplicación)
  const checkIfUserIsLoggedIn = () => {
    // Aquí puedes implementar tu lógica para verificar si el usuario está logueado
    // Por ejemplo, puedes comprobar si hay un token de sesión almacenado en sessionStorage
    const token = window.sessionStorage.getItem('TOKEN'); // Suponiendo que guardas el token de sesión en sessionStorage
    return !!token; // Devuelve true si hay un token almacenado, de lo contrario, devuelve false
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="App-logo-container">
            <Link to="/">
              <img src={friendlyImage} className="App-logo" alt="logo" style={{ width: '145px', height: 'auto' }} />
            </Link>
          </div>
          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to={loggedIn ? "/profile" : "/login"}>
                  <img src={userImage} className="PersonSVG" alt="Persona" style={{ width: '23px', height: 'auto' }} />
                </Link>
                <span className="nav-link-text"></span>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/register" element={<Register />} />
          {/* Aquí pasamos loggedIn como una prop al componente Login */}
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />} />
          <Route path="/profile" element={loggedIn ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
