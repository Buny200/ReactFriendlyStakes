import React, { useState, useEffect } from 'react';
import '../../css/Profile.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const [nickname, setNickname] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [changePasswordData, setChangePasswordData] = useState({
        email: '',
        currentPassword: '',
        newPassword: ''
    });
    const [documentFront, setDocumentFront] = useState(null);
    const [documentBack, setDocumentBack] = useState(null);

    useEffect(() => {
        const storedNickname = window.sessionStorage.getItem('NICKNAME');
        setNickname(storedNickname);
    }, []);

    const handleUserInfoClick = async () => {
        try {
            const userId = window.sessionStorage.getItem('USER_ID');
            const response = await fetch(`http://localhost:8080/api/users/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                setUserInfo(userData);
                setSelectedSection('personal');
                setShowPopup(true);
            } else {
                console.error('Error al obtener la información del usuario');
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    };

    const handleChangePasswordClick = async () => {
        try {
            const userId = window.sessionStorage.getItem('USER_ID');
            const response = await fetch(`http://localhost:8080/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: changePasswordData.email,
                    password: changePasswordData.currentPassword,
                    newPassword: changePasswordData.newPassword,
                    userId: userId,
                }),
            });
    
            if (response.ok) {
                console.log('Contraseña cambiada exitosamente');
            } else {
                console.error('Error al cambiar la contraseña:', response.statusText);
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChangePasswordData({
            ...changePasswordData,
            [name]: value
        });
    };

    const handleVerifyAccount = async () => {
        try {
            const userId = window.sessionStorage.getItem('USER_ID');
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('documentFront', documentFront);
            formData.append('documentBack', documentBack);
            
            const response = await fetch('http://localhost:8080/api/verification/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const message = await response.text();
                console.log(message);
            } else {
                console.error('Error al verificar la cuenta:', response.statusText);
            }
        } catch (error) {
            console.error('Error al verificar la cuenta:', error);
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

        if (selectedSection === 'personal') {
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
        } else if (selectedSection === 'account') {
            return (
                <div className="account-info">
                    <h3 className="section-title">Información de Cuenta</h3>
                    <table>
                        <tbody>
                            {userInfo && (
                                <>
                                    <tr>
                                        <td>Verificado:</td>
                                        <td>{userInfo.verified ? 'Sí' : 'No'}</td>
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
                                        <td>{userInfo.excluded ? 'Sí' : 'No'}</td>
                                    </tr>
                                    {userInfo.excluded && (
                                        <tr>
                                            <td>Fecha de Exclusión:</td>
                                            <td>{userInfo.exclusionDate}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td>Cuenta Habilitada:</td>
                                        <td>{userInfo.enabled ? 'Sí' : 'No'}</td>
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
        } else if (selectedSection === 'password') {
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
                    <div className="section-wrapper">
                        <h3 className="section-title">Historial de Apuestas</h3>
                    </div>
                </div>
                <div className="profile-section">
                     <div className="section-wrapper" onClick={() => {
                        setSelectedSection('verify-account');
                        setShowVerificationPopup(true);
                    }}>
                        <h3 className="section-title">Verificar Cuenta</h3>
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
                <div className="profile-section">
                    <div className="section-wrapper">
                        <h3 className="section-title">Modificar Ajustes de Cuenta</h3>
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="user-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan="2">Bienvenido {userInfo.surname}, {userInfo.name} a tu perfil de FriendlyStakes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="sections">
                                                <div className="section-wrapper" onClick={() => setSelectedSection('personal')}>
                                                    <h3 className="section-title">Información Personal</h3>
                                                </div>
                                                <div className="section-wrapper" onClick={() => setSelectedSection('account')}>
                                                    <h3 className="section-title">Información de Cuenta</h3>
                                                </div>
                                                <div className="section-wrapper" onClick={() => setSelectedSection('password')}>
                                                    <h3 className="section-title">Cambiar Contraseña</h3>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{renderUserInfo()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button className="popup-close-btn" onClick={() => setShowPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}
            {showVerificationPopup && (
                <div className="popup">
                    <div className="popup-content">
                        {userInfo && userInfo.verified ? (
                            <>
                                <h3>Proceso de Verificación Completo</h3>
                                <p>Disfruta de la experiencia de nuestra página web al 100% 🎉</p>
                            </>
                        ) : (
                            <>
                                <h3>Verificar Cuenta</h3>
                                <p>Por favor, adjunta los documentos necesarios para verificar tu cuenta. Esto puede tardar hasta 24 horas en procesarse.</p>
                                <form onSubmit={handleVerifyAccount}>
                                    <div className="verification-docs">
                                        <div className="doc-input">
                                            <label htmlFor="documentFront">Documento de Identidad (DNI) - Cara:</label>
                                            <input
                                                type="file"
                                                id="documentFront"
                                                name="documentFront"
                                                onChange={handleDocumentFrontChange}
                                                required
                                            />
                                        </div>
                                        <div className="doc-input">
                                            <label htmlFor="documentBack">Documento de Identidad (DNI) - Dorso:</label>
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
                                <p>Nota: El proceso de verificación puede tardar hasta 24 horas en completarse.</p>
                            </>
                        )}
                        <button className="popup-close-btn" onClick={() => setShowVerificationPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
