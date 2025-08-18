// Sidebar removido conforme solicitado.

// ...todo o conteúdo do arquivo...
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  CardGiftcard,
  Store,
  AccountBalanceWallet,
  Person,
  Settings,
  Help,
  Logout,
  ExpandLess,
  ExpandMore,
  Notifications,
  AdminPanelSettings,
  Analytics,
  Payment,
  Star,
  History,
  Security,
  Support,
  ChevronLeft,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import sidebarService from '../../services/sidebarService';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

// Mapeamento de ícones
const iconMap = {
  Dashboard: <Dashboard />,
  Assignment: <Assignment />,
  CardGiftcard: <CardGiftcard />,
  Store: <Store />,
  AccountBalanceWallet: <AccountBalanceWallet />,
  Person: <Person />,
  Settings: <Settings />,
  Help: <Help />,
  Notifications: <Notifications />,
  AdminPanelSettings: <AdminPanelSettings />,
  Analytics: <Analytics />,
  Payment: <Payment />,
  Star: <Star />,
  History: <History />,
  Security: <Security />,
  Support: <Support />
};

// Dados de fallback estáticos
const fallbackMenuItems = {
  main: [
    {
      id: 'dashboard',
      name: 'dashboard',
      label: 'Dashboard',
      icon: 'Dashboard',
      path: '/dashboard',
      category: 'main',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'surveys',
      name: 'surveys',
      label: 'Pesquisas',
      icon: 'Assignment',
      path: '/surveys',
      category: 'main',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'rewards',
      name: 'rewards',
      label: 'Recompensas',
      icon: 'CardGiftcard',
      path: '/rewards',
      category: 'main',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'rewards-store',
      name: 'rewards-store',
      label: 'Loja de Recompensas',
      icon: 'Store',
      path: '/rewards-store',
      category: 'main',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'cash-conversion',
      name: 'cash-conversion',
      label: 'Conversão',
      icon: 'AccountBalanceWallet',
      path: '/cash-conversion',
      category: 'main',
      isActive: true,
      hasSubmenu: false,
      badge: null
    }
  ],
  account: [
    {
      id: 'profile',
      name: 'profile',
      label: 'Perfil',
      icon: 'Person',
      path: '/profile',
      category: 'account',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'notifications',
      name: 'notifications',
      label: 'Notificações',
      icon: 'Notifications',
      path: '/notifications',
      category: 'account',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'settings',
      name: 'settings',
      label: 'Configurações',
      icon: 'Settings',
      path: '/settings',
      category: 'account',
      isActive: true,
      hasSubmenu: false,
      badge: null
    }
  ],
  admin: [],
  support: [
    {
      id: 'help',
      name: 'help',
      label: 'Ajuda',
      icon: 'Help',
      path: '/help',
      category: 'support',
      isActive: true,
      hasSubmenu: false,
      badge: null
    },
    {
      id: 'support',
      name: 'support',
      label: 'Suporte',
      icon: 'Support',
      path: '/support',
      category: 'support',
      isActive: true,
      hasSubmenu: false,
      badge: null
    }
  ]
};

const fallbackSidebarData = {
  notificationCount: 0,
  availableSurveys: 0,
  pendingSurveys: 0,
  subscriptionStatus: 'free',
  userPoints: 0
};

