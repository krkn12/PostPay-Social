const User = require('./User');
const Survey = require('./Survey');
const SurveyResponse = require('./SurveyResponse');
const CashConversion = require('./CashConversion');
const MenuItem = require('./MenuItem');
const UserPermission = require('./UserPermission');
const SidebarConfig = require('./SidebarConfig');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const UserPoints = require('./UserPoints');
const PointsTransaction = require('./PointsTransaction');

// Definir associações existentes
User.hasMany(Survey, { foreignKey: 'createdBy', as: 'createdSurveys' });
Survey.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(SurveyResponse, { foreignKey: 'userId', as: 'responses' });
SurveyResponse.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Survey.hasMany(SurveyResponse, { foreignKey: 'surveyId', as: 'responses' });
SurveyResponse.belongsTo(Survey, { foreignKey: 'surveyId', as: 'survey' });

User.hasMany(CashConversion, { foreignKey: 'userId', as: 'conversions' });
CashConversion.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Associações para sidebar
User.hasMany(UserPermission, { foreignKey: 'userId', as: 'permissions' });
UserPermission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(UserPermission, { foreignKey: 'grantedBy', as: 'grantedPermissions' });
UserPermission.belongsTo(User, { foreignKey: 'grantedBy', as: 'grantor' });

User.hasOne(SidebarConfig, { foreignKey: 'userId', as: 'sidebarConfig' });
SidebarConfig.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Associações para loja de recompensas
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Alterar esta linha:
// User.hasOne(UserPoints, { foreignKey: 'userId', as: 'points' });
// Para:
User.hasOne(UserPoints, { foreignKey: 'userId', as: 'userPoints' });
UserPoints.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PointsTransaction, { foreignKey: 'userId', as: 'pointsTransactions' });
PointsTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(PointsTransaction, { foreignKey: 'relatedOrderId', as: 'pointsTransactions' });
PointsTransaction.belongsTo(Order, { foreignKey: 'relatedOrderId', as: 'relatedOrder' });

Survey.hasMany(PointsTransaction, { foreignKey: 'relatedSurveyId', as: 'pointsTransactions' });
PointsTransaction.belongsTo(Survey, { foreignKey: 'relatedSurveyId', as: 'relatedSurvey' });

module.exports = {
  User,
  Survey,
  SurveyResponse,
  CashConversion,
  MenuItem,
  UserPermission,
  SidebarConfig,
  Product,
  Order,
  OrderItem,
  UserPoints,
  PointsTransaction
};