const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Total de pontos não pode ser negativo' }
    }
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Endereço de entrega completo'
  },
  trackingCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      // Gerar número do pedido único
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      order.orderNumber = `ORD${timestamp}${random}`;
    }
  }
});

module.exports = Order;