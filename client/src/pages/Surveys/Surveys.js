import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Search,
  Assignment,
  AccessTime,
  Star,
  CheckCircle,
  PlayArrow
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import surveyService from '../../services/surveyService';

const Surveys = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
  loadSurveys();
  }, []);

  useEffect(() => {
    filterSurveys();
  }, [surveys, searchTerm, currentTab]);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const res = await surveyService.getSurveys();
      if (res && res.success && Array.isArray(res.surveys)) {
        const mapped = res.surveys.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description || s.summary || '',
          points: s.pointsReward ?? s.points ?? 0,
          estimatedTime: s.estimatedTime || s.duration || '',
          status: s.alreadyParticipated ? 'completed' : (s.canParticipate ? 'available' : 'in_progress'),
          category: s.category || (s.creator && s.creator.name) || 'Geral',
          deadline: s.endDate || s.deadline || null,
          participants: s.currentResponses ?? s.participants ?? 0,
          maxParticipants: s.maxResponses ?? s.maxParticipants ?? 1000,
          progress: s.progress ?? 0,
          completedAt: s.completedAt || null
        }));
        setSurveys(mapped);
      } else if (Array.isArray(res)) {
        setSurveys(res);
      } else {
        setSurveys([]);
      }
    } catch (error) {
      console.error('Erro ao carregar pesquisas:', error);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSurveys = () => {
    let filtered = surveys;

    // Filtrar por status baseado na aba
    if (currentTab === 1) {
      filtered = filtered.filter(survey => survey.status === 'available');
    } else if (currentTab === 2) {
      filtered = filtered.filter(survey => survey.status === 'in_progress');
    } else if (currentTab === 3) {
      filtered = filtered.filter(survey => survey.status === 'completed');
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(survey =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSurveys(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <PlayArrow />;
      case 'in_progress': return <AccessTime />;
      case 'completed': return <CheckCircle />;
      default: return <Assignment />;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando pesquisas..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pesquisas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Participe de pesquisas e ganhe pontos que podem ser convertidos em dinheiro.
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar pesquisas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Todas" />
          <Tab label="Disponíveis" />
          <Tab label="Em Andamento" />
          <Tab label="Concluídas" />
        </Tabs>
      </Box>

      {/* Surveys Grid */}
      {filteredSurveys.length === 0 ? (
        <Alert severity="info">
          Nenhuma pesquisa encontrada com os filtros aplicados.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredSurveys.map((survey) => (
            <Grid item xs={12} md={6} lg={4} key={survey.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Chip
                      label={getStatusLabel(survey.status)}
                      color={getStatusColor(survey.status)}
                      size="small"
                      icon={getStatusIcon(survey.status)}
                    />
                    <Chip
                      label={survey.category}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {survey.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {survey.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Star color="warning" fontSize="small" />
                      <Typography variant="body2">
                        {survey.points} pontos
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        ~{survey.estimatedTime} minutos
                      </Typography>
                    </Box>
                  </Box>

                  {survey.status === 'in_progress' && survey.progress && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progresso: {survey.progress}%
                      </Typography>
                      <LinearProgress variant="determinate" value={survey.progress} />
                    </Box>
                  )}

                  {survey.status === 'available' && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Participantes: {survey.participants}/{survey.maxParticipants}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(survey.participants / survey.maxParticipants) * 100}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  )}

                  {survey.deadline && survey.status !== 'completed' && (
                    <Typography variant="caption" color="text.secondary">
                      Prazo: {formatDate(survey.deadline)}
                    </Typography>
                  )}

                  {survey.completedAt && (
                    <Typography variant="caption" color="text.secondary">
                      Concluída em: {formatDate(survey.completedAt)}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  {survey.status === 'available' && (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PlayArrow />}
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                    >
                      Iniciar Pesquisa
                    </Button>
                  )}
                  {survey.status === 'in_progress' && (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<AccessTime />}
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                    >
                      Continuar
                    </Button>
                  )}
                  {survey.status === 'completed' && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CheckCircle />}
                      disabled
                    >
                      Concluída
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Surveys;