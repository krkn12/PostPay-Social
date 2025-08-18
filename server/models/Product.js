const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome do produto é obrigatório' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pointsPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Preço em pontos deve ser maior que 0' }
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'geral'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Estoque não pode ser negativo' }
    }
  },
  weight: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0.1,
    comment: 'Peso em kg para cálculo de frete'
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Dimensões do produto {length, width, height} em cm'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Produto em destaque'
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;