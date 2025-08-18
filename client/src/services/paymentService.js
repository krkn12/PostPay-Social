const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class PaymentService {
  // Obter métodos de pagamento do usuário
  async getPaymentMethods() {
    try {
      const response = await fetch(`${API_URL}/payment/methods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar métodos de pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no serviço de métodos de pagamento:', error);
      throw error;
    }
  }

  // Adicionar novo método de pagamento
  async addPaymentMethod(methodData) {
    try {
      const response = await fetch(`${API_URL}/payment/methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(methodData)
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar método de pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw error;
    }
  }

  // Remover método de pagamento
  async removePaymentMethod(methodId) {
    try {
      const response = await fetch(`${API_URL}/payment/methods/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao remover método de pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao remover método de pagamento:', error);
      throw error;
    }
  }

  // Processar assinatura
  async processSubscription(subscriptionData) {
    try {
      const response = await fetch(`${API_URL}/subscription/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subscriptionData)
      });

      if (!response.ok) {
        throw new Error('Erro ao processar assinatura');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      throw error;
    }
  }

  // Cancelar assinatura
  async cancelSubscription() {
    try {
      const response = await fetch(`${API_URL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao cancelar assinatura');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  // Obter histórico de pagamentos
  async getPaymentHistory(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/payment/history?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de pagamentos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no histórico de pagamentos:', error);
      throw error;
    }
  }

  // Gerar link de pagamento PIX
  async generatePixPayment(amount, description) {
    try {
      const response = await fetch(`${API_URL}/payment/pix/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount, description })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar pagamento PIX');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      throw error;
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${API_URL}/payment/status/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }
}

export default new PaymentService();