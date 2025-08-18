const CashConversion = require('../models/CashConversion');
const User = require('../models/User');
const BUSINESS_CONFIG = require('../config/businessLogic');

class CashConversionService {
  // Calcular valor de conversão
  static calculateConversion(points) {
    const cashAmount = points * BUSINESS_CONFIG.CASH_CONVERSION.rate;
    const feeAmount = cashAmount * BUSINESS_CONFIG.CASH_CONVERSION.fee_percentage;
    const netAmount = cashAmount - feeAmount;
    
    return {
      points,
      cashAmount: parseFloat(cashAmount.toFixed(2)),
      feeAmount: parseFloat(feeAmount.toFixed(2)),
      netAmount: parseFloat(netAmount.toFixed(2))
    };
  }
  
  // Validar elegibilidade para conversão
  static async validateConversion(userId, points) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verificar se é VIP ativo
    if (!user.isVipActive()) {
      throw new Error('Apenas usuários VIP podem converter pontos em dinheiro');
    }
    
    // Verificar pontos suficientes
    if (user.points < points) {
      throw new Error('Pontos insuficientes');
    }
    
    // Verificar mínimo
    if (points < BUSINESS_CONFIG.CASH_CONVERSION.min_points) {
      throw new Error(`Mínimo de ${BUSINESS_CONFIG.CASH_CONVERSION.min_points} pontos necessário`);
    }
    
    return true;
  }
  
  // Processar conversão
  static async processConversion(userId, points, paymentMethod, paymentDetails) {
    await this.validateConversion(userId, points);
    
    const conversion = this.calculateConversion(points);
    
    // Criar registro de conversão
    const cashConversion = new CashConversion({
      user: userId,
      pointsConverted: points,
      cashAmount: conversion.cashAmount,
      feeAmount: conversion.feeAmount,
      netAmount: conversion.netAmount,
      paymentMethod,
      paymentDetails
    });
    
    await cashConversion.save();
    
    // Debitar pontos do usuário
    await User.findByIdAndUpdate(userId, {
      $inc: { points: -points }
    });
    
    return cashConversion;
  }
  
  // Aprovar conversão (admin)
  static async approveConversion(conversionId) {
    const conversion = await CashConversion.findById(conversionId);
    
    if (!conversion) {
      throw new Error('Conversão não encontrada');
    }
    
    conversion.status = 'processing';
    conversion.processedAt = new Date();
    conversion.transactionId = `TX${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    await conversion.save();
    
    // Aqui integraria com sistema de pagamento (PIX, transferência, etc.)
    
    return conversion;
  }
}

module.exports = CashConversionService;