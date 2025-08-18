import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Criar Conta
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Junte-se ao PostPay Social e comece a ganhar recompensas
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              autoFocus
              {...register('name', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 2,
                  message: 'Nome deve ter pelo menos 2 caracteres'
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Telefone (opcional)"
              name="phone"
              autoComplete="tel"
              {...register('phone', {
                pattern: {
                  value: /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/,
                  message: 'Formato de telefone inválido'
                }
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirmação de senha é obrigatória',
                validate: value => value === password || 'Senhas não coincidem'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  {...register('terms', {
                    required: 'Você deve aceitar os termos de uso'
                  })}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Aceito os{' '}
                  <Link href="/terms" target="_blank">
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link href="/privacy" target="_blank">
                    Política de Privacidade
                  </Link>
                </Typography>
              }
              sx={{ mt: 1 }}
            />
            {errors.terms && (
              <Typography color="error" variant="caption" display="block">
                {errors.terms.message}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
            </Button>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Já tem uma conta?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Faça login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;