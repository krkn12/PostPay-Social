import api from './api';

const userService = {
  // Buscar perfil do usuário
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Atualizar perfil
  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Buscar estatísticas do usuário
  async getUserStats() {
    const response = await api.get('/users/dashboard');
    return response.data;
  }
};

export default userService;