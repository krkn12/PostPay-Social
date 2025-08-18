import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, userPoints }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const canAfford = userPoints >= (product.pointsPrice * quantity);
  const isInStock = product.stock > 0;
  const isAvailable = canAfford && isInStock;

  const handleAddToCart = async () => {
    if (!isAvailable) return;
    
    setIsAdding(true);
    try {
      await onAddToCart(product, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={`product-card ${!isAvailable ? 'unavailable' : ''} ${product.featured ? 'featured' : ''}`}>
      {product.featured && <div className="featured-badge">⭐ Destaque</div>}
      
      <div className="product-image">
        <img 
          src={product.imageUrl || '/placeholder-product.png'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-product.png';
          }}
        />
        {!isInStock && <div className="out-of-stock-overlay">Esgotado</div>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <div className="product-price">
            <span className="points-price">{product.pointsPrice} pontos</span>
            {product.originalPrice && (
              <span className="original-price">R$ {product.originalPrice}</span>
            )}
          </div>
          
          <div className="product-stock">
            <span className={`stock-info ${product.stock <= 5 ? 'low-stock' : ''}`}>
              {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
            </span>
          </div>
        </div>

        {isInStock && (
          <div className="quantity-selector">
            <label>Quantidade:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="product-actions">
          <button
            className={`add-to-cart-btn ${!isAvailable ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
          >
            {isAdding ? (
              '⏳ Adicionando...'
            ) : !isInStock ? (
              '❌ Esgotado'
            ) : !canAfford ? (
              `💰 Precisa de ${(product.pointsPrice * quantity) - userPoints} pontos`
            ) : (
              `🛒 Adicionar (${product.pointsPrice * quantity} pontos)`
            )}
          </button>
        </div>

        {product.weight && (
          <div className="product-specs">
            <small>Peso: {product.weight}kg</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;