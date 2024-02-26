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
import DropdownMenu from "./components/auth/DropdownMenu";
import AllBetsPage from "./components/auth/AllBetsPage.js";
import MyBetsPage from "./components/auth/MyBetsPage.js";
import JoinBetPage from "./components/auth/JoinBetPage.js";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage.js";
import ResetPasswordPage from "./components/auth/ResetPasswordPage.js";
import friendlyImage from "../src/photos/FRIENDLY.jpg";
import userImage from "../src/photos/usuario.png";
import logoutImage from "../src/photos/logout.png";
import CreateBetPage from "./components/auth/CreateBetPage.js"; // Importa el componente CreateBetForm
import Roulette from "./components/auth/Roulette"; // Importa el componente Roulette
import "./App.css";
Modal.setAppElement("#root");

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    const userIsLoggedIn = checkIfUserIsLoggedIn();
    setLoggedIn(userIsLoggedIn);

    if (userIsLoggedIn) {
      fetchUserBalance();
    }
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

  const checkIfUserIsLoggedIn = () => {
    const token = window.sessionStorage.getItem("TOKEN");
    return !!token;
  };

  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.href = "/";
    setLoggedIn(false);
  };

  const updateUserBalance = async () => {
    await fetchUserBalance();
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
            {(
              <div className="dropdown-container">
                <DropdownMenu />
              </div>
            )}
          </div>
          <nav>
            <ul className="nav-list">
              {(
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
              {loggedIn && (
                <li className="nav-item balance-item">
                  💲 Balance: {userBalance}
                </li>
              )}
              {(
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
        <div className="content-container">
          <div className="background-image"></div>
          <div className="content">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route
                path="/login"
                element={<Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} updateUserBalance={updateUserBalance} />}
                />
              <Route
                path="/profile"
                element={loggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              {/* Agrega la ruta para la creación de apuestas */}
              <Route
                path="/custom-bets/create"
                element={<CreateBetPage updateUserBalance={updateUserBalance} />}
              />
              <Route path="/custom-bets/all" element={<AllBetsPage />} /> 
              <Route path="/custom-bets/created-by-me" element={<MyBetsPage updateUserBalance={updateUserBalance} />} /> 
              <Route path="/custom-bets/join" element={<JoinBetPage updateUserBalance={updateUserBalance} />} /> 
              <Route path="/reset-password" element={<ResetPasswordPage />} /> 
              <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
              <Route path="/roulette" element={<Roulette />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
