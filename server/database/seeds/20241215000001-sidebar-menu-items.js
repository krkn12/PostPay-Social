'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const menuItems = [
      // Menu Principal
      {
        id: uuidv4(),
        name: 'dashboard',
        label: 'Dashboard',
        icon: 'Dashboard',
        path: '/dashboard',
        parentId: null,
        order: 1,
        category: 'main',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: null,
        permissions: '[]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'surveys',
        label: 'Pesquisas',
        icon: 'Assignment',
        path: '/surveys',
        parentId: null,
        order: 2,
        category: 'main',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: true,
        badge: '{"type": "count", "source": "availableSurveys", "color": "primary"}',
        permissions: '["surveys.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'rewards',
        label: 'Recompensas',
        icon: 'CardGiftcard',
        path: '/rewards',
        parentId: null,
        order: 3,
        category: 'main',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: true,
        badge: null,
        permissions: '["rewards.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'rewards-store',
        label: 'Loja de Recompensas',
        icon: 'Store',
        path: '/rewards-store',
        parentId: null,
        order: 4,
        category: 'main',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: null,
        permissions: '["rewards.store.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'cash-conversion',
        label: 'Conversão',
        icon: 'AccountBalanceWallet',
        path: '/cash-conversion',
        parentId: null,
        order: 5,  // Ajustado de 4 para 5
        category: 'main',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: null,
        permissions: '["conversion.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'subscription',
        label: 'Assinatura',
        icon: 'Payment',
        path: '/subscription',
        parentId: null,
        order: 6,  // Ajustado de 5 para 6
        category: 'main',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: '{"type": "text", "source": "subscriptionStatus", "color": "warning"}',
        permissions: '["subscription.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Menu da Conta
      {
        id: uuidv4(),
        name: 'profile',
        label: 'Perfil',
        icon: 'Person',
        path: '/profile',
        parentId: null,
        order: 1,
        category: 'account',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: null,
        permissions: '["profile.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'notifications',
        label: 'Notificações',
        icon: 'Notifications',
        path: '/notifications',
        parentId: null,
        order: 2,
        category: 'account',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: '{"type": "count", "source": "notificationCount", "color": "error"}',
        permissions: '["notifications.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'settings',
        label: 'Configurações',
        icon: 'Settings',
        path: '/settings',
        parentId: null,
        order: 3,
        category: 'account',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: true,
        badge: null,
        permissions: '["settings.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Menu Admin
      {
        id: uuidv4(),
        name: 'admin',
        label: 'Administração',
        icon: 'AdminPanelSettings',
        path: '/admin',
        parentId: null,
        order: 1,
        category: 'admin',
        requiredRole: 'admin',
        isActive: true,
        hasSubmenu: true,
        badge: null,
        permissions: '["admin.view"]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Menu Suporte
      {
        id: uuidv4(),
        name: 'help',
        label: 'Ajuda',
        icon: 'Help',
        path: '/help',
        parentId: null,
        order: 1,
        category: 'support',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: null,
        permissions: '[]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'support',
        label: 'Suporte',
        icon: 'Support',
        path: '/support',
        parentId: null,
        order: 2,
        category: 'support',
        requiredRole: 'user',
        isActive: true,
        hasSubmenu: false,
        badge: null,
        permissions: '[]',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('menu_items', menuItems);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('menu_items', null, {});
  }
};