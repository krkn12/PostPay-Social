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
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  FilterList,
  AccessTime,
  Star,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Surveys = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  useEffect(() => {
    filterSurveys();
  }, [surveys, searchTerm, categoryFilter, tabValue]);

  const loadSurveys = () => {
    // Simular dados de pesquisas
    const mockSurveys = [
      {
        id: 1,
        title: 'Hábitos de Consumo Digital',
        description: 'Pesquisa sobre como você utiliza dispositivos digitais no dia a dia',
        points: 75,
        duration: '8-10 min',
        category: 'Tecnologia',
        difficulty: 'Fácil',
        status: 'available',
        participants: 1250,
        deadline: '2024-02-15'
      },
      {
        id: 2,
        title: 'Preferências Alimentares',
        description: 'Entenda melhor seus hábitos alimentares e preferências culinárias',
        points: 60,
        duration: '5-7 min',
        category: 'Alimentação',
        difficulty: 'Fácil',
        status: 'available',
        participants: 890,
        deadline: '2024-02-20'
      },
      {
        id: 3,
        title: 'Experiência de Compras Online',
        description: 'Compartilhe sua experiência com e-commerce e compras digitais',
        points: 90,
        duration: '10-12 min',
        category: 'E-commerce',
        difficulty: 'Médio',
        status: 'available',
        participants: 567,
        deadline: '2024-02-18'
      },
      {
        id: 4,
        title: 'Pesquisa sobre Sustentabilidade',
        description: 'Suas opiniões sobre práticas sustentáveis e meio ambiente',
        points: 45,
        duration: '6-8 min',
        category: 'Meio Ambiente',
        difficulty: 'Fácil',
        status: 'completed',
        participants: 2100,
        completedAt: '2024-01-10'
      },
      {
        id: 5,
        title: 'Tendências de Moda 2024',
        description: 'Pesquisa sobre tendências e preferências de moda para o ano',
        points: 80,
        duration: '7-9 min',
        category: 'Moda',
        difficulty: 'Médio',
        status: 'in_progress',
        participants: 445,
        progress: 60
      }
    ];
    setSurveys(mockSurveys);
  };

  const filterSurveys = () => {
    let filtered = surveys;

    // Filtrar por status baseado na aba
    if (tabValue === 0) {
      filtered = filtered.filter(s => s.status === 'available');
    } else if (tabValue === 1) {
      filtered = filtered.filter(s => s.status === 'in_progress');
    } else if (tabValue === 2) {
      filtered = filtered.filter(s => s.status === 'completed');
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (categoryFilter) {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }

    setFilteredSurveys(filtered);
  };

  const handleStartSurvey = (survey) => {
    setSelectedSurvey(survey);
    setDialogOpen(true);
  };

  const confirmStartSurvey = () => {
    setDialogOpen(false);
    navigate(`/surveys/${selectedSurvey.id}/start`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'success';
      case 'Médio': return 'warning';
      case 'Difícil': return 'error';
      default: return 'default';
    }
  };

  const SurveyCard = ({ survey }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {survey.title}
          </Typography>
          <Chip 
            label={`${survey.points} pts`} 
            color="primary" 
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {survey.description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={survey.category} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={survey.difficulty} 
            size="small" 
            color={getDifficultyColor(survey.difficulty)}
            variant="outlined"
          />
          <Chip 
            icon={<AccessTime />}
            label={survey.duration} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        {survey.status === 'in_progress' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Progresso: {survey.progress}%
            </Typography>
            <LinearProgress variant="determinate" value={survey.progress} />
          </Box>
        )}
        
        <Typography variant="caption" color="text.secondary">
          {survey.status === 'available' && `${survey.participants} participantes • Prazo: ${new Date(survey.deadline).toLocaleDateString('pt-BR')}`}
          {survey.status === 'completed' && `Concluída em ${new Date(survey.completedAt).toLocaleDateString('pt-BR')}`}
          {survey.status === 'in_progress' && 'Em andamento'}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        {survey.status === 'available' && (
          <Button 
            fullWidth 
            variant="contained"
            onClick={() => handleStartSurvey(survey)}
          >
            Iniciar Pesquisa
          </Button>
        )}
        {survey.status === 'in_progress' && (
          <Button 
            fullWidth 
            variant="outlined"
            onClick={() => navigate(`/surveys/${survey.id}/continue`)}
          >
            Continuar
          </Button>
        )}
        {survey.status === 'completed' && (
          <Button 
            fullWidth 
            variant="outlined"
            disabled
            startIcon={<CheckCircle />}
          >
            Concluída
          </Button>
        )}
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pesquisas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete pesquisas e ganhe pontos para trocar por recompensas
        </Typography>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar pesquisas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoria"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Tecnologia">Tecnologia</MenuItem>
                <MenuItem value="Alimentação">Alimentação</MenuItem>
                <MenuItem value="E-commerce">E-commerce</MenuItem>
                <MenuItem value="Meio Ambiente">Meio Ambiente</MenuItem>
                <MenuItem value="Moda">Moda</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Disponíveis" />
          <Tab label="Em Andamento" />
          <Tab label="Concluídas" />
        </Tabs>
      </Box>

      {/* Lista de Pesquisas */}
      <Grid container spacing={3}>
        {filteredSurveys.map((survey) => (
          <Grid item xs={12} md={6} lg={4} key={survey.id}>
            <SurveyCard survey={survey} />
          </Grid>
        ))}
      </Grid>

      {filteredSurveys.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma pesquisa encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros ou volte mais tarde para novas pesquisas
          </Typography>
        </Box>
      )}

      {/* Dialog de Confirmação */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          Iniciar Pesquisa
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Você está prestes a iniciar a pesquisa:
          </Typography>
          <Typography variant="h6" gutterBottom>
            {selectedSurvey?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Duração estimada: {selectedSurvey?.duration}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pontos a ganhar: {selectedSurvey?.points}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmStartSurvey} variant="contained">
            Iniciar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Surveys;