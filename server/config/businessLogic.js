// Configurações do modelo de negócio
const BUSINESS_CONFIG = {
  // Receitas
  SURVEY_CREATION_FEES: {
    basic: 50.00,      // R$ 50 por pesquisa básica (até 100 respostas)
    premium: 150.00,   // R$ 150 por pesquisa premium (até 500 respostas)
    enterprise: 400.00 // R$ 400 por pesquisa enterprise (até 2000 respostas)
  },
  
  SUBSCRIPTION_FEES: {
    premium: 29.90,    // R$ 29,90/mês
    vip: 59.90        // R$ 59,90/mês
  },
  
  // Custos operacionais
  POINT_VALUES: {
    survey_completion: 100,     // 100 pontos por pesquisa
    subscription_bonus: 500,    // 500 pontos bônus mensal
    referral_bonus: 200        // 200 pontos por indicação
  },
  
  // Conversão de pontos (apenas VIP)
  CASH_CONVERSION: {
    rate: 0.005,              // R$ 0,005 por ponto (1000 pontos = R$ 5,00)
    min_points: 2000,         // Mínimo 2000 pontos para saque
    max_monthly: 500.00,      // Máximo R$ 500 por mês por usuário
    fee_percentage: 0.05      // Taxa de 5% sobre conversões
  },
  
  // Margem de segurança
  PROFIT_MARGINS: {
    survey_margin: 0.70,      // 70% de margem nas pesquisas
    subscription_margin: 0.60, // 60% de margem nas assinaturas
    product_margin: 0.40      // 40% de margem nos produtos físicos
  }
};

module.exports = BUSINESS_CONFIG;