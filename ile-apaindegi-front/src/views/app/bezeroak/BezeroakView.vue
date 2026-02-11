<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBezeroakStore } from '@/stores/bezeroakStore';

const router = useRouter();
const bezeroakStore = useBezeroakStore();

// Cargar clientes al montar el componente
onMounted(async () => {
  try {
    await bezeroakStore.fetchBezeroak();
  } catch (error) {
    console.error('Error cargando bezeroak:', error);
  }
});

// Computed para acceder a los bezeroak del store
const bezeroak = computed(() => {
  // Mapear los datos del backend al formato esperado por la vista
  return bezeroakStore.bezeroak.map(b => ({
    id: b.id,
    nombre: `${b.izena} ${b.abizenak}`,
    telefono: b.telefonoa,
    // Estos campos los podemos obtener de las relaciones si el backend los incluye
    servicios: b.hitzorduak?.length || 0,
    saldo: 0.00 // Implementar lógica de saldo si es necesario
  }));
});

const isLoading = computed(() => bezeroakStore.isLoading);
const error = computed(() => bezeroakStore.error);

const irADetalle = (id) => {
  router.push(`/bezeroak/${id}`);
};
</script>

<template>
  <div class="container py-3 mb-5 mt-3" style="max-width: 1140px;">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Gure <span class="text-custom">Bezeroak</span></h2>
      <div class="badge bg-custom-light text-custom p-2 px-3 rounded-pill">
        {{ bezeroak.length }} bezero totala
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-custom" role="status">
        <span class="visually-hidden">Kargatzen...</span>
      </div>
      <p class="text-muted mt-3">Bezeroak kargatzen...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>
      Errorea bezeroak kargatzerakoan: {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="bezeroak.length === 0" class="text-center py-5">
      <i class="fas fa-users fa-3x text-muted mb-3"></i>
      <p class="text-muted">Ez dago bezerorik oraindik</p>
    </div>

    <!-- Bezeroak grid -->
    <div v-else class="row g-4">
      <div v-for="b in bezeroak" :key="b.id" class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm card-product" @click="irADetalle(b.id)">
          <div class="card-img-top bg-light d-flex align-items-center justify-content-center py-5">
             <i class="fas fa-user fa-3x text-custom opacity-25"></i>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span class="badge bg-light text-muted small">Servicios: {{ b.servicios }}</span>
              <span class="text-custom fw-bold">{{ b.saldo.toFixed(2) }}€</span>
            </div>
            <h6 class="fw-bold text-dark mb-1">{{ b.nombre }}</h6>
            <p class="text-muted small mb-3">{{ b.telefono }}</p>

            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-custom" :style="{ width: Math.min(100, b.servicios * 12) + '%' }"></div>
            </div>
            <small class="text-muted mt-2 d-block">Historial: {{ b.servicios }} s.</small>
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

    .card-product {
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 16px;
    overflow: hidden;
    }

    .card-product:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
    }
</style>
