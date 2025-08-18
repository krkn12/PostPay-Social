const express = require('express');
const router = express.Router();
const sidebarService = require('../services/sidebarService');
const auth = require('../middleware/auth');

// Buscar itens de menu do usuário
router.get('/menu', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'user';
    
    const menuItems = await sidebarService.getMenuItems(userId, userRole);
    
    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    console.error('Erro ao buscar menu:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Buscar dados dinâmicos da sidebar
router.get('/data', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sidebarData = await sidebarService.getSidebarData(userId);
    
    res.json({
      success: true,
      data: sidebarData
    });
  } catch (error) {
    console.error('Erro ao buscar dados da sidebar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Buscar configurações da sidebar
router.get('/config', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const config = await sidebarService.getSidebarConfig(userId);
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Erro ao buscar configuração da sidebar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Atualizar configurações da sidebar
router.put('/config', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const configData = req.body;
    
    const config = await sidebarService.updateSidebarConfig(userId, configData);
    
    res.json({
      success: true,
      data: config,
      message: 'Configuração atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar configuração da sidebar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Buscar permissões do usuário
router.get('/permissions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const permissions = await sidebarService.getUserPermissions(userId);
    
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Verificar permissão específica
router.get('/permissions/:permission', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const permission = req.params.permission;
    
    const hasPermission = await sidebarService.hasPermission(userId, permission);
    
    res.json({
      success: true,
      data: {
        permission,
        hasPermission
      }
    });
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;