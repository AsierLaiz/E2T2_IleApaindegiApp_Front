<script setup>
  import { ref } from 'vue';

  //PRUEBA
  const usuario = ref({
    nombre: 'Juan Perez',
    email: 'juan.perez@fpsanturtzilh.eus',
    role: 'admin', 
    puesto: 'Tailer Koordinatzailea',
    incorporacion: '12/09/2022',
    avatar: null
  });

  const estadisticas =
    [{ label: 'Admin Erabiltzaileak', val: '2' }, { label: 'Erabiltzaile Arruntak', val: '32' }];

  const showModal = ref(false);
  const passwords = ref({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  const closeOnOverlay = (event) => {
    if (event.target.id === 'modalContainer') {
      showModal.value = false;
    }
  };
</script>

<template>
<div v-if="showModal" class="modal-backdrop fade show"></div>

  <div id="modalContainer" class="modal fade" :class="{ show: showModal, 'd-block': showModal }" tabindex="-1" role="dialog"@click="closeOnOverlay">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header border-0 pt-4 px-4">
          <h5 class="fw-bold">Pasahitza Aldatu</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body px-4">
          <form @submit.prevent="handlePasswordChange">
            <div class="mb-3">
              <label class="small fw-bold text-muted mb-1">Oraingo pasahitza</label>
              <input v-model="passwords.actual" type="password" class="form-control rounded-3" placeholder="••••••••" required>
            </div>
            <div class="mb-3">
              <label class="small fw-bold text-muted mb-1">Pasahitza berria</label>
              <input v-model="passwords.nueva" type="password" class="form-control rounded-3" placeholder="••••••••" required>
            </div>
            <div class="mb-4">
              <label class="small fw-bold text-muted mb-1">Pasahitza berretsi</label>
              <input v-model="passwords.confirmar" type="password" class="form-control rounded-3" placeholder="••••••••" required>
            </div>
            <div class="d-grid gap-2 mb-3">
              <button type="submit" class="btn btn-gorde py-2 justify-content-center">Gorde aldaketak</button>
              <button type="button" class="btn btn-danger py-2 justify-content-center" @click="showModal = false">Utzi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="container py-3" style="margin-bottom: 100px; margin-top: 10px;">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div class="profile-cover bg-custom"></div>
          <div class="card-body p-4 pt-0 text-center text-md-start">
            <div class="d-flex flex-column flex-md-row align-items-end profile-header-content">
              <div class="profile-avatar-container shadow">
                <i class="fas fa-user-tie fa-4x text-muted" v-if="usuario.role === 'admin'"></i>
                <i class="fas fa-user fa-4x text-muted" v-else></i>
              </div>
              <div class="ms-md-4 mt-3 mt-md-0 flex-grow-1 pb-2">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2">
                  <h2 class="fw-bold mb-0">{{ usuario.nombre }}</h2>
                  <span :class="['badge rounded-pill px-3 py-2', usuario.role === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success']">
                    <i class="fas fa-shield-alt me-1" v-if="usuario.role === 'admin'"></i>
                    {{ usuario.role.toUpperCase() }}
                  </span>
                </div>
                <p class="text-muted mb-0">{{ usuario.puesto }}</p>
              </div>
              <div class="pb-2">
                <button class="btn btn-outline-secondary btn-sm px-4 rounded-pill">
                  <i class="fas fa-edit me-2"></i>Profila Editatu
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-7">
            <div class="card border-0 shadow-sm rounded-4 h-100 p-4">
              <h5 class="fw-bold mb-4">Informazio Pertsonala</h5>
              <div class="info-grid">
                <div class="info-item mb-3">
                  <label class="text-muted small d-block">Email-a</label>
                  <span class="fw-medium">{{ usuario.email }}</span>
                </div>
                <div class="info-item mb-3">
                  <label class="text-muted small d-block">Alta data</label>
                  <span class="fw-medium">{{ usuario.incorporacion }}</span>
                </div>
              </div>

              <hr class="my-4 opacity-10">

              <h5 class="fw-bold mb-3">Kontuaren ezarpenak</h5>
              <div class="d-grid gap-2">
                <button @click="showModal = true" class="btn btn-light text-start border-0 py-2"><i class="fas fa-key me-2"></i> Pasahitza Aldatu</button>
                <router-link class="btn btn-login px-4 shadow-sm py-2 mt-2" to="/login"><i class="fas fa-sign-out-alt me-1"></i> Saioa Itxi</router-link>
              </div>
            </div>
          </div>

          <div class="col-md-5">
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 class="fw-bold mb-4">Erabiltzaileak</h5>
              <div class="row text-center">
                <div v-for="stat in estadisticas" :key="stat.label" class="col-6">
                  <h3 class="fw-bold text-custom mb-0">{{ stat.val }}</h3>
                  <small class="text-muted">{{ stat.label }}</small>
                </div>
              </div>
            </div>

            <div v-if="usuario.role === 'admin'" class="card border-0 bg-dark text-white rounded-4 p-4">
              <h5 class="fw-bold mb-3 text-danger"><i class="fas fa-user-shield me-2"></i>Admin Panela</h5>
              <p class="small text-white">Sistemaren monitorizazio tresnetarako sarbidea duzu.</p>
              <div class="d-grid gap-2 mt-3">
                <router-link to="/admin" class="btn btn-danger btn-sm border-0 p-2">Erabiltzaileak Kudeatu</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-custom { 
  color: #2bc1b6; 
}

.bg-custom { 
  background-color: #2bc1b6; 
}

.bg-custom-light { 
  background-color: #e0f2f1;
}

.profile-cover {
  height: 120px;
  background-image: linear-gradient(45deg, #86ece6, #72d8d1);
}

  .btn-login {
    background-color: #e40000;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    transition: all 0.3s ease;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }

  .btn-login:hover {
    background-color: #b60000;
    color: white;
  }

  .btn-gorde { 
    background-color: #2bc1b6;
    font-weight: 600;
    font-size: 0.9rem;
    color: white; 
    border: none;
    transition: all 0.3s ease; 
    border-radius: 8px;
    display: flex;
    align-items: center;
  }

  .btn-gorde:hover,
  .btn-gorde:focus,
  .btn-gorde:active { 
    background-color: #24a89e !important; 
    color: white !important; 
  }

  .btn-close {
    transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
    opacity: 0.5;
  }

  .btn-close:hover {
    filter: invert(13%) sepia(91%) saturate(7454%) hue-rotate(359deg) brightness(93%) contrast(117%);
    opacity: 1;
  }

  .btn-close:focus {
    box-shadow: none !important;
    outline: none;
  }
  
.profile-avatar-container {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
  border: 5px solid white;
}

.profile-header-content {
  margin-top: -20px;
}

.bg-danger-subtle { 
  background-color: #ffebee; 
}

.bg-success-subtle { 
  background-color: #e8f5e9; 
}

.btn-white { background: white; }

/* MODAL */
.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.4);
}

.form-control:focus {
  border-color: #2bc1b6;
  box-shadow: 0 0 0 0.25rem rgba(43, 193, 182, 0.1);
}

@media (max-width: 767.98px) {
  .profile-header-content {
    align-items: center !important;
  }
  .profile-avatar-container {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>