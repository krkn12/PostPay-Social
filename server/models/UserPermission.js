const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserPermission = sequelize.define('UserPermission', {
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
  permission: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Permissão é obrigatória' }
    }
  },
  resource: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Recurso específico ao qual a permissão se aplica'
  },
  grantedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  grantedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'user_permissions',
  timestamps: true
  // Removendo índices temporariamente
});

module.exports = UserPermission;