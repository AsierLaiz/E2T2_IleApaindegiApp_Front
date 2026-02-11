import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useAppointmentsStore = defineStore('appointments', () => {
  const hitzorduak = ref([]);
  const currentHitzordua = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL - Obtener todas las citas
  const fetchHitzorduak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.HITZORDUAK, {
        method: 'GET'
      });
      hitzorduak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch hitzorduak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID - Obtener una cita por ID
  const fetchHitzordua = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.HITZORDUAK}/${id}`, {
        method: 'GET'
      });
      currentHitzordua.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch hitzordua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY BEZEROA - Obtener citas de un cliente
  const fetchHitzorduakByBezeroa = async (bezeroaId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.REPORTS.HITZORDUAK_BY_BEZEROA(bezeroaId), {
        method: 'GET'
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch hitzorduak by bezeroa error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // POST - Crear nueva cita
  const createHitzordua = async (hitzorduaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.HITZORDUAK, {
        method: 'POST',
        body: JSON.stringify(hitzorduaData)
      });
      hitzorduak.value.push(data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Create hitzordua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // PUT - Actualizar cita existente
  const updateHitzordua = async (id, hitzorduaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.HITZORDUAK}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(hitzorduaData)
      });
      
      // Actualizar en el array local
      const index = hitzorduak.value.findIndex(h => h.id === id);
      if (index !== -1) {
        hitzorduak.value[index] = data;
      }
      
      // Actualizar current si es la misma
      if (currentHitzordua.value?.id === id) {
        currentHitzordua.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Update hitzordua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE - Eliminar cita
  const deleteHitzordua = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.HITZORDUAK}/${id}`, {
        method: 'DELETE'
      });
      
      // Eliminar del array local
      hitzorduak.value = hitzorduak.value.filter(h => h.id !== id);
      
      // Limpiar current si es la misma
      if (currentHitzordua.value?.id === id) {
        currentHitzordua.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error al eliminar cita:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ATTACH SERVICE - Añadir servicio a una cita
  const attachService = async (hitzorduaId, zerbitzuaId, iruzkinak = null) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(
        API_CONFIG.HITZORDUAK_ACTIONS.ATTACH_SERVICE(hitzorduaId),
        {
          method: 'POST',
          body: JSON.stringify({ zerbitzua_id: zerbitzuaId, iruzkinak })
        }
      );
      
      // Actualizar en el array local si existe
      const index = hitzorduak.value.findIndex(h => h.id === hitzorduaId);
      if (index !== -1) {
        hitzorduak.value[index] = data;
      }
      
      // Actualizar current si es la misma
      if (currentHitzordua.value?.id === hitzorduaId) {
        currentHitzordua.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Attach service error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DETACH SERVICE - Quitar servicio de una cita
  const detachService = async (hitzorduaId, zerbitzuaId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(
        API_CONFIG.HITZORDUAK_ACTIONS.DETACH_SERVICE(hitzorduaId),
        {
          method: 'POST',
          body: JSON.stringify({ zerbitzua_id: zerbitzuaId })
        }
      );
      
      // Actualizar en el array local si existe
      const index = hitzorduak.value.findIndex(h => h.id === hitzorduaId);
      if (index !== -1) {
        hitzorduak.value[index] = data;
      }
      
      // Actualizar current si es la misma
      if (currentHitzordua.value?.id === hitzorduaId) {
        currentHitzordua.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Detach service error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    hitzorduak,
    currentHitzordua,
    isLoading,
    error,
    fetchHitzorduak,
    fetchHitzordua,
    fetchHitzorduakByBezeroa,
    createHitzordua,
    updateHitzordua,
    deleteHitzordua,
    attachService,
    detachService
  };
});
