const { sequelize } = require('../config/database');
const { 
  User, 
  Survey, 
  SurveyResponse, 
  CashConversion,
  Product,
  MenuItem,
  UserPermission,
  SidebarConfig
} = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Iniciando migrations...');
    
    // Dropar todas as tabelas primeiro
    await sequelize.drop();
    
    // Criar tabelas uma por uma sem índices
    const models = [User, Survey, SurveyResponse, CashConversion, Product, MenuItem, UserPermission, SidebarConfig];
    
    for (const model of models) {
      await model.sync({ force: false });
      console.log(`✅ Tabela ${model.tableName} criada`);
    }
    
    console.log('✅ Migrations concluídas com sucesso!');
    console.log('📊 Todas as tabelas foram criadas:');
    console.log('  - Users');
    console.log('  - Surveys');
    console.log('  - SurveyResponses');
    console.log('  - CashConversions');
    console.log('  - MenuItems');
    console.log('  - UserPermissions');
    console.log('  - SidebarConfigs');
    
  } catch (error) {
    console.error('❌ Erro nas migrations:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  migrate().then(() => process.exit(0));
}

module.exports = migrate;