<script setup>
import { computed, onMounted, ref, defineExpose } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventoryStore';

const router = useRouter();
const inventoryStore = useInventoryStore();
const modalCrear = ref(false);
const terminoBusqueda = ref('');
const formularioNuevo = ref({
  tipo: '',
  izena: '',
  deskribapena: '',
  marka: '',
  kantitatea: 1
});

const abrirModalCrear = () => {
  modalCrear.value = true;
};

defineExpose({ abrirModalCrear });

onMounted(async () => {
  try {
    await inventoryStore.fetchEkipamenduak();
  } catch (e) {}
});

const herramientas = computed(() => {
  let items = (inventoryStore.ekipamenduak || []).map(e => ({
    id: e.id,
    nombre: e.izena,
    tipo: e.tipo,
    marca: e.marka,
    deskribapena: e.deskribapena,
    kantitatea: e.kantitatea || 1
  }));

  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase();
    items = items.filter(h => 
      h.nombre.toLowerCase().includes(termino) ||
      h.marca.toLowerCase().includes(termino) ||
      h.tipo.toLowerCase().includes(termino)
    );
  }

  return items;
});

const irADetalle = (id) => {
  router.push(`/inbentarioa/ekipamendua/${id}`);
};

const resetearFormulario = () => {
  formularioNuevo.value = {
    tipo: '',
    izena: '',
    deskribapena: '',
    marka: '',
    kantitatea: 1
  };
};

const guardarNuevoEkipamendua = async () => {
  if (!formularioNuevo.value.izena.trim()) {
    alert('Izena ezinbestekoa da');
    return;
  }
  
  try {
    await inventoryStore.createEkipamendua(formularioNuevo.value);
    await inventoryStore.fetchEkipamenduak();
    
    modalCrear.value = false;
    resetearFormulario();
  } catch (error) {
    console.error('Error sortzean ekipamendua:', error);
    alert('Errorea ekipamendua sortzean: ' + error.message);
  }
};
</script>

<template>
  <div>
    <!-- Buscador -->
    <div class="mb-4">
      <input 
        v-model="terminoBusqueda"
        type="text" 
        class="form-control form-control-lg" 
        placeholder="Bilatu izena, marka, motean..."
        style="border-color: #2bc1b6; border-width: 2px;"
      >
    </div>

    <!-- Resultados -->
    <div v-if="herramientas.length === 0 && terminoBusqueda.trim()" class="text-center py-5">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <p class="text-muted">Ez da tresnerik aurkitu</p>
    </div>

    <div class="row g-4">
      <div v-for="herr in herramientas" :key="herr.id" class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm card-product" @click="irADetalle(herr.id)">
          <div class="card-img-top bg-light d-flex align-items-center justify-content-center py-5">
             <i class="fas fa-tools fa-3x text-custom opacity-25"></i>
          </div>
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-1">{{ herr.nombre }}</h6>
            <p class="text-muted small mb-3">{{ herr.marca }}</p>
            
            <small class="text-muted mt-2 d-block">Kantitatea: {{ herr.kantitatea }} uds.</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear nuevo equipamiento -->
    <div v-if="modalCrear" class="modal-overlay" @click.self="modalCrear = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold">Sortu Ekipamendua</h5>
          <button type="button" class="btn-close" @click="modalCrear = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarNuevoEkipamendua">
            <div class="mb-3">
              <label class="form-label fw-bold">Tipo (Mota) *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formularioNuevo.tipo"
                required
                placeholder="Adib: Secador, Plancha, Rizador..."
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Izena *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formularioNuevo.izena"
                required
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Marka</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formularioNuevo.marka"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Kantitatea</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formularioNuevo.kantitatea"
                min="1"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Deskribapena</label>
              <textarea 
                class="form-control" 
                v-model="formularioNuevo.deskribapena"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="modalCrear = false">
            Itxi
          </button>
          <button class="btn btn-primary" @click="guardarNuevoEkipamendua">
            <i class="fas fa-save me-1"></i>Sortu
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

    .bg-custom { 
        background-color: #2bc1b6; 
    }

    .bg-custom-light { 
        background-color: #e0f2f1; 
    }

    .btn-custom {
        background-color: #2bc1b6;
        color: white;
        border: none;
    }

    .btn-custom:hover {
        background-color: #24a89e;
        color: white;
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

    /* Modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .modal-content {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .btn-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }

    .btn-close:hover {
        color: #000;
    }
</style>
