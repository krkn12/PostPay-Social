import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Skeleton,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  Download,
  Receipt,
  CreditCard,
  Pix,
  CheckCircle,
  Error,
  Schedule,
  Cancel
} from '@mui/icons-material';
import { formatters } from '../../utils/formatters';
import paymentService from '../../services/paymentService';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  useEffect(() => {
    loadPaymentHistory();
  }, [page, rowsPerPage]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentHistory(page + 1, rowsPerPage);
      setPayments(response.payments || []);
      setTotalCount(response.totalCount || 0);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar histórico de pagamentos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'failed':
        return <Error color="error" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'cancelled':
        return <Cancel color="disabled" />;
      default:
        return <Schedule color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard />;
      case 'pix':
        return <Pix />;
      default:
        return <Receipt />;
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsDialog(true);
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      // Implementar download do comprovante
      console.log('Download receipt for payment:', paymentId);
    } catch (err) {
      console.error('Erro ao baixar comprovante:', err);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Histórico de Pagamentos
        </Typography>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Pagamentos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {payments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum pagamento encontrado
            </Typography>
            <Typography color="text.secondary">
              Seus pagamentos e assinaturas aparecerão aqui
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatters.formatDate(payment.createdAt)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatters.formatTime(payment.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {payment.description}
                      </Typography>
                      {payment.subscriptionPlan && (
                        <Typography variant="caption" color="text.secondary">
                          Plano {payment.subscriptionPlan}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <Typography variant="body2">
                          {payment.paymentMethod === 'credit_card' ? 'Cartão' : 'PIX'}
                        </Typography>
                      </Box>
                      {payment.lastFourDigits && (
                        <Typography variant="caption" color="text.secondary">
                          **** {payment.lastFourDigits}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatters.formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(payment.status)}
                        label={getStatusText(payment.status)}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalhes">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {payment.status === 'completed' && (
                        <Tooltip title="Baixar comprovante">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadReceipt(payment.id)}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </Card>
      )}

      {/* Dialog de Detalhes */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Detalhes do Pagamento
        </DialogTitle>
        
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  {selectedPayment.description}
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedPayment.status)}
                  label={getStatusText(selectedPayment.status)}
                  color={getStatusColor(selectedPayment.status)}
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  ID da Transação
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {selectedPayment.transactionId || selectedPayment.id}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Data e Hora
                </Typography>
                <Typography variant="body1">
                  {formatters.formatDateTime(selectedPayment.createdAt)}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Valor
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatters.formatCurrency(selectedPayment.amount)}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Método de Pagamento
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                  <Typography variant="body1">
                    {selectedPayment.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'PIX'}
                  </Typography>
                </Box>
                {selectedPayment.lastFourDigits && (
                  <Typography variant="body2" color="text.secondary">
                    Cartão terminado em {selectedPayment.lastFourDigits}
                  </Typography>
                )}
              </Box>

              {selectedPayment.subscriptionPlan && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Plano de Assinatura
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.subscriptionPlan}
                  </Typography>
                </Box>
              )}

              {selectedPayment.notes && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Observações
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Fechar
          </Button>
          {selectedPayment?.status === 'completed' && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => handleDownloadReceipt(selectedPayment.id)}
            >
              Baixar Comprovante
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentHistory;