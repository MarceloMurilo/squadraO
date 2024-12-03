const express = require('express');
const router = express.Router();
const db = require('../../db'); // Importa a conexão com o banco de dados

// Middleware para log de requisições
router.use((req, res, next) => {
  console.log(`=== Nova requisição recebida ===`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Body:`, req.body);
  console.log(`Params:`, req.params);
  console.log(`==============================`);
  next();
});

// Rota para criar um jogo
router.post('/criar', async (req, res) => {
  const { nome_jogo, data_jogo, horario_inicio, horario_fim, id_usuario_criador } = req.body;

  if (!nome_jogo || !data_jogo || !horario_inicio || !horario_fim || !id_usuario_criador) {
    console.error('Erro: Campos obrigatórios ausentes:', req.body);
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    console.log('Criando jogo com os dados:', req.body);
    const result = await db.query(
      `INSERT INTO jogos (nome_jogo, data_jogo, horario_inicio, horario_fim, id_usuario_criador)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_jogo`,
      [nome_jogo, data_jogo, horario_inicio, horario_fim, id_usuario_criador]
    );
    console.log('Jogo criado com sucesso:', result.rows[0]);
    res.status(201).json({ message: 'Jogo criado com sucesso.', id_jogo: result.rows[0].id_jogo });
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({ message: 'Erro interno ao criar o jogo.', error });
  }
});

// Rota para convidar amigos para um jogo
router.post('/convidar', async (req, res) => {
  const { id_jogo, amigos_ids } = req.body;

  if (!id_jogo || !amigos_ids || !Array.isArray(amigos_ids) || amigos_ids.length === 0) {
    console.error('Erro: Dados inválidos ao convidar amigos:', req.body);
    return res.status(400).json({ message: 'ID do jogo e uma lista de amigos são obrigatórios.' });
  }

  try {
    console.log('Convidando amigos:', amigos_ids, 'para o jogo:', id_jogo);
    const values = amigos_ids
      .map((id_amigo) => `(${id_jogo}, ${id_amigo}, NOW())`)
      .join(', ');

    await db.query(
      `INSERT INTO participacao_jogos (id_jogo, id_usuario, data_participacao) VALUES ${values}`
    );

    console.log('Amigos convidados com sucesso para o jogo:', id_jogo);
    res.status(201).json({ message: 'Amigos convidados com sucesso.' });
  } catch (error) {
    console.error('Erro ao convidar amigos:', error);
    res.status(500).json({ message: 'Erro interno ao convidar amigos.', error });
  }
});

// Rota para buscar habilidades dos jogadores de um jogo
router.get('/:id_jogo/habilidades', async (req, res) => {
  const { id_jogo } = req.params;

  if (!id_jogo) {
    console.error('Erro: ID do jogo não fornecido');
    return res.status(400).json({ message: 'ID do jogo é obrigatório.' });
  }

  try {
    console.log('Buscando habilidades dos jogadores do jogo:', id_jogo);
    const result = await db.query(
      `SELECT pj.id_usuario, u.nome, u.email, 
              COALESCE(a.passe, 0) AS passe, 
              COALESCE(a.ataque, 0) AS ataque, 
              COALESCE(a.levantamento, 0) AS levantamento
       FROM participacao_jogos pj
       JOIN usuario u ON pj.id_usuario = u.id_usuario
       LEFT JOIN avaliacoes a ON pj.id_usuario = a.usuario_id 
       WHERE pj.id_jogo = $1`,
      [id_jogo]
    );

    if (result.rows.length === 0) {
      console.warn('Nenhum jogador encontrado para o jogo:', id_jogo);
      return res.status(404).json({ message: 'Nenhum jogador encontrado para este jogo.' });
    }

    console.log('Habilidades dos jogadores:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar habilidades dos jogadores:', error);
    res.status(500).json({ message: 'Erro interno ao buscar habilidades dos jogadores.', error });
  }
});

// Rota para salvar habilidades dos jogadores de um jogo
router.post('/:id_jogo/habilidades', async (req, res) => {
  const { id_jogo } = req.params;
  const { habilidades } = req.body;

  if (!id_jogo || !Array.isArray(habilidades) || habilidades.length === 0) {
    console.error('Erro: ID do jogo ou habilidades ausentes:', req.body);
    return res.status(400).json({ message: 'ID do jogo e habilidades dos jogadores são obrigatórios.' });
  }

  try {
    console.log('Salvando habilidades para o jogo:', id_jogo);
    const queries = habilidades.map((jogador) =>
      db.query(
        `INSERT INTO avaliacoes (usuario_id, organizador_id, passe, ataque, levantamento)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (usuario_id, organizador_id) 
         DO UPDATE SET passe = $3, ataque = $4, levantamento = $5`,
        [jogador.id_usuario, jogador.organizador_id, jogador.passe, jogador.ataque, jogador.levantamento]
      )
    );

    await Promise.all(queries);

    console.log('Habilidades salvas com sucesso para o jogo:', id_jogo);
    res.status(200).json({ message: 'Habilidades atualizadas com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar habilidades:', error);
    res.status(500).json({ message: 'Erro interno ao salvar habilidades.', error });
  }
});

// Rota para equilibrar times
router.get('/:id_jogo/equilibrar-times', async (req, res) => {
  const { id_jogo } = req.params;

  if (!id_jogo) {
    console.error('Erro: ID do jogo não fornecido');
    return res.status(400).json({ message: 'ID do jogo é obrigatório.' });
  }

  try {
    console.log('Equilibrando times para o jogo:', id_jogo);
    const result = await db.query(
      `SELECT pj.id_usuario, u.nome, 
              COALESCE(a.passe, 0) AS passe, 
              COALESCE(a.ataque, 0) AS ataque, 
              COALESCE(a.levantamento, 0) AS levantamento
       FROM participacao_jogos pj
       JOIN usuario u ON pj.id_usuario = u.id_usuario
       LEFT JOIN avaliacoes a ON pj.id_usuario = a.usuario_id
       WHERE pj.id_jogo = $1`,
      [id_jogo]
    );

    if (result.rows.length === 0) {
      console.warn('Nenhum jogador encontrado para o jogo:', id_jogo);
      return res.status(404).json({ message: 'Nenhum jogador encontrado para este jogo.' });
    }

    console.log('Jogadores encontrados para equilibrar:', result.rows);

    // Lógica para equilibrar times
    const jogadores = result.rows;
    const times = [[], []];

    jogadores.sort((a, b) => (b.passe + b.ataque + b.levantamento) - (a.passe + a.ataque + a.levantamento));

    jogadores.forEach((jogador, index) => {
      if (index % 2 === 0) {
        times[0].push(jogador);
      } else {
        times[1].push(jogador);
      }
    });

    console.log('Times equilibrados:', times);
    res.status(200).json({ times });
  } catch (error) {
    console.error('Erro ao equilibrar times:', error);
    res.status(500).json({ message: 'Erro interno ao equilibrar times.', error });
  }
});

module.exports = router;
