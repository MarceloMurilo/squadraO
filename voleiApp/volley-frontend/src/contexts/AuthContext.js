import React, { createContext, useState } from 'react';
import { login as apiLogin } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      console.log('Tentando login com:', email, password); // Log de tentativa de login
      const response = await apiLogin(email, password);
      console.log('Resposta da API de login:', response); // Log da resposta da API

      if (response.token) {
        setUser(response.user);
        console.log('Login bem-sucedido. Usuário definido:', response.user); // Log de login bem-sucedido
        return true;
      } else {
        console.warn('Login falhou. Resposta inválida da API.'); // Log de falha no login
        return false;
      }
    } catch (error) {
      console.error('Erro de login:', error); // Log de erro durante o login
      return false;
    }
  };

  const logout = () => {
    console.log('Efetuando logout. Limpando estado do usuário.'); // Log de logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
