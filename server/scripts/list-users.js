const { sequelize } = require('../config/database');
const { User } = require('../models');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectado (list-users)');
    const users = await User.findAll({ attributes: ['id', 'email', 'name', 'isActive', 'createdAt'] });
    console.log('Users count:', users.length);
    users.forEach(u => console.log(u.toJSON()));
    process.exit(0);
  } catch (err) {
    console.error('Erro list-users:', err);
    process.exit(1);
  }
};

run();
