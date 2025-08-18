// Validadores para formulários e dados

/**
 * Validar email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar senha forte
 * @param {string} password - Senha a ser validada
 * @returns {object} Objeto com resultado e mensagens
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: [],
    strength: 'weak'
  };

  if (!password) {
    result.isValid = false;
    result.errors.push('Senha é obrigatória');
    return result;
  }

  if (password.length < 8) {
    result.isValid = false;
    result.errors.push('Senha deve ter pelo menos 8 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/\d/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve conter pelo menos um número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve conter pelo menos um caractere especial');
  }

  // Calcular força da senha
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength <= 2) result.strength = 'weak';
  else if (strength <= 4) result.strength = 'medium';
  else result.strength = 'strong';

  return result;
};

/**
 * Validar CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;

  // Remover caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');

  // Verificar se tem 11 dígitos
  if (cleaned.length !== 11) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

/**
 * Validar telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} True se válido
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;

  const cleaned = phone.replace(/\D/g, '');
  
  // Aceitar telefones com 10 ou 11 dígitos
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Validar CEP
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCEP = (cep) => {
  if (!cep) return false;

  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

/**
 * Validar URL
 * @param {string} url - URL a ser validada
 * @returns {boolean} True se válido
 */
export const isValidURL = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validar idade mínima
 * @param {string|Date} birthDate - Data de nascimento
 * @param {number} minAge - Idade mínima
 * @returns {boolean} True se válido
 */
export const isValidAge = (birthDate, minAge = 18) => {
  if (!birthDate) return false;

  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }

  return age >= minAge;
};

/**
 * Validar campo obrigatório
 * @param {any} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validar comprimento mínimo
 * @param {string} value - Valor a ser validado
 * @param {number} minLength - Comprimento mínimo
 * @returns {boolean} True se válido
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.toString().length >= minLength;
};

/**
 * Validar comprimento máximo
 * @param {string} value - Valor a ser validado
 * @param {number} maxLength - Comprimento máximo
 * @returns {boolean} True se válido
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.toString().length <= maxLength;
};

/**
 * Validar valor numérico
 * @param {any} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isNumeric = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Validar valor inteiro
 * @param {any} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isInteger = (value) => {
  if (!isNumeric(value)) return false;
  return Number.isInteger(Number(value));
};

/**
 * Validar valor positivo
 * @param {any} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isPositive = (value) => {
  if (!isNumeric(value)) return false;
  return Number(value) > 0;
};

/**
 * Validar intervalo de valores
 * @param {any} value - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True se válido
 */
export const isInRange = (value, min, max) => {
  if (!isNumeric(value)) return false;
  const num = Number(value);
  return num >= min && num <= max;
};

/**
 * Validar arquivo por extensão
 * @param {File} file - Arquivo a ser validado
 * @param {string[]} allowedExtensions - Extensões permitidas
 * @returns {boolean} True se válido
 */
export const isValidFileExtension = (file, allowedExtensions) => {
  if (!file || !file.name) return false;
  
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedExtensions.includes(extension);
};

/**
 * Validar tamanho do arquivo
 * @param {File} file - Arquivo a ser validado
 * @param {number} maxSizeInMB - Tamanho máximo em MB
 * @returns {boolean} True se válido
 */
export const isValidFileSize = (file, maxSizeInMB) => {
  if (!file) return false;
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validar formulário completo
 * @param {object} data - Dados do formulário
 * @param {object} rules - Regras de validação
 * @returns {object} Resultado da validação
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];
    const fieldErrors = [];

    fieldRules.forEach(rule => {
      if (rule.type === 'required' && !isRequired(value)) {
        fieldErrors.push(rule.message || `${field} é obrigatório`);
      } else if (rule.type === 'email' && value && !isValidEmail(value)) {
        fieldErrors.push(rule.message || 'Email inválido');
      } else if (rule.type === 'minLength' && value && !hasMinLength(value, rule.value)) {
        fieldErrors.push(rule.message || `Mínimo de ${rule.value} caracteres`);
      } else if (rule.type === 'maxLength' && value && !hasMaxLength(value, rule.value)) {
        fieldErrors.push(rule.message || `Máximo de ${rule.value} caracteres`);
      } else if (rule.type === 'numeric' && value && !isNumeric(value)) {
        fieldErrors.push(rule.message || 'Deve ser um número');
      } else if (rule.type === 'custom' && rule.validator && !rule.validator(value)) {
        fieldErrors.push(rule.message || 'Valor inválido');
      }
    });

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};