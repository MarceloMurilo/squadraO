// Importando dependências
const express = require('express');
const router = express.Router();
const pool = require('../../db'); // Certifique-se de que o pool está apontando para a configuração correta do banco de dados
const authMiddleware = require('../../middlewares/authMiddleware');

// Rota para criar um novo convite
router.post('/', authMiddleware, async (req, res) => {
  console.log("=== Rota POST /api/invites chamada ===");

  const { id_jogo, id_usuario_convidado } = req.body;
  const id_usuario = req.user.id; // O usuário que está enviando o convite
  console.log("Dados recebidos:", { id_jogo, id_usuario_convidado });

  try {
    // Verificar se todos os dados necessários foram enviados
    if (!id_jogo || !id_usuario_convidado) {
      console.log("Erro: id_jogo ou id_usuario_convidado faltando.");
      return res.status(400).json({ error: 'Dados insuficientes para criar um convite.' });
    }

    // Verificar se já existe um convite do mesmo usuário para o mesmo convidado e jogo
    const existingInvite = await pool.query(
      `SELECT * FROM invites WHERE id_jogo = $1 AND id_usuario = $2 AND id_usuario_convidado = $3`,
      [id_jogo, id_usuario, id_usuario_convidado]
    );

    if (existingInvite.rows.length > 0) {
      console.log("Erro: Convite já existente.");
      return res.status(400).json({ error: 'Convite já existente para este usuário e jogo.' });
    }

    // Inserir o novo convite no banco de dados
    const result = await pool.query(
      `INSERT INTO invites (id_jogo, id_usuario_convidado, id_usuario, status, date_sent)
       VALUES ($1, $2, $3, 'pendente', NOW())
       RETURNING *`,
      [id_jogo, id_usuario_convidado, id_usuario]
    );

    console.log("Convite criado com sucesso:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    res.status(500).json({ error: 'Erro ao criar convite.' });
  }
});

module.exports = router;