import React, { useState, useEffect } from 'react';
import '../../css/Profile.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [nickname, setNickname] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [changePasswordData, setChangePasswordData] = useState({
        email: '',
        currentPassword: '',
        newPassword: ''
    });

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
                    userId: userId, // Si es necesario enviar el ID del usuario
                }),
            });
    
            if (response.ok) {
                // La contraseña se cambió correctamente
                console.log('Contraseña cambiada exitosamente');
            } else {
                // Error al cambiar la contraseña
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

    const renderUserInfo = () => {
        if (!userInfo) return null;

        if (selectedSection === 'personal') {
            return (
                <div className="user-details">
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
                </div>
            );
        } else if (selectedSection === 'account') {
            return (
                <div className="user-details">
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
                    {/* Contenido de Información Personal */}
                </div>
                <div className="profile-section">
                    <div className="section-wrapper">
                        <h3 className="section-title">Historial de Apuestas</h3>
                    </div>
                    {/* Contenido de Historial de Apuestas */}
                </div>
                <div className="profile-section">
                    <div className="section-wrapper">
                        <h3 className="section-title">Verificar Cuenta</h3>
                    </div>
                    {/* Contenido de Verificar Cuenta */}
                </div>
                <div className="profile-section">
                    <div className="section-wrapper">
                        <h3 className="section-title">Depositar</h3>
                    </div>
                    {/* Contenido de Depositar */}
                </div>
                <div className="profile-section">
                    <div className="section-wrapper">
                        <h3 className="section-title">Historial de Transacciones</h3>
                    </div>
                    {/* Contenido de Historial de Transacciones */}
                </div>
                <div className="profile-section">
                    <div className="section-wrapper">
                        <h3 className="section-title">Modificar Ajustes de Cuenta</h3>
                    </div>
                    {/* Contenido de Modificar Ajustes de Cuenta */}
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
        </div>
    );
};

export default Profile;
