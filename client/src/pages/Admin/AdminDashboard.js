import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Group,
  Poll
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';
import { formatNumber, formatCurrency } from '../../utils/formatters';

// Componentes administrativos
import UserManagement from '../../components/Admin/UserManagement';
import SurveyManagement from '../../components/Admin/SurveyManagement';
import PaymentManagement from '../../components/Admin/PaymentManagement';
import SystemSettings from '../../components/Admin/SystemSettings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário é admin
  if (!user || user.role !== USER_ROLES.ADMIN) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Acesso negado. Você não tem permissão para acessar esta área.
        </Alert>
      </Container>
    );
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Painel Administrativo
        </Typography>
        <LinearProgress sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box height={100} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Painel Administrativo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie usuários, pesquisas, pagamentos e configurações do sistema
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      {dashboardData && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Usuários"
              value={formatters.formatNumber(dashboardData.totalUsers)}
              icon={<People sx={{ fontSize: 40 }} />}
              trend={dashboardData.userGrowth > 0 ? 'up' : 'down'}
              trendValue={`${Math.abs(dashboardData.userGrowth)}%`}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pesquisas Ativas"
              value={formatters.formatNumber(dashboardData.activeSurveys)}
              icon={<Assignment sx={{ fontSize: 40 }} />}
              trend={dashboardData.surveyGrowth > 0 ? 'up' : 'down'}
              trendValue={`${Math.abs(dashboardData.surveyGrowth)}%`}
              color="secondary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Receita Mensal"
              value={formatters.formatCurrency(dashboardData.monthlyRevenue)}
              icon={<AttachMoney sx={{ fontSize: 40 }} />}
              trend={dashboardData.revenueGrowth > 0 ? 'up' : 'down'}
              trendValue={`${Math.abs(dashboardData.revenueGrowth)}%`}
              color="success"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Taxa de Conversão"
              value={`${dashboardData.conversionRate}%`}
              icon={<Poll sx={{ fontSize: 40 }} />}
              trend={dashboardData.conversionGrowth > 0 ? 'up' : 'down'}
              trendValue={`${Math.abs(dashboardData.conversionGrowth)}%`}
              color="warning"
            />
          </Grid>
        </Grid>
      )}

      {/* Tabs de Gerenciamento */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin tabs">
            <Tab
              icon={<Dashboard />}
              label="Dashboard"
              iconPosition="start"
            />
            <Tab
              icon={<People />}
              label="Usuários"
              iconPosition="start"
            />
            <Tab
              icon={<Assignment />}
              label="Pesquisas"
              iconPosition="start"
            />
            <Tab
              icon={<AttachMoney />}
              label="Pagamentos"
              iconPosition="start"
            />
            <Tab
              icon={<Group />}
              label="Configurações"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Visão Geral do Sistema
              </Typography>
              
              {dashboardData && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Usuários por Plano
                        </Typography>
                        {Object.entries(dashboardData.usersByPlan || {}).map(([plan, count]) => (
                          <Box key={plan} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2">
                              {plan.charAt(0).toUpperCase() + plan.slice(1)}
                            </Typography>
                            <Chip label={count} size="small" />
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Atividade Recente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {dashboardData.recentSignups || 0} novos cadastros hoje
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {dashboardData.completedSurveys || 0} pesquisas completadas
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {dashboardData.pendingPayments || 0} pagamentos pendentes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
          
          {currentTab === 1 && <UserManagement />}
          {currentTab === 2 && <SurveyManagement />}
          {currentTab === 3 && <PaymentManagement />}
          {currentTab === 4 && <SystemSettings />}
        </Box>
      </Card>
    </Container>
  );
};

export default AdminDashboard;