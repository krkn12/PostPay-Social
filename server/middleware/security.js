const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configuração de segurança avançada
const securityConfig = {
  // Rate limiting mais restritivo para APIs sensíveis
  strictRateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas
    message: {
      error: 'Muitas tentativas. Tente novamente em 15 minutos.',
      retryAfter: 900
    },
    standardHeaders: true,
    legacyHeaders: false
  }),
  
  // Rate limiting padrão
  standardRateLimit: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      error: 'Limite de requisições excedido',
      retryAfter: 900
    }
  }),
  
  // Configuração do Helmet
  helmetConfig: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'https://api.stripe.com']
      }
    },
    crossOriginEmbedderPolicy: false
  })
};

module.exports = securityConfig;