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
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  Security,
  CheckCircle,
  History,
  Info,
  Warning,
  MonetizationOn
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

const CashConversion = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [conversionAmount, setConversionAmount] = useState('');
  const [bankInfo, setBankInfo] = useState({
    bank: '',
    agency: '',
    account: '',
    accountType: '',
    cpf: '',
    name: ''
  });
  const [conversionHistory, setConversionHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [conversionRates, setConversionRates] = useState({
    pointsToReal: 100, // 100 pontos = R$ 1,00
    minimumConversion: 1000, // Mínimo 1000 pontos
    maximumConversion: 50000, // Máximo 50000 pontos
    processingFee: 0.05 // Taxa de 5%
  });

  const steps = [
    'Valor da Conversão',
    'Dados Bancários',
    'Confirmação'
  ];

  useEffect(() => {
    loadConversionHistory();
  }, []);

  const loadConversionHistory = () => {
    // Dados simulados - substituir por chamada à API
    const mockHistory = [
      {
        id: 1,
        points: 5000,
        amount: 45.00, // R$ 50 - 5% taxa
        status: 'completed',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        transactionId: 'TXN001'
      },
      {
        id: 2,
        points: 2500,
        amount: 22.50,
        status: 'processing',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        transactionId: 'TXN002'
      },
      {
        id: 3,
        points: 10000,
        amount: 95.00,
        status: 'completed',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        transactionId: 'TXN003'
      }
    ];
    setConversionHistory(mockHistory);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateConversionAmount()) return;
    if (activeStep === 1 && !validateBankInfo()) return;
    
    if (activeStep === steps.length - 1) {
      setConfirmDialogOpen(true);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateConversionAmount = () => {
    const points = parseInt(conversionAmount);
    if (!points || points < conversionRates.minimumConversion) {
      setSnackbar({
        open: true,
        message: `Valor mínimo para conversão: ${conversionRates.minimumConversion} pontos`,
        severity: 'error'
      });
      return false;
    }
    if (points > conversionRates.maximumConversion) {
      setSnackbar({
        open: true,
        message: `Valor máximo para conversão: ${conversionRates.maximumConversion} pontos`,
        severity: 'error'
      });
      return false;
    }
    if (points > user?.points) {
      setSnackbar({
        open: true,
        message: 'Pontos insuficientes',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const validateBankInfo = () => {
    const required = ['bank', 'agency', 'account', 'accountType', 'cpf', 'name'];
    for (let field of required) {
      if (!bankInfo[field]) {
        setSnackbar({
          open: true,
          message: 'Preencha todos os campos bancários',
          severity: 'error'
        });
        return false;
      }
    }
    return true;
  };

  const handleConversion = async () => {
    try {
      // Aqui seria feita a chamada à API para processar a conversão
      // await cashConversionService.processConversion({
      //   points: parseInt(conversionAmount),
      //   bankInfo
      // });
      
      setSnackbar({
        open: true,
        message: 'Conversão solicitada com sucesso! Processamento em até 3 dias úteis.',
        severity: 'success'
      });
      
      // Reset form
      setActiveStep(0);
      setConversionAmount('');
      setBankInfo({
        bank: '',
        agency: '',
        account: '',
        accountType: '',
        cpf: '',
        name: ''
      });
      setConfirmDialogOpen(false);
      
      // Reload history
      loadConversionHistory();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao processar conversão. Tente novamente.',
        severity: 'error'
      });
    }
  };

  const calculateConversion = (points) => {
    const realValue = points / conversionRates.pointsToReal;
    const fee = realValue * conversionRates.processingFee;
    const finalAmount = realValue - fee;
    return { realValue, fee, finalAmount };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'failed': return 'Falhou';
      default: return 'Pendente';
    }
  };

  const conversion = conversionAmount ? calculateConversion(parseInt(conversionAmount)) : null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Coluna Principal - Processo de Conversão */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Conversão de Pontos em Dinheiro
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Converta seus pontos em dinheiro real e receba diretamente em sua conta bancária.
            </Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Valor da Conversão
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Pontos para Converter"
                      type="number"
                      value={conversionAmount}
                      onChange={(e) => setConversionAmount(e.target.value)}
                      inputProps={{
                        min: conversionRates.minimumConversion,
                        max: Math.min(conversionRates.maximumConversion, user?.points || 0)
                      }}
                      helperText={`Mínimo: ${conversionRates.minimumConversion} pontos | Máximo: ${conversionRates.maximumConversion} pontos`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Seus pontos disponíveis
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {user?.points?.toLocaleString() || '0'} pontos
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {conversion && (
                  <Card sx={{ mt: 3, bgcolor: 'primary.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Resumo da Conversão
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Valor bruto
                          </Typography>
                          <Typography variant="h6">
                            R$ {conversion.realValue.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Taxa de processamento (5%)
                          </Typography>
                          <Typography variant="h6" color="error">
                            - R$ {conversion.fee.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Valor líquido
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            R$ {conversion.finalAmount.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Dados Bancários
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Banco</InputLabel>
                      <Select
                        value={bankInfo.bank}
                        label="Banco"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, bank: e.target.value }))}
                      >
                        <MenuItem value="001">Banco do Brasil</MenuItem>
                        <MenuItem value="104">Caixa Econômica Federal</MenuItem>
                        <MenuItem value="237">Bradesco</MenuItem>
                        <MenuItem value="341">Itaú</MenuItem>
                        <MenuItem value="033">Santander</MenuItem>
                        <MenuItem value="260">Nu Pagamentos</MenuItem>
                        <MenuItem value="077">Inter</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Agência"
                      value={bankInfo.agency}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, agency: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Conta"
                      value={bankInfo.account}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, account: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Conta</InputLabel>
                      <Select
                        value={bankInfo.accountType}
                        label="Tipo de Conta"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, accountType: e.target.value }))}
                      >
                        <MenuItem value="corrente">Conta Corrente</MenuItem>
                        <MenuItem value="poupanca">Conta Poupança</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CPF"
                      value={bankInfo.cpf}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, cpf: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome do Titular"
                      value={bankInfo.name}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Confirmação
                </Typography>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Resumo da Conversão
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Pontos a converter:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {parseInt(conversionAmount).toLocaleString()} pontos
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Valor líquido:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          R$ {conversion?.finalAmount.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Dados Bancários
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2">
                      <strong>Banco:</strong> {bankInfo.bank}<br />
                      <strong>Agência:</strong> {bankInfo.agency}<br />
                      <strong>Conta:</strong> {bankInfo.account} ({bankInfo.accountType})<br />
                      <strong>Titular:</strong> {bankInfo.name}<br />
                      <strong>CPF:</strong> {bankInfo.cpf}
                    </Typography>
                  </CardContent>
                </Card>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    O processamento da conversão pode levar até 3 dias úteis. Você receberá uma confirmação por email quando a transferência for realizada.
                  </Typography>
                </Alert>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Confirmar Conversão' : 'Próximo'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Coluna Lateral - Informações e Histórico */}
        <Grid item xs={12} md={4}>
          {/* Card de Informações */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Info color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Como Funciona
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                • 100 pontos = R$ 1,00
              </Typography>
              <Typography variant="body2" paragraph>
                • Conversão mínima: 1.000 pontos
              </Typography>
              <Typography variant="body2" paragraph>
                • Taxa de processamento: 5%
              </Typography>
              <Typography variant="body2" paragraph>
                • Prazo: até 3 dias úteis
              </Typography>
              <Typography variant="body2">
                • Transferência via PIX ou TED
              </Typography>
            </CardContent>
          </Card>

          {/* Card de Segurança */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Segurança
                </Typography>
              </Box>
              <Typography variant="body2">
                Todas as transações são protegidas por criptografia SSL e processadas em ambiente seguro.
              </Typography>
            </CardContent>
          </Card>

          {/* Histórico de Conversões */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Histórico de Conversões
              </Typography>
              <List dense>
                {conversionHistory.slice(0, 5).map((conversion) => (
                  <ListItem key={conversion.id} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MonetizationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${conversion.points.toLocaleString()} pontos`}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            R$ {conversion.amount.toFixed(2)} • {conversion.date.toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={getStatusLabel(conversion.status)}
                            size="small"
                            color={getStatusColor(conversion.status)}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {conversionHistory.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Nenhuma conversão realizada ainda
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Confirmação */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            Confirmar Conversão
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Você está prestes a converter <strong>{parseInt(conversionAmount).toLocaleString()} pontos</strong> em <strong>R$ {conversion?.finalAmount.toFixed(2)}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta ação não pode ser desfeita. O valor será transferido para a conta bancária informada em até 3 dias úteis.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConversion} variant="contained" color="primary">
            Confirmar Conversão
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

export default CashConversion;