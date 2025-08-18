import { useState, useEffect } from 'react';

/**
 * Hook customizado para gerenciar dados no localStorage
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {[any, function]} Array com valor atual e função para atualizar
 */
const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Tentar obter o item do localStorage
      const item = window.localStorage.getItem(key);
      // Analisar JSON armazenado ou retornar valor inicial se não existir
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro, retornar valor inicial
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para definir valor
  const setValue = (value) => {
    try {
      // Permitir que value seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salvar no estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Um erro mais avançado de tratamento seria implementar um fallback
      console.error(`Erro ao definir localStorage key "${key}":`, error);
    }
  };

  // Função para remover item
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;