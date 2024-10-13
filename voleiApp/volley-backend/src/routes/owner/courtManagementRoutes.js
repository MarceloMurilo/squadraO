const express = require('express');
const pool = require('../../db');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// Rota para cadastrar uma nova quadra (Create)
router.post('/', async (req, res) => {
  const { nome, endereco, capacidade, preco_hora, promocao_ativa, descricao_promocao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO public.courts (nome, endereco, capacidade, preco_hora, promocao_ativa, descricao_promocao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, endereco, capacidade, preco_hora, promocao_ativa, descricao_promocao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar a quadra:', error);
    res.status(500).json({ error: 'Erro ao cadastrar a quadra', details: error.message });
  }
});

// Rota para listar todas as quadras (Read)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.courts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar as quadras:', error);
    res.status(500).json({ error: 'Erro ao listar as quadras', details: error.message });
  }
});

// Rota para listar uma única quadra por ID (Read)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.courts WHERE id_quadra = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quadra não encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar a quadra:', error);
    res.status(500).json({ error: 'Erro ao buscar a quadra', details: error.message });
  }
});

// Rota para atualizar uma quadra por ID (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, endereco, capacidade, preco_hora, promocao_ativa, descricao_promocao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE public.courts SET nome = $1, endereco = $2, capacidade = $3, preco_hora = $4, promocao_ativa = $5, descricao_promocao = $6 WHERE id_quadra = $7 RETURNING *',
      [nome, endereco, capacidade, preco_hora, promocao_ativa, descricao_promocao, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quadra não encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar a quadra:', error);
    res.status(500).json({ error: 'Erro ao atualizar a quadra', details: error.message });
  }
});

// Rota para deletar uma quadra por ID (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM public.courts WHERE id_quadra = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quadra não encontrada' });
    }
    res.status(200).json({ message: 'Quadra deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar a quadra:', error);
    res.status(500).json({ error: 'Erro ao deletar a quadra', details: error.message });
  }
});

module.exports = router;