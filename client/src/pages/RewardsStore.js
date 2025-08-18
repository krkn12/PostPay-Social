import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Divider,
  Badge,
  IconButton
} from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  LocalOffer,
  ShoppingCart,
  AccountBalanceWallet,
  Store,
  Add,
  Remove
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import RewardsService from '../services/rewardsService';
import Cart from '../components/Cart';
import './RewardsStore.css';

const RewardsStore = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pointsFilter, setPointsFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadProducts();
    loadUserPoints();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, pointsFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await RewardsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Dados mock para desenvolvimento
      const mockProducts = [
        {
          id: 1,
          name: 'Smartphone Samsung Galaxy',
          description: 'Smartphone Samsung Galaxy A54 128GB',
          category: 'Eletrônicos',
          pointsPrice: 15000,
          imageUrl: '/api/placeholder/300/200',
          stock: 5,
          featured: true,
          isActive: true,
          weight: 0.2
        },
        {
          id: 2,
          name: 'Fone Bluetooth JBL',
          description: 'Fone de ouvido JBL Tune 510BT sem fio',
          category: 'Eletrônicos',
          pointsPrice: 3500,
          imageUrl: '/api/placeholder/300/200',
          stock: 12,
          featured: false,
          isActive: true,
          weight: 0.1
        },
        {
          id: 3,
          name: 'Vale-presente Amazon',
          description: 'Vale-presente Amazon de R$ 100',
          category: 'Vale-presente',
          pointsPrice: 8000,
          imageUrl: '/api/placeholder/300/200',
          stock: 50,
          featured: true,
          isActive: true,
          weight: 0
        },
        {
          id: 4,
          name: 'Camiseta Premium',
          description: 'Camiseta 100% algodão com logo da marca',
          category: 'Roupas',
          pointsPrice: 2500,
          imageUrl: '/api/placeholder/300/200',
          stock: 20,
          featured: false,
          isActive: true,
          weight: 0.2
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async () => {
    try {
      const pointsData = await RewardsService.getUserPoints();
      setUserPoints(pointsData.availablePoints || 0);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
      setUserPoints(user?.points || 0);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (pointsFilter) {
      switch (pointsFilter) {
        case 'low':
          filtered = filtered.filter(product => product.pointsPrice <= 5000);
          break;
        case 'medium':
          filtered = filtered.filter(product => product.pointsPrice > 5000 && product.pointsPrice <= 10000);
          break;
        case 'high':
          filtered = filtered.filter(product => product.pointsPrice > 10000);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        showSnackbar('Quantidade atualizada no carrinho!', 'success');
      } else {
        showSnackbar('Estoque insuficiente!', 'warning');
      }
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        pointsPrice: product.pointsPrice,
        imageUrl: product.imageUrl,
        quantity: 1,
        maxStock: product.stock
      }]);
      showSnackbar('Produto adicionado ao carrinho!', 'success');
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
    showSnackbar('Produto removido do carrinho!', 'info');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const categories = [...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <Container className="rewards-store loading">
        <Typography className="loading-spinner">Carregando produtos...</Typography>
      </Container>
    );
  }

  return (
    <Container className="rewards-store">
      {/* Cabeçalho da Loja */}
      <div className="store-header">
        <h1>🏪 Loja de Recompensas</h1>
        <div className="user-points">
          <span>Seus pontos: <strong>{userPoints.toLocaleString()}</strong></span>
          <Badge badgeContent={getTotalCartItems()} color="primary">
            <Button
              className="cart-button"
              onClick={() => setCartOpen(true)}
              startIcon={<ShoppingCart />}
            >
              Carrinho
            </Button>
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar produtos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoria"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">Todas as categorias</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Faixa de Pontos</InputLabel>
              <Select
                value={pointsFilter}
                label="Faixa de Pontos"
                onChange={(e) => setPointsFilter(e.target.value)}
              >
                <MenuItem value="">Todos os valores</MenuItem>
                <MenuItem value="low">Até 5.000 pontos</MenuItem>
                <MenuItem value="medium">5.001 - 10.000 pontos</MenuItem>
                <MenuItem value="high">Acima de 10.000 pontos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Grid de Produtos */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const cartQuantity = getCartItemQuantity(product.id);
            const canAfford = userPoints >= product.pointsPrice;
            const hasStock = product.stock > 0;

            return (
              <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={product.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {product.featured && (
                        <Chip
                          icon={<Star />}
                          label="Destaque"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          {product.pointsPrice.toLocaleString()} pontos
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Estoque: {product.stock}
                        </Typography>
                      </Box>
                    </Box>

                    {cartQuantity > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <IconButton
                          onClick={() => updateCartQuantity(product.id, cartQuantity - 1)}
                          size="small"
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 2 }}>
                          {cartQuantity}
                        </Typography>
                        <IconButton
                          onClick={() => updateCartQuantity(product.id, cartQuantity + 1)}
                          disabled={cartQuantity >= product.stock}
                          size="small"
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        fullWidth
                        variant={canAfford && hasStock ? "contained" : "outlined"}
                        disabled={!canAfford || !hasStock}
                        onClick={() => addToCart(product)}
                        startIcon={<ShoppingCart />}
                        sx={{ mt: 1 }}
                      >
                        {!hasStock ? 'Sem estoque' : 
                         !canAfford ? 'Pontos insuficientes' : 'Adicionar ao carrinho'}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Carrinho */}
      {cartOpen && (
        <Cart
          cart={cart}
          userPoints={userPoints}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onOrderComplete={() => {
            setCart([]);
            setCartOpen(false);
            loadUserPoints();
            showSnackbar('Pedido realizado com sucesso!', 'success');
          }}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RewardsStore;