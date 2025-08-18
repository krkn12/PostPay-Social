export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('pt-BR').format(number);
};

export const formatPoints = (points) => {
  if (!points && points !== 0) return '0 pts';
  return `${formatNumber(points)} pts`;
};

export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};