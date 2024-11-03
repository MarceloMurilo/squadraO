const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  const tokenWithoutBearer = token.split(' ')[1]; // Removendo o "Bearer" do token
  
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = { id: decoded.id, role: decoded.role }; // Passa o ID e o role do usuário adiante
    next();
  });
};

// Rota para registrar um novo usuário com senha criptografada (Register)
router.post('/register', async (req, res) => {
  const { nome, email, senha, profile_image, user_role } = req.body;
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
      'INSERT INTO public.usuario (nome, email, senha, profile_image, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, hashedPassword, profile_image, user_role]
    );

    // Gerar o token JWT com `id` e `role`
    const token = jwt.sign(
      { id: result.rows[0].id_usuario, role: result.rows[0].user_role }, // Inclui `role` no token
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
      { id: user.id_usuario, role: user.user_role }, // Inclui `role` no token
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no login', details: error.message });
  }
});

// Rota protegida (apenas para testar a autenticação)
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acesso permitido. Você está autenticado!', userId: req.user.id, role: req.user.role });
});

module.exports = router;
