import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em milissegundos
 * @returns {any} Valor debounced
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Definir um timer que atualiza o valor debounced após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpar o timeout se value mudar (também na desmontagem do componente)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;