import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useOrdutegiaStore = defineStore('ordutegia', () => {
  const ordutegiak = ref([]);
  const currentOrdutegia = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL
  const fetchOrdutegiak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.ORDUTEGIAK, {
        method: 'GET'
      });
      ordutegiak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ordutegiak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID
  const fetchOrdutegia = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ORDUTEGIAK}/${id}`, {
        method: 'GET'
      });
      currentOrdutegia.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ordutegia error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE
  const createOrdutegia = async (data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(API_CONFIG.ENDPOINTS.ORDUTEGIAK, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      ordutegiak.value.push(result);
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Create ordutegia error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE
  const updateOrdutegia = async (id, data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(`${API_CONFIG.ENDPOINTS.ORDUTEGIAK}/${id}`, {
        method: 'POST',
        body: JSON.stringify({ ...data, _method: 'PUT' })
      });
      const index = ordutegiak.value.findIndex(o => o.id === id);
      if (index !== -1) {
        ordutegiak.value[index] = result;
      }
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Update ordutegia error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE
  const deleteOrdutegia = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ORDUTEGIAK}/${id}`, {
        method: 'DELETE'
      });
      ordutegiak.value = ordutegiak.value.filter(o => o.id !== id);
    } catch (err) {
      error.value = err.message;
      console.error('Delete ordutegia error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    ordutegiak,
    currentOrdutegia,
    isLoading,
    error,
    fetchOrdutegiak,
    fetchOrdutegia,
    createOrdutegia,
    updateOrdutegia,
    deleteOrdutegia
  };
});
