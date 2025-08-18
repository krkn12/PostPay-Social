import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Alert,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Search,
  Add,
  FilterList,
  TrendingUp,
  People,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pause
} from '@mui/icons-material';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { SURVEY_STATUS } from '../../utils/constants';

const SurveyManagement = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadSurveys();
    loadStats();
  }, [page, rowsPerPage, searchTerm, filterStatus, filterCategory]);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus,
        category: filterCategory
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/surveys?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar pesquisas');
      }

      const data = await response.json();
      setSurveys(data.surveys || []);
      setTotalCount(data.totalCount || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/surveys/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const handleDeleteSurvey = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/surveys/${selectedSurvey.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir pesquisa');
      }

      await loadSurveys();
      await loadStats();
      setDeleteDialog(false);
      setSelectedSurvey(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (surveyId, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/surveys/${surveyId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status da pesquisa');
      }

      await loadSurveys();
      await loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case SURVEY_STATUS.ACTIVE:
        return 'success';
      case SURVEY_STATUS.COMPLETED:
        return 'info';
      case SURVEY_STATUS.PAUSED:
        return 'warning';
      case SURVEY_STATUS.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case SURVEY_STATUS.ACTIVE:
        return <CheckCircle fontSize="small" />;
      case SURVEY_STATUS.COMPLETED:
        return <TrendingUp fontSize="small" />;
      case SURVEY_STATUS.PAUSED:
        return <Pause fontSize="small" />;
      case SURVEY_STATUS.CANCELLED:
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Gerenciamento de Pesquisas
        </Typography>
        <Button startIcon={<Add />} variant="contained">
          Nova Pesquisa
        </Button>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total de Pesquisas
                  </Typography>
                  <Typography variant="h4">
                    {formatters.formatNumber(stats.total)}
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pesquisas Ativas
                  </Typography>
                  <Typography variant="h4">
                    {formatters.formatNumber(stats.active)}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Concluídas
                  </Typography>
                  <Typography variant="h4">
                    {formatters.formatNumber(stats.completed)}
                  </Typography>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Receita Total
                  </Typography>
                  <Typography variant="h4">
                    {formatters.formatCurrency(stats.totalRevenue)}
                  </Typography>
                </Box>
                <AttachMoney color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Buscar pesquisas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          size="small"
          sx={{ minWidth: 250 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value={SURVEY_STATUS.ACTIVE}>Ativo</MenuItem>
            <MenuItem value={SURVEY_STATUS.PAUSED}>Pausado</MenuItem>
            <MenuItem value={SURVEY_STATUS.COMPLETED}>Concluído</MenuItem>
            <MenuItem value={SURVEY_STATUS.CANCELLED}>Cancelado</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Categoria"
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="marketing">Marketing</MenuItem>
            <MenuItem value="produto">Produto</MenuItem>
            <MenuItem value="satisfacao">Satisfação</MenuItem>
            <MenuItem value="pesquisa-mercado">Pesquisa de Mercado</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabela de Pesquisas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Respostas</TableCell>
              <TableCell>Valor por Resposta</TableCell>
              <TableCell>Receita</TableCell>
              <TableCell>Criação</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {survey.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {survey.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={survey.category}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(survey.status)}
                    label={survey.status}
                    color={getStatusColor(survey.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatters.formatNumber(survey.responseCount || 0)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatters.formatCurrency(survey.rewardPerResponse || 0)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatters.formatCurrency((survey.responseCount || 0) * (survey.rewardPerResponse || 0))}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatters.formatDate(survey.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setSelectedSurvey(survey);
                      setActionMenu(e.currentTarget);
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Pesquisas por página:"
      />

      {/* Menu de Ações */}
      <Menu
        anchorEl={actionMenu}
        open={Boolean(actionMenu)}
        onClose={() => setActionMenu(null)}
      >
        <MenuItemComponent
          onClick={() => {
            setViewDialog(true);
            setActionMenu(null);
          }}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Visualizar
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => {
            // Implementar edição
            setActionMenu(null);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItemComponent>
        {selectedSurvey?.status === SURVEY_STATUS.ACTIVE && (
          <MenuItemComponent
            onClick={() => {
              handleUpdateStatus(selectedSurvey.id, SURVEY_STATUS.PAUSED);
              setActionMenu(null);
            }}
          >
            <Pause fontSize="small" sx={{ mr: 1 }} />
            Pausar
          </MenuItemComponent>
        )}
        {selectedSurvey?.status === SURVEY_STATUS.PAUSED && (
          <MenuItemComponent
            onClick={() => {
              handleUpdateStatus(selectedSurvey.id, SURVEY_STATUS.ACTIVE);
              setActionMenu(null);
            }}
          >
            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
            Ativar
          </MenuItemComponent>
        )}
        <MenuItemComponent
          onClick={() => {
            setDeleteDialog(true);
            setActionMenu(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItemComponent>
      </Menu>

      {/* Dialog de Visualização */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Pesquisa</DialogTitle>
        <DialogContent>
          {selectedSurvey && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedSurvey.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedSurvey.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Categoria:</strong> {selectedSurvey.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedSurvey.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Respostas:</strong> {formatters.formatNumber(selectedSurvey.responseCount || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Valor por Resposta:</strong> {formatters.formatCurrency(selectedSurvey.rewardPerResponse || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a pesquisa <strong>{selectedSurvey?.title}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteSurvey} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SurveyManagement;