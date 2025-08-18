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
  Avatar,
  Typography,
  Alert,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
  CheckCircle,
  MoreVert,
  Search,
  Add,
  FilterList
} from '@mui/icons-material';
import { formatNumber, formatDate } from '../../utils/formatters';
import { USER_ROLES, SUBSCRIPTION_TYPES } from '../../utils/constants';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterSubscription, setFilterSubscription] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, searchTerm, filterRole, filterSubscription]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        role: filterRole,
        subscription: filterSubscription
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalCount(data.totalCount || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário');
      }

      await loadUsers();
      setEditDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir usuário');
      }

      await loadUsers();
      setDeleteDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBlockUser = async (userId, blocked) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ blocked })
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do usuário');
      }

      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'error';
      case USER_ROLES.MODERATOR:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case SUBSCRIPTION_TYPES.VIP:
        return 'warning';
      case SUBSCRIPTION_TYPES.PREMIUM:
        return 'secondary';
      case SUBSCRIPTION_TYPES.BASIC:
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Gerenciamento de Usuários
        </Typography>
        <Button startIcon={<Add />} variant="contained">
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          size="small"
          sx={{ minWidth: 250 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Função</InputLabel>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            label="Função"
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value={USER_ROLES.USER}>Usuário</MenuItem>
            <MenuItem value={USER_ROLES.MODERATOR}>Moderador</MenuItem>
            <MenuItem value={USER_ROLES.ADMIN}>Admin</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Assinatura</InputLabel>
          <Select
            value={filterSubscription}
            onChange={(e) => setFilterSubscription(e.target.value)}
            label="Assinatura"
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value={SUBSCRIPTION_TYPES.FREE}>Gratuito</MenuItem>
            <MenuItem value={SUBSCRIPTION_TYPES.BASIC}>Básico</MenuItem>
            <MenuItem value={SUBSCRIPTION_TYPES.PREMIUM}>Premium</MenuItem>
            <MenuItem value={SUBSCRIPTION_TYPES.VIP}>VIP</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabela de Usuários */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Assinatura</TableCell>
              <TableCell>Pontos</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cadastro</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.subscriptionType || 'free'}
                    color={getSubscriptionColor(user.subscriptionType)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatNumber(user.points || 0)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.blocked ? 'Bloqueado' : 'Ativo'}
                    color={user.blocked ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setSelectedUser(user);
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
        labelRowsPerPage="Usuários por página:"
      />

      {/* Menu de Ações */}
      <Menu
        anchorEl={actionMenu}
        open={Boolean(actionMenu)}
        onClose={() => setActionMenu(null)}
      >
        <MenuItemComponent
          onClick={() => {
            setEditDialog(true);
            setActionMenu(null);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => {
            handleBlockUser(selectedUser.id, !selectedUser.blocked);
            setActionMenu(null);
          }}
        >
          {selectedUser?.blocked ? (
            <><CheckCircle fontSize="small" sx={{ mr: 1 }} />Desbloquear</>
          ) : (
            <><Block fontSize="small" sx={{ mr: 1 }} />Bloquear</>
          )}
        </MenuItemComponent>
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

      {/* Dialog de Edição */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          {/* Formulário de edição aqui */}
          <Typography>Formulário de edição será implementado</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
          <Button variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;