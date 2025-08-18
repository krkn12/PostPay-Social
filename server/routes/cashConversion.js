const express = require('express');
const CashConversionService = require('../services/cashConversionService');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Calcular conversão
router.post('/calculate', auth, [
  body('points').isInt({ min: 1 }).withMessage('Pontos devem ser um número positivo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { points } = req.body;
    
    await CashConversionService.validateConversion(req.user.id, points);
    const conversion = CashConversionService.calculateConversion(points);
    
    res.json({
      success: true,
      conversion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Solicitar conversão
router.post('/request', auth, [
  body('points').isInt({ min: 2000 }).withMessage('Mínimo 2000 pontos'),
  body('paymentMethod').isIn(['pix', 'bank_transfer', 'digital_wallet']).withMessage('Método de pagamento inválido'),
  body('paymentDetails').isObject().withMessage('Detalhes de pagamento obrigatórios')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { points, paymentMethod, paymentDetails } = req.body;
    
    const conversion = await CashConversionService.processConversion(
      req.user.id,
      points,
      paymentMethod,
      paymentDetails
    );
    
    res.json({
      success: true,
      message: 'Solicitação de conversão criada com sucesso',
      conversion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Histórico de conversões
router.get('/history', auth, async (req, res) => {
  try {
    const conversions = await CashConversion.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      conversions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico'
    });
  }
});

module.exports = router;