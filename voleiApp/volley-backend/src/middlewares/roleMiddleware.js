// Middleware para verificar a função do usuário
const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const userRole = req.userRole; // Verifique se está sendo passado pelo token ou de outra forma
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;