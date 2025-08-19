import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Chip, Alert } from '@mui/material';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import surveyService from '../../services/surveyService';
import { formatDate } from '../../utils/formatters';

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await surveyService.getSurveyById(id);
        const data = res?.survey || res;
        setSurvey(data);
      } catch (err) {
        console.error('Erro ao carregar pesquisa:', err);
        setError('Não foi possível carregar a pesquisa.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen message="Carregando pesquisa..." />;

  if (error) return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Alert severity="error">{error}</Alert>
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/surveys')}>Voltar</Button>
      </Box>
    </Container>
  );

  if (!survey) return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Alert severity="info">Pesquisa não encontrada.</Alert>
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/surveys')}>Voltar</Button>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" gutterBottom>{survey.title || survey.name}</Typography>
          <Typography variant="body2" color="text.secondary">{survey.description || survey.summary}</Typography>
        </div>
        <div>
          <Chip label={survey.category || 'Geral'} sx={{ mr: 1 }} />
          <Chip label={`${survey.pointsReward ?? survey.points ?? 0} pts`} color="primary" />
        </div>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2">Prazo: {survey.deadline ? formatDate(survey.deadline) : '—'}</Typography>
        <Typography variant="body2">Status: {survey.alreadyParticipated ? 'Você já participou' : (survey.canParticipate ? 'Disponível' : 'Indisponível')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {survey.canParticipate && (
          <Button variant="contained" onClick={() => navigate(`/surveys/${id}/start`)}>Iniciar pesquisa</Button>
        )}

        {survey.alreadyParticipated && (
          <Button variant="outlined" onClick={() => navigate('/surveys')}>Ver outras pesquisas</Button>
        )}

        {!survey.canParticipate && !survey.alreadyParticipated && (
          <Button variant="outlined" onClick={() => navigate('/surveys')}>Voltar</Button>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Alert severity="info">Fluxo de preenchimento da pesquisa será aberto aqui — implementação de respostas detalhadas está pendente.</Alert>
      </Box>
    </Container>
  );
};

export default SurveyDetail;
