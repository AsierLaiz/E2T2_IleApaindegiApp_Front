import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useErabiltzaileakStore = defineStore('erabiltzaileak', () => {
  const erabiltzaileak = ref([]);
  const currentErabiltzailea = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL
  const fetchErabiltzaileak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.ERABILTZAILEAK, {
        method: 'GET'
      });
      erabiltzaileak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch erabiltzaileak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID
  const fetchErabiltzailea = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ERABILTZAILEAK}/${id}`, {
        method: 'GET'
      });
      currentErabiltzailea.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch erabiltzailea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE
  const createErabiltzailea = async (data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(API_CONFIG.ENDPOINTS.ERABILTZAILEAK, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      erabiltzaileak.value.push(result);
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Create erabiltzailea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE
  const updateErabiltzailea = async (id, data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(`${API_CONFIG.ENDPOINTS.ERABILTZAILEAK}/${id}`, {
        method: 'POST',
        body: JSON.stringify({ ...data, _method: 'PUT' })
      });
      const index = erabiltzaileak.value.findIndex(e => e.id === id);
      if (index !== -1) {
        erabiltzaileak.value[index] = result;
      }
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Update erabiltzailea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE
  const deleteErabiltzailea = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ERABILTZAILEAK}/${id}`, {
        method: 'DELETE'
      });
      erabiltzaileak.value = erabiltzaileak.value.filter(e => e.id !== id);
    } catch (err) {
      error.value = err.message;
      console.error('Delete erabiltzailea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    erabiltzaileak,
    currentErabiltzailea,
    isLoading,
    error,
    fetchErabiltzaileak,
    fetchErabiltzailea,
    createErabiltzailea,
    updateErabiltzailea,
    deleteErabiltzailea
  };
});
