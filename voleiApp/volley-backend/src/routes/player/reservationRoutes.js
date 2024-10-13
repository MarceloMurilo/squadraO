const express = require('express');
const router = express.Router();

// Defina suas rotas de reservas para jogadores aqui
router.get('/', (req, res) => {
  res.send('Rota de reservas dos jogadores funcionando.');
});

module.exports = router;