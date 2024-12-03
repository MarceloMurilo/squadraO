import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api'; // Altere conforme a URL do backend

// Função para login
export const apiLogin = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
    return response.data; // Retorna os dados da API (ex.: token)
  } catch (error) {
    if (error.response) {
      // Erro com resposta da API (ex.: 400, 401)
      console.error('Erro ao logar (resposta da API):', error.response.data);
    } else if (error.request) {
      // Erro de rede (sem resposta do servidor)
      console.error('Erro ao logar (sem resposta do servidor):', error.request);
    } else {
      // Outros erros (ex.: configuração)
      console.error('Erro ao logar (configuração):', error.message);
    }
    throw new Error('Falha no login. Verifique suas credenciais.');
  }
};

// Função para registro
export const register = async (nome, email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { nome, email, senha });
    return response.data; // Retorna os dados da API (ex.: token ou mensagem de sucesso)
  } catch (error) {
    if (error.response) {
      console.error('Erro ao registrar (resposta da API):', error.response.data);
    } else if (error.request) {
      console.error('Erro ao registrar (sem resposta do servidor):', error.request);
    } else {
      console.error('Erro ao registrar (configuração):', error.message);
    }
    throw new Error('Falha no registro. Tente novamente.');
  }
};
