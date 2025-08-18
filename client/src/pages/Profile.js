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
  TextField,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Star,
  TrendingUp,
  AccountBalanceWallet,
  History,
  Settings,
  Security,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    occupation: '',
    interests: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        occupation: user.occupation || '',
        interests: user.interests || []
      });
    }
    loadRecentActivity();
  }, [user]);

  const loadRecentActivity = () => {
    // Dados simulados - substituir por chamada à API
    const mockActivity = [
      {
        id: 1,
        type: 'survey_completed',
        description: 'Pesquisa "Hábitos de Consumo" concluída',
        points: 150,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: 'reward_redeemed',
        description: 'Vale-presente Amazon R$ 25 resgatado',
        points: -2500,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        type: 'survey_completed',
        description: 'Pesquisa "Tecnologia e Inovação" concluída',
        points: 200,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 4,
        type: 'bonus',
        description: 'Bônus por completar 5 pesquisas',
        points: 500,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];
    setRecentActivity(mockActivity);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Aqui seria feita a chamada à API para atualizar o perfil
      // await userService.updateProfile(formData);
      
      await updateUser(formData);
      setEditing(false);
      setSnackbar({
        open: true,
        message: 'Perfil atualizado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar perfil. Tente novamente.',
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDate: user.birthDate || '',
      gender: user.gender || '',
      occupation: user.occupation || '',
      interests: user.interests || []
    });
    setEditing(false);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'survey_completed':
        return <Star color="primary" />;
      case 'reward_redeemed':
        return <AccountBalanceWallet color="secondary" />;
      case 'bonus':
        return <TrendingUp color="success" />;
      default:
        return <History />;
    }
  };

  const getUserLevel = (points) => {
    if (points < 1000) return { level: 'Bronze', progress: (points / 1000) * 100, next: 1000 };
    if (points < 5000) return { level: 'Prata', progress: ((points - 1000) / 4000) * 100, next: 5000 };
    if (points < 15000) return { level: 'Ouro', progress: ((points - 5000) / 10000) * 100, next: 15000 };
    return { level: 'Platina', progress: 100, next: null };
  };

  const userLevel = getUserLevel(user?.totalPoints || 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Coluna Esquerda - Informações do Perfil */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h1">
                Meu Perfil
              </Typography>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                >
                  Editar
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Salvar
                  </Button>
                </Box>
              )}
            </Box>

            {/* Avatar e Informações Básicas */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar
                  sx={{ width: 100, height: 100, fontSize: '2rem' }}
                  src={user?.avatar}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                {editing && (
                  <Button
                    sx={{
                      position: 'absolute',
                      bottom: -10,
                      right: -10,
                      minWidth: 'auto',
                      width: 40,
                      height: 40,
                      borderRadius: '50%'
                    }}
                    variant="contained"
                    size="small"
                  >
                    <PhotoCamera fontSize="small" />
                  </Button>
                )}
              </Box>
              <Box>
                <Typography variant="h6">
                  {user?.name || 'Usuário'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Chip
                  label={`Nível ${userLevel.level}`}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Formulário de Informações */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={!editing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gênero"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Profissão"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Coluna Direita - Estatísticas e Atividades */}
        <Grid item xs={12} md={4}>
          {/* Card de Pontos */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWallet color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Pontos
                </Typography>
              </Box>
              <Typography variant="h4" color="primary" gutterBottom>
                {user?.points?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total acumulado: {user?.totalPoints?.toLocaleString() || '0'}
              </Typography>
            </CardContent>
          </Card>

          {/* Card de Nível */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Nível {userLevel.level}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={userLevel.progress}
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary">
                {userLevel.next ? 
                  `${userLevel.next - (user?.totalPoints || 0)} pontos para o próximo nível` :
                  'Nível máximo atingido!'
                }
              </Typography>
            </CardContent>
          </Card>

          {/* Card de Estatísticas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Pesquisas concluídas:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {user?.surveysCompleted || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Recompensas resgatadas:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {user?.rewardsRedeemed || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Dias consecutivos:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {user?.consecutiveDays || 0}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => setStatsDialogOpen(true)}
              >
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>

          {/* Card de Atividade Recente */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atividade Recente
              </Typography>
              <List dense>
                {recentActivity.slice(0, 4).map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption">
                            {activity.date.toLocaleDateString()}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color={activity.points > 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                          >
                            {activity.points > 0 ? '+' : ''}{activity.points}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Estatísticas Detalhadas */}
      <Dialog open={statsDialogOpen} onClose={() => setStatsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Estatísticas Detalhadas
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {user?.surveysCompleted || 0}
                </Typography>
                <Typography variant="body2">Pesquisas Concluídas</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {user?.rewardsRedeemed || 0}
                </Typography>
                <Typography variant="body2">Recompensas Resgatadas</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {user?.totalPoints?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">Total de Pontos Ganhos</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {user?.consecutiveDays || 0}
                </Typography>
                <Typography variant="body2">Dias Consecutivos</Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialogOpen(false)}>
            Fechar
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

export default Profile;