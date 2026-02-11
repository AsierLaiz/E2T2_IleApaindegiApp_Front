<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const posta_elek = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!posta_elek.value || !password.value) {
    errorMessage.value = 'Mesedez, bete eremu guztiak';
    return;
  }

  isLoading.value = true;

  try {
    const response = await userStore.login({
      posta_elek: posta_elek.value,
      password: password.value
    });
    
    // Redirigir al home después del login exitoso
    router.push({ name: 'home' });
    
  } catch (error) {
    errorMessage.value = error.message || 'Errorea saioa hastean!';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-screen d-flex align-items-center justify-content-center">
    <div class="login-card shadow-lg">
      <div class="row g-0 h-100 d-flex">
        
        <div class="col-md-5 d-flex align-items-center p-5 bg-white">
          <div class="w-100">
            <h2 class="fw-bold mb-3">Ongi Etorri</h2>
            <p class="text-muted mb-4">Sartu zure datuak kudeatzeko.</p>

            <form @submit.prevent="handleLogin">
              <div v-if="errorMessage" class="alert alert-danger py-2 mb-3 small">
                {{ errorMessage }}
              </div>
              
              <div class="mb-3">
                <label class="form-label small fw-bold">Email-a</label>
                <input 
                  v-model="posta_elek" 
                  type="email" 
                  class="form-control form-control-lg" 
                  placeholder="usuario@correo.com"
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="mb-4">
                <label class="form-label small fw-bold">Pasahitza</label>
                <input 
                  v-model="password" 
                  type="password" 
                  class="form-control form-control-lg" 
                  placeholder="••••••••"
                  required
                  :disabled="isLoading"
                >
              </div>
              
              <button 
                type="submit" 
                class="btn btn-dark btn-lg w-100 mb-3 shadow-sm"
                :disabled="isLoading"
              >
                <span v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Kargatzen...
                </span>
                <span v-else>Saioa Hasi</span>
              </button>
              
              <div class="text-center">
                <a href="#" class="text-decoration-none small text-secondary link_pass">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
        </div>

        <div class="col-md-7 d-none d-md-flex p-0 position-relative bg-img">
          <div class="image-overlay d-flex align-items-end p-5 w-100">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
    .login-screen {
    min-height: 100vh;
    background-color: #f7fffe;
    padding: 20px;
    }

    .login-card {
    background: white;
    width: 100%;
    max-width: 1100px;
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    }

    .row {
    width: 100%;
    min-height: 600px;
    }

    .bg-img {
    background-image: url("@/assets/img/login-img.avif");  background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    align-self: stretch; 
    }

    .image-overlay {
    height: 100%;
    background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
    }

    .form-control {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    }

    .form-control:focus {
    box-shadow: none;
    border-color: #000;
    }

    .link_pass {
      transition: 300ms;
    }

    .link_pass:hover {
      color: black !important;
    }
</style>