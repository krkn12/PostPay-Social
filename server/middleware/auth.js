const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: true, 
        message: 'Token de acesso requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(403).json({ 
        error: true, 
        message: 'Usuário não encontrado ou inativo' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: true, 
      message: 'Token inválido' 
    });
  }
};

module.exports = authenticateToken;