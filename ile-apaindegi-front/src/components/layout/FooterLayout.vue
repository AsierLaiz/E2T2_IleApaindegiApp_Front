<script setup>
    const urtea = new Date().getFullYear();
</script>

<template>
  <footer class="footer mt-auto py-5 bg-white border-top">
    <div class="container">
      <div class="row gy-5 justify-content-lg-between ms-lg-5 me-lg-5"> 
        
        <div class="col-12 col-lg-4 text-center text-lg-start">
          <router-link class="footer-brand fw-bold d-inline-flex align-items-center mb-3 text-decoration-none" to="/">
            <img src="https://ile-apaindegi-testing-bucket.s3.us-east-1.amazonaws.com/img/logo/FPSanturtzi_Logo.png" class="logo-img" />
          </router-link>
          <div class="social-links d-flex justify-content-center justify-content-lg-start gap-3 mt-4">
            <a href="https://www.instagram.com/fpsanturtzilh" class="social-icon" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://www.facebook.com/fpsanturtzilh" class="social-icon" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.x.com/fpsanturtzilh" class="social-icon" target="_blank"><i class="fab fa-twitter"></i></a>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-2 text-center text-lg-start">
          <h6 class="fw-bold mb-4 text-dark text-uppercase small tracking-wider">Nabigazioa</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><router-link to="/" class="footer-link">Inicio</router-link></li>
            <li class="mb-2"><router-link to="/inbentarioa" class="footer-link">Inbentarioa</router-link></li>
            <li class="mb-2"><router-link to="/zerbitzuak" class="footer-link">Zerbitzuak</router-link></li>
          </ul>
        </div>

        <div class="col-12 col-md-6 col-lg-3 text-center text-lg-start">
          <h6 class="fw-bold mb-4 text-dark text-uppercase small tracking-wider">Kontaktua</h6>
          <ul class="list-unstyled text-muted small">
            <li class="mb-3">
              <i class="fas fa-home me-2 text-primary-custom"></i> Pajares Kalea 34 - Santurtzi
            </li>
            <li class="mb-3">
              <i class="fas fa-phone me-2 text-primary-custom"></i> +34 944 614 600
            </li>
            <li class="mb-3">
              <i class="fas fa-envelope me-2 text-primary-custom"></i> secretaria@fpsanturtzilh.eus
            </li>
          </ul>
        </div>

      </div>

      <hr class="my-5 opacity-10">

      <div class="d-flex justify-content-center">
          <span class="text-muted extra-small">© {{ urtea }} Ile-Apaindegi-Web | FP Santurtzi LH.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
    .footer {
        background-color: #ffffff;
    }

    .footer-link {
        color: #636e72;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: inline-block;
    }

    .footer-link:hover {
        color: #2bc1b6;
    }

    .logo-img {
        height: 70px;
        width: auto;
        object-fit: contain;
    }

    .social-icon {
        width: 38px;
        height: 38px;
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        border: 1px solid #2bc1b6;
        color: #2bc1b6;
        font-weight: bold;
        font-size: 0.95rem;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .social-icon:hover {
        background-color: #2bc1b6;
        color: white;
    }

    .tracking-wider {
        letter-spacing: 1.5px;
    }

    .extra-small {
        font-size: 0.8rem;
    }
</style>