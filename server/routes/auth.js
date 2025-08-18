const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Remover a redefinição duplicada do middleware
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: true, 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { name, email, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        error: true, 
        message: 'Usuário já existe com este email' 
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password
    });

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remover senha da resposta
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: true, 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        error: true, 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: true, 
        message: 'Credenciais inválidas' 
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remover senha da resposta
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Verificar token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const userResponse = req.user.toJSON();
    delete userResponse.password;
    
    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Perfil do usuário
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userResponse = req.user.toJSON();
    delete userResponse.password;
    
    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
// Remover: module.exports.authenticateToken = authenticateToken;