<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const cliente = ref(null);
const historial = ref([]);

onMounted(() => {
  const id = Number(route.params.id || 0);
  // mock data — sustituir por llamada API si procede
  cliente.value = {
    id,
    nombre: id ? `Cliente #${id}` : 'Cliente Desconocido',
    telefono: '600000000',
    email: 'cliente@example.com',
    direccion: 'Calle Falsa 123'
  };

  historial.value = [
    { id: 1, fecha: '2025-12-01', servicio: 'Corte y peinado', precio: 25.00 },
    { id: 2, fecha: '2026-01-10', servicio: 'Coloración', precio: 40.00 },
    { id: 3, fecha: '2026-01-20', servicio: 'Tratamiento hidratación', precio: 18.00 }
  ];
});

const volver = () => router.push('/bezeroak');
</script>

<template>
  <div class="container py-3" v-if="cliente" style="margin-top: 10px; margin-bottom: 140px; max-width: 1140px;">
    <button @click="volver" class="btn btn-danger text-decoration-none mb-4">
      <i class="fas fa-arrow-left me-2"></i> Itzuli
    </button>

    <div class="row g-5">
      <div class="col-lg-5">
        <div class="product-image-container bg-white shadow-sm rounded-4 d-flex align-items-center justify-content-center">
          <i class="fas fa-user fa-10x text-light"></i>
        </div>
      </div>

      <div class="col-lg-7">
        <span class="badge bg-custom-light text-custom mb-2 px-3 py-2 rounded-pill fw-bold">Cliente</span>
        <h1 class="display-5 fw-bold mb-3">{{ cliente.nombre }}</h1>
        <p class="text-muted lead mb-4">Telefono: {{ cliente.telefono }} • {{ cliente.email }}</p>

        <div class="card border-0 bg-light rounded-4 p-4 mb-4">
          <div class="row text-center">
            <div class="col-6 border-end">
              <small class="text-muted d-block mb-1">Historiko Zerbitzuak</small>
              <span class="h4 fw-bold mb-0">{{ historial.length }}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Gastua totala</small>
              <span class="h4 fw-bold mb-0 text-truncate d-block px-2">{{ historial.reduce((s, i) => s + i.precio, 0).toFixed(2) }}€</span>
            </div>
          </div>
        </div>

        <h5 class="fw-bold mb-3">Historial de servicios</h5>
        <div class="list-group mb-4">
          <div v-for="item in historial" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-semibold">{{ item.servicio }}</div>
              <small class="text-muted">{{ item.fecha }}</small>
            </div>
            <div class="text-custom fw-bold">{{ item.precio }}€</div>
          </div>
        </div>

        <div class="d-flex gap-3">
          <button class="btn btn-custom btn-lg flex-grow-1 shadow-sm">
            <i class="fas fa-phone me-2"></i> Kontaktatu
          </button>
          <button class="btn btn-outline-secondary btn-lg px-4 shadow-sm">
            <i class="fas fa-file-invoice"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .text-custom { 
        color: #2bc1b6; 
    }

    .bg-custom-light { 
        background-color: #e0f2f1; 
    }

    .btn-custom { 
        background-color: #2bc1b6; 
        color: white; 
        border: none; 
    }

    .btn-custom:hover,
    .btn-custom:focus,
    .btn-custom:active { 
        background-color: #24a89e !important; 
        color: white !important; 
    }

    .product-image-container {
        min-height: 300px;
        border: 1px solid rgba(0,0,0,0.05);
    }
</style>
