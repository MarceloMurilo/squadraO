const jwt = require('jsonwebtoken');

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    console.log("Token não fornecido.");
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token inválido:", err.message);
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Log para verificar o conteúdo decodificado do token
    console.log("Token decodificado:", decoded);

    req.user = { id: decoded.id, role: decoded.role }; // Passa o ID e o role do usuário adiante
    next();
  });
};

module.exports = authMiddleware;
