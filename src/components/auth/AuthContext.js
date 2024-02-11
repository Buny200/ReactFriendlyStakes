a; // AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    // Aquí deberías realizar la lógica de autenticación, como verificar credenciales, etc.
    // Si el inicio de sesión es exitoso, establece isLoggedIn en true.
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Aquí deberías realizar la lógica para cerrar la sesión, como eliminar tokens de sesión, etc.
    // Luego, establece isLoggedIn en false.
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
