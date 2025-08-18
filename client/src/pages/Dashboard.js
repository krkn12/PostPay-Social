import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert
} from '@mui/material';
import { Poll, AttachMoney, Star } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: { totalPoints: 0, completedSurveys: 0, pendingSurveys: 0, totalConversions: 0 },
    recentSurveys: []
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getDashboardData();
      if (res && res.success && res.dashboard) {
        const d = res.dashboard;
        setDashboardData({
          stats: {
            totalPoints: d.user?.points ?? 0,
            completedSurveys: d.stats?.totalSurveys ?? 0,
            pendingSurveys: d.stats?.pendingSurveys ?? 0,
            totalConversions: d.stats?.totalConversions ?? 0
          },
          recentSurveys: d.recentActivity ?? []
        });
      } else {
        setDashboardData({ stats: { totalPoints: 0, completedSurveys: 0, pendingSurveys: 0, totalConversions: 0 }, recentSurveys: [] });
        if (res && res.error) setError(res.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setDashboardData({ stats: { totalPoints: 0, completedSurveys: 0, pendingSurveys: 0, totalConversions: 0 }, recentSurveys: [] });
      setError(err.message || 'Falha na conexão com o backend');
    }
    setLoading(false);
  };

  const StatCard = ({ title, value, icon, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{icon}</Avatar>
          <Box>
            <Typography variant="h4">{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            {subtitle && <Typography variant="caption">{subtitle}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) return <LoadingSpinner fullScreen message="Carregando dashboard..." />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Olá, {user?.name?.split(' ')[0]}! 👋</Typography>
        <Typography variant="body1" color="text.secondary">Resumo das suas atividades</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pontos Totais"
            value={(dashboardData.stats.totalPoints ?? 0).toLocaleString()}
            icon={<Star />}
            subtitle={`≈ R$ ${((dashboardData.stats.totalPoints ?? 0) * 0.005).toFixed(2)}`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pesquisas Concluídas" value={dashboardData.stats.completedSurveys ?? 0} icon={<Poll />} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pesquisas Pendentes" value={dashboardData.stats.pendingSurveys ?? 0} icon={<Poll />} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Ganho"
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.stats.totalConversions ?? 0)}
            icon={<AttachMoney />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Pesquisas Disponíveis</Typography>
              <Button variant="outlined" onClick={() => navigate('/surveys')}>Ver Todas</Button>
            </Box>
            <Typography variant="body2" color="text.secondary">Nenhuma pesquisa disponível no momento.</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Atividade Recente</Typography>
            <List>
              {(dashboardData.recentSurveys || []).map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar><Poll /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.survey?.title || item.title}
                      secondary={item.completedAt ? new Date(item.completedAt).toLocaleDateString('pt-BR') : '-'}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;