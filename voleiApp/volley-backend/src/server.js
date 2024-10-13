const express = require('express');
const cors = require('cors');
const app = express();

// Importando middlewares de autenticação e função
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

// Importando rotas para jogadores (player)
const playerRoutes = require('./routes/player/playerRoutes');
const reservationRoutes = require('./routes/player/reservationRoutes');

// Importando rotas para donos de quadras (owner)
const courtManagementRoutes = require('./routes/owner/courtManagementRoutes');
const ownerReservationsRoutes = require('./routes/owner/ownerReservationsRoutes');

// Importando autenticação e usuário
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Middleware de logging para todas as requisições
app.use((req, res, next) => {
  console.log(`\n=== Nova requisição recebida ===`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Body:`, req.body);
  console.log('==============================\n');
  next();
});

// Rotas protegidas por autenticação e verificação de funções
app.use('/api/player', authMiddleware, roleMiddleware(['player']), playerRoutes);
app.use('/api/player/reservations', authMiddleware, roleMiddleware(['player']), reservationRoutes);

// Rotas protegidas para donos de quadras
app.use('/api/owner/courts', authMiddleware, roleMiddleware(['owner']), courtManagementRoutes);
app.use('/api/owner/reservations', authMiddleware, roleMiddleware(['owner']), ownerReservationsRoutes);

// Rotas públicas de autenticação e usuários
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);

// Rota de teste no server.js
app.get('/api/test', (req, res) => {
  res.json({ message: 'Rota de teste funcionando!' });
});

// Listando rotas registradas para depuração
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(`Rota registrada: ${r.route.path} [${Object.keys(r.route.methods)}]`);
  }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});