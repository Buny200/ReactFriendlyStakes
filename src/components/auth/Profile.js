import React, { useState, useEffect } from "react";
import "../../css/Profile.css";
import BetHistoryPopup from "../auth/BetHistoryPopup";
import TransactionHistoryPopup from "../auth/TransactionHistoryPopup";
import { Link } from "react-router-dom";

const Profile = ({ language }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [nickname, setNickname] = useState("");
  const [betHistory, setBetHistory] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [handleInfoForVerificationCalled, setHandleInfoForVerificationCalled] =
    useState(false);

  const [showBetHistoryPopup, setShowBetHistoryPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [exclusionData, setExclusionData] = useState({
    exclusionDate: "",
  });
  const [documentFront, setDocumentFront] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [showTransactionHistoryPopup, setShowTransactionHistoryPopup] =
    useState(false);
  const [transactionHistory, setTransactionHistory] = useState(null);

  const handleTransactionHistoryClick = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(
        `http://localhost:8080/api/transactions/user/${userId}`
      );
      if (response.ok) {
        const historyData = await response.json();
        setTransactionHistory(historyData);
        setShowTransactionHistoryPopup(true);
      } else {
        console.error(
          "Error al obtener el historial de transacciones del usuario"
        );
      }
    } catch (error) {
      console.error(
        "Error al obtener el historial de transacciones del usuario:",
        error
      );
    }
  };
  const handleConfirmDisableChange = (event) => {
    setConfirmDisable(event.target.checked);
  };

  useEffect(() => {
    if (showSettingsPopup) {
      setSelectedSection("exclude");
    }
  }, [showSettingsPopup]);

  useEffect(() => {
    const storedNickname = window.sessionStorage.getItem("NICKNAME");
    setNickname(storedNickname);
  }, []);
  useEffect(() => {
    if (!handleInfoForVerificationCalled) {
      setHandleInfoForVerification();
      setHandleInfoForVerificationCalled(true);
    }
  }, []);
  useEffect(() => {
    const fetchBetHistory = async () => {
      try {
        const userId = window.sessionStorage.getItem("USER_ID");
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/bets`
        );
        if (response.ok) {
          const historyData = await response.json();
          setBetHistory(historyData);
        } else {
          console.error(
            "Error al obtener el historial de apuestas del usuario"
          );
        }
      } catch (error) {
        console.error(
          "Error al obtener el historial de apuestas del usuario:",
          error
        );
      }
    };
    fetchBetHistory();
  }, []);

  const handleExclusionDateChange = (event) => {
    setExclusionData({
      ...exclusionData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExcludeUser = async (event) => {
    event.preventDefault();
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(
        `http://localhost:8080/api/users/excludeTime/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exclusionDate: exclusionData.exclusionDate,
          }),
        }
      );
      if (response.ok) {
        alert("Tu cuenta ha sido EXCLUIDA exitosamente.");
        console.log("Usuario excluido exitosamente");
        window.sessionStorage.clear();
        window.location.href = "/";
      } else {
        console.error("Error al excluir al usuario:", response.statusText);
        alert(
          "Hubo un error al excluir tu cuenta. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } catch (error) {
      console.error("Error al excluir al usuario:", error);
    }
  };

  const handleDisableAccount = async (event) => {
    event.preventDefault();
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(
        `http://localhost:8080/api/users/disable/${userId}`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        alert("Tu cuenta ha sido deshabilitada exitosamente.");
        console.log("Cuenta deshabilitada exitosamente");
        window.sessionStorage.clear();
        window.location.href = "/";
      } else {
        console.error("Error al deshabilitar la cuenta:", response.statusText);
        alert(
          "Hubo un error al deshabilitar tu cuenta. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } catch (error) {
      console.error("Error al deshabilitar la cuenta:", error);
    }
  };

  const handleUserInfoClick = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        setSelectedSection("personal");
        setShowPopup(true);
      } else {
        console.error("Error al obtener la información del usuario");
      }
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };

  const setHandleInfoForVerification = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        console.error("Error al obtener la información del usuario");
      }
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };
  const handleChangePasswordClick = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await fetch(
        `http://localhost:8080/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: changePasswordData.email,
            password: changePasswordData.currentPassword,
            newPassword: changePasswordData.newPassword,
            userId: userId,
          }),
        }
      );

      if (response.ok) {
        console.log("Contraseña cambiada exitosamente");
      } else {
        console.error("Error al cambiar la contraseña:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordData({
      ...changePasswordData,
      [name]: value,
    });
  };

  const handleVerifyAccount = async () => {
    try {
      const userId = window.sessionStorage.getItem("USER_ID");
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("documentFront", documentFront);
      formData.append("documentBack", documentBack);
      const response = await fetch(
        "http://localhost:8080/api/verification/submit",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const message = await response.text();
        console.log(message);
      } else {
        console.error("Error al verificar la cuenta:", response.statusText);
      }
    } catch (error) {
      console.error("Error al verificar la cuenta:", error);
    }
  };
  const handleDocumentFrontChange = (e) => {
    setDocumentFront(e.target.files[0]);
  };

  const handleDocumentBackChange = (e) => {
    setDocumentBack(e.target.files[0]);
  };

  const renderUserInfo = () => {
    if (!userInfo) return null;

    if (selectedSection === "personal") {
      return (
        <div className="personal-info">
          <h3 className="section-title">
            {language === "es"
              ? "Información Personal"
              : "Personal Information"}
          </h3>
          <table>
            <tbody>
              <tr>
              <td>{language === "es" ? "Email:" : "Email:"}</td>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
              <td>{language === "es" ? "Nombre:" : "Name:"}</td>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
              <td>{language === "es" ? "Apellido:" : "Surname:"}</td>
                <td>{userInfo.surname}</td>
              </tr>
              <tr>
              <td>{language === "es" ? "Dni:" : "ID number:"}</td>
                <td>{userInfo.dni}</td>
              </tr>
              <tr>
                <td>{language === "es" ? "Contraseña:" : "Password:"}</td>
                <td>******</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (selectedSection === "account") {
      return (
        <div className="account-info">
          <h3 className="section-title">
            {language === "es"
              ? "Información de Cuenta"
              : "Account Information"}
          </h3>
          <table>
            <tbody>
              {userInfo && (
                <>
                  <tr>
                    <td>{language === "es" ? "Verificado:" : "Verified:"}</td>
                    <td>{userInfo.verified ? "Sí" : "No"}</td>
                  </tr>
                  <tr>
                    <td>
                      {language === "es" ? "Total Apostado:" : "Total Wagered:"}
                    </td>
                    <td>{userInfo.wagered}</td>
                  </tr>
                  <tr>
                    <td>
                      {language === "es"
                        ? "Ganancias o Pérdidas:"
                        : "Earnings or Losses:"}
                    </td>
                    <td>{userInfo.earningsLosses}</td>
                  </tr>
                  <tr>
                    <td>
                      {language === "es"
                        ? "Fecha de Creación:"
                        : "Creation Date:"}
                    </td>
                    <td>{userInfo.createdAt}</td>
                  </tr>
                  <tr>
                    <td>{language === "es" ? "Excluído:" : "Excluded:"}</td>
                    <td>{userInfo.excluded ? "Sí" : "No"}</td>
                  </tr>
                  {userInfo.excluded && (
                    <tr>
                      <td>
                        {language === "es"
                          ? "Fecha de Exclusión:"
                          : "Exclusion Date:"}
                      </td>
                      <td>{userInfo.exclusionDate}</td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      {language === "es"
                        ? "Cuenta Habilitada:"
                        : "Account Enabled:"}
                    </td>
                    <td>{userInfo.enabled ? "Sí" : "No"}</td>
                  </tr>
                  <tr>
                    <td>{language === "es" ? "Saldo:" : "Balance:"}</td>
                    <td>{userInfo.balance}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      );
    } else if (selectedSection === "password") {
      return (
        <div className="password-change-form">
          <form onSubmit={handleChangePasswordClick}>
            <label htmlFor="email">
              {language === "es" ? "Correo:" : "Email:"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={changePasswordData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="currentPassword">
              {language === "es" ? "Contraseña Actual:" : "Current Password:"}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={changePasswordData.currentPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="newPassword">
              {language === "es" ? "Nueva Contraseña:" : "New Password:"}
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={changePasswordData.newPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">
              {language === "es" ? "Cambiar Contraseña" : "Change Password"}
            </button>
          </form>
        </div>
      );
    }
  };

  return (
    <div className="profile-container">
      <h2>
        {language === "es" ? `Perfil de ${nickname}` : `Profile of ${nickname}`}
      </h2>
      <div className="profile-grid">
        <div className="profile-section" onClick={handleUserInfoClick}>
          <div className="section-wrapper">
            <h3 className="section-title">
              {language === "es"
                ? "Información Personal"
                : "Personal Information"}
            </h3>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={() => setShowBetHistoryPopup(true)}
          >
            <h3 className="section-title">
              {language === "es" ? "Historial de Apuestas" : "Bet History"}
            </h3>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={() => {
              setSelectedSection("verify-account");
              setHandleInfoForVerification(true);
              setShowVerificationPopup(true);
            }}
          >
            <h3 className="section-title">
              {language === "es" ? "Verificar Cuenta" : "Verify Account"}
            </h3>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={() => setShowSettingsPopup(true)}
          >
            <h3 className="section-title">
              {language === "es"
                ? "Modificar Ajustes de Cuenta"
                : "Modify Account Settings"}
            </h3>
          </div>
        </div>
        <div className="profile-section">
          <div className="section-wrapper">
            <Link to="/deposito">
              <h3 className="section-title">
                {language === "es" ? "Depositar" : "Deposit"}
              </h3>
            </Link>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={handleTransactionHistoryClick}
          >
            <h3 className="section-title">
              {language === "es"
                ? "Historial de Transacciones"
                : "Transaction History"}
            </h3>
          </div>
          {showTransactionHistoryPopup && (
            <TransactionHistoryPopup
              transactionHistory={transactionHistory}
              onClose={() => setShowTransactionHistoryPopup(false)}
            />
          )}
        </div>
      </div>
      {showBetHistoryPopup && (
        <div className="popup">
          <div className="popup-content">
            {betHistory !== null ? (
              <BetHistoryPopup betHistory={betHistory} />
            ) : (
              <p>
                {language === "es"
                  ? "Cargando historial de apuestas..."
                  : "Loading bet history..."}
              </p>
            )}
            <button
              className="popup-close-btn"
              onClick={() => setShowBetHistoryPopup(false)}
            >
              {language === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="user-table">
              <table>
                <thead>
                  <tr>
                    <th colSpan="2">
                      {language === "es"
                        ? `Bienvenido ${userInfo.surname}, ${userInfo.name} a tu perfil de FriendlyStakes`
                        : `Welcome ${userInfo.surname}, ${userInfo.name} to your FriendlyStakes profile`}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="sections">
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("personal")}
                        >
                          <h3 className="section-title">
                            {language === "es"
                              ? "Información Personal"
                              : "Personal Information"}
                          </h3>
                        </div>
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("account")}
                        >
                          <h3 className="section-title">
                            {language === "es"
                              ? "Información de Cuenta"
                              : "Account Information"}
                          </h3>
                        </div>
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("password")}
                        >
                          <h3 className="section-title">
                            {language === "es"
                              ? "Cambiar Contraseña"
                              : "Change Password"}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td>{renderUserInfo()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowPopup(false)}
            >
              {language === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}
      {/* reenderizar la info del user */}
      {showVerificationPopup && (
        <div className="popup">
          <div className="popup-content">
            {userInfo && userInfo.verified ? (
              <>
                <h3>
                  {language === "es"
                    ? "Proceso de Verificación Completo"
                    : "Verification Process Complete"}
                </h3>
                <p>
                  {language === "es"
                    ? "Disfruta de la experiencia de nuestra página web al 100% 🎉"
                    : "Enjoy the full experience of our website 🎉"}
                </p>
              </>
            ) : (
              <>
                <h3>
                  {language === "es" ? "Verificar Cuenta" : "Verify Account"}
                </h3>
                <p>
                  {language === "es"
                    ? "Por favor, adjunta los documentos necesarios para verificar tu cuenta. Esto puede tardar hasta 24 horas en procesarse."
                    : "Please attach the necessary documents to verify your account. This may take up to 24 hours to process."}
                </p>
                <form onSubmit={handleVerifyAccount}>
                  <div className="verification-docs">
                    <div className="doc-input">
                      <label htmlFor="documentFront">
                        {language === "es"
                          ? "Documento de Identidad (DNI) - Cara:"
                          : "Identity Document (DNI) - Front:"}
                      </label>
                      <input
                        type="file"
                        id="documentFront"
                        name="documentFront"
                        onChange={handleDocumentFrontChange}
                        required
                      />
                    </div>
                    <div className="doc-input">
                      <label htmlFor="documentBack">
                        {language === "es"
                          ? "Documento de Identidad (DNI) - Dorso:"
                          : "Identity Document (DNI) - Back:"}
                      </label>
                      <input
                        type="file"
                        id="documentBack"
                        name="documentBack"
                        onChange={handleDocumentBackChange}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit">
                    {language === "es"
                      ? "Enviar Documentos"
                      : "Submit Documents"}
                  </button>
                </form>
                <p>
                  {language === "es"
                    ? "Nota: El proceso de verificación puede tardar hasta 24 horas en completarse."
                    : "Note: The verification process may take up to 24 hours to complete."}
                </p>
              </>
            )}
            <button
              className="popup-close-btn"
              onClick={() => setShowVerificationPopup(false)}
            >
              {language === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}
      {showSettingsPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>
              {language === "es"
                ? `Bienvenido ${window.sessionStorage.getItem(
                    "SURNAME"
                  )}, ${window.sessionStorage.getItem("NAME")}`
                : `Welcome ${window.sessionStorage.getItem(
                    "SURNAME"
                  )}, ${window.sessionStorage.getItem("NAME")}`}
            </h3>
            <div className="settings-form">
              <div className="section-selector">
                <button
                  onClick={() => setSelectedSection("exclude")}
                  className={selectedSection === "exclude" ? "active" : ""}
                >
                  {language === "es" ? "Excluirme" : "Exclude Myself"}
                </button>
                <button
                  onClick={() => setSelectedSection("disable")}
                  className={selectedSection === "disable" ? "active" : ""}
                >
                  {language === "es"
                    ? "Deshabilitar Cuenta"
                    : "Disable Account"}
                </button>
              </div>
              {selectedSection === "exclude" && (
                <form onSubmit={handleExcludeUser}>
                  <label htmlFor="exclusionDate">
                    {language === "es"
                      ? "Fecha de Exclusión:"
                      : "Exclusion Date:"}
                  </label>
                  <input
                    type="date"
                    id="exclusionDate"
                    name="exclusionDate"
                    value={exclusionData.exclusionDate}
                    onChange={handleExclusionDateChange}
                    required
                  />
                  <div className="confirm-checkbox">
                    <input
                      type="checkbox"
                      id="confirmDisable"
                      name="confirmDisable"
                      checked={confirmDisable}
                      onChange={handleConfirmDisableChange}
                      required
                    />
                    <label htmlFor="confirmDisable">
                      {language === "es"
                        ? "Confirmo que deseo excluir mi cuenta."
                        : "I confirm that I want to exclude my account."}
                    </label>
                  </div>
                  <button type="submit" disabled={!confirmDisable}>
                    {language === "es" ? "Excluir Cuenta" : "Exclude Account"}
                  </button>
                </form>
              )}
              {selectedSection === "disable" && (
                <form onSubmit={handleDisableAccount}>
                  <div className="confirm-checkbox">
                    <input
                      type="checkbox"
                      id="confirmDisable"
                      name="confirmDisable"
                      checked={confirmDisable}
                      onChange={handleConfirmDisableChange}
                      required
                    />
                    <label htmlFor="confirmDisable">
                      {language === "es"
                        ? "Confirmo que deseo deshabilitar mi cuenta."
                        : "I confirm that I want to disable my account."}
                    </label>
                  </div>
                  <button type="submit" disabled={!confirmDisable}>
                    {language === "es"
                      ? "Deshabilitar Cuenta"
                      : "Disable Account"}
                  </button>
                </form>
              )}
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowSettingsPopup(false)}
            >
              {language === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
