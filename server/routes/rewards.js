const express = require('express');
const router = express.Router();
const { Product, Order, OrderItem, UserPoints, PointsTransaction, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// GET /api/rewards/products - Listar produtos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      order: [['featured', 'DESC'], ['pointsPrice', 'ASC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET /api/rewards/points - Pontos do usuário
router.get('/points', auth, async (req, res) => {
  try {
    let userPoints = await UserPoints.findOne({ where: { userId: req.user.id } });
    if (!userPoints) {
      userPoints = await UserPoints.create({ userId: req.user.id });
    }
    res.json(userPoints);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pontos' });
  }
});

// POST /api/rewards/calculate-shipping - Calcular frete
router.post('/calculate-shipping', auth, async (req, res) => {
  try {
    const { items, cep } = req.body;
    let totalWeight = 0;
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        totalWeight += product.weight * item.quantity;
      }
    }
    
    // Cálculo simples de frete baseado no peso
    const baseRate = 15.00;
    const weightRate = totalWeight * 2.50;
    const shippingCost = Math.max(baseRate, weightRate);
    
    res.json({ 
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      estimatedDays: Math.ceil(Math.random() * 7) + 3
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular frete' });
  }
});

// POST /api/rewards/orders - Criar pedido
router.post('/orders', auth, async (req, res) => {
  const transaction = await require('../config/database').sequelize.transaction();
  
  try {
    const { items, shippingAddress, shippingCost } = req.body;
    
    // Verificar pontos do usuário
    const userPoints = await UserPoints.findOne({ 
      where: { userId: req.user.id },
      transaction 
    });
    
    let totalPoints = 0;
    const orderItems = [];
    
    // Validar produtos e calcular total
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Produto ${product?.name || 'não encontrado'} indisponível`);
      }
      
      totalPoints += product.pointsPrice * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        pointsPrice: product.pointsPrice,
        productSnapshot: {
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl
        }
      });
      
      // Reduzir estoque
      await product.update({ 
        stock: product.stock - item.quantity 
      }, { transaction });
    }
    
    if (userPoints.availablePoints < totalPoints) {
      throw new Error('Pontos insuficientes');
    }
    
    // Criar pedido
    const order = await Order.create({
      userId: req.user.id,
      totalPoints,
      shippingCost: shippingCost || 0,
      shippingAddress,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }, { transaction });
    
    // Criar itens do pedido
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      }, { transaction });
    }
    
    // Debitar pontos
    await userPoints.update({
      availablePoints: userPoints.availablePoints - totalPoints,
      usedPoints: userPoints.usedPoints + totalPoints,
      lastUsed: new Date()
    }, { transaction });
    
    // Registrar transação
    await PointsTransaction.create({
      userId: req.user.id,
      type: 'spent',
      amount: -totalPoints,
      description: `Compra - Pedido ${order.orderNumber}`,
      relatedOrderId: order.id,
      balanceAfter: userPoints.availablePoints - totalPoints
    }, { transaction });
    
    await transaction.commit();
    
    const orderWithItems = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    res.status(201).json(orderWithItems);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

// GET /api/rewards/orders - Listar pedidos do usuário
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

module.exports = router;