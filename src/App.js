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
import TraditionalBets from "./components/auth/TraditionalBets";
import AllBetsPage from "./components/auth/AllBetsPage.js";
import MyBetsPage from "./components/auth/MyBetsPage.js";
import IamInBetsPage from "./components/auth/IamInPage.js";
import JoinBetPage from "./components/auth/JoinBetPage.js";
import Leaderboards from "./components/auth/Leaderboards.js";
import QuestionsAnswers from "./components/auth/QuestionsAnswers.js";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage.js";
import ResetPasswordPage from "./components/auth/ResetPasswordPage.js";
import DepositPage from "./components/auth/Deposito.js";
import PaymentSuccess from "./components/auth/PaymentSuccess.js";
import PaymentError from "./components/auth/PaymentError.js";
import friendlyImage from "../src/photos/FRIENDLY.jpg";
import userImage from "../src/photos/usuario.png";
import logoutImage from "../src/photos/logout.png";
import spainFlag from "../src/photos/spain-flag.png";
import ukFlag from "../src/photos/uk-flag.png";
import CreateBetPage from "./components/auth/CreateBetPage.js";
import Roulette from "./components/auth/Roulette";
import Coinflip from "./components/auth/Coinflip.js";
import Blackjack from "./components/auth/Blackjack.js";
import ChatGlobal from "./components/auth/ChatGlobal.js";
import AssistanceChat from "./components/auth/AssistanceChat.js";
import Keno from "./components/auth/Keno.js";
import "./App.css";
import { LanguageProvider } from "./components/auth/LanguageContext.js";
Modal.setAppElement("#root");

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [language, setLanguage] = useState("en"); // Default language is English

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
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/balance`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setUserBalance(data);
    } catch (error) {
      console.error("Error fetching user balance:", error);
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
    fetchUserBalance();
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <Router>
      <LanguageProvider>
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
              <div className="language-selector">
                <button
                  className={`flag-button ${language === "es" ? "active" : ""}`}
                  onClick={() => changeLanguage("es")}
                >
                  <img src={spainFlag} alt="Spain Flag" className="flag-icon" />
                </button>
                <button
                  className={`flag-button ${language === "en" ? "active" : ""}`}
                  onClick={() => changeLanguage("en")}
                >
                  <img src={ukFlag} alt="UK Flag" className="flag-icon" />
                </button>
              </div>
              {
                <div className="dropdown-container">
                  <DropdownMenu language={language} />
                </div>
              }
              {
                <div className="dropdown-container-traditional">
                  <TraditionalBets language={language} />
                </div>
              }
              {
                <div className="leaderboards">
                  <Link to="/leaderboards">
                    <button className="nav-item-button">
                      {language === "es" ? "Clasificaciones" : "Leaderboards"}
                    </button>
                  </Link>
                </div>
              }
              {
                <div className="questions">
                  <Link to="/questionsAnswers">
                    <button className="nav-item-button">
                      {language === "es"
                        ? "Preguntas y Respuestas"
                        : "Questions Answers"}
                    </button>
                  </Link>
                </div>
              }
            </div>
            <nav>
              <ul className="nav-list">
                {
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
                }
                {loggedIn && (
                  <li className="nav-item balance-item">
                    💲 Balance: {userBalance}
                  </li>
                )}
                {
                  <li className="nav-item" onClick={handleLogout}>
                    <img
                      src={logoutImage}
                      className="LogoutSVG"
                      alt="Logout"
                      style={{ width: "25px", height: "auto" }}
                    />
                  </li>
                }
              </ul>
            </nav>
          </header>
          <div className="content-container">
            <div className="background-image"></div>
            <div className="content">
              <Routes>
                <Route
                  path="/register"
                  element={<Register language={language} />}
                />
                <Route
                  path="/login"
                  element={
                    <Login
                      setLoggedIn={setLoggedIn}
                      loggedIn={loggedIn}
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    loggedIn ? (
                      <Profile />
                    ) : (
                      <Navigate to="/login" language={language} />
                    )
                  }
                />
                {/* Agrega la ruta para la creación de apuestas */}
                <Route
                  path="/custom-bets/create"
                  element={
                    <CreateBetPage
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/custom-bets/all"
                  element={<AllBetsPage />}
                  language={language}
                />
                <Route
                  path="/custom-bets/created-by-me"
                  element={
                    <MyBetsPage
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/custom-bets/in"
                  element={
                    <IamInBetsPage
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/custom-bets/join"
                  element={
                    <JoinBetPage
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/reset-password"
                  element={<ResetPasswordPage language={language} />}
                />
                <Route
                  path="/deposito"
                  element={<DepositPage language={language} />}
                />
                <Route
                  path="/PaymentSuccess"
                  element={<PaymentSuccess language={language} />}
                />
                <Route
                  path="/PaymentError"
                  element={<PaymentError language={language} />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage language={language} />}
                />
                <Route
                  path="/questionsAnswers"
                  element={<QuestionsAnswers language={language} />}
                />
                <Route
                  path="/leaderboards"
                  element={<Leaderboards language={language} />}
                />
                <Route
                  path="/traditional-Bets/Keno"
                  element={
                    <Keno
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/traditional-Bets/roulette"
                  element={
                    <Roulette
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/traditional-Bets/Coinflip"
                  element={
                    <Coinflip
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
                <Route
                  path="/traditional-Bets/Blackjack"
                  element={
                    <Blackjack
                      updateUserBalance={updateUserBalance}
                      language={language}
                    />
                  }
                />
              </Routes>
            </div>
            <ChatGlobal />
            <AssistanceChat />
          </div>
        </div>
      </LanguageProvider>
    </Router>
  );
}

export default App;
