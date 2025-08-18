const { sequelize } = require('../config/database');
const { User } = require('../models');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectado (debug-check-user)');
    const user = await User.findOne({ where: { email: 'teste@postpay.com' } });
    if (!user) {
      console.log('Usuário teste não encontrado');
      process.exit(0);
    }
    console.log('Usuário:', { id: user.id, email: user.email, name: user.name, isActive: user.isActive });
    console.log('Senha (hash):', user.password);
    process.exit(0);
  } catch (err) {
    console.error('Erro debug:', err);
    process.exit(1);
  }
};

run();
