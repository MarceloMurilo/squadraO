const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexão com o banco de dados

// Adicionar um amigo
router.post('/adicionar', async (req, res) => {
  const { organizador_id, amigo_id } = req.body;

  if (!organizador_id || !amigo_id) {
    return res.status(400).json({ message: 'Organizador e Amigo são obrigatórios.' });
  }

  try {
    await db.query(
      `INSERT INTO amizades (organizador_id, amigo_id) VALUES ($1, $2)
       ON CONFLICT (organizador_id, amigo_id) DO NOTHING`,
      [organizador_id, amigo_id]
    );

    return res.status(201).json({ message: 'Amigo adicionado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao adicionar amigo.', error });
  }
});

// Listar amigos
router.get('/listar/:organizador_id', async (req, res) => {
  const { organizador_id } = req.params;

  try {
    const amigos = await db.query(
      `SELECT u.id_usuario AS id, u.nome, u.email
       FROM usuario u
       JOIN amizades a ON u.id_usuario = a.amigo_id
       WHERE a.organizador_id = $1`,
      [organizador_id]
    );

    return res.status(200).json(amigos.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar amigos.', error });
  }
});

// Equilibrar times com amigos selecionados
router.post('/equilibrar-amigos-selecionados', async (req, res) => {
    const { amigosSelecionados } = req.body;
  
    if (!amigosSelecionados || amigosSelecionados.length === 0) {
      return res.status(400).json({ message: 'Nenhum amigo selecionado.' });
    }
  
    try {
      const jogadores = await db.query(
        `SELECT u.id_usuario, u.nome, 
                COALESCE(a.passe, 0) AS passe, 
                COALESCE(a.ataque, 0) AS ataque, 
                COALESCE(a.levantamento, 0) AS levantamento
         FROM usuario u
         LEFT JOIN avaliacoes a ON u.id_usuario = a.usuario_id
         WHERE u.id_usuario = ANY($1)`,
        [amigosSelecionados]
      );
  
      if (jogadores.rows.length === 0) {
        return res.status(404).json({ message: 'Nenhum jogador encontrado.' });
      }
  
      const times = balancearTimes(jogadores.rows);
  
      res.status(200).json({ times });
    } catch (error) {
      console.error('Erro ao equilibrar times:', error);
      res.status(500).json({ message: 'Erro interno ao equilibrar times.' });
    }
  });

// Função para balancear os times
function balancearTimes(jogadores) {
  jogadores.sort((a, b) => {
    const totalA = (a.passe || 0) + (a.ataque || 0) + (a.levantamento || 0);
    const totalB = (b.passe || 0) + (b.ataque || 0) + (b.levantamento || 0);
    return totalB - totalA;
  });

  const time1 = [];
  const time2 = [];

  jogadores.forEach((jogador, index) => {
    if (index % 2 === 0) {
      time1.push(jogador);
    } else {
      time2.push(jogador);
    }
  });

  return [time1, time2];
}

module.exports = router;
