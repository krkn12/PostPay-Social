const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PointsTransaction = sequelize.define('PointsTransaction', {
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
  type: {
    type: DataTypes.ENUM('earned', 'spent', 'refund', 'bonus', 'penalty'),
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notZero: function(value) {
        if (value === 0) {
          throw new Error('Quantidade de pontos deve ser diferente de zero');
        }
      }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  relatedOrderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  relatedSurveyId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Surveys',
      key: 'id'
    }
  },
  balanceAfter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Saldo de pontos após esta transação'
  }
}, {
  tableName: 'points_transactions',
  timestamps: true
});

module.exports = PointsTransaction;