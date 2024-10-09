const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// Importando rotas
const userRoutes = require('./routes/userRoutes');
console.log('userRoutes:', userRoutes); // Log para verificar a importação
const courtRoutes = require('./routes/courtRoutes');
const authRoutes = require('./routes/authRoutes');

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

// Registrando rotas
app.use('/api/usuarios', userRoutes);
app.use('/api/quadras', courtRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste no server.js
app.get('/api/test', (req, res) => {
  res.json({ message: 'Rota de teste funcionando!' });
});

// Listando rotas registradas para depuração
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(
      `Rota registrada: ${r.route.path} [${Object.keys(r.route.methods)}]`
    );
  }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});