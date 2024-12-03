import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin } from '../services/authService';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento para verificar login persistente

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token encontrado no AsyncStorage:', token);

        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            console.log('Token decodificado:', decodedToken);

            if (decodedToken.exp * 1000 > Date.now()) {
              console.log('Token válido. Definindo usuário:', decodedToken.id);
              setUser({ id: decodedToken.id }); // Configura o usuário logado a partir do token
            } else {
              console.warn('Token expirado. Removendo do armazenamento.');
              await AsyncStorage.removeItem('token'); // Remove token expirado
            }
          } catch (decodeError) {
            console.error('Erro ao decodificar o token:', decodeError);
            await AsyncStorage.removeItem('token'); // Remove token inválido
          }
        }
      } catch (error) {
        console.error('Erro ao verificar token no AsyncStorage:', error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    checkToken();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Tentando login com:', email, password);
      const response = await apiLogin(email, password);
      console.log('Resposta da API de login:', response);
  
      if (response.token) {
        try {
          const decodedToken = jwtDecode(response.token);
          console.log('Token decodificado após login:', decodedToken);
  
          setUser({ id: decodedToken.id }); // Define o usuário com base no token decodificado
          await AsyncStorage.setItem('token', response.token);
          console.log('Token salvo com sucesso:', response.token); // Armazena o token no dispositivo
          return response; // Retorna a resposta completa
          
        } catch (decodeError) {
          console.error('Erro ao decodificar token após login:', decodeError);
          return null; // Retorna null em caso de erro
        }
      } else {
        console.warn('Login falhou. Resposta inválida da API.');
        return null; // Retorna null se não houver token
      }
    } catch (error) {
      console.error('Erro de login:', error);
      return null; // Retorna null em caso de erro
    }
  };

  const logout = async () => {
    try {
      console.log('Efetuando logout. Limpando estado do usuário.');
      await AsyncStorage.removeItem('token'); // Remove o token do armazenamento
      setUser(null);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
