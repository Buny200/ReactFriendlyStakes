import React, { useState, useEffect } from "react";
import "../../css/Profile.css";
import BetHistoryPopup from "../auth/BetHistoryPopup";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [nickname, setNickname] = useState("");
  const [betHistory, setBetHistory] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
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
          <h3 className="section-title">Información Personal</h3>
          <table>
            <tbody>
              <tr>
                <td>Email:</td>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <td>Nombre:</td>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
                <td>Apellido:</td>
                <td>{userInfo.surname}</td>
              </tr>
              <tr>
                <td>DNI:</td>
                <td>{userInfo.dni}</td>
              </tr>
              <tr>
                <td>Contraseña:</td>
                <td>******</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (selectedSection === "account") {
      return (
        <div className="account-info">
          <h3 className="section-title">Información de Cuenta</h3>
          <table>
            <tbody>
              {userInfo && (
                <>
                  <tr>
                    <td>Verificado:</td>
                    <td>{userInfo.verified ? "Sí" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Total Apostado:</td>
                    <td>{userInfo.wagered}</td>
                  </tr>
                  <tr>
                    <td>Ganancias o Pérdidas:</td>
                    <td>{userInfo.earningsLosses}</td>
                  </tr>
                  <tr>
                    <td>Fecha de Creación:</td>
                    <td>{userInfo.createdAt}</td>
                  </tr>
                  <tr>
                    <td>Excluído:</td>
                    <td>{userInfo.excluded ? "Sí" : "No"}</td>
                  </tr>
                  {userInfo.excluded && (
                    <tr>
                      <td>Fecha de Exclusión:</td>
                      <td>{userInfo.exclusionDate}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Cuenta Habilitada:</td>
                    <td>{userInfo.enabled ? "Sí" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Saldo:</td>
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
            <label htmlFor="email">Correo:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={changePasswordData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="currentPassword">Contraseña Actual:</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={changePasswordData.currentPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="newPassword">Nueva Contraseña:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={changePasswordData.newPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Cambiar Contraseña</button>
          </form>
        </div>
      );
    }
  };

  return (
    <div className="profile-container">
      <h2>Perfil de {nickname}</h2>
      <div className="profile-grid">
        <div className="profile-section" onClick={handleUserInfoClick}>
          <div className="section-wrapper">
            <h3 className="section-title">Información Personal</h3>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={() => setShowBetHistoryPopup(true)}
          >
            <h3 className="section-title">Historial de Apuestas</h3>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={() => {
              setSelectedSection("verify-account");
              setShowVerificationPopup(true);
            }}
          >
            <h3 className="section-title">Verificar Cuenta</h3>
          </div>
        </div>
        <div className="profile-section">
          <div
            className="section-wrapper"
            onClick={() => setShowSettingsPopup(true)}
          >
            <h3 className="section-title">Modificar Ajustes de Cuenta</h3>
          </div>
        </div>
        <div className="profile-section">
          <div className="section-wrapper">
            <h3 className="section-title">Depositar</h3>
          </div>
        </div>
        <div className="profile-section">
          <div className="section-wrapper">
            <h3 className="section-title">Historial de Transacciones</h3>
          </div>
        </div>
      </div>
      {showBetHistoryPopup && (
        <div className="popup">
          <div className="popup-content">
            {betHistory !== null ? (
              <BetHistoryPopup betHistory={betHistory} />
            ) : (
              <p>Cargando historial de apuestas...</p>
            )}
            <button
              className="popup-close-btn"
              onClick={() => setShowBetHistoryPopup(false)}
            >
              Cerrar
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
                      Bienvenido {userInfo.surname}, {userInfo.name} a tu perfil
                      de FriendlyStakes
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
                            Información Personal
                          </h3>
                        </div>
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("account")}
                        >
                          <h3 className="section-title">
                            Información de Cuenta
                          </h3>
                        </div>
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("password")}
                        >
                          <h3 className="section-title">Cambiar Contraseña</h3>
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
              Cerrar
            </button>
          </div>
        </div>
      )}
      {showVerificationPopup && (
        <div className="popup">
          <div className="popup-content">
            {userInfo && userInfo.verified ? (
              <>
                <h3>Proceso de Verificación Completo</h3>
                <p>
                  Disfruta de la experiencia de nuestra página web al 100% 🎉
                </p>
              </>
            ) : (
              <>
                <h3>Verificar Cuenta</h3>
                <p>
                  Por favor, adjunta los documentos necesarios para verificar tu
                  cuenta. Esto puede tardar hasta 24 horas en procesarse.
                </p>
                <form onSubmit={handleVerifyAccount}>
                  <div className="verification-docs">
                    <div className="doc-input">
                      <label htmlFor="documentFront">
                        Documento de Identidad (DNI) - Cara:
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
                        Documento de Identidad (DNI) - Dorso:
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
                  <button type="submit">Enviar Documentos</button>
                </form>
                <p>
                  Nota: El proceso de verificación puede tardar hasta 24 horas
                  en completarse.
                </p>
              </>
            )}
            <button
              className="popup-close-btn"
              onClick={() => setShowVerificationPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {showSettingsPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>
              Bienvenido {window.sessionStorage.getItem("SURNAME")},{" "}
              {window.sessionStorage.getItem("NAME")}
            </h3>
            <div className="user-table">
              <table>
                <tbody>
                  <tr>
                    <td>
                      {/* Secciones para Excluir Usuario y Deshabilitar Cuenta */}
                      <div className="profile-section">
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("exclude")}
                        >
                          <h3
                            className={`section-title ${
                              selectedSection === "exclude" ? "selected" : ""
                            }`}
                          >
                            Excluir Usuario
                          </h3>
                        </div>
                      </div>
                      <div className="profile-section">
                        <div
                          className="section-wrapper"
                          onClick={() => setSelectedSection("disable")}
                        >
                          <h3
                            className={`section-title ${
                              selectedSection === "disable" ? "selected" : ""
                            }`}
                          >
                            Deshabilitar Cuenta
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td>
                      {/* Contenido de las secciones */}
                      <div className="tab-content">
                        {selectedSection === "exclude" && (
                          <div className="form-section">
                            <h4>Excluir Usuario</h4>
                            <form onSubmit={handleExcludeUser} className="centered-form">
                                <p>NOTA: Cuando te excluyas de usar nuestros servicios no podrás usar nuestra página hasta que se cumpla el tiempo que hayas decidido abandonarnos.</p>
                              <label htmlFor="exclusionDate">
                                Fecha de Exclusión:
                              </label>
                              <input
                                type="date"
                                id="exclusionDate"
                                name="exclusionDate"
                                value={exclusionData.exclusionDate}
                                onChange={handleExclusionDateChange}
                                required
                              />
                              <button type="submit">Excluir</button>
                            </form>
                          </div>
                        )}
                         {selectedSection === "disable" && (
        <div className="form-section">
          <h4>Deshabilitar Cuenta</h4>
          <form onSubmit={handleDisableAccount} className="centered-form">
            <p>
              ¿Estás seguro de que deseas deshabilitar tu cuenta? Esta acción
              no se puede deshacer.
            </p>
            <p>
              NOTA: Mantendremos sus datos en nuestra base de datos durante un
              intervalo de 30 Días, por razones de seguridad y cuando se
              cumpla, eliminaremos todos sus datos de forma irreversible.
            </p>
            <label htmlFor="confirmDisable">
              <input
                type="checkbox"
                id="confirmDisable"
                checked={confirmDisable}
                onChange={handleConfirmDisableChange}
              />
              Confirmar deshabilitación de cuenta
            </label>
            <button
              type="submit"
              disabled={!confirmDisable}
              className="disable-account-btn"
              style={{
                backgroundColor: confirmDisable ? "#007bff" : "#ccc",
                cursor: confirmDisable ? "pointer" : "not-allowed",
                color: confirmDisable ? "#fff" : "#666",
              }}
            >
              Deshabilitar Cuenta
            </button>
          </form>
        </div>
      )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowSettingsPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;