import React, { useState, useEffect } from 'react';
import '../../css/Profile.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null); // Estado para almacenar la información del usuario
    const [showPopup, setShowPopup] = useState(false); // Estado para controlar la visibilidad del pop-up
    const [nickname, setNickname] = useState(''); // Estado para almacenar el nickname del usuario

    useEffect(() => {
        const storedNickname = window.sessionStorage.getItem('NICKNAME'); // Obtener el nickname del sessionStorage
        setNickname(storedNickname); // Establecer el nickname en el estado
    }, []);

    // Función para manejar el clic en "Información Personal" y enviar solicitud al endpoint
    const handleUserInfoClick = async () => {
        try {
            const userId = window.sessionStorage.getItem('USER_ID'); // Obtener el userId del sessionStorage
            const response = await fetch(`http://localhost:8080/api/users/${userId}`); // Hacer la solicitud al endpoint
            if (response.ok) {
                const userData = await response.json();
                setUserInfo(userData);
                setShowPopup(true); // Mostrar el pop-up
            } else {
                console.error('Error al obtener la información del usuario');
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    };

    return (
        <div className="profile-container">
            <h2>Perfil de {nickname}</h2> {/* Aquí se muestra el nickname del usuario */}
            <div className="profile-grid">
                <div className="profile-section" onClick={handleUserInfoClick}>
                    <h3>Información Personal</h3>
                    {/* Contenido de Información Personal */}
                </div>
                <div className="profile-section">
                    <h3>Historial de Apuestas</h3>
                    {/* Contenido de Historial de Apuestas */}
                </div>
                <div className="profile-section">
                    <h3>Verificar Cuenta</h3>
                    {/* Contenido de Verificar Cuenta */}
                </div>
                <div className="profile-section">
                    <h3>Depositar</h3>
                    {/* Contenido de Depositar */}
                </div>
                <div className="profile-section">
                    <h3>Historial de Transacciones</h3>
                    {/* Contenido de Historial de Transacciones */}
                </div>
                <div className="profile-section">
                    <h3>Modificar Ajustes de Cuenta</h3>
                    {/* Contenido de Modificar Ajustes de Cuenta */}
                </div>
            </div>
            {/* Pop-up para mostrar la información del usuario */}
            {showPopup && userInfo && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Información Personal</h2>
                        <p>Nombre: {userInfo.name}</p>
                        <p>Apellido: {userInfo.surname}</p>
                        <p>Email: {userInfo.email}</p>
                        <p>Nickname: {userInfo.nickname}</p>
                        <button onClick={() => setShowPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