const Sidebar = ({ open, onClose, variant = 'temporary' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [menuItems, setMenuItems] = useState(fallbackMenuItems);
  const [sidebarData, setSidebarData] = useState(fallbackSidebarData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Carregar dados da sidebar
  useEffect(() => {
    const loadSidebarData = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        setUsingFallback(false);
        try {
          // Carregar itens de menu e dados dinâmicos em paralelo
          const [menuData, dynamicData] = await Promise.all([
            sidebarService.getMenuItems(),
            sidebarService.getSidebarData()
          ]);
          // Se não vier menu, mostrar erro
          if (!menuData || Object.values(menuData).every(arr => arr.length === 0)) {
            setError('Nenhum item de menu disponível para este usuário.');
            setMenuItems(fallbackMenuItems);
            setUsingFallback(true);
          } else {
            setMenuItems(menuData);
            setUsingFallback(false);
          }
          setSidebarData(dynamicData);
        } catch (error) {
          console.error('Erro ao carregar dados da sidebar:', error);
          setError('Modo offline - usando dados locais');
          setUsingFallback(true);
          setMenuItems(fallbackMenuItems);
          setSidebarData(fallbackSidebarData);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSidebarData();

    // Atualizar dados a cada 30 segundos (apenas se não estiver em modo fallback)
    const interval = setInterval(() => {
      if (user && !usingFallback) {
        sidebarService.getSidebarData()
          .then(setSidebarData)
          .catch(() => {
            // Se falhar, não fazer nada para manter os dados atuais
            console.warn('Falha ao atualizar dados da sidebar');
          });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user, usingFallback]);
// ...existing code...

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
    setExpandedItems({}); // Fechar todos os submenus ao colapsar
  };

  const handleExpandClick = (itemId) => {
    if (collapsed) return;
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Renderizar badge baseado na configuração
  const renderBadge = (item) => {
    if (!item.badge) return item.icon;
    
    try {
      const badgeConfig = typeof item.badge === 'string' ? JSON.parse(item.badge) : item.badge;
      const { type, source, color } = badgeConfig;
      
      let badgeContent = null;
      
      if (type === 'count' && sidebarData[source]) {
        badgeContent = sidebarData[source];
      } else if (type === 'text' && sidebarData[source]) {
        badgeContent = sidebarData[source] === 'trial' ? 'TRIAL' : null;
      }
      
      if (badgeContent) {
        return (
          <Badge 
            badgeContent={badgeContent} 
            color={color === 'primary' ? 'primary' : color === 'error' ? 'error' : 'warning'}
          >
            {item.icon}
          </Badge>
        );
      }
    } catch (e) {
      console.warn('Erro ao processar badge:', e);
    }
    
    return item.icon;
  };

  const renderMenuItem = (item, isChild = false) => {
    const isActive = location.pathname === item.path || 
                    (item.children && item.children.some(child => location.pathname === child.path));
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name];
    const icon = iconMap[item.icon] || <Dashboard />;
    const itemWithIcon = { ...item, icon };

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleExpandClick(item.name);
              } else {
                handleNavigation(item.path);
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: collapsed ? 1 : 2.5,
              pl: isChild ? (collapsed ? 1 : 4) : (collapsed ? 1 : 2.5),
              backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
              borderRight: isActive ? `3px solid ${theme.palette.primary.main}` : 'none',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 3,
                justifyContent: 'center',
                color: isActive ? theme.palette.primary.main : 'inherit'
              }}
            >
              {renderBadge(itemWithIcon)}
            </ListItemIcon>
            
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: collapsed ? 0 : 1,
                    color: isActive ? theme.palette.primary.main : 'inherit'
                  }}
                />
                {hasChildren && (
                  isExpanded ? <ExpandLess /> : <ExpandMore />
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, true))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        {!collapsed && (
          <Typography variant="h6" noWrap component="div" color="primary">
            PostPay Social
          </Typography>
        )}
        
        {!isMobile && (
          <IconButton
            onClick={handleToggleCollapse}
            size="small"
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            {collapsed ? <MenuIcon /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* Alert para modo offline */}
      {usingFallback && !collapsed && (
        <Alert severity="warning" sx={{ m: 1, fontSize: '0.75rem' }}>
          Modo offline ativo
        </Alert>
      )}

      {/* User Info */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Avatar
            src={user?.profilePicture}
            alt={user?.name}
            sx={{ width: 40, height: 40 }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || 'email@exemplo.com'}
            </Typography>
            <Typography variant="caption" color="primary" display="block">
              {sidebarData.userPoints || 0} pontos
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {/* Main Menu */}
            {menuItems.main.length > 0 && (
              <List>
                {menuItems.main.map((item) => renderMenuItem(item))}
              </List>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Account Menu */}
            {menuItems.account.length > 0 && (
              <List>
                {menuItems.account.map((item) => renderMenuItem(item))}
              </List>
            )}

            {/* Admin Menu */}
            {menuItems.admin.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <List>
                  {menuItems.admin.map((item) => renderMenuItem(item))}
                </List>
              </>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Support Menu */}
            {menuItems.support.length > 0 && (
              <List>
                {menuItems.support.map((item) => renderMenuItem(item))}
              </List>
            )}
          </>
        )}
      </Box>

      {/* Logout */}
      <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: collapsed ? 1 : 2.5
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 3,
                  justifyContent: 'center'
                }}
              >
                <Logout />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText primary="Sair" />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;