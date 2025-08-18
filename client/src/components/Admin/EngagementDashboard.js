import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Timer,
  Repeat
} from '@mui/icons-material';
import { formatters } from '../../utils/formatters';

const EngagementDashboard = ({ surveyId }) => {
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagementData();
  }, [surveyId]);

  const loadEngagementData = async () => {
    try {
      const response = await fetch(`/api/admin/surveys/${surveyId}/engagement`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEngagementData(data);
    } catch (error) {
      console.error('Erro ao carregar dados de engajamento:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  const {
    survey,
    metrics,
    completionDetails,
    pointsDistribution
  } = engagementData;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Métricas de Engajamento - {survey.title}
      </Typography>
      
      {/* Cards de Métricas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {metrics.totalCompletions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Conclusões
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {metrics.uniqueUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuários Únicos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {formatters.formatPoints(metrics.totalPointsDistributed)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pontos Distribuídos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Timer color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {formatters.formatDuration(metrics.averageCompletionTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tempo Médio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Progresso de Pontos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Distribuição de Pontos
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                Pontos Restantes: {formatters.formatPoints(survey.remainingPoints)}
              </Typography>
              <Typography variant="body2">
                {Math.round((survey.remainingPoints / survey.initialPoints) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(survey.remainingPoints / survey.initialPoints) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Total inicial: {formatters.formatPoints(survey.initialPoints)} | 
            Distribuídos: {formatters.formatPoints(metrics.totalPointsDistributed)}
          </Typography>
        </CardContent>
      </Card>
      
      {/* Detalhes de Conclusões */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Histórico de Conclusões
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Pontos Ganhos</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completionDetails.map((completion, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {completion.user.name}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {completion.user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatters.formatDate(completion.completedAt)}
                    </TableCell>
                    <TableCell>
                      {formatters.formatPoints(completion.pointsEarned)}
                    </TableCell>
                    <TableCell>
                      {completion.canRepeat ? (
                        <Chip
                          icon={<Repeat />}
                          label="Pode Repetir"
                          color="info"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Concluído"
                          color="success"
                          size="small"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EngagementDashboard;