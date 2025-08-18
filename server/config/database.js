const { Sequelize } = require('sequelize');
const path = require('path');

// Configuração do SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database', 'postpay.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Teste de conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão SQLite estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com SQLite:', error);
  }
};

module.exports = { sequelize, testConnection };