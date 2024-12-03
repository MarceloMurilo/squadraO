const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Token não fornecido ou formato inválido.');
    return res.status(403).json({ error: 'Token não fornecido ou formato inválido' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token inválido:', err.message);
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Log detalhado para depuração
    console.log('Token decodificado com sucesso:', decoded);

    // Passa o ID e o role do usuário para a requisição
    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
};

// Rota para registrar um novo usuário com senha criptografada (Register)
router.post('/register', async (req, res) => {
  const { nome, email, senha, profile_image, user_role = 'jogador' } = req.body; // Define 'jogador' como padrão
  try {
    // Verificar se o usuário já existe
    const userCheck = await pool.query('SELECT * FROM public.usuario WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário no banco de dados
    const result = await pool.query(
      'INSERT INTO public.usuario (nome, email, senha, imagem_perfil, papel_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, hashedPassword, profile_image, user_role]
    );

    // Gerar o token JWT com `id` e `role`
    const token = jwt.sign(
      { id: result.rows[0].id_usuario, papel_usuario: result.rows[0].papel_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar o token e os dados do usuário (sem a senha)
    res.status(201).json({ token, user: { ...result.rows[0], senha: undefined } });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar o usuário' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const result = await pool.query('SELECT * FROM public.usuario WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Compara a senha com o hash no banco de dados
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera o token JWT com `id` e `role`
    const token = jwt.sign(
      { id: user.id_usuario, role: user.papel_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no login', details: error.message });
  }
});

// Rota protegida para autenticação
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Acesso permitido. Você está autenticado!',
    userId: req.user.id, // Garantir que o ID do usuário está vindo do middleware
    papel_usuario: req.user.papel_usuario, // Papel do usuário
  });
});

module.exports = router;
