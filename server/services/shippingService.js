class ShippingService {
  static calculateShipping(items, cep, products) {
    let totalWeight = 0;
    let totalVolume = 0;
    
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        totalWeight += product.weight * item.quantity;
        
        if (product.dimensions) {
          const volume = (product.dimensions.length * product.dimensions.width * product.dimensions.height) / 1000000; // cm³ para m³
          totalVolume += volume * item.quantity;
        }
      }
    });
    
    // Cálculo baseado em peso e volume
    const baseRate = 15.00;
    const weightRate = totalWeight * 2.50;
    const volumeRate = totalVolume * 100;
    
    const shippingCost = Math.max(baseRate, weightRate, volumeRate);
    
    // Estimativa de entrega baseada no CEP (simulação)
    const estimatedDays = this.getEstimatedDays(cep);
    
    return {
      cost: parseFloat(shippingCost.toFixed(2)),
      estimatedDays,
      details: {
        totalWeight: parseFloat(totalWeight.toFixed(3)),
        totalVolume: parseFloat(totalVolume.toFixed(6))
      }
    };
  }
  
  static getEstimatedDays(cep) {
    if (!cep) return 7;
    
    // Simulação baseada na região do CEP
    const firstDigit = parseInt(cep.charAt(0));
    
    switch (firstDigit) {
      case 0: case 1: case 2: case 3: // SP, RJ, ES, MG
        return Math.ceil(Math.random() * 3) + 2; // 2-5 dias
      case 4: case 8: case 9: // PR, SC, RS
        return Math.ceil(Math.random() * 4) + 3; // 3-7 dias
      default: // Outras regiões
        return Math.ceil(Math.random() * 7) + 5; // 5-12 dias
    }
  }
}

module.exports = ShippingService;