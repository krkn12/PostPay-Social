const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SidebarConfig = sequelize.define('SidebarConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isCollapsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pinnedItems: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array de IDs dos itens fixados pelo usuário'
  },
  hiddenItems: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array de IDs dos itens ocultos pelo usuário'
  },
  customOrder: {
    type: DataTypes.JSON,
    defaultValue: null,
    comment: 'Ordem personalizada dos itens definida pelo usuário'
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'auto'),
    defaultValue: 'auto'
  },
  showBadges: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  showIcons: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'sidebar_configs',
  timestamps: true
  // Removendo índices temporariamente
});

module.exports = SidebarConfig;