const express = require('express');
const router = express.Router();
const db = require('../../db'); // Conexão com o banco de dados

// Rota para salvar ou atualizar avaliações
router.post('/salvar', async (req, res) => {
  const { organizador_id, usuario_id, passe, ataque, levantamento } = req.body;

  if (!organizador_id || !usuario_id) {
    return res.status(400).json({ message: 'Organizador e Usuário são obrigatórios.' });
  }

  try {
    await db.query(
      `INSERT INTO avaliacoes (organizador_id, usuario_id, passe, ataque, levantamento)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (organizador_id, usuario_id)
       DO UPDATE SET passe = $3, ataque = $4, levantamento = $5`,
      [organizador_id, usuario_id, passe, ataque, levantamento]
    );

    res.status(200).json({ message: 'Avaliação salva ou atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    res.status(500).json({ message: 'Erro ao salvar avaliação.' });
  }
});

// Rota para buscar avaliações feitas pelo organizador
router.get('/:organizador_id', async (req, res) => {
  const { organizador_id } = req.params;

  try {
    const result = await db.query(
      `SELECT usuario_id, passe, ataque, levantamento
       FROM avaliacoes
       WHERE organizador_id = $1`,
      [organizador_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ message: 'Erro ao buscar avaliações.' });
  }
});

module.exports = router;
