const express = require('express');
const { Survey, SurveyResponse, User } = require('../models');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Listar pesquisas disponíveis
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      isActive: true,
      remainingPoints: { [require('sequelize').Op.gt]: 0 }
    };
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    const surveys = await Survey.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Verificar quais pesquisas o usuário já respondeu
    const userResponses = await SurveyResponse.findAll({
      where: { userId: req.user.id },
      attributes: ['surveyId']
    });
    
    const respondedSurveyIds = userResponses.map(r => r.surveyId);
    
    const surveysWithStatus = surveys.rows.map(survey => {
      const surveyData = survey.toJSON();
      surveyData.canParticipate = !respondedSurveyIds.includes(survey.id) && 
                                  survey.canUserParticipate(req.user.id);
      surveyData.alreadyParticipated = respondedSurveyIds.includes(survey.id);
      return surveyData;
    });
    
    res.json({
      success: true,
      surveys: surveysWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: surveys.count,
        pages: Math.ceil(surveys.count / limit)
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar pesquisas:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Buscar pesquisa específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const survey = await Survey.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['name']
      }]
    });
    
    if (!survey) {
      return res.status(404).json({ 
        error: true, 
        message: 'Pesquisa não encontrada' 
      });
    }
    
    // Verificar se usuário já respondeu
    const existingResponse = await SurveyResponse.findOne({
      where: {
        userId: req.user.id,
        surveyId: survey.id
      }
    });
    
    const surveyData = survey.toJSON();
    surveyData.canParticipate = !existingResponse && survey.canUserParticipate(req.user.id);
    surveyData.alreadyParticipated = !!existingResponse;
    
    res.json({
      success: true,
      survey: surveyData
    });
    
  } catch (error) {
    console.error('Erro ao buscar pesquisa:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Participar de pesquisa
router.post('/:id/participate', authenticateToken, async (req, res) => {
  try {
    const { responses } = req.body;
    
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Respostas são obrigatórias' 
      });
    }
    
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) {
      return res.status(404).json({ 
        error: true, 
        message: 'Pesquisa não encontrada' 
      });
    }
    
    // Verificar se usuário pode participar
    if (!survey.canUserParticipate(req.user.id)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Não é possível participar desta pesquisa' 
      });
    }
    
    // Verificar se já respondeu
    const existingResponse = await SurveyResponse.findOne({
      where: {
        userId: req.user.id,
        surveyId: survey.id
      }
    });
    
    if (existingResponse) {
      return res.status(400).json({ 
        error: true, 
        message: 'Você já participou desta pesquisa' 
      });
    }
    
    // Validar respostas
    const requiredQuestions = survey.questions.filter(q => q.required);
    const answeredQuestions = responses.filter(r => r.answer && r.answer.trim() !== '');
    
    if (answeredQuestions.length < requiredQuestions.length) {
      return res.status(400).json({ 
        error: true, 
        message: 'Todas as perguntas obrigatórias devem ser respondidas' 
      });
    }
    
    // Criar resposta
    const surveyResponse = await SurveyResponse.create({
      userId: req.user.id,
      surveyId: survey.id,
      responses: responses,
      pointsEarned: survey.pointsReward
    });
    
    // Atualizar pesquisa
    await survey.completeForUser(req.user.id, survey.pointsReward);
    
    // Adicionar pontos ao usuário
    await req.user.addPoints(survey.pointsReward, `Pesquisa: ${survey.title}`);
    
    res.json({
      success: true,
      message: 'Pesquisa concluída com sucesso!',
      pointsEarned: survey.pointsReward,
      newPointsBalance: req.user.points,
      response: {
        id: surveyResponse.id,
        completedAt: surveyResponse.completedAt
      }
    });
    
  } catch (error) {
    console.error('Erro ao participar da pesquisa:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Histórico de participações do usuário
router.get('/user/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const responses = await SurveyResponse.findAndCountAll({
      where: { userId: req.user.id },
      include: [{
        model: Survey,
        as: 'survey',
        attributes: ['title', 'description', 'category']
      }],
      order: [['completedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      responses: responses.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: responses.count,
        pages: Math.ceil(responses.count / limit)
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;