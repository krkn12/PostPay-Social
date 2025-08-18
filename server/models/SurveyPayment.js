const mongoose = require('mongoose');
const BUSINESS_CONFIG = require('../config/businessLogic');

const surveyPaymentSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageType: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  maxResponses: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: String,
  paidAt: Date,
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Definir preços baseados no tipo
surveyPaymentSchema.pre('save', function(next) {
  if (this.isNew) {
    const prices = {
      basic: { amount: BUSINESS_CONFIG.SURVEY_CREATION_FEES.basic, maxResponses: 100 },
      premium: { amount: BUSINESS_CONFIG.SURVEY_CREATION_FEES.premium, maxResponses: 500 },
      enterprise: { amount: BUSINESS_CONFIG.SURVEY_CREATION_FEES.enterprise, maxResponses: 2000 }
    };
    
    this.amount = prices[this.packageType].amount;
    this.maxResponses = prices[this.packageType].maxResponses;
    
    // Expirar em 30 dias
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('SurveyPayment', surveyPaymentSchema);