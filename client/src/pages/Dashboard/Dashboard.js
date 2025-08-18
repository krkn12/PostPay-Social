import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
  , Alert
} from '@mui/material';
import {
  Assignment,
  CardGiftcard,
  AccountBalanceWallet,
  TrendingUp,
  Star,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPoints: 0,
      completedSurveys: 0,
      pendingSurveys: 0,
    totalEarnings: 0,
    totalConversions: 0
    },
    recentSurveys: [],
    recentRewards: [],
    notifications: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Carregar dados reais do backend
      setError(null);
      const response = await dashboardService.getDashboardData();

      if (response && response.success && response.dashboard) {
        const d = response.dashboard;
        const user = d.user || {};
        const stats = d.stats || {};

        const normalized = {
          stats: {
            totalPoints: user.points ?? 0,
            completedSurveys: stats.totalSurveys ?? 0,
            pendingSurveys: stats.pendingSurveys ?? 0,
            totalConversions: stats.totalConversions ?? 0,
            totalEarnings: user.totalEarned ?? 0
          },
          recentSurveys: d.recentActivity ?? [],
          recentRewards: [],
          notifications: [
            {
              id: 1,
              message: 'Dados carregados do backend em tempo real',
              type: 'success',
              createdAt: new Date()
            }
          ]
        };

        // Se o BD estiver em branco (tudo zero), exibimos zeros normalmente
        setDashboardData(normalized);
      } else {
        // API respondeu, mas sem dados - tratar como vazio e mostrar 0
        setDashboardData({
          stats: {
            totalPoints: 0,
            completedSurveys: 0,
            pendingSurveys: 0,
            totalEarnings: 0,
            totalConversions: 0
          },
          recentSurveys: [],
          recentRewards: [],
          notifications: [
            {
              id: 1,
              message: response?.message || 'Nenhum dado disponível',
              type: 'info',
              createdAt: new Date()
            }
          ]
        });
        if (response && response.error) setError(response.message || 'Erro desconhecido');
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      // Em caso de erro, mostrar dados zerados
      setDashboardData({
        stats: {
          totalPoints: 0,
          completedSurveys: 0,
          pendingSurveys: 0,
          totalEarnings: 0,
          totalConversions: 0
        },
        recentSurveys: [],
        recentRewards: [],
        notifications: [
          {
            id: 1,
            message: 'Falha na conexão com o backend',
            type: 'error',
            createdAt: new Date()
          }
        ]
      });
      setError(error?.message || 'Erro ao conectar com o backend');
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, action }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            {typeof value === 'string' || typeof value === 'number' ? (
              <Typography variant="h4" component="div">
                {value}
              </Typography>
            ) : (
              value
            )}
            {action && (
              <Button
                size="small"
                color={color}
                onClick={action.onClick}
                sx={{ mt: 1 }}
              >
                {action.label}
              </Button>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Função para calcular conversão de pontos para reais
  const calculatePointsToReal = (points) => {
    const conversionRate = 0.005; // R$ 0,005 por ponto (do businessLogic.js)
    return points * conversionRate;
  };

  // Função para calcular total ganho em tempo real
  const calculateTotalEarnings = () => {
    const pointsValue = calculatePointsToReal(dashboardData.stats.totalPoints);
    // Adicionar outros ganhos se houver (recompensas resgatadas, bônus, etc.)
    return pointsValue + (dashboardData.stats.totalEarnings || 0);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Olá, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo de volta ao seu dashboard. Aqui está um resumo das suas atividades.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pontos Totais"
            value={
              <Box>
                <Typography variant="h4" component="div">
                  {(dashboardData.stats.totalPoints ?? 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                  ≈ R$ {calculatePointsToReal(dashboardData.stats.totalPoints).toFixed(2)}
                </Typography>
              </Box>
            }
            icon={<Star sx={{ fontSize: 40 }} />}
            color="warning"
            action={{
              label: "Converter",
              onClick: () => navigate('/cash-conversion')
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pesquisas Concluídas"
            value={dashboardData.stats.completedSurveys ?? 0}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pesquisas Pendentes"
            value={dashboardData.stats.pendingSurveys ?? 0}
            icon={<AccessTime sx={{ fontSize: 40 }} />}
            color="info"
            action={{
              label: "Ver Todas",
              onClick: () => navigate('/surveys')
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Carteira Digital"
            value={
              <Box>
                <Typography variant="h4" component="div" color="success.main">
                  R$ {calculatePointsToReal(dashboardData.stats.totalPoints ?? 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {(dashboardData.stats.totalPoints ?? 0).toLocaleString()} pontos disponíveis
                </Typography>
              </Box>
            }
            icon={<AccountBalanceWallet sx={{ fontSize: 40 }} />}
            color="success"
            action={{
              label: "Sacar",
              onClick: () => navigate('/cash-conversion')
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Ganho"
              value={formatCurrency(dashboardData.stats.totalConversions ?? 0)}
            icon={<AccountBalanceWallet sx={{ fontSize: 40 }} />}
            color="primary"
            action={{
              label: "Histórico",
              onClick: () => navigate('/cash-conversion')
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Surveys */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2">
                  Pesquisas Recentes
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/surveys')}
                >
                  Ver Todas
                </Button>
              </Box>
              <List>
                {dashboardData.recentSurveys.map((survey, index) => (
                  <React.Fragment key={survey.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Assignment color={survey.status === 'completed' ? 'success' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={survey.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {survey.points} pontos
                            </Typography>
                            <Chip
                              label={survey.status === 'completed' ? 'Concluída' : 'Pendente'}
                              size="small"
                              color={survey.status === 'completed' ? 'success' : 'warning'}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < dashboardData.recentSurveys.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2">
                  Atividade Recente
                </Typography>
              </Box>
              <List>
                {dashboardData.notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem>
                      <ListItemIcon>
                        {notification.type === 'survey' ? (
                          <Assignment color="primary" />
                        ) : (
                          <Star color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.message}
                        secondary={formatDate(notification.createdAt)}
                      />
                    </ListItem>
                    {index < dashboardData.notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Ações Rápidas
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Assignment />}
            onClick={() => navigate('/surveys')}
          >
            Ver Pesquisas
          </Button>
          <Button
            variant="outlined"
            startIcon={<CardGiftcard />}
            onClick={() => navigate('/rewards')}
          >
            Resgatar Recompensas
          </Button>
          <Button
            variant="outlined"
            startIcon={<AccountBalanceWallet />}
            onClick={() => navigate('/cash-conversion')}
          >
            Converter Pontos
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;