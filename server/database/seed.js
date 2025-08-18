const { User, Survey, Product } = require('../models');
const { sequelize } = require('../config/database');

const seed = async () => {
  try {
    console.log('🌱 Iniciando seed...');
    
    // Criar usuário admin
    const adminUser = await User.findOrCreate({
      where: { email: 'admin@postpay.com' },
      defaults: {
        name: 'Administrador',
        email: 'admin@postpay.com',
        password: 'admin123',
        subscriptionType: 'vip',
        points: 10000
      }
    });
    
    // Criar usuário teste
    const testUser = await User.findOrCreate({
      where: { email: 'teste@postpay.com' },
      defaults: {
        name: 'Usuário Teste',
        email: 'teste@postpay.com',
        password: 'teste123',
        points: 500
      }
    });
    
    // Criar produtos de exemplo
    const products = [
      {
        name: 'Caneca PostPay',
        description: 'Caneca personalizada com logo PostPay, perfeita para seu café matinal.',
        pointsPrice: 150,
        originalPrice: 25.90,
        stock: 50,
        category: 'brindes',
        weight: 0.3,
        featured: true,
        imageUrl: '/images/products/caneca-postpay.jpg'
      },
      {
        name: 'Camiseta PostPay',
        description: 'Camiseta 100% algodão com estampa exclusiva PostPay.',
        pointsPrice: 300,
        originalPrice: 49.90,
        stock: 30,
        category: 'roupas',
        weight: 0.2,
        featured: false,
        imageUrl: '/images/products/camiseta-postpay.jpg'
      },
      {
        name: 'Chaveiro PostPay',
        description: 'Chaveiro metálico com logo PostPay gravado.',
        pointsPrice: 75,
        originalPrice: 12.90,
        stock: 100,
        category: 'brindes',
        weight: 0.05,
        featured: false,
        imageUrl: '/images/products/chaveiro-postpay.jpg'
      },
      {
        name: 'Adesivos PostPay (Pack)',
        description: 'Pack com 10 adesivos variados do PostPay para personalizar seus objetos.',
        pointsPrice: 50,
        originalPrice: 8.90,
        stock: 200,
        category: 'brindes',
        weight: 0.02,
        featured: true,
        imageUrl: '/images/products/adesivos-postpay.jpg'
      }
    ];

    for (const productData of products) {
      await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData
      });
    }
    
    // Criar pesquisa de exemplo
    // Criar pesquisa de exemplo (campos required: initialPoints, remainingPoints, createdBy)
    const admin = adminUser[0];
    const sampleSurvey = await Survey.findOrCreate({
      where: { title: 'Pesquisa de Satisfação' },
      defaults: {
        title: 'Pesquisa de Satisfação',
        description: 'Ajude-nos a melhorar nossos serviços respondendo esta pesquisa rápida.',
        questions: [
          {
            question: 'Como você avalia nosso serviço?',
            type: 'rating',
            required: true
          },
          {
            question: 'Qual sua idade?',
            type: 'multiple_choice',
            options: ['18-25', '26-35', '36-45', '46+'],
            required: true
          },
          {
            question: 'Comentários adicionais:',
            type: 'text',
            required: false
          }
        ],
        pointsReward: 50,
        isActive: true,
        initialPoints: 1000,
        remainingPoints: 1000,
        createdBy: admin.id
      }
    });
    
    console.log('✅ Seed concluído com sucesso!');
    console.log('👤 Usuários criados:', adminUser[1] ? 'Admin criado' : 'Admin já existe', '|', testUser[1] ? 'Teste criado' : 'Teste já existe');
    console.log('📋 Pesquisa criada:', sampleSurvey[1] ? 'Nova pesquisa' : 'Pesquisa já existe');
    console.log('🛍️ Produtos criados: 4 produtos de exemplo adicionados');
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
};

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}

module.exports = seed;