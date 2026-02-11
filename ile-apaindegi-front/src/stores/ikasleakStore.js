import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useIkasleakStore = defineStore('ikasleak', () => {
  const ikasleak = ref([]);
  const currentIkaslea = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // GET ALL - Obtener todos los alumnos
  const fetchIkasleak = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.IKASLEAK, {
        method: 'GET'
      });
      ikasleak.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ikasleak error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // GET BY ID - Obtener un alumno por ID
  const fetchIkaslea = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.IKASLEAK}/${id}`, {
        method: 'GET'
      });
      currentIkaslea.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Fetch ikaslea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Computed: Formatear ikasleak para la vista con nombre completo y grupo
  const ikasleakFormatted = computed(() => {
    return ikasleak.value.map(ikaslea => ({
      id: ikaslea.id,
      nombre: `${ikaslea.izena} ${ikaslea.abizenak}`,
      grupo: ikaslea.taldea?.izena || 'Sin grupo'
    }));
  });

  // CREATE - Crear nuevo alumno
  const createIkaslea = async (data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(API_CONFIG.ENDPOINTS.IKASLEAK, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      ikasleak.value.push(result);
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Create ikaslea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE - Actualizar alumno
  const updateIkaslea = async (id, data) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apiRequest(`${API_CONFIG.ENDPOINTS.IKASLEAK}/${id}`, {
        method: 'POST',
        body: JSON.stringify({ ...data, _method: 'PUT' })
      });
      const index = ikasleak.value.findIndex(i => i.id === id);
      if (index !== -1) {
        ikasleak.value[index] = result;
      }
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Update ikaslea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE - Eliminar alumno
  const deleteIkaslea = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.IKASLEAK}/${id}`, {
        method: 'POST',
        body: JSON.stringify({ _method: 'DELETE' })
      });
      ikasleak.value = ikasleak.value.filter(i => i.id !== id);
    } catch (err) {
      error.value = err.message;
      console.error('Delete ikaslea error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return { 
    ikasleak,
    ikasleakFormatted,
    currentIkaslea,
    isLoading, 
    error, 
    fetchIkasleak,
    fetchIkaslea,
    createIkaslea,
    updateIkaslea,
    deleteIkaslea
  };
});
