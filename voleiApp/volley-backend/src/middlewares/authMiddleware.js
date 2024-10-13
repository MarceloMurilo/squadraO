const jwt = require('jsonwebtoken');

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  const tokenWithoutBearer = token.split(' ')[1]; // Removendo o "Bearer" do token
  
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.userId = decoded.id; // Passa o ID do usuário adiante
    next();
  });
};

module.exports = authMiddleware;