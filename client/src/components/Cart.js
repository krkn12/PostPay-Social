import React, { useState, useEffect } from 'react';
import RewardsService from '../services/rewardsService';
import './Cart.css';

const Cart = ({ cart, userPoints, onClose, onUpdateQuantity, onRemoveItem, onOrderComplete }) => {
  const [step, setStep] = useState('cart'); // cart, shipping, checkout, success
  const [shippingData, setShippingData] = useState({
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [shippingCost, setShippingCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const getTotalPoints = () => {
    return cart.reduce((total, item) => total + (item.pointsPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const canProceed = () => {
    const totalPoints = getTotalPoints();
    return cart.length > 0 && userPoints?.availablePoints >= totalPoints;
  };

  const handleCalculateShipping = async () => {
    if (!shippingData.cep || shippingData.cep.length < 8) {
      setError('CEP inválido');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      
      const result = await RewardsService.calculateShipping(items, shippingData.cep);
      setShippingCost(result);
    } catch (error) {
      setError('Erro ao calcular frete');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOrder = async () => {
    if (!shippingCost) {
      setError('Calcule o frete primeiro');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          cep: shippingData.cep,
          address: shippingData.address,
          number: shippingData.number,
          complement: shippingData.complement,
          neighborhood: shippingData.neighborhood,
          city: shippingData.city,
          state: shippingData.state
        },
        shippingCost: shippingCost.cost
      };

      const result = await RewardsService.createOrder(orderData);
      setOrderResult(result);
      setStep('success');
      onOrderComplete();
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  const renderCartStep = () => (
    <div className="cart-step">
      <h3>🛒 Seu Carrinho ({getTotalItems()} itens)</h3>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio</p>
          <button onClick={onClose}>Continuar Comprando</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <img 
                  src={item.product.imageUrl || '/placeholder-product.png'} 
                  alt={item.product.name}
                />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>{item.pointsPrice} pontos cada</p>
                </div>
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="item-total">
                  {item.pointsPrice * item.quantity} pontos
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-line">
              <span>Total de pontos:</span>
              <strong>{getTotalPoints()} pontos</strong>
            </div>
            <div className="summary-line">
              <span>Seus pontos disponíveis:</span>
              <span className={userPoints?.availablePoints >= getTotalPoints() ? 'sufficient' : 'insufficient'}>
                {userPoints?.availablePoints || 0} pontos
              </span>
            </div>
            {!canProceed() && (
              <div className="insufficient-points">
                ❌ Pontos insuficientes. Faltam {getTotalPoints() - (userPoints?.availablePoints || 0)} pontos.
              </div>
            )}
          </div>
          
          <div className="cart-actions">
            <button onClick={onClose}>Continuar Comprando</button>
            <button 
              className="proceed-btn"
              onClick={() => setStep('shipping')}
              disabled={!canProceed()}
            >
              Continuar para Entrega
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderShippingStep = () => (
    <div className="shipping-step">
      <h3>📦 Dados de Entrega</h3>
      
      <form className="shipping-form">
        <div className="form-row">
          <div className="form-group">
            <label>CEP:</label>
            <input
              type="text"
              value={shippingData.cep}
              onChange={(e) => setShippingData({...shippingData, cep: e.target.value})}
              placeholder="00000-000"
              maxLength="9"
            />
            <button 
              type="button" 
              onClick={handleCalculateShipping}
              disabled={loading}
            >
              {loading ? 'Calculando...' : 'Calcular Frete'}
            </button>
          </div>
        </div>
        
        {shippingCost && (
          <div className="shipping-result">
            <div className="shipping-info">
              <span>💰 Frete: R$ {shippingCost.cost}</span>
              <span>📅 Entrega: {shippingCost.estimatedDays} dias úteis</span>
            </div>
          </div>
        )}
        
        <div className="form-row">
          <div className="form-group flex-2">
            <label>Endereço:</label>
            <input
              type="text"
              value={shippingData.address}
              onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
              placeholder="Rua, Avenida..."
            />
          </div>
          <div className="form-group">
            <label>Número:</label>
            <input
              type="text"
              value={shippingData.number}
              onChange={(e) => setShippingData({...shippingData, number: e.target.value})}
              placeholder="123"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Complemento:</label>
            <input
              type="text"
              value={shippingData.complement}
              onChange={(e) => setShippingData({...shippingData, complement: e.target.value})}
              placeholder="Apto, Bloco..."
            />
          </div>
          <div className="form-group">
            <label>Bairro:</label>
            <input
              type="text"
              value={shippingData.neighborhood}
              onChange={(e) => setShippingData({...shippingData, neighborhood: e.target.value})}
              placeholder="Centro"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group flex-2">
            <label>Cidade:</label>
            <input
              type="text"
              value={shippingData.city}
              onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
              placeholder="São Paulo"
            />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select
              value={shippingData.state}
              onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
            >
              <option value="">Selecione</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              <option value="RS">RS</option>
              <option value="PR">PR</option>
              <option value="SC">SC</option>
              {/* Adicionar outros estados conforme necessário */}
            </select>
          </div>
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="shipping-actions">
        <button onClick={() => setStep('cart')}>Voltar ao Carrinho</button>
        <button 
          className="proceed-btn"
          onClick={() => setStep('checkout')}
          disabled={!shippingCost || !shippingData.address || !shippingData.city}
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );

  const renderCheckoutStep = () => (
    <div className="checkout-step">
      <h3>✅ Confirmar Pedido</h3>
      
      <div className="order-summary">
        <div className="summary-section">
          <h4>Itens do Pedido:</h4>
          {cart.map(item => (
            <div key={item.productId} className="summary-item">
              <span>{item.product.name} x{item.quantity}</span>
              <span>{item.pointsPrice * item.quantity} pontos</span>
            </div>
          ))}
        </div>
        
        <div className="summary-section">
          <h4>Entrega:</h4>
          <p>{shippingData.address}, {shippingData.number}</p>
          <p>{shippingData.neighborhood} - {shippingData.city}/{shippingData.state}</p>
          <p>CEP: {shippingData.cep}</p>
          <p>Frete: R$ {shippingCost?.cost} ({shippingCost?.estimatedDays} dias úteis)</p>
        </div>
        
        <div className="summary-section">
          <h4>Pagamento:</h4>
          <div className="payment-summary">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>{getTotalPoints()} pontos</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <strong>{getTotalPoints()} pontos</strong>
            </div>
            <div className="summary-line">
              <span>Saldo após compra:</span>
              <span>{(userPoints?.availablePoints || 0) - getTotalPoints()} pontos</span>
            </div>
          </div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-actions">
        <button onClick={() => setStep('shipping')}>Voltar</button>
        <button 
          className="finish-btn"
          onClick={handleFinishOrder}
          disabled={loading}
        >
          {loading ? 'Finalizando...' : '🎉 Finalizar Pedido'}
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="success-step">
      <div className="success-content">
        <div className="success-icon">🎉</div>
        <h3>Pedido Realizado com Sucesso!</h3>
        <p>Número do pedido: <strong>{orderResult?.orderNumber}</strong></p>
        <p>Seus pontos foram debitados e o pedido está sendo preparado.</p>
        <p>Você receberá atualizações sobre o status da entrega.</p>
        
        <div className="success-actions">
          <button onClick={onClose}>Continuar Comprando</button>
          <button onClick={() => window.location.href = '/orders'}>Ver Meus Pedidos</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <div className="cart-steps">
            <div className={`step ${step === 'cart' ? 'active' : step !== 'cart' ? 'completed' : ''}`}>1. Carrinho</div>
            <div className={`step ${step === 'shipping' ? 'active' : ['checkout', 'success'].includes(step) ? 'completed' : ''}`}>2. Entrega</div>
            <div className={`step ${step === 'checkout' ? 'active' : step === 'success' ? 'completed' : ''}`}>3. Confirmar</div>
            <div className={`step ${step === 'success' ? 'active' : ''}`}>4. Concluído</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="cart-content">
          {step === 'cart' && renderCartStep()}
          {step === 'shipping' && renderShippingStep()}
          {step === 'checkout' && renderCheckoutStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
};

export default Cart;