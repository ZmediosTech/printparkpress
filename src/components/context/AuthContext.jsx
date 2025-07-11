import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const login = (email) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  const logout = () => {
    setUserEmail('');
    localStorage.removeItem('userEmail'); 
    localStorage.removeItem('userName');

  };

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);