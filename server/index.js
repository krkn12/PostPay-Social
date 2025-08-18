const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const migrate = require('./database/migrate');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const surveyRoutes = require('./routes/surveys');
const cashConversionRoutes = require('./routes/cashConversion');
const sidebarRoutes = require('./routes/sidebar');
const rewardsRoutes = require('./routes/rewards');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/cash-conversion', cashConversionRoutes);
app.use('/api/sidebar', sidebarRoutes);
app.use('/api/rewards', rewardsRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PostPay API funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: true,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Testar conexão com banco
    await testConnection();
    
    // Executar migrations
    await migrate();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor PostPay rodando!');
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('📋 Rotas disponíveis:');
      console.log('  - GET  /api/health');
      console.log('  - POST /api/auth/register');
      console.log('  - POST /api/auth/login');
      console.log('  - GET  /api/surveys');
      console.log('  - POST /api/surveys/:id/participate');
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;