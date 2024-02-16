import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import '../../css/Register.css'; // Importa los estilos CSS

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    surname: '',
    dni: '',
    nickname: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/register', formData);
      console.log(response.data);
      // Aquí podrías redirigir al usuario a otra página si el registro fue exitoso
    } catch (error) {
      console.error(error.response.data.message);
    }
  };
//devolver success msg

  return (
    <div className="register-container">
      <h2>Crea tu cuenta FriendlyStakes</h2>
      <form className="register-form">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Fecha de Nacimiento</label>
          <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Apellido</label>
          <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="dni">DNI</label>
          <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleInputChange} />
        </div>
        <button type="button" onClick={handleRegister}>Registrarse</button>
        {/* aqui podrias añadir algun tipo de respuesta al usuario, redirigir al inicio de sesion   */}
      </form>
      {/* Enlace para ir a la página de registro */}
      <Link to="/login" className="login-link">¿Ya tienes una cuenta? Inicia sesión</Link>
    </div>
  );
};

export default Register;
