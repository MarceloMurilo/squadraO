const express = require('express');
const router = express.Router();
const db = require('../../db'); // Certifique-se de que a conexão com o banco está correta.

router.post('/equilibrar-times', async (req, res) => {
  const { organizador_id, jogo_id, tamanho_time, restricoes = [] } = req.body;

  if (!organizador_id || !jogo_id || !tamanho_time) {
    return res.status(400).json({ message: 'Organizador, jogo e tamanho do time são obrigatórios.' });
  }

  try {
    const jogadores = await db.query(
      `SELECT u.nome, u.id_usuario, a.passe, a.ataque, a.levantamento
       FROM avaliacoes a
       JOIN usuario u ON a.usuario_id = u.id_usuario
       JOIN participacao_jogos pj ON pj.id_usuario = a.usuario_id
       WHERE a.organizador_id = $1 AND pj.id_jogo = $2`,
      [organizador_id, jogo_id]
    );

    if (jogadores.rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum jogador encontrado para este jogo.' });
    }

    const jogadoresComPontuacao = jogadores.rows.map((player) => ({
      id: player.id_usuario,
      nome: player.nome,
      passe: player.passe,
      ataque: player.ataque,
      levantamento: player.levantamento,
      total: player.passe + player.ataque + player.levantamento,
    }));

    // Garantir que temos jogadores suficientes
    if (jogadoresComPontuacao.length < tamanho_time * 2) {
      return res.status(400).json({ message: `Jogadores insuficientes para criar times de ${tamanho_time} jogadores.` });
    }

    // Ordenar jogadores por pontuação total (habilidades somadas)
    jogadoresComPontuacao.sort((a, b) => b.total - a.total);

    // Inicializar os times
    const times = Array.from({ length: Math.ceil(jogadoresComPontuacao.length / tamanho_time) }, () => []);

    // Distribuir os jogadores nos times
    jogadoresComPontuacao.forEach((jogador, index) => {
      times[index % times.length].push(jogador);
    });

    // Retornar os times e suas pontuações
    const result = times.map((time, index) => ({
      time: index + 1,
      jogadores: time.map((j) => j.nome),
      totalScore: time.reduce((acc, j) => acc + j.total, 0),
    }));

    return res.json({ times: result });
  } catch (error) {
    console.error('Erro ao equilibrar times:', error);
    return res.status(500).json({ message: 'Erro ao equilibrar times.', error });
  }
});

module.exports = router;
