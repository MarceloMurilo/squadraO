// Middleware para verificar a função do usuário
const roleMiddleware = (roles) => {
  return (req, res, next) => {
      const userRole = req.user?.role;

      // Log para verificar o papel do usuário
      console.log("Papel do usuário:", userRole);
      console.log("Papéis permitidos:", roles);

      if (!userRole || !roles.includes(userRole)) {
          console.log("Acesso negado - Papel do usuário não autorizado.");
          return res.status(403).json({ message: 'Acesso negado' });
      }

      next();
  };
};

module.exports = roleMiddleware;
