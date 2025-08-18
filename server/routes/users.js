const express = require('express');
const { User, SurveyResponse, CashConversion } = require('../models');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Dashboard do usuário
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Estatísticas do usuário
    const totalSurveys = await SurveyResponse.count({
      where: { userId: user.id }
    });
    
    // Contar pesquisas pendentes (surveys disponíveis que o usuário ainda não fez)
    const { Survey } = require('../models');
    const availableSurveys = await Survey.count({
      where: {
        isActive: true,
        endDate: {
          [require('sequelize').Op.or]: [
            { [require('sequelize').Op.gte]: new Date() },
            { [require('sequelize').Op.is]: null }
          ]
        }
      }
    });
    
    const pendingSurveys = Math.max(0, availableSurveys - totalSurveys);
    
    const totalConversions = await CashConversion.sum('netAmount', {
      where: { 
        userId: user.id,
        status: 'completed'
      }
    }) || 0;
    
    // Últimas atividades
    const recentSurveys = await SurveyResponse.findAll({
      where: { userId: user.id },
      include: [{
        model: require('../models').Survey,
        as: 'survey',
        attributes: ['title', 'category']
      }],
      order: [['completedAt', 'DESC']],
      limit: 5
    });
    
    res.json({
      success: true,
      dashboard: {
        user: {
          name: user.name,
          email: user.email,
          points: user.points,
          totalEarned: user.totalEarned,
          subscriptionType: user.subscriptionType,
          isSubscriber: user.isSubscriber()
        },
        stats: {
          totalSurveys: totalSurveys,
          pendingSurveys: pendingSurveys,
          totalConversions: parseFloat(totalConversions),
          pointsToday: 0 // Implementar lógica para pontos de hoje
        },
        recentActivity: recentSurveys
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Atualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };
    
    await req.user.update(updateData);
    
    const userResponse = req.user.toJSON();
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Dados da sidebar
router.get('/sidebar-data', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { Op } = require('sequelize');
    
    // Contar pesquisas disponíveis com base no BD
    const availableSurveys = await require('../models').Survey.count({
      where: {
        isActive: true,
        endDate: {
          [Op.or]: [
            { [Op.gte]: new Date() },
            { [Op.is]: null }
          ]
        }
      }
    }) || 0;

    // Notificações: modelo de notificacao não existe - retornar 0 por enquanto
    const notificationCount = 0;

    // Pesquisas em andamento: aproximar como availableSurveys - totalRespondidas pelo usuário
    const totalResponded = await SurveyResponse.count({ where: { userId: user.id } }) || 0;
    const pendingSurveys = Math.max(0, availableSurveys - totalResponded);

    res.json({
      success: true,
      notificationCount,
      availableSurveys,
      pendingSurveys,
      subscriptionStatus: user.subscriptionType
    });
  } catch (error) {
    console.error('Erro ao buscar dados da sidebar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;