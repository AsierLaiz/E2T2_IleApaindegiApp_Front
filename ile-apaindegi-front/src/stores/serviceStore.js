import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useServicesStore = defineStore('services', () => {
  const zerbitzuak = ref([]);
  const currentZerbitzua = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL - Obtener todos los servicios
  const fetchZerbitzuak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.ZERBITZUAK, {
        method: 'GET'
      });
      zerbitzuak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch zerbitzuak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID - Obtener un servicio por ID
  const fetchZerbitzua = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ZERBITZUAK}/${id}`, {
        method: 'GET'
      });
      currentZerbitzua.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch zerbitzua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // POST - Crear un nuevo servicio
  const createZerbitzua = async (zerbitzuaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.ZERBITZUAK, {
        method: 'POST',
        body: JSON.stringify(zerbitzuaData)
      });
      zerbitzuak.value.push(data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Create zerbitzua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // PUT - Actualizar un servicio existente (usando POST con X-HTTP-Method-Override)
  const updateZerbitzua = async (id, zerbitzuaData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ZERBITZUAK}/${id}`, {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'PUT'
        },
        body: JSON.stringify(zerbitzuaData)
      });
      
      // Actualizar en el array local
      const index = zerbitzuak.value.findIndex(z => z.id === id);
      if (index !== -1) {
        zerbitzuak.value[index] = data;
      }
      
      // Actualizar current si es el mismo
      if (currentZerbitzua.value?.id === id) {
        currentZerbitzua.value = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Update zerbitzua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE - Eliminar un servicio
  const deleteZerbitzua = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ZERBITZUAK}/${id}`, {
        method: 'DELETE'
      });
      
      // Eliminar del array local
      zerbitzuak.value = zerbitzuak.value.filter(z => z.id !== id);
      
      // Limpiar current si es el mismo
      if (currentZerbitzua.value?.id === id) {
        currentZerbitzua.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Delete zerbitzua error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return { 
    zerbitzuak,
    currentZerbitzua,
    isLoading, 
    error, 
    fetchZerbitzuak,
    fetchZerbitzua,
    createZerbitzua,
    updateZerbitzua,
    deleteZerbitzua,
    // Alias para compatibilidad con código antiguo
    services: zerbitzuak,
    fetchServices: fetchZerbitzuak,
    addService: createZerbitzua,
    updateService: updateZerbitzua,
    deleteService: deleteZerbitzua
  };
});