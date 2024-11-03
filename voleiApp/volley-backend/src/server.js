// Importando dependências
const express = require('express');
const cors = require('cors');
const app = express();

// Importando middlewares de autenticação e função
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

// Importando rotas para jogadores (player)
const playerRoutes = require('./routes/player/playerRoutes'); // Rotas do jogador, incluindo /quadras/disponiveis
const reservationRoutes = require('./routes/player/reservationRoutes');

// Importando rotas para donos de quadras (owner)
const courtManagementRoutes = require('./routes/owner/courtManagementRoutes');
const ownerReservationsRoutes = require('./routes/owner/ownerReservationsRoutes');

// Importando autenticação e usuário
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Importando rotas para empresas
const companyRoutes = require('./routes/companyRoutes'); // Nova rota para empresas


// Importando rotas para convites
const inviteRoutes = require('./routes/invites/inviteRoutes'); // Nova rota para convites
const inviteUserRoutes = require('./routes/invites/inviteUserRoutes'); // Nova rota para convites do usuário

=======

// Configurando middlewares globais
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

// Rotas para jogadores protegidas por autenticação e verificação de função
// Permite tanto "player" quanto "jogador" como papéis permitidos
app.use('/api/player', authMiddleware, roleMiddleware(['player', 'jogador']), playerRoutes);
app.use('/api/player/reservations', authMiddleware, roleMiddleware(['player', 'jogador']), reservationRoutes);

// Rotas para donos de quadras protegidas por autenticação e verificação de função
app.use('/api/owner/courts', authMiddleware, roleMiddleware(['owner']), courtManagementRoutes);
app.use('/api/owner/reservations', authMiddleware, roleMiddleware(['owner']), ownerReservationsRoutes);

// Rotas para empresas (sem autenticação, caso seja acessível a todos)
app.use('/api/empresas', companyRoutes);


// Rotas para convites (protegidas por autenticação)
app.use('/api/invites', authMiddleware, inviteRoutes);
app.use('/api/invites/user', authMiddleware, inviteUserRoutes); // Ajuste para evitar conflito de rota com inviteRoutes

=======

// Rotas públicas de autenticação e usuários
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);

// Rota de teste no server.js para verificar o funcionamento
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
