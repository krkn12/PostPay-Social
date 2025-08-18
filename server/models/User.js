const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome é obrigatório' },
      len: { args: [2, 50], msg: 'Nome deve ter entre 2 e 50 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 100], msg: 'Senha deve ter pelo menos 6 caracteres' }
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Pontos não podem ser negativos' }
    }
  },
  totalEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  subscriptionType: {
    type: DataTypes.ENUM('free', 'premium', 'vip'),
    defaultValue: 'free'
  },
  subscriptionStartDate: DataTypes.DATE,
  subscriptionEndDate: DataTypes.DATE,
  stripeCustomerId: DataTypes.STRING,
  stripeSubscriptionId: DataTypes.STRING,
  avatar: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.JSON,
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      notifications: true,
      newsletter: true
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: DataTypes.DATE
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Métodos de instância
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.isSubscriber = function() {
  return this.subscriptionType !== 'free' && 
         this.subscriptionEndDate && 
         new Date() < this.subscriptionEndDate;
};

User.prototype.addPoints = async function(points, reason = 'general') {
  this.points += points;
  this.totalEarned += points;
  await this.save();
  
  // Log da transação de pontos
  console.log(`Usuário ${this.name} ganhou ${points} pontos. Motivo: ${reason}`);
  return this.points;
};

module.exports = User;