const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Quantidade deve ser maior que 0' }
    }
  },
  pointsPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Preço em pontos no momento da compra'
  },
  productSnapshot: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Snapshot dos dados do produto no momento da compra'
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

module.exports = OrderItem;