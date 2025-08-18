import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar se há token armazenado
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Verificar se o token é válido buscando dados do usuário
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setError(error.message);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login do usuário
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Armazenar token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registro do usuário
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      const data = await response.json();
      
      // Armazenar token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout do usuário
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Tentar fazer logout no servidor
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Limpar dados locais independentemente do resultado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  // Atualizar dados do usuário
  const updateUser = useCallback(async (newUserData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(newUserData);
      
      // Atualizar estado local
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar se usuário tem permissão específica
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    
    // Admin tem todas as permissões
    if (user.role === 'admin') return true;
    
    // Verificar permissões específicas
    return user.permissions?.includes(permission) || false;
  }, [user]);

  // Verificar se usuário tem role específica
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Verificar se usuário está autenticado
  const isAuthenticated = useCallback(() => {
    return !!user && !!localStorage.getItem('token');
  }, [user]);

  // Verificar se usuário tem assinatura ativa
  const hasActiveSubscription = useCallback(() => {
    return user?.subscription?.status === 'active';
  }, [user]);

  // Atualizar pontos do usuário
  const updatePoints = useCallback((newPoints) => {
    if (user) {
      const updatedUser = { ...user, points: newPoints };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  // Resetar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar autenticação na inicialização
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Verificar token periodicamente
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        navigate('/login');
      }
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [user, navigate]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    isAuthenticated,
    hasActiveSubscription,
    updatePoints,
    clearError,
    checkAuthStatus
  };
};

export default useAuth;