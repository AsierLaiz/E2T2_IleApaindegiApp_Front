// Configuración centralizada de la API
export const API_CONFIG = {
  // URL base de la API Laravel
  BASE_URL: import.meta.env.VITE_API_URL || 'http://54.174.47.95/api',
  
  // Rutas de autenticación
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REVOKE_ALL: '/auth/revoke-all-tokens'
  },
  
  // Rutas de recursos
  ENDPOINTS: {
    TALDEAK: '/taldeak',
    IKASLEAK: '/ikasleak',
    ORDUTEGIAK: '/ordutegiak',
    ERABILTZAILEAK: '/erabiltzaileak',
    BEZEROAK: '/bezeroak',
    ZERBITZUAK: '/zerbitzuak',
    KATEGORIAK: '/kategoriak',
    KONTSUMIGARRIAK: '/kontsumigarriak',
    EKIPAMENDUAK: '/ekipamenduak',
    TXANDAK: '/txandak',
    HITZORDUAK: '/hitzorduak',
    IKASLEAK_EKIPAMENDUAK: '/ikasleak-ekipamenduak',
    IKASLEAK_KONTSUMIGARRIAK: '/ikasleak-kontsumigarriak',
    HITZORDUAK_ZERBITZUAK: '/hitzorduak-zerbitzuak'
  },
  
  // Rutas de reportes
  REPORTS: {
    IKASLEAK_BY_TALDEA: (taldeaId) => `/reports/ikasleak-by-taldea/${taldeaId}`,
    HITZORDUAK_BY_BEZEROA: (bezeroaId) => `/reports/hitzorduak-by-bezeroa/${bezeroaId}`,
    KONTSUMIGARRIAK_BY_KATEGORIA: (kategoriaId) => `/reports/kontsumigarriak-by-kategoria/${kategoriaId}`,
    EKIPAMENDUAK_BY_IKASLEA: (ikasleaId) => `/reports/ekipamenduak-by-ikaslea/${ikasleaId}`,
    KONTSUMIGARRIAK_STOCK_BAJO: '/reports/kontsumigarriak-stock-bajo',
    KONTSUMIGARRIAK_VENCIDOS: '/reports/kontsumigarriak-vencidos'
  },
  
  // Rutas especiales de hitzorduak
  HITZORDUAK_ACTIONS: {
    ATTACH_SERVICE: (hitzorduaId) => `/hitzorduak/${hitzorduaId}/attach-service`,
    DETACH_SERVICE: (hitzorduaId) => `/hitzorduak/${hitzorduaId}/detach-service`
  }
};

// Función helper para obtener headers con autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función helper para hacer peticiones autenticadas
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    cache: 'no-store',
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };
  
  const response = await fetch(url, config);
  
  // Si el token es inválido (401), limpiar y redirigir al login
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }
  
  // Si hay error, lanzar excepción con el mensaje
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  
  // Si la respuesta es 204 (No Content), devolver null
  if (response.status === 204) {
    return null;
  }
  
  return await response.json();
};
