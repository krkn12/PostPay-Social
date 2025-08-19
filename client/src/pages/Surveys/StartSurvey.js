import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert } from '@mui/material';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import surveyService from '../../services/surveyService';

const StartSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await surveyService.getSurveyById(id);
        setSurvey(res?.survey || res);
      } catch (err) {
        console.error('Erro ao carregar pesquisa:', err);
        setError('Não foi possível carregar a pesquisa.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmitDummy = async () => {
    // Envia respostas mínimas vazias para garantir que a API aceite (caso haja perguntas obrigatórias, backend valida)
    try {
      setSubmitting(true);
      // O backend espera `responses` como array; aqui usamos array vazio para tentar evitar erro
      const payload = { responses: [] };
      await surveyService.participateInSurvey(id, payload.responses);
      // Após participar, volta para lista de pesquisas e mostra sucesso
      navigate('/surveys');
    } catch (err) {
      console.error('Erro ao participar da pesquisa:', err);
      setError(err?.response?.data?.message || 'Erro ao enviar respostas');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Preparando pesquisa..." />;

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
      <Typography variant="h5" gutterBottom>{survey.title || survey.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{survey.description || survey.summary}</Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Este fluxo é um atalho para iniciar/confirmar participação enquanto o formulário de perguntas não está implementado no front-end.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSubmitDummy} disabled={submitting}>Confirmar participação</Button>
        <Button variant="outlined" onClick={() => navigate(`/surveys/${id}`)}>Cancelar</Button>
      </Box>
    </Container>
  );
};

export default StartSurvey;
