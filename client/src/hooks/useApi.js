import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para gerenciar chamadas de API
 * @param {function} apiFunction - Função da API a ser chamada
 * @param {any} initialData - Dados iniciais
 * @param {boolean} immediate - Se deve executar imediatamente
 * @returns {object} Objeto com dados, loading, error e funções de controle
 */
const useApi = (apiFunction, initialData = null, immediate = true) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para executar a chamada da API
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Erro na chamada da API');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Função para resetar o estado
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Executar imediatamente se solicitado
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

export default useApi;