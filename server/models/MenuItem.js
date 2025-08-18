const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome do item é obrigatório' }
    }
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Label do item é obrigatório' }
    }
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'MenuItems',
      key: 'id'
    }
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Ordem deve ser um número positivo' }
    }
  },
  category: {
    type: DataTypes.ENUM('main', 'account', 'admin', 'support'),
    allowNull: false,
    defaultValue: 'main'
  },
  requiredRole: {
    type: DataTypes.ENUM('user', 'admin', 'premium', 'vip'),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hasSubmenu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  badge: {
    type: DataTypes.JSON,
    defaultValue: null,
    comment: 'Configuração do badge: {type: "count", source: "notifications", color: "red"}'
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array de permissões necessárias para acessar este item'
  }
}, {
  tableName: 'menu_items',
  timestamps: true
  // Removendo os indexes temporariamente
});

// Associações
MenuItem.hasMany(MenuItem, { 
  as: 'children', 
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
});
MenuItem.belongsTo(MenuItem, { 
  as: 'parent', 
  foreignKey: 'parentId'
});

module.exports = MenuItem;