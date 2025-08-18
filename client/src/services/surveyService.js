import api from './api';

const surveyService = {
  // Buscar pesquisas disponíveis
  getSurveys: async (params = {}) => {
    const response = await api.get('/surveys', { params });
    return response.data;
  },

  // Buscar detalhes de uma pesquisa
  getSurveyById: async (id) => {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  },

  // Participar de uma pesquisa
  participateInSurvey: async (surveyId, answers) => {
    const response = await api.post(`/surveys/${surveyId}/participate`, { answers });
    return response.data;
  },

  // Histórico de pesquisas do usuário
  getUserSurveyHistory: async () => {
    const response = await api.get('/surveys/user/history');
    return response.data;
  }
};

export default surveyService;