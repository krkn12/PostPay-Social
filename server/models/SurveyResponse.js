const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SurveyResponse = sequelize.define('SurveyResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  surveyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Survey',
      key: 'id'
    }
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false
  },
  pointsEarned: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = SurveyResponse;