import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Delete,
  LocationOn,
  Link as LinkIcon,
  AttachMoney
} from '@mui/icons-material';

const CreateSurveyForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    initialPoints: 1000,
    pointsPerCompletion: 100,
    maxResponses: 100,
    questions: [{
      question: '',
      type: 'multiple_choice',
      options: [''],
      required: true
    }],
    physicalAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    },
    externalLinks: [{
      title: '',
      url: '',
      description: ''
    }],
    targetAudience: {
      minAge: 18,
      maxAge: 65,
      gender: 'all',
      subscriptionType: 'all'
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        type: 'multiple_choice',
        options: [''],
        required: true
      }]
    }));
  };

  const addExternalLink = () => {
    setFormData(prev => ({
      ...prev,
      externalLinks: [...prev.externalLinks, {
        title: '',
        url: '',
        description: ''
      }]
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Criar Nova Pesquisa
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações Básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Pesquisa"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="product">Produto</MenuItem>
                  <MenuItem value="service">Serviço</MenuItem>
                  <MenuItem value="general">Geral</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Sistema de Pontos */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Sistema de Pontos
              </Typography>
            </Grid>
            
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Pontos Iniciais"
                value={formData.initialPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, initialPoints: parseInt(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>
                }}
                helperText="Total de pontos disponíveis para distribuição"
                required
              />
            </Grid>
            
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Pontos por Conclusão"
                value={formData.pointsPerCompletion}
                onChange={(e) => setFormData(prev => ({ ...prev, pointsPerCompletion: parseInt(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>
                }}
                helperText="Pontos que cada usuário ganha"
                required
              />
            </Grid>
            
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Máximo de Respostas"
                value={formData.maxResponses}
                onChange={(e) => setFormData(prev => ({ ...prev, maxResponses: parseInt(e.target.value) }))}
                helperText="Limite de participações"
              />
            </Grid>
            
            {/* Endereço Físico */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Endereço Físico (Opcional)
              </Typography>
            </Grid>
            
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Rua/Endereço"
                value={formData.physicalAddress.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  physicalAddress: { ...prev.physicalAddress, street: e.target.value }
                }))}
              />
            </Grid>
            
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="CEP"
                value={formData.physicalAddress.zipCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  physicalAddress: { ...prev.physicalAddress, zipCode: e.target.value }
                }))}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cidade"
                value={formData.physicalAddress.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  physicalAddress: { ...prev.physicalAddress, city: e.target.value }
                }))}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Estado"
                value={formData.physicalAddress.state}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  physicalAddress: { ...prev.physicalAddress, state: e.target.value }
                }))}
              />
            </Grid>
            
            {/* Links Externos */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                  <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Links Externos
                </Typography>
                <Button startIcon={<Add />} onClick={addExternalLink}>
                  Adicionar Link
                </Button>
              </Box>
            </Grid>
            
            {formData.externalLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Título do Link"
                    value={link.title}
                    onChange={(e) => {
                      const newLinks = [...formData.externalLinks];
                      newLinks[index].title = e.target.value;
                      setFormData(prev => ({ ...prev, externalLinks: newLinks }));
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="URL"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...formData.externalLinks];
                      newLinks[index].url = e.target.value;
                      setFormData(prev => ({ ...prev, externalLinks: newLinks }));
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => {
                      const newLinks = formData.externalLinks.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, externalLinks: newLinks }));
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Criar Pesquisa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSurveyForm;