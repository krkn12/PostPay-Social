import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Diamond,
  EmojiEvents,
  Payment,
  Security,
  Speed,
  Support
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth'; // ✅ CORRETO
import { SUBSCRIPTION_TYPES } from '../utils/constants';

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Função para renderizar ícones
  const getIcon = (type) => {
    switch (type) {
      case SUBSCRIPTION_TYPES.FREE:
        return <CheckCircle color="success" />;
      case SUBSCRIPTION_TYPES.BASIC:
        return <Star color="primary" />;
      case SUBSCRIPTION_TYPES.PREMIUM:
        return <Diamond color="secondary" />;
      case SUBSCRIPTION_TYPES.VIP:
        return <EmojiEvents sx={{ color: '#FFD700' }} />;
      default:
        return <CheckCircle />;
    }
  };

  // Planos de assinatura
  const subscriptionPlans = [
    {
      id: SUBSCRIPTION_TYPES.FREE,
      name: 'Gratuito',
      price: 0,
      period: 'Sempre',
      iconType: SUBSCRIPTION_TYPES.FREE,
      color: 'success',
      features: [
        'Até 5 pesquisas por mês',
        'Pontos básicos por pesquisa',
        'Conversão mínima de R$ 50',
        'Suporte por email'
      ],
      limitations: [
        'Limite de pesquisas',
        'Conversão limitada',
        'Sem prioridade no suporte'
      ]
    },
    {
      id: SUBSCRIPTION_TYPES.BASIC,
      name: 'Básico',
      price: 19.90,
      period: 'mês',
      iconType: SUBSCRIPTION_TYPES.BASIC,
      color: 'primary',
      features: [
        'Até 20 pesquisas por mês',
        '20% mais pontos por pesquisa',
        'Conversão mínima de R$ 20',
        'Acesso a pesquisas exclusivas',
        'Suporte prioritário'
      ],
      popular: false
    },
    {
      id: SUBSCRIPTION_TYPES.PREMIUM,
      name: 'Premium',
      price: 39.90,
      period: 'mês',
      iconType: SUBSCRIPTION_TYPES.PREMIUM,
      color: 'secondary',
      features: [
        'Pesquisas ilimitadas',
        '50% mais pontos por pesquisa',
        'Conversão mínima de R$ 10',
        'Acesso antecipado a pesquisas',
        'Recompensas exclusivas',
        'Suporte 24/7'
      ],
      popular: true
    },
    {
      id: SUBSCRIPTION_TYPES.VIP,
      name: 'VIP',
      price: 79.90,
      period: 'mês',
      iconType: SUBSCRIPTION_TYPES.VIP,
      color: 'warning',
      features: [
        'Pesquisas ilimitadas',
        '100% mais pontos por pesquisa',
        'Conversão instantânea',
        'Sem taxa de conversão',
        'Pesquisas VIP exclusivas',
        'Gerente de conta dedicado',
        'Suporte premium 24/7'
      ],
      exclusive: true
    }
  ];

  // Função para processar pagamento
  const handleSubscribe = async (plan) => {
    if (plan.id === SUBSCRIPTION_TYPES.FREE) {
      // Plano gratuito - apenas atualizar o usuário
      try {
        setLoading(true);
        await updateUser({ subscriptionType: SUBSCRIPTION_TYPES.FREE });
        setSuccess('Plano gratuito ativado com sucesso!');
      } catch (err) {
        setError('Erro ao ativar plano gratuito');
      } finally {
        setLoading(false);
      }
      return;
    }

    setSelectedPlan(plan);
    setPaymentDialog(true);
  };

  // Função para confirmar pagamento
  const confirmPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular processamento de pagamento
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/subscription/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: selectedPlan.price
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      const data = await response.json();
      await updateUser({ subscriptionType: selectedPlan.id });
      
      setSuccess(`Assinatura ${selectedPlan.name} ativada com sucesso!`);
      setPaymentDialog(false);
      setSelectedPlan(null);
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Escolha seu Plano
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Desbloqueie mais oportunidades e ganhe mais pontos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {subscriptionPlans.map((plan) => (
          <Grid item xs={12} md={6} lg={3} key={plan.id}>
            <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {plan.popular && (
                <Chip
                  label="Mais Popular"
                  color="secondary"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1
                  }}
                />
              )}

              {plan.exclusive && (
                <Chip
                  label="Exclusivo"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FFD700',
                    color: '#000',
                    zIndex: 1
                  }}
                />
              )}

              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                  {plan.iconType ? getIcon(plan.iconType) : plan.icon}
                  <Typography variant="h6" ml={1}>
                    {plan.name}
                  </Typography>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="h3" component="span" color={`${plan.color}.main`}>
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    /{plan.period}
                  </Typography>
                </Box>

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                      />
                    </ListItem>
                  ))}
                </List>

                {plan.limitations && (
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Limitações: {plan.limitations.join(', ')}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  color={plan.color}
                  size="large"
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading || user?.subscriptionType === plan.id}
                  startIcon={user?.subscriptionType === plan.id ? <CheckCircle /> : <Payment />}
                >
                  {user?.subscriptionType === plan.id ? 'Plano Atual' : 
                   plan.price === 0 ? 'Ativar Gratuito' : 'Assinar Agora'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de Pagamento */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Payment color="primary" />
            Confirmar Assinatura
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedPlan && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Plano {selectedPlan.name}
              </Typography>
              
              <Typography variant="h4" color="primary" gutterBottom>
                R$ {selectedPlan.price.toFixed(2).replace('.', ',')}/{selectedPlan.period}
              </Typography>

              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Security fontSize="small" />
                  Pagamento seguro processado via PIX ou cartão de crédito
                </Box>
              </Alert>

              <Typography variant="body2" color="text.secondary">
                Ao confirmar, você será redirecionado para o gateway de pagamento seguro.
                Sua assinatura será ativada imediatamente após a confirmação do pagamento.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={confirmPayment}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
          >
            {loading ? 'Processando...' : 'Confirmar Pagamento'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Seção de Benefícios */}
      <Box mt={6} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Por que assinar?
        </Typography>
        
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <Speed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Mais Oportunidades
              </Typography>
              <Typography color="text.secondary">
                Acesso a pesquisas exclusivas e maior limite mensal
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Star sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Mais Pontos
              </Typography>
              <Typography color="text.secondary">
                Ganhe até 100% mais pontos por pesquisa completada
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Support sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Suporte Premium
              </Typography>
              <Typography color="text.secondary">
                Atendimento prioritário e suporte 24/7
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Subscription;