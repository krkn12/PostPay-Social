'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela menu_items
    await queryInterface.createTable('menu_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      label: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      path: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      parentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'menu_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      category: {
        type: Sequelize.ENUM('main', 'account', 'admin', 'support'),
        allowNull: false,
        defaultValue: 'main'
      },
      requiredRole: {
        type: Sequelize.ENUM('user', 'admin', 'premium', 'vip'),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      hasSubmenu: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      badge: {
        type: Sequelize.JSON,
        defaultValue: null
      },
      permissions: {
        type: Sequelize.JSON,
        defaultValue: '[]'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar tabela user_permissions
    await queryInterface.createTable('user_permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      resource: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      grantedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      grantedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar tabela sidebar_configs
    await queryInterface.createTable('sidebar_configs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isCollapsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      pinnedItems: {
        type: Sequelize.JSON,
        defaultValue: '[]'
      },
      hiddenItems: {
        type: Sequelize.JSON,
        defaultValue: '[]'
      },
      customOrder: {
        type: Sequelize.JSON,
        defaultValue: null
      },
      theme: {
        type: Sequelize.ENUM('light', 'dark', 'auto'),
        defaultValue: 'auto'
      },
      showBadges: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      showIcons: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar índices
    await queryInterface.addIndex('menu_items', ['category', 'order']);
    await queryInterface.addIndex('menu_items', ['parentId']);
    await queryInterface.addIndex('menu_items', ['isActive']);
    
    await queryInterface.addIndex('user_permissions', ['userId', 'permission'], {
      unique: true
    });
    await queryInterface.addIndex('user_permissions', ['permission']);
    await queryInterface.addIndex('user_permissions', ['isActive']);
    
    await queryInterface.addIndex('sidebar_configs', ['userId'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sidebar_configs');
    await queryInterface.dropTable('user_permissions');
    await queryInterface.dropTable('menu_items');
  }
};