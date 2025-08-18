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
  Grid,
  Avatar
} from '@mui/material';
import {
  Visibility,
  MoreVert,
  Search,
  FilterList,
  AttachMoney,
  TrendingUp,
  Receipt,
  CreditCard,
  Pix,
  Download
} from '@mui/icons-material';
import { formatCurrency, formatDate, formatPoints, formatPercentage, formatNumber, formatDateTime } from '../../utils/formatters';
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../../utils/constants';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    pendingAmount: 0,
    completedToday: 0
  });

  useEffect(() => {
    loadPayments();
    loadStats();
  }, [page, rowsPerPage, searchTerm, filterStatus, filterMethod]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus,
        method: filterMethod
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar pagamentos');
      }

      const data = await response.json();
      setPayments(data.payments || []);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/payments/stats`, {
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

  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return 'success';
      case PAYMENT_STATUS.PENDING:
        return 'warning';
      case PAYMENT_STATUS.FAILED:
        return 'error';
      case PAYMENT_STATUS.CANCELLED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case PAYMENT_METHODS.CREDIT_CARD:
        return <CreditCard fontSize="small" />;
      case PAYMENT_METHODS.PIX:
        return <Pix fontSize="small" />;
      default:
        return <AttachMoney fontSize="small" />;
    }
  };

  const handleExportPayments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/payments/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pagamentos_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('Erro ao exportar pagamentos');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Gerenciamento de Pagamentos
        </Typography>
        <Button startIcon={<Download />} variant="outlined" onClick={handleExportPayments}>
          Exportar
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
                    Receita Total
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                </Box>
                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
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
                    Total de Transações
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(stats.totalTransactions)}
                  </Typography>
                </Box>
                <Receipt color="info" sx={{ fontSize: 40 }} />
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
                    Pendentes
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.pendingAmount)}
                  </Typography>
                </Box>
                <TrendingUp color="warning" sx={{ fontSize: 40 }} />
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
                    Hoje
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(stats.completedToday)}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
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
          placeholder="Buscar por usuário, ID..."
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
            <MenuItem value={PAYMENT_STATUS.COMPLETED}>Concluído</MenuItem>
            <MenuItem value={PAYMENT_STATUS.PENDING}>Pendente</MenuItem>
            <MenuItem value={PAYMENT_STATUS.FAILED}>Falhou</MenuItem>
            <MenuItem value={PAYMENT_STATUS.CANCELLED}>Cancelado</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Método</InputLabel>
          <Select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            label="Método"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value={PAYMENT_METHODS.CREDIT_CARD}>Cartão</MenuItem>
            <MenuItem value={PAYMENT_METHODS.PIX}>PIX</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabela de Pagamentos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={payment.user?.avatar} sx={{ width: 32, height: 32 }}>
                      {payment.user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {payment.user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {payment.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(payment.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getMethodIcon(payment.method)}
                    label={payment.method}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {payment.subscriptionType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(payment.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setSelectedPayment(payment);
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
        labelRowsPerPage="Pagamentos por página:"
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
          Visualizar Detalhes
        </MenuItemComponent>
      </Menu>

      {/* Dialog de Visualização */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Pagamento</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>ID:</strong> {selectedPayment.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Valor:</strong> {formatCurrency(selectedPayment.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Método:</strong> {selectedPayment.method}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedPayment.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Usuário:</strong> {selectedPayment.user?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>E-mail:</strong> {selectedPayment.user?.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Data:</strong> {formatDateTime(selectedPayment.createdAt)}
                  </Typography>
                </Grid>
                {selectedPayment.transactionId && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>ID da Transação:</strong> {selectedPayment.transactionId}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;