<script setup>
import { onMounted } from 'vue';

const closeOffcanvas = () => {
  const offcanvasElement = document.getElementById('navbarOffcanvas');
  if (offcanvasElement) {
    const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
    if (bsOffcanvas) bsOffcanvas.hide();
  }
};

onMounted(() => {
  const offcanvasElement = document.getElementById('navbarOffcanvas');
  if (offcanvasElement) {
    const links = offcanvasElement.querySelectorAll('a');
    links.forEach(link => link.addEventListener('click', closeOffcanvas));
  }
});
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top custom-nav">
    <div class="container bg-white shadow-sm mt-2 mt-lg-3 px-3 px-lg-4 py-2">
      <router-link class="navbar-brand fw-bold d-flex align-items-center" to="/">
        <img src="https://ile-apaindegi-testing-bucket.s3.us-east-1.amazonaws.com/img/logo/FPSanturtzi_Logo.png" class="logo-img" alt="Logo" />
      </router-link>

      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#navbarOffcanvas">
        <div class="hamburger-icon">
          <span class="toggler-line line-top"></span>
          <span class="toggler-line line-mid"></span>
          <span class="toggler-line line-bot"></span>
        </div>
      </button>

      <div class="offcanvas offcanvas-end border-0" tabindex="-1" id="navbarOffcanvas">
        <div class="offcanvas-header d-lg-none">
          <div class="d-flex align-items-center">
            <img src="https://ile-apaindegi-testing-bucket.s3.us-east-1.amazonaws.com/img/logo/FPSanturtzi_Logo.png" height="35px" alt="Logo" class="me-2" />
          </div>
          <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto align-items-stretch align-items-lg-center">
            <li class="nav-item">
              <router-link class="nav-link mx-lg-2" to="/inbentarioa">
                <i class="fas fa-boxes me-2 d-lg-none"></i>Inbentarioa
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-lg-2" to="/kudeaketa">
                <i class="fas fa-clipboard-list me-2 d-lg-none"></i>Kudeaketa
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-lg-2" to="/bezeroak">
                <i class="fas fa-users me-2 d-lg-none"></i>Bezeroak
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-lg-2" to="/zerbitzuak">
                <i class="fas fa-concierge-bell me-2 d-lg-none"></i>Zerbitzuak
              </router-link>
            </li>

            <div class="mobile-action-group mt-4 mt-lg-0 d-flex align-items-center">

              <li class="nav-item-calendar">
                <router-link class="btn-perfil-wrapper nav-link d-lg-none" to="/egutegia">
                  <i class="fas fa-calendar-alt m-0"></i>
                </router-link>
                <router-link class="btn btn-perfil d-none d-lg-flex mx-2" to="/egutegia">
                  <i class="fas fa-calendar-alt"></i>
                </router-link>
              </li>

              <li class="nav-item-profile flex-grow-1 ms-lg-2">
                <router-link class="btn-perfil-wrapper nav-link d-lg-none justify-content-start" to="/profila">
                  <i class="fas fa-user-circle me-2"></i>
                  <span>Nire Profila</span>
                </router-link>
                <router-link class="btn btn-perfil d-none d-lg-flex" to="/profila">
                  <i class="fas fa-user-tie"></i>
                </router-link>
              </li>

            </div>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* --- BASE & DESKTOP (Restaurado) --- */
.custom-nav {
  background-color: #f7fffe;
  z-index: 1050;
}

.logo-img {
  height: 45px;
  transition: 0.3s;
}

.container.bg-white {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 15px;
}

.nav-link {
  color: #636e72 !important;
  font-weight: 500;
  transition: 0.3s;
}

.nav-link:hover {
  color: #2bc1b6 !important;
}

.btn-perfil {
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #2bc1b6;
  color: #2bc1b6;
  transition: 0.3s;
  background: white;
}

.btn-perfil:hover {
  box-shadow: 0px 0px 0px 5px rgb(43, 193, 183);
  color: #2bc1b6;
}

/* --- HAMBURGER ICON (Restaurado) --- */
.hamburger-icon {
  width: 22px;
  height: 16px;
  position: relative;
}

.toggler-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #2bc1b6;
  border-radius: 2px;
  position: absolute;
  transition: 0.3s;
}

.line-top {
  top: 0;
}

.line-mid {
  top: 7px;
}

.line-bot {
  top: 14px;
}

/* --- MOBILE STYLES (Restaurado + Ajuste Layout) --- */
@media (max-width: 991.98px) {
  .logo-img {
    height: 35px;
  }

  .offcanvas {
    background-color: #ffffff;
    border-radius: 20px 0 0 20px !important;
  }

  .offcanvas-body {
    padding: 1.5rem;
  }

  .nav-item {
    margin-bottom: 0.75rem;
  }

  /* Estilo base para links en menú móvil */
  .nav-link {
    padding: 14px 20px !important;
    background-color: #f8f9fa;
    border-radius: 12px;
    display: flex;
    align-items: center;
    font-size: 1.05rem;
  }

  .nav-link i {
    font-size: 1.2rem;
    color: #2bc1b6;
    width: 30px;
  }

  .nav-link:active,
  .nav-link:hover {
    background-color: #e0f2f1;
    color: #2bc1b6 !important;
  }

  /* --- BOTONES DE ACCIÓN INFERIORES --- */
  .mobile-action-group {
    display: flex;
    gap: 10px;
    width: 100%;
    list-style: none;
    padding: 0;
  }

  .nav-item-calendar,
  .nav-item-profile {
    list-style: none;
  }

  .nav-item-calendar {
    flex: 0 0 auto;
  }

  .nav-item-calendar .btn-perfil-wrapper {
    width: 55px;
    justify-content: center;
    padding: 14px 0 !important;
  }

  .btn-perfil-wrapper {
    background-color: #2bc1b6 !important;
    color: white !important;
    border: none;
  }

  .btn-perfil-wrapper i {
    color: white !important;
    font-size: 1.2rem;
  }

  .btn-perfil-wrapper:hover,
  .btn-perfil-wrapper:active {
    background-color: #24a89e !important;
    color: white !important;
  }

  .btn-perfil-wrapper i {
    width: auto !important;
  }
}
</style>