import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useInventoryStore = defineStore('inventory', () => {
  // Estado para equipamientos
  const ekipamenduak = ref([]);
  const currentEkipamendua = ref(null);
  
  // Estado para consumibles
  const kontsumigarriak = ref([]);
  const currentKontsumigarria = ref(null);
  
  // Estado para categorías
  const kategoriak = ref([]);
  
  // Estado general
  const isLoading = ref(false);
  const error = ref(null);

  // ========== EKIPAMENDUAK (Equipamientos) ==========
  
  // GET ALL Ekipamenduak
  const fetchEkipamenduak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.EKIPAMENDUAK, {
        method: 'GET'
      });
      ekipamenduak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ekipamenduak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID Ekipamendua
  const fetchEkipamendua = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.EKIPAMENDUAK}/${id}`, {
        method: 'GET'
      });
      currentEkipamendua.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ekipamendua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY IKASLEA
  const fetchEkipamenduakByIkaslea = async (ikasleaId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.REPORTS.EKIPAMENDUAK_BY_IKASLEA(ikasleaId), {
        method: 'GET'
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ekipamenduak by ikaslea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE Ekipamendua
  const createEkipamendua = async (ekipamenduaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.EKIPAMENDUAK, {
        method: 'POST',
        body: JSON.stringify(ekipamenduaData)
      });
      ekipamenduak.value.push(data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Create ekipamendua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE Ekipamendua
  const updateEkipamendua = async (id, ekipamenduaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.EKIPAMENDUAK}/${id}`, {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'PUT'
        },
        body: JSON.stringify(ekipamenduaData)
      });
      
      const index = ekipamenduak.value.findIndex(e => e.id === id);
      if (index !== -1) {
        ekipamenduak.value[index] = data;
      }
      
      if (currentEkipamendua.value?.id === id) {
        currentEkipamendua.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Update ekipamendua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE Ekipamendua
  const deleteEkipamendua = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.EKIPAMENDUAK}/${id}`, {
        method: 'DELETE'
      });
      
      ekipamenduak.value = ekipamenduak.value.filter(e => e.id !== id);
      
      if (currentEkipamendua.value?.id === id) {
        currentEkipamendua.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Delete ekipamendua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ========== KONTSUMIGARRIAK (Consumibles) ==========
  
  // GET ALL Kontsumigarriak
  const fetchKontsumigarriak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.KONTSUMIGARRIAK, {
        method: 'GET'
      });
      kontsumigarriak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch kontsumigarriak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID Kontsumigarria
  const fetchKontsumigarria = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.KONTSUMIGARRIAK}/${id}`, {
        method: 'GET'
      });
      currentKontsumigarria.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch kontsumigarria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY KATEGORIA
  const fetchKontsumigarriakByKategoria = async (kategoriaId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.REPORTS.KONTSUMIGARRIAK_BY_KATEGORIA(kategoriaId), {
        method: 'GET'
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch kontsumigarriak by kategoria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET LOW STOCK - Consumibles con stock bajo
  const fetchLowStockKontsumigarriak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.REPORTS.KONTSUMIGARRIAK_STOCK_BAJO, {
        method: 'GET'
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch low stock kontsumigarriak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET EXPIRED - Consumibles vencidos
  const fetchExpiredKontsumigarriak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.REPORTS.KONTSUMIGARRIAK_VENCIDOS, {
        method: 'GET'
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch expired kontsumigarriak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE Kontsumigarria
  const createKontsumigarria = async (kontsumigarriaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.KONTSUMIGARRIAK, {
        method: 'POST',
        body: JSON.stringify(kontsumigarriaData)
      });
      kontsumigarriak.value.push(data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Create kontsumigarria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE Kontsumigarria
  const updateKontsumigarria = async (id, kontsumigarriaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.KONTSUMIGARRIAK}/${id}`, {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'PUT'
        },
        body: JSON.stringify(kontsumigarriaData)
      });
      
      const index = kontsumigarriak.value.findIndex(k => k.id === id);
      if (index !== -1) {
        kontsumigarriak.value[index] = data;
      }
      
      if (currentKontsumigarria.value?.id === id) {
        currentKontsumigarria.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Update kontsumigarria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE Kontsumigarria
  const deleteKontsumigarria = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.KONTSUMIGARRIAK}/${id}`, {
        method: 'DELETE'
      });
      
      kontsumigarriak.value = kontsumigarriak.value.filter(k => k.id !== id);
      
      if (currentKontsumigarria.value?.id === id) {
        currentKontsumigarria.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Delete kontsumigarria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ========== IKASLEAK_KONTSUMIGARRIAK (Historial de préstamos) ==========
  
  // GET ALL Ikasleak Kontsumigarriak
  const fetchIkasleakKontsumigarriak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.IKASLEAK_KONTSUMIGARRIAK, {
        method: 'GET'
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ikasleak kontsumigarriak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // GET Ikasleak Kontsumigarriak by Kontsumigarria
  const fetchIkasleakKontsumigarriakByKontsumigarria = async (kontsumigarriaId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const allData = await apiRequest(API_CONFIG.ENDPOINTS.IKASLEAK_KONTSUMIGARRIAK, {
        method: 'GET'
      });
      // Filtrar por kontsumigarria_id
      return allData.filter(item => item.kontsumigarria_id === kontsumigarriaId);
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ikasleak kontsumigarriak by kontsumigarria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // CREATE Ikaslea Kontsumigarria (registrar préstamo)
  const createIkasleaKontsumigarria = async (data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(API_CONFIG.ENDPOINTS.IKASLEAK_KONTSUMIGARRIAK, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Create ikaslea kontsumigarria error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ========== KATEGORIAK (Categorías) ==========
  
  // GET ALL Kategoriak
  const fetchKategoriak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.KATEGORIAK, {
        method: 'GET'
      });
      kategoriak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch kategoriak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // Estado
    ekipamenduak,
    currentEkipamendua,
    kontsumigarriak,
    currentKontsumigarria,
    kategoriak,
    isLoading,
    error,
    
    // Métodos Ekipamenduak
    fetchEkipamenduak,
    fetchEkipamendua,
    fetchEkipamenduakByIkaslea,
    createEkipamendua,
    updateEkipamendua,
    deleteEkipamendua,
    
    // Métodos Kontsumigarriak
    fetchKontsumigarriak,
    fetchKontsumigarria,
    fetchKontsumigarriakByKategoria,
    fetchLowStockKontsumigarriak,
    fetchExpiredKontsumigarriak,
    createKontsumigarria,
    updateKontsumigarria,
    deleteKontsumigarria,
    
    // Métodos Kategoriak
    fetchKategoriak,
    
    // Métodos Ikasleak Kontsumigarriak (Historial de préstamos)
    fetchIkasleakKontsumigarriak,
    fetchIkasleakKontsumigarriakByKontsumigarria,
    createIkasleaKontsumigarria
  };
});
