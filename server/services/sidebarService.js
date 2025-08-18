const { MenuItem, UserPermission, SidebarConfig, User, Survey, SurveyResponse } = require('../models');
const { Op } = require('sequelize');

class SidebarService {
  // Buscar itens de menu para um usuário específico
  async getMenuItems(userId, userRole = 'user') {
    try {
      const menuItems = await MenuItem.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { requiredRole: null },
            { requiredRole: userRole },
            { requiredRole: 'user' } // Todos podem ver itens de usuário
          ]
        },
        order: [['category', 'ASC'], ['order', 'ASC']],
        include: [
          {
            model: MenuItem,
            as: 'children',
            where: { isActive: true },
            required: false,
            order: [['order', 'ASC']]
          }
        ]
      });

      // Organizar por categoria
      const organizedMenu = {
        main: [],
        account: [],
        admin: [],
        support: []
      };

      menuItems.forEach(item => {
        if (item.parentId === null) { // Apenas itens principais
          organizedMenu[item.category].push(item);
        }
      });

      return organizedMenu;
    } catch (error) {
      throw new Error(`Erro ao buscar itens de menu: ${error.message}`);
    }
  }

  // Buscar dados dinâmicos da sidebar (badges, contadores)
  async getSidebarData(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Contar notificações não lidas (simulado por enquanto)
      const notificationCount = 0; // TODO: Implementar sistema de notificações

      // Contar pesquisas disponíveis
      const availableSurveys = await Survey.count({
        where: {
          isActive: true,
          endDate: {
            [Op.gte]: new Date()
          }
        }
      });

      // Contar pesquisas já respondidas pelo usuário
      const completedSurveys = await SurveyResponse.count({
        where: {
          userId: userId
        }
      });

      // Status da assinatura
      const subscriptionStatus = user.subscriptionType || 'free';
      const isTrialActive = user.subscriptionEndDate && 
        new Date(user.subscriptionEndDate) > new Date() && 
        user.subscriptionType === 'trial';

      return {
        notificationCount,
        availableSurveys,
        completedSurveys, // Mudei de pendingSurveys para completedSurveys
        subscriptionStatus: isTrialActive ? 'trial' : subscriptionStatus,
        userPoints: user.points || 0,
        userRole: user.role || 'user'
      };
    } catch (error) {
      throw new Error(`Erro ao buscar dados da sidebar: ${error.message}`);
    }
  }

  // Buscar configurações da sidebar do usuário
  async getSidebarConfig(userId) {
    try {
      let config = await SidebarConfig.findOne({
        where: { userId }
      });

      // Se não existe configuração, criar uma padrão
      if (!config) {
        config = await SidebarConfig.create({
          userId,
          isCollapsed: false,
          pinnedItems: [],
          hiddenItems: [],
          customOrder: null,
          theme: 'auto',
          showBadges: true,
          showIcons: true
        });
      }

      return config;
    } catch (error) {
      throw new Error(`Erro ao buscar configuração da sidebar: ${error.message}`);
    }
  }

  // Atualizar configurações da sidebar
  async updateSidebarConfig(userId, configData) {
    try {
      const [config, created] = await SidebarConfig.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          ...configData
        }
      });

      if (!created) {
        await config.update(configData);
      }

      return config;
    } catch (error) {
      throw new Error(`Erro ao atualizar configuração da sidebar: ${error.message}`);
    }
  }

  // Verificar permissões do usuário
  async getUserPermissions(userId) {
    try {
      const permissions = await UserPermission.findAll({
        where: {
          userId,
          isActive: true,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gte]: new Date() } }
          ]
        }
      });

      return permissions.map(p => p.permission);
    } catch (error) {
      throw new Error(`Erro ao buscar permissões do usuário: ${error.message}`);
    }
  }

  // Verificar se usuário tem permissão específica
  async hasPermission(userId, permission) {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      return userPermissions.includes(permission);
    } catch (error) {
      throw new Error(`Erro ao verificar permissão: ${error.message}`);
    }
  }
}

module.exports = new SidebarService();