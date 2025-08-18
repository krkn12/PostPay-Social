import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  EmojiEvents,
  Poll,
  AttachMoney,
  CardGiftcard,
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirecionar usuários autenticados para o dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  // Se usuário está autenticado, não renderizar nada (será redirecionado)
  if (user) {
    return null;
  }

  const features = [
    {
      icon: <Poll sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Pesquisas Remuneradas',
      description: 'Complete pesquisas e ganhe pontos que podem ser convertidos em recompensas.',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Sistema de Pontos',
      description: 'Acumule pontos através de diversas atividades na plataforma.',
    },
    {
      icon: <CardGiftcard sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Produtos Físicos',
      description: 'Troque seus pontos por produtos físicos pagando apenas o frete.',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Conversão em Dinheiro',
      description: 'Usuários VIP podem converter pontos em dinheiro real.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                PostPay Social
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Ganhe Recompensas Reais
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                Complete pesquisas, acumule pontos e troque por produtos físicos ou dinheiro real.
                Junte-se à nossa comunidade de recompensas!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Começar Agora
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Fazer Login
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Como Funciona
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Descubra todas as formas de ganhar e resgatar recompensas
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Pronto para Começar?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Cadastre-se gratuitamente e comece a ganhar pontos hoje mesmo!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Criar Conta Grátis
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;