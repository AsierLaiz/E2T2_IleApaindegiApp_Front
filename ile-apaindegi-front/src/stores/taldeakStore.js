import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useTaldeakStore = defineStore('taldeak', () => {
  const taldeak = ref([]);
  const currentTaldea = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL
  const fetchTaldeak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.TALDEAK, {
        method: 'GET'
      });
      taldeak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch taldeak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID
  const fetchTaldea = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TALDEAK}/${id}`, {
        method: 'GET'
      });
      currentTaldea.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch taldea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE
  const createTaldea = async (data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(API_CONFIG.ENDPOINTS.TALDEAK, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      taldeak.value.push(result);
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Create taldea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE
  const updateTaldea = async (id, data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(`${API_CONFIG.ENDPOINTS.TALDEAK}/${id}`, {
        method: 'POST',
        body: JSON.stringify({ ...data, _method: 'PUT' })
      });
      const index = taldeak.value.findIndex(t => t.id === id);
      if (index !== -1) {
        taldeak.value[index] = result;
      }
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Update taldea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE
  const deleteTaldea = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.TALDEAK}/${id}`, {
        method: 'DELETE'
      });
      taldeak.value = taldeak.value.filter(t => t.id !== id);
    } catch (err) {
      error.value = err.message;
      console.error('Delete taldea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    taldeak,
    currentTaldea,
    isLoading,
    error,
    fetchTaldeak,
    fetchTaldea,
    createTaldea,
    updateTaldea,
    deleteTaldea
  };
});
