const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const BUSINESS_CONFIG = require('../config/businessLogic');

const CashConversion = sequelize.define('CashConversion', {
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
  pointsConverted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { 
        args: [BUSINESS_CONFIG.CASH_CONVERSION.min_points], 
        msg: `Mínimo ${BUSINESS_CONFIG.CASH_CONVERSION.min_points} pontos` 
      }
    }
  },
  cashAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  feeAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('pix', 'bank_transfer', 'digital_wallet'),
    allowNull: false
  },
  paymentDetails: DataTypes.JSON,
  processedAt: DataTypes.DATE,
  transactionId: DataTypes.STRING
});

// Hook para calcular valores antes de salvar
CashConversion.beforeCreate(async (conversion) => {
  const rate = BUSINESS_CONFIG.CASH_CONVERSION.rate;
  const feePercentage = BUSINESS_CONFIG.CASH_CONVERSION.fee_percentage;
  
  conversion.cashAmount = conversion.pointsConverted * rate;
  conversion.feeAmount = conversion.cashAmount * feePercentage;
  conversion.netAmount = conversion.cashAmount - conversion.feeAmount;
});

module.exports = CashConversion;