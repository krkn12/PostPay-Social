import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  Divider,
  Grid,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Save,
  ExpandMore,
  AttachMoney,
  Security,
  Notifications,
  Settings
} from '@mui/icons-material';
import { formatters } from '../../utils/formatters';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Configurações de Pontos e Recompensas
    pointsPerSurvey: 100,
    vipMultiplier: 2,
    minimumCashout: 50,
    cashoutRate: 0.01, // R$ 0,01 por ponto
    
    // Configurações de Assinatura
    basicPrice: 19.90,
    premiumPrice: 39.90,
    vipPrice: 79.90,
    
    // Configurações de Sistema
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxSurveysPerDay: 10,
    
    // Configurações de Notificação
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    
    // Configurações de Segurança
    sessionTimeout: 24, // horas
    passwordMinLength: 8,
    requireStrongPassword: true,
    maxLoginAttempts: 5
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data });
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Configurações do Sistema
        </Typography>
        <Button
          startIcon={<Save />}
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Configurações salvas com sucesso!
        </Alert>
      )}

      {/* Configurações de Pontos e Recompensas */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoney color="primary" />
            <Typography variant="h6">Pontos e Recompensas</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pontos por Pesquisa"
                type="number"
                value={settings.pointsPerSurvey}
                onChange={(e) => handleChange('pointsPerSurvey', parseInt(e.target.value))}
                helperText="Pontos base que o usuário recebe por pesquisa"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Multiplicador VIP"
                type="number"
                inputProps={{ step: 0.1 }}
                value={settings.vipMultiplier}
                onChange={(e) => handleChange('vipMultiplier', parseFloat(e.target.value))}
                helperText="Multiplicador de pontos para usuários VIP"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Saque Mínimo"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
                value={settings.minimumCashout}
                onChange={(e) => handleChange('minimumCashout', parseFloat(e.target.value))}
                helperText="Valor mínimo para conversão de pontos"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Taxa de Conversão"
                type="number"
                inputProps={{ step: 0.001 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
                value={settings.cashoutRate}
                onChange={(e) => handleChange('cashoutRate', parseFloat(e.target.value))}
                helperText="Valor em reais por ponto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Configurações de Assinatura */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoney color="secondary" />
            <Typography variant="h6">Preços de Assinatura</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Plano Básico"
                type="number"
                inputProps={{ step: 0.01 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
                value={settings.basicPrice}
                onChange={(e) => handleChange('basicPrice', parseFloat(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Plano Premium"
                type="number"
                inputProps={{ step: 0.01 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
                value={settings.premiumPrice}
                onChange={(e) => handleChange('premiumPrice', parseFloat(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Plano VIP"
                type="number"
                inputProps={{ step: 0.01 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
                value={settings.vipPrice}
                onChange={(e) => handleChange('vipPrice', parseFloat(e.target.value))}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Configurações de Sistema */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Settings color="info" />
            <Typography variant="h6">Sistema</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  />
                }
                label="Modo de Manutenção"
              />
              <Typography variant="caption" display="block" color="text.secondary">
                Desabilita o acesso ao sistema para usuários
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.registrationEnabled}
                    onChange={(e) => handleChange('registrationEnabled', e.target.checked)}
                  />
                }
                label="Registro Habilitado"
              />
              <Typography variant="caption" display="block" color="text.secondary">
                Permite novos usuários se registrarem
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailVerificationRequired}
                    onChange={(e) => handleChange('emailVerificationRequired', e.target.checked)}
                  />
                }
                label="Verificação de E-mail Obrigatória"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Máximo de Pesquisas por Dia"
                type="number"
                value={settings.maxSurveysPerDay}
                onChange={(e) => handleChange('maxSurveysPerDay', parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Configurações de Notificação */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Notifications color="warning" />
            <Typography variant="h6">Notificações</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Notificações por E-mail"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  />
                }
                label="Notificações Push"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.marketingEmails}
                    onChange={(e) => handleChange('marketingEmails', e.target.checked)}
                  />
                }
                label="E-mails de Marketing"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Configurações de Segurança */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Security color="error" />
            <Typography variant="h6">Segurança</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timeout de Sessão (horas)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Comprimento Mínimo da Senha"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireStrongPassword}
                    onChange={(e) => handleChange('requireStrongPassword', e.target.checked)}
                  />
                }
                label="Exigir Senha Forte"
              />
              <Typography variant="caption" display="block" color="text.secondary">
                Requer maiúsculas, minúsculas, números e símbolos
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Máximo de Tentativas de Login"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SystemSettings;