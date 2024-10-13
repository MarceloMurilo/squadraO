import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api'; // Altere conforme a URL do backend

export const apiLogin = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
    return response.data; // Retorna o token
  } catch (error) {
    console.error('Erro ao logar:', error);
    return null;
  }
};

export const register = async (nome, email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { nome, email, senha });
    return response.data; // Retorna o token
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return null;
  }
};
