const express = require('express');
const router = express.Router();

// Defina suas rotas para jogadores aqui
router.get('/', (req, res) => {
  res.send('Rota dos jogadores funcionando.');
});

module.exports = router;