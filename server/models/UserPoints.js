const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserPoints = sequelize.define('UserPoints', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Total de pontos não pode ser negativo' }
    }
  },
  availablePoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Pontos disponíveis não podem ser negativos' }
    }
  },
  usedPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Pontos usados não podem ser negativos' }
    }
  },
  lastEarned: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastUsed: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_points',
  timestamps: true,
  hooks: {
    beforeSave: (userPoints) => {
      // Garantir que totalPoints = availablePoints + usedPoints
      userPoints.totalPoints = userPoints.availablePoints + userPoints.usedPoints;
    }
  }
});

module.exports = UserPoints;