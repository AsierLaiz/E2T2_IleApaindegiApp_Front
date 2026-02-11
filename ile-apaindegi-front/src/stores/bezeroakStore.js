import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useBezeroakStore = defineStore('bezeroak', () => {
  const bezeroak = ref([]);
  const currentBezeroa = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL - Obtener todos los clientes
  const fetchBezeroak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.BEZEROAK, {
        method: 'GET'
      });
      bezeroak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch bezeroak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID - Obtener un cliente por ID
  const fetchBezeroa = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.BEZEROAK}/${id}`, {
        method: 'GET'
      });
      currentBezeroa.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch bezeroa error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // POST - Crear nuevo cliente
  const createBezeroa = async (bezeroaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.BEZEROAK, {
        method: 'POST',
        body: JSON.stringify(bezeroaData)
      });
      bezeroak.value.push(data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Create bezeroa error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // PUT - Actualizar cliente existente
  const updateBezeroa = async (id, bezeroaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.BEZEROAK}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bezeroaData)
      });
      
      // Actualizar en el array local
      const index = bezeroak.value.findIndex(b => b.id === id);
      if (index !== -1) {
        bezeroak.value[index] = data;
      }
      
      // Actualizar current si es el mismo
      if (currentBezeroa.value?.id === id) {
        currentBezeroa.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Update bezeroa error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE - Eliminar cliente
  const deleteBezeroa = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.BEZEROAK}/${id}`, {
        method: 'DELETE'
      });
      
      // Eliminar del array local
      bezeroak.value = bezeroak.value.filter(b => b.id !== id);
      
      // Limpiar current si es el mismo
      if (currentBezeroa.value?.id === id) {
        currentBezeroa.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Delete bezeroa error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    bezeroak,
    currentBezeroa,
    isLoading,
    error,
    fetchBezeroak,
    fetchBezeroa,
    createBezeroa,
    updateBezeroa,
    deleteBezeroa
  };
});
