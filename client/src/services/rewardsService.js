import api from './api';

class RewardsService {
  // Produtos
  static async getProducts() {
    const response = await api.get('/rewards/products');
    return response.data;
  }

  // Pontos do usuário
  static async getUserPoints() {
    const response = await api.get('/rewards/points');
    return response.data;
  }

  // Calcular frete
  static async calculateShipping(items, cep) {
    const response = await api.post('/rewards/calculate-shipping', { items, cep });
    return response.data;
  }

  // Criar pedido
  static async createOrder(orderData) {
    const response = await api.post('/rewards/orders', orderData);
    return response.data;
  }

  // Listar pedidos
  static async getUserOrders() {
    const response = await api.get('/rewards/orders');
    return response.data;
  }
}

export default RewardsService;