import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  FormLabel
} from '@mui/material';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import surveyService from '../../services/surveyService';

const StartSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await surveyService.getSurveyById(id);
        setSurvey(res?.survey || res);
        // inicializar respostas vazias
        const qs = (res?.survey || res)?.questions || [];
        const init = {};
        qs.forEach((q, idx) => { init[idx] = ''; });
        setAnswers(init);
      } catch (err) {
        console.error('Erro ao carregar pesquisa:', err);
        setError('Não foi possível carregar a pesquisa.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const validate = () => {
    const qs = survey?.questions || [];
    const required = qs.filter(q => q.required);
    for (let i = 0; i < qs.length; i++) {
      if (qs[i].required) {
        const val = answers[i];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          return { ok: false, message: 'Por favor responda todas as perguntas obrigatórias.' };
        }
      }
    }
    return { ok: true };
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const v = validate();
      if (!v.ok) {
        setError(v.message);
        return;
      }

      setSubmitting(true);
      const qs = survey.questions || [];
      const payloadResponses = qs.map((q, idx) => ({
        question: q.question || `q${idx}`,
        answer: answers[idx] === undefined || answers[idx] === null ? '' : String(answers[idx])
      }));

      const res = await surveyService.participateInSurvey(id, payloadResponses);
      setSuccessMessage(res?.message || 'Pesquisa enviada com sucesso!');
      // opcional: aguardar 1s e voltar para lista
      setTimeout(() => navigate('/surveys'), 1000);
    } catch (err) {
      console.error('Erro ao participar da pesquisa:', err, err?.response?.data);
      setError(err?.response?.data?.message || err?.message || 'Erro ao enviar respostas');
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

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {(survey.questions || []).map((q, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <FormLabel component="legend">{q.question} {q.required ? '*' : ''}</FormLabel>
            {q.type === 'text' && (
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={answers[idx] || ''}
                onChange={(e) => handleChange(idx, e.target.value)}
                sx={{ mt: 1 }}
              />
            )}

            {q.type === 'multiple_choice' && (
              <RadioGroup value={answers[idx] || ''} onChange={(e) => handleChange(idx, e.target.value)}>
                {(q.options || []).map((opt, i) => (
                  <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
            )}

            {q.type === 'rating' && (
              <Box sx={{ mt: 1 }}>
                <Rating
                  value={Number(answers[idx]) || 0}
                  onChange={(_, val) => handleChange(idx, val)}
                />
              </Box>
            )}
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={submitting}>Enviar respostas</Button>
          <Button variant="outlined" onClick={() => navigate(`/surveys/${id}`)}>Cancelar</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StartSurvey;
