import api from './api';

const cashConversionService = {
  // Calcular conversão
  async calculateConversion(points) {
    const response = await api.post('/cash-conversion/calculate', { points });
    return response.data;
  },

  // Solicitar conversão
  async requestConversion(conversionData) {
    const response = await api.post('/cash-conversion/request', conversionData);
    return response.data;
  },

  // Buscar histórico
  async getHistory() {
    const response = await api.get('/cash-conversion/history');
    return response.data;
  }
};

export default cashConversionService;