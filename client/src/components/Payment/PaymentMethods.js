import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  CreditCard,
  Pix,
  Add,
  Delete,
  Edit,
  Security,
  CheckCircle
} from '@mui/icons-material';
import { formatters } from '../../utils/formatters';
import { validators } from '../../utils/validators';

const PaymentMethods = ({ onPaymentMethodSelect, selectedMethod }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addMethodDialog, setAddMethodDialog] = useState(false);
  const [methodType, setMethodType] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    pixKey: '',
    pixType: 'cpf'
  });

  // Carregar métodos de pagamento salvos
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/payment/methods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.methods || []);
      }
    } catch (err) {
      console.error('Erro ao carregar métodos de pagamento:', err);
    }
  };

  // Adicionar novo método de pagamento
  const handleAddMethod = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar dados
      if (methodType === 'credit_card') {
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
          throw new Error('Todos os campos do cartão são obrigatórios');
        }
      } else if (methodType === 'pix') {
        if (!formData.pixKey) {
          throw new Error('Chave PIX é obrigatória');
        }
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/payment/methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: methodType,
          data: methodType === 'credit_card' ? {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardName: formData.cardName,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          } : {
            pixKey: formData.pixKey,
            pixType: formData.pixType
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar método de pagamento');
      }

      await loadPaymentMethods();
      setAddMethodDialog(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remover método de pagamento
  const handleRemoveMethod = async (methodId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/payment/methods/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadPaymentMethods();
      }
    } catch (err) {
      console.error('Erro ao remover método de pagamento:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      pixKey: '',
      pixType: 'cpf'
    });
    setMethodType('credit_card');
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Métodos de Pagamento
        </Typography>
        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={() => setAddMethodDialog(true)}
        >
          Adicionar Método
        </Button>
      </Box>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CreditCard sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum método de pagamento cadastrado
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Adicione um cartão de crédito ou chave PIX para facilitar seus pagamentos
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddMethodDialog(true)}
            >
              Adicionar Primeiro Método
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} sm={6} key={method.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedMethod?.id === method.id ? 2 : 1,
                  borderColor: selectedMethod?.id === method.id ? 'primary.main' : 'divider'
                }}
                onClick={() => onPaymentMethodSelect?.(method)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {method.type === 'credit_card' ? <CreditCard /> : <Pix />}
                      <Typography variant="h6">
                        {method.type === 'credit_card' ? 'Cartão de Crédito' : 'PIX'}
                      </Typography>
                    </Box>
                    {selectedMethod?.id === method.id && (
                      <CheckCircle color="primary" />
                    )}
                  </Box>

                  {method.type === 'credit_card' ? (
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        **** **** **** {method.data.lastFourDigits}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {method.data.cardName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expira em {method.data.expiryDate}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        {method.data.pixType.toUpperCase()}: {method.data.maskedPixKey}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={method.isDefault ? 'Padrão' : 'Secundário'}
                      size="small"
                      color={method.isDefault ? 'primary' : 'default'}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMethod(method.id);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para adicionar método */}
      <Dialog open={addMethodDialog} onClose={() => setAddMethodDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Adicionar Método de Pagamento
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tipo de Pagamento</InputLabel>
            <Select
              value={methodType}
              onChange={(e) => setMethodType(e.target.value)}
              label="Tipo de Pagamento"
            >
              <MenuItem value="credit_card">
                <Box display="flex" alignItems="center" gap={1}>
                  <CreditCard fontSize="small" />
                  Cartão de Crédito
                </Box>
              </MenuItem>
              <MenuItem value="pix">
                <Box display="flex" alignItems="center" gap={1}>
                  <Pix fontSize="small" />
                  PIX
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {methodType === 'credit_card' ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número do Cartão"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatters.formatCreditCard(e.target.value);
                    handleInputChange('cardNumber', formatted);
                  }}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome no Cartão"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                  placeholder="NOME COMO NO CARTÃO"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Validade"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    const formatted = formatters.formatExpiryDate(e.target.value);
                    handleInputChange('expiryDate', formatted);
                  }}
                  placeholder="MM/AA"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  inputProps={{ maxLength: 4 }}
                  type="password"
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo da Chave</InputLabel>
                  <Select
                    value={formData.pixType}
                    onChange={(e) => handleInputChange('pixType', e.target.value)}
                    label="Tipo da Chave"
                  >
                    <MenuItem value="cpf">CPF</MenuItem>
                    <MenuItem value="email">E-mail</MenuItem>
                    <MenuItem value="phone">Telefone</MenuItem>
                    <MenuItem value="random">Chave Aleatória</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Chave PIX"
                  value={formData.pixKey}
                  onChange={(e) => handleInputChange('pixKey', e.target.value)}
                  placeholder={
                    formData.pixType === 'cpf' ? '000.000.000-00' :
                    formData.pixType === 'email' ? 'email@exemplo.com' :
                    formData.pixType === 'phone' ? '(11) 99999-9999' :
                    'chave-aleatoria-uuid'
                  }
                />
              </Grid>
            </Grid>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Security fontSize="small" />
              Seus dados de pagamento são criptografados e armazenados com segurança
            </Box>
          </Alert>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAddMethodDialog(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddMethod}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar Método'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentMethods;