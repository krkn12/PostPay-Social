const { sequelize } = require('../config/database');
const { User, SurveyResponse, CashConversion, Survey } = require('../models');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectado.');

    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'points'] });
    for (const u of users) {
      const totalSurveys = await SurveyResponse.count({ where: { userId: u.id } });
      const availableSurveys = await Survey.count({ where: { isActive: true } });
      const pendingSurveys = Math.max(0, availableSurveys - totalSurveys);
      const totalConversions = await CashConversion.sum('netAmount', { where: { userId: u.id, status: 'completed' } }) || 0;

      console.log(`User: ${u.email} (${u.name || '—'})`);
      console.log(`  points: ${u.points}`);
      console.log(`  totalSurveys: ${totalSurveys}`);
      console.log(`  availableSurveys: ${availableSurveys}`);
      console.log(`  pendingSurveys: ${pendingSurveys}`);
      console.log(`  totalConversions: ${totalConversions}`);
      console.log('---');
    }

    process.exit(0);
  } catch (err) {
    console.error('Erro no script:', err);
    process.exit(1);
  }
};

run();
