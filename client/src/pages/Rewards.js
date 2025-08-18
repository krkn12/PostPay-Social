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
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  LocalOffer,
  Redeem,
  AccountBalanceWallet
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Rewards = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pointsFilter, setPointsFilter] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadRewards();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [rewards, searchTerm, categoryFilter, pointsFilter]);

  const loadRewards = () => {
    // Dados simulados - substituir por chamada à API
    const mockRewards = [
      {
        id: 1,
        title: 'Vale-presente Amazon R$ 50',
        description: 'Vale-presente para compras na Amazon no valor de R$ 50',
        category: 'Vale-presente',
        points: 5000,
        image: '/api/placeholder/300/200',
        available: true,
        stock: 25,
        rating: 4.8,
        redemptions: 1250
      },
      {
        id: 2,
        title: 'Desconto 20% iFood',
        description: 'Cupom de desconto de 20% para pedidos no iFood (máximo R$ 30)',
        category: 'Alimentação',
        points: 2000,
        image: '/api/placeholder/300/200',
        available: true,
        stock: 100,
        rating: 4.6,
        redemptions: 890
      },
      {
        id: 3,
        title: 'Assinatura Netflix 1 mês',
        description: 'Um mês grátis de assinatura Netflix plano básico',
        category: 'Entretenimento',
        points: 3500,
        image: '/api/placeholder/300/200',
        available: true,
        stock: 15,
        rating: 4.9,
        redemptions: 2100
      },
      {
        id: 4,
        title: 'Cashback R$ 25',
        description: 'Transferência direta de R$ 25 para sua conta bancária',
        category: 'Dinheiro',
        points: 2500,
        image: '/api/placeholder/300/200',
        available: true,
        stock: 50,
        rating: 5.0,
        redemptions: 3200
      },
      {
        id: 5,
        title: 'Curso Udemy Premium',
        description: 'Acesso a qualquer curso premium da Udemy por 3 meses',
        category: 'Educação',
        points: 4000,
        image: '/api/placeholder/300/200',
        available: true,
        stock: 8,
        rating: 4.7,
        redemptions: 450
      },
      {
        id: 6,
        title: 'Frete grátis Mercado Livre',
        description: 'Cupom de frete grátis para 5 compras no Mercado Livre',
        category: 'Compras',
        points: 1500,
        image: '/api/placeholder/300/200',
        available: false,
        stock: 0,
        rating: 4.4,
        redemptions: 1800
      }
    ];
    setRewards(mockRewards);
  };

  const filterRewards = () => {
    let filtered = rewards;

    if (searchTerm) {
      filtered = filtered.filter(reward =>
        reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(reward => reward.category === categoryFilter);
    }

    if (pointsFilter) {
      switch (pointsFilter) {
        case 'low':
          filtered = filtered.filter(reward => reward.points <= 2000);
          break;
        case 'medium':
          filtered = filtered.filter(reward => reward.points > 2000 && reward.points <= 4000);
          break;
        case 'high':
          filtered = filtered.filter(reward => reward.points > 4000);
          break;
        default:
          break;
      }
    }

    setFilteredRewards(filtered);
  };

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setDialogOpen(true);
  };

  const handleRedeem = async () => {
    if (!selectedReward) return;

    if (user.points < selectedReward.points) {
      setSnackbar({
        open: true,
        message: 'Pontos insuficientes para resgatar esta recompensa',
        severity: 'error'
      });
      setDialogOpen(false);
      return;
    }

    try {
      // Aqui seria feita a chamada à API para resgatar a recompensa
      // await rewardsService.redeemReward(selectedReward.id);
      
      setSnackbar({
        open: true,
        message: `Recompensa "${selectedReward.title}" resgatada com sucesso!`,
        severity: 'success'
      });
      
      // Atualizar pontos do usuário (simulado)
      // setUser(prev => ({ ...prev, points: prev.points - selectedReward.points }));
      
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao resgatar recompensa. Tente novamente.',
        severity: 'error'
      });
    }
  };

  const getPointsFilterLabel = (value) => {
    switch (value) {
      case 'low': return 'Até 2.000 pontos';
      case 'medium': return '2.001 - 4.000 pontos';
      case 'high': return 'Acima de 4.000 pontos';
      default: return 'Todos os valores';
    }
  };

  const categories = [...new Set(rewards.map(reward => reward.category))];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recompensas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resgate recompensas incríveis com seus pontos
        </Typography>
      </Box>

      {/* Saldo de Pontos */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">
              Seus Pontos
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {user?.points?.toLocaleString() || '0'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar recompensas..."
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
                <MenuItem value="low">Até 2.000 pontos</MenuItem>
                <MenuItem value="medium">2.001 - 4.000 pontos</MenuItem>
                <MenuItem value="high">Acima de 4.000 pontos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Recompensas */}
      <Grid container spacing={3}>
        {filteredRewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                opacity: reward.available ? 1 : 0.6,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: reward.available ? 'translateY(-4px)' : 'none',
                  boxShadow: reward.available ? 4 : 1
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={reward.image}
                alt={reward.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {reward.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {reward.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={reward.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    icon={<Star />}
                    label={reward.rating}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {reward.points.toLocaleString()} pontos
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {reward.redemptions} resgates
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Estoque: {reward.stock}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant={reward.available ? "contained" : "outlined"}
                    disabled={!reward.available || user?.points < reward.points}
                    onClick={() => handleRedeemClick(reward)}
                    startIcon={<Redeem />}
                    sx={{ mt: 1 }}
                  >
                    {!reward.available ? 'Indisponível' : 
                     user?.points < reward.points ? 'Pontos Insuficientes' : 'Resgatar'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredRewards.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <LocalOffer sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhuma recompensa encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros de busca
          </Typography>
        </Paper>
      )}

      {/* Dialog de Confirmação */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirmar Resgate
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedReward.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedReward.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body1">
                  <strong>Custo:</strong> {selectedReward.points.toLocaleString()} pontos
                </Typography>
                <Typography variant="body1">
                  <strong>Saldo atual:</strong> {user?.points?.toLocaleString() || '0'} pontos
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Após o resgate, você receberá as instruções por email em até 24 horas.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRedeem} 
            variant="contained" 
            disabled={selectedReward && user?.points < selectedReward.points}
          >
            Confirmar Resgate
          </Button>
        </DialogActions>
      </Dialog>

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

export default Rewards;