const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Survey = sequelize.define('Survey', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Título é obrigatório' },
      len: { args: [5, 100], msg: 'Título deve ter entre 5 e 100 caracteres' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: { args: [10, 500], msg: 'Descrição deve ter entre 10 e 500 caracteres' }
    }
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidQuestions(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Deve ter pelo menos uma pergunta');
        }
      }
    }
  },
  pointsReward: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Recompensa deve ser pelo menos 1 ponto' }
    }
  },
  initialPoints: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  remainingPoints: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('marketing', 'product', 'service', 'general'),
    defaultValue: 'general'
  },
  targetAudience: DataTypes.JSON,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: DataTypes.DATE,
  maxResponses: DataTypes.INTEGER,
  currentResponses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
});

// Métodos de instância
Survey.prototype.canUserParticipate = function(userId) {
  if (!this.isActive) return false;
  if (this.endDate && new Date() > this.endDate) return false;
  if (this.maxResponses && this.currentResponses >= this.maxResponses) return false;
  if (this.remainingPoints < this.pointsReward) return false;
  
  return true;
};

Survey.prototype.completeForUser = async function(userId, pointsEarned) {
  this.currentResponses += 1;
  this.remainingPoints -= pointsEarned;
  await this.save();
  
  return {
    surveyId: this.id,
    pointsEarned,
    remainingPoints: this.remainingPoints
  };
};

module.exports = Survey;