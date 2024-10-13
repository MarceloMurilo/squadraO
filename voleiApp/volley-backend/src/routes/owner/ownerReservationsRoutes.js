const express = require('express');
const router = express.Router();

// Defina suas rotas para reservas dos donos de quadra aqui
router.get('/', (req, res) => {
  res.send('Rota de reservas dos donos de quadra funcionando.');
});

module.exports = router;