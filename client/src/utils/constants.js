// Constantes da aplicação

// URLs da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
    POINTS: '/user/points',
    SUBSCRIPTION: '/user/subscription'
  },
  SURVEYS: {
    LIST: '/surveys',
    DETAILS: '/surveys/:id',
    SUBMIT: '/surveys/:id/submit',
    HISTORY: '/surveys/history'
  },
  REWARDS: {
    LIST: '/rewards',
    REDEEM: '/rewards/:id/redeem',
    HISTORY: '/rewards/history'
  },
  CASH_CONVERSION: {
    RATES: '/cash-conversion/rates',
    CONVERT: '/cash-conversion/convert',
    HISTORY: '/cash-conversion/history',
    CANCEL: '/cash-conversion/:id/cancel'
  }
};

// Status de pesquisas
export const SURVEY_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

// Status de conversão de dinheiro
export const CASH_CONVERSION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Tipos de usuário
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Tipos de assinatura
export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  VIP: 'vip'
};

// Status de pagamentos
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Métodos de pagamento
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal'
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Configurações de pontos
export const POINTS_CONFIG = {
  MIN_CONVERSION_AMOUNT: 1000, // Mínimo de pontos para conversão
  CONVERSION_RATE: 0.01, // 1 ponto = R$ 0,01
  SURVEY_REWARD_RANGE: {
    MIN: 10,
    MAX: 500
  }
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  TIMEOUT_ERROR: 'Tempo limite excedido. Tente novamente.'
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  SURVEY_SUBMITTED: 'Pesquisa enviada com sucesso!',
  REWARD_REDEEMED: 'Recompensa resgatada com sucesso!',
  CASH_CONVERTED: 'Conversão solicitada com sucesso!',
  PASSWORD_CHANGED: 'Senha alterada com sucesso!'
};

// Configurações de tema
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#2e7d32',
    ERROR: '#d32f2f',
    WARNING: '#ed6c02',
    INFO: '#0288d1'
  },
  BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 900,
    LG: 1200,
    XL: 1536
  }
};

// Configurações de validação
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },
  EMAIL: {
    MAX_LENGTH: 254
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  }
};

export default {
  API_ENDPOINTS,
  SURVEY_STATUS,
  CASH_CONVERSION_STATUS,
  USER_ROLES,
  SUBSCRIPTION_TYPES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  PAGINATION,
  POINTS_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME_CONFIG,
  VALIDATION_RULES
};