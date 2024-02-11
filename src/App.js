import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Modal from "react-modal";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import DropdownMenu from "./components/auth/DropdownMenu"; // Importa el componente de lista desplegable
import friendlyImage from "../src/photos/FRIENDLY.jpg";
import userImage from "../src/photos/usuario.png";
import logoutImage from "../src/photos/logout.png"; // Importa el logo de logout
import "./App.css";
import { FiChevronDown } from "react-icons/fi"; 
Modal.setAppElement("#root");

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
    const token = window.sessionStorage.getItem("TOKEN"); // Suponiendo que guardas el token de sesión en sessionStorage
    return !!token; // Devuelve true si hay un token almacenado, de lo contrario, devuelve false
  };

  // Función para cerrar sesión del usuario
  const handleLogout = () => {
    // Aquí debes implementar la lógica para cerrar sesión del usuario
    // Por ejemplo, puedes eliminar el token de sesión de sessionStorage
    window.sessionStorage.clear();
    window.location.href = "/";
    // Después de cerrar sesión, redirige al usuario a la página de inicio de sesión
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <Link to="/">
              <img
                src={friendlyImage}
                className="App-logo"
                alt="logo"
                style={{ width: "145px", height: "auto" }}
              />
            </Link>
            {/* Muestra la sección de Apuestas Personalizadas */}
            {loggedIn && (
              <div className="dropdown-container">
                <DropdownMenu />
              </div>
            )}
          </div>
          <nav>
            <ul className="nav-list">
              {/* Muestra el logo de usuario solo si el usuario está loggeado */}
              {loggedIn && (
                <li className="nav-item">
                  <Link to="/profile">
                    <img
                      src={userImage}
                      className="PersonSVG"
                      alt="Persona"
                      style={{ width: "25px", height: "auto" }}
                    />
                  </Link>
                </li>
              )}
              {/* Muestra el logo de logout solo si el usuario está loggeado */}
              {loggedIn && (
                <li className="nav-item" onClick={handleLogout}>
                  <img
                    src={logoutImage}
                    className="LogoutSVG"
                    alt="Logout"
                    style={{ width: "25px", height: "auto" }}
                  />
                </li>
              )}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/register" element={<Register />} />
          {/* Aquí pasamos loggedIn como una prop al componente Login */}
          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
          />
          <Route
            path="/profile"
            element={loggedIn ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
