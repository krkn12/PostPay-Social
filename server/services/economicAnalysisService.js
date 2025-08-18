const BUSINESS_CONFIG = require('../config/businessLogic');

class EconomicAnalysisService {
  // Calcular receita mensal estimada
  static calculateMonthlyRevenue(metrics) {
    const {
      surveysCreated = 0,
      premiumSubscribers = 0,
      vipSubscribers = 0,
      averageSurveyPackage = 'basic'
    } = metrics;
    
    // Receita de pesquisas
    const surveyRevenue = surveysCreated * BUSINESS_CONFIG.SURVEY_CREATION_FEES[averageSurveyPackage];
    
    // Receita de assinaturas
    const subscriptionRevenue = 
      (premiumSubscribers * BUSINESS_CONFIG.SUBSCRIPTION_FEES.premium) +
      (vipSubscribers * BUSINESS_CONFIG.SUBSCRIPTION_FEES.vip);
    
    return {
      surveyRevenue,
      subscriptionRevenue,
      totalRevenue: surveyRevenue + subscriptionRevenue
    };
  }
  
  // Calcular custos operacionais
  static calculateMonthlyCosts(metrics) {
    const {
      totalUsers = 0,
      surveysCompleted = 0,
      vipCashConversions = 0,
      averageConversionAmount = 50
    } = metrics;
    
    // Custo de pontos distribuídos
    const pointsCost = surveysCompleted * BUSINESS_CONFIG.POINT_VALUES.survey_completion * 0.005;
    
    // Custo de conversões VIP
    const conversionCost = vipCashConversions * averageConversionAmount;
    
    // Custos operacionais (servidor, staff, etc.)
    const operationalCost = totalUsers * 0.50; // R$ 0,50 por usuário
    
    return {
      pointsCost,
      conversionCost,
      operationalCost,
      totalCosts: pointsCost + conversionCost + operationalCost
    };
  }
  
  // Análise de lucratividade
  static analyzeProfitability(metrics) {
    const revenue = this.calculateMonthlyRevenue(metrics);
    const costs = this.calculateMonthlyCosts(metrics);
    
    const profit = revenue.totalRevenue - costs.totalCosts;
    const profitMargin = (profit / revenue.totalRevenue) * 100;
    
    return {
      revenue,
      costs,
      profit,
      profitMargin,
      isViable: profit > 0 && profitMargin >= 20 // Margem mínima de 20%
    };
  }
}

module.exports = EconomicAnalysisService;