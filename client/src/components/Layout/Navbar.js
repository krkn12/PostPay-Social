import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Menu as MenuIcon,
  Logout,
  Dashboard,
  Person,
  Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import dashboardService from '../../services/dashboardService';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [points, setPoints] = useState(user?.points ?? 0);

  useEffect(() => {
    let mounted = true;
    const loadPoints = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        if (!mounted) return;
        const pts = res?.dashboard?.user?.points ?? res?.dashboard?.stats?.totalPoints ?? user?.points ?? 0;
        setPoints(pts);
      } catch (err) {
        // falhar silenciosamente — manter pontos do usuário
        // console.error('Erro ao buscar pontos:', err);
      }
    };

    if (isAuthenticated) loadPoints();

    return () => { mounted = false; };
  }, [isAuthenticated, user]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Pesquisas', path: '/surveys', icon: <MenuIcon /> },
    { label: 'Recompensas', path: '/rewards', icon: <MenuIcon /> },
    { label: 'Perfil', path: '/profile', icon: <Person /> }
  ];

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: isMobile ? 1 : 0, 
            cursor: 'pointer',
            mr: 4
          }}
          onClick={() => navigate('/')}
        >
          PostPay Social
        </Typography>

        {/* Menu Desktop */}
        {!isMobile && isAuthenticated && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Área direita */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Pontos do usuário */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="inherit">
                  {typeof points === 'number' ? points.toLocaleString() : (user?.points ?? 0).toLocaleString()} pts
                </Typography>
                <Chip 
                  label={user?.subscription?.type || 'Free'} 
                  size="small" 
                  color={user?.subscription?.type === 'Premium' ? 'warning' : 'secondary'}
                  variant="filled"
                  sx={{
                    backgroundColor: user?.subscription?.type === 'Premium' ? '#ff9800' : '#9c27b0',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}
                />
              </Box>

              {/* Notificações */}
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* Menu do usuário */}
              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  src={user?.avatar} 
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>

              {/* Menu Mobile */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={handleMobileMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => navigate('/register')}
              >
                Cadastrar
              </Button>
            </Box>
          )}
        </Box>

        {/* Menu do Perfil */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            <Person sx={{ mr: 1 }} /> Perfil
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
            <Settings sx={{ mr: 1 }} /> Configurações
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} /> Sair
          </MenuItem>
        </Menu>

        {/* Menu Mobile */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem 
              key={item.path}
              onClick={() => { navigate(item.path); handleMenuClose(); }}
            >
              {item.icon}
              <Typography sx={{ ml: 1 }}>{item.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;