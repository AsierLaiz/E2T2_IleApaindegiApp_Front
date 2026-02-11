import { defineStore } from 'pinia';
import { ref } from 'vue';
import { API_CONFIG, apiRequest } from '@/config/api';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('auth_token') || null);
  const isLoading = ref(false);
  const error = ref(null);
  const isAuthenticated = ref(!!token.value);

  // REGISTER - Registrar nuevo usuario
  const register = async (userData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiRequest(API_CONFIG.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      // Guardar token y usuario
      token.value = response.access_token;
      user.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('auth_token', response.access_token);

      return response;
    } catch (err) {
      error.value = err.message;
      console.error('Register error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // LOGIN - Iniciar sesión
  const login = async (credentials) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiRequest(API_CONFIG.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      // Guardar token y usuario
      token.value = response.access_token;
      user.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('auth_token', response.access_token);

      return response;
    } catch (err) {
      error.value = err.message;
      console.error('Login error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ME - Obtener información del usuario autenticado
  const me = async () => {
    if (!token.value) {
      throw new Error('No hay token de autenticación');
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiRequest(API_CONFIG.AUTH.ME, {
        method: 'GET'
      });

      user.value = response.user;
      return response.user;
    } catch (err) {
      error.value = err.message;
      console.error('Me error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // LOGOUT - Cerrar sesión
  const logout = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      if (token.value) {
        await apiRequest(API_CONFIG.AUTH.LOGOUT, {
          method: 'POST'
        });
      }
    } catch (err) {
      error.value = err.message;
      console.error('Logout error:', err);
    } finally {
      // Limpiar estado local independientemente del resultado
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem('auth_token');
      isLoading.value = false;
    }
  };

  // REVOKE ALL TOKENS - Revocar todos los tokens del usuario
  const revokeAllTokens = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiRequest(API_CONFIG.AUTH.REVOKE_ALL, {
        method: 'POST'
      });

      // Limpiar estado local
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem('auth_token');
    } catch (err) {
      error.value = err.message;
      console.error('Revoke all tokens error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // INICIALIZAR - Cargar usuario si hay token guardado
  const initialize = async () => {
    if (token.value) {
      try {
        await me();
      } catch (err) {
        // Si falla, limpiar token
        logout();
      }
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    me,
    revokeAllTokens,
    initialize
  };
});
