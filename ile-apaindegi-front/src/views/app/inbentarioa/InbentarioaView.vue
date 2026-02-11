<script setup>
import { ref, computed } from 'vue';
import MaterialaView from './MaterialaView.vue';
import EkipamenduaView from './EkipamenduaView.vue';
import { useInventoryStore } from '@/stores/inventoryStore';

const tabActivo = ref('materiala');
const materialaView = ref(null);
const ekipamenduaView = ref(null);
const inventoryStore = useInventoryStore();

const contadorActual = computed(() => {
  if (tabActivo.value === 'materiala') {
    return `${inventoryStore.kontsumigarriak?.length || 0} Produktu`;
  } else {
    return `${inventoryStore.ekipamenduak?.length || 0} Tresneta`;
  }
});

const abrirModal = () => {
  if (tabActivo.value === 'materiala') {
    materialaView.value?.abrirModalCrear();
  } else {
    ekipamenduaView.value?.abrirModalCrear();
  }
};
</script>

<template>
  <div class="container py-3 mb-5 mt-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Gure <span class="text-custom">Inbentarioa</span></h2>
      <div class="d-flex gap-2 align-items-center">
        <button 
          class="btn btn-custom btn-sm" 
          @click="abrirModal"
        >
          <i class="fas fa-plus"></i>
        </button>
        <div class="badge bg-custom-light text-custom p-2 px-3 rounded-pill">
          {{ contadorActual }}
        </div>
      </div>
    </div>

    <!-- Pestañas de Navegación -->
    <ul class="nav nav-tabs mb-4 border-bottom border-2" style="border-color: #2bc1b6 !important;">
      <li class="nav-item">
        <button 
          @click="tabActivo = 'materiala'"
          :class="['nav-link', { active: tabActivo === 'materiala' }]"
        >
          <i class="fas fa-vial me-2"></i> Materiala
        </button>
      </li>
      <li class="nav-item">
        <button 
          @click="tabActivo = 'ekipamendua'"
          :class="['nav-link', { active: tabActivo === 'ekipamendua' }]"
        >
          <i class="fas fa-tools me-2"></i> Ekipamendua
        </button>
      </li>
    </ul>

    <!-- Contenido de Pestañas -->
    <div class="tab-content">
      <div v-if="tabActivo === 'materiala'" class="tab-pane fade show active">
        <MaterialaView ref="materialaView" />
      </div>
      <div v-if="tabActivo === 'ekipamendua'" class="tab-pane fade show active">
        <EkipamenduaView ref="ekipamenduaView" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-custom { 
    color: #2bc1b6; 
}

.btn-custom {
  background: linear-gradient(135deg, #2bc1b6 0%, #1aa094 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-custom.btn-sm {
  padding: 6px 12px;
  font-size: 0.875rem;
}

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(43, 193, 182, 0.3);
  background: linear-gradient(135deg, #1aa094 0%, #2bc1b6 100%);
  color: white;
}

.bg-custom-light {
  background-color: rgba(43, 193, 182, 0.1) !important;
}

.nav-link {
  color: #636e72 !important;
  font-weight: 500;
  border: none !important;
  position: relative;
  transition: all 0.3s ease;
  padding: 12px 24px;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #2bc1b6 !important;
}

.nav-link.active {
  color: #2bc1b6 !important;
  font-weight: 600;
  border-bottom: 3px solid #2bc1b6 !important;
}
</style>
