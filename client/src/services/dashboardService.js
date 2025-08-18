import api from './api';

const dashboardService = {
  // Buscar dados do dashboard
  async getDashboardData() {
    const response = await api.get('/users/dashboard');
    return response.data;
  },

  // Buscar histórico de conversões
  async getCashConversionHistory() {
    const response = await api.get('/cash-conversion/history');
    return response.data;
  }
};

export default dashboardService;