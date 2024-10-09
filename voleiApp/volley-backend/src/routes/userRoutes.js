const express = require('express');
const pool = require('../db'); // Importando a conexão com o banco de dados
const router = express.Router();

// Middleware para logar todas as requisições
router.use((req, res, next) => {
  console.log(`\n=== Nova requisição recebida ===`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Body:`, req.body);
  console.log('==============================\n');
  next();
});

// Rota de teste dentro de userRoutes
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de teste dentro de userRoutes funcionando!' });
});

// Rota para cadastrar um novo usuário (Create)
router.post('/', async (req, res) => {
  const { nome, email, senha, profile_image, user_role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO public.usuario (nome, email, senha, profile_image, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, senha, profile_image, user_role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar o usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar o usuário', details: error.message });
  }
});

// Rota para listar todos os usuários (Read)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.usuario');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar os usuários:', error);
    res.status(500).json({ error: 'Erro ao listar os usuários', details: error.message });
  }
});

// Rota para listar um único usuário por ID (Read)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.usuario WHERE id_usuario = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar o usuário', details: error.message });
  }
});

// Rota para atualizar um usuário por ID (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, profile_image, user_role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE public.usuario SET nome = $1, email = $2, senha = $3, profile_image = $4, user_role = $5 WHERE id_usuario = $6 RETURNING *',
      [nome, email, senha, profile_image, user_role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar o usuário', details: error.message });
  }
});


// Rota para deletar um usuário por ID (Delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Deletar participações do usuário em qualquer jogo
      await client.query(
        'DELETE FROM public.game_participation WHERE id_usuario = $1',
        [id]
      );
  
      // Deletar convites onde o usuário é o convidado
      await client.query(
        'DELETE FROM public.invites WHERE id_usuario_convidado = $1',
        [id]
      );
  
      // Deletar convites relacionados aos jogos criados pelo usuário
      await client.query(
        'DELETE FROM public.invites WHERE id_jogo IN (SELECT id_jogo FROM public.jogos WHERE id_usuario_criador = $1)',
        [id]
      );
  
      // Deletar transações relacionadas às reservas do usuário
      await client.query(
        'DELETE FROM public.transactions WHERE id_reserva IN (SELECT id_reserva FROM public.court_reservations WHERE id_usuario = $1)',
        [id]
      );
  
      // Deletar reservas de quadra feitas pelo usuário
      await client.query(
        'DELETE FROM public.court_reservations WHERE id_usuario = $1',
        [id]
      );
  
      // Deletar participações em jogos criados pelo usuário
      await client.query(
        'DELETE FROM public.game_participation WHERE id_jogo IN (SELECT id_jogo FROM public.jogos WHERE id_usuario_criador = $1)',
        [id]
      );
  
      // Deletar jogos criados pelo usuário
      await client.query(
        'DELETE FROM public.jogos WHERE id_usuario_criador = $1',
        [id]
      );
  
      // Deletar registros relacionados em usuario_insignias
      await client.query(
        'DELETE FROM public.usuario_insignias WHERE id_usuario = $1',
        [id]
      );
  
      // Deletar registros relacionados em usuario_funcao
      await client.query(
        'DELETE FROM public.usuario_funcao WHERE id_usuario = $1',
        [id]
      );
  
      // Deletar transações feitas pelo usuário (se houver)
      await client.query(
        'DELETE FROM public.transactions WHERE id_usuario = $1',
        [id]
      );
  
      // Deletar o usuário
      const result = await client.query(
        'DELETE FROM public.usuario WHERE id_usuario = $1 RETURNING *',
        [id]
      );
  
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      await client.query('COMMIT');
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao deletar o usuário:', error);
      res.status(500).json({
        error: 'Erro ao deletar o usuário',
        details: error.detail || error.message,
      });
    } finally {
      client.release();
    }
  });
module.exports = router;