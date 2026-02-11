<script setup>
import { ref, computed, onMounted } from 'vue';
import { useServicesStore } from '@/stores/serviceStore';

const servicesStore = useServicesStore();

const tabActivo = ref('denak');
const terminoBusqueda = ref('');
const servicioEditando = ref(null);
const mostrarModalCrear = ref(false);
const nuevoServicio = ref({
  nombre: '',
  precio: 0,
  etxeko_prezioa: 0,
  iraunaldia: 30,
  kategoria: 'ileapaintzea'
});

// Cargar servicios al montar
onMounted(async () => {
  try {
    await servicesStore.fetchZerbitzuak();
  } catch (error) {
    console.error('Error cargando zerbitzuak:', error);
  }
});

const categorias = [
  { value: 'denak', label: 'Denak', icon: 'fa-list' },
  { value: 'ileapaintzea', label: 'Ile-apaintzea', icon: 'fa-cut' },
  { value: 'kolorea', label: 'Kolorea', icon: 'fa-palette' },
  { value: 'tratamenduak', label: 'Tratamenduak', icon: 'fa-spa' },
  { value: 'bestelakoak', label: 'Bestelakoak', icon: 'fa-star' }
];

const categoriaActual = computed(() => {
  return categorias.find(c => c.value === tabActivo.value);
});

// Datos de servicios del store
const servicios = computed(() => {
  // Mapear los datos del backend al formato esperado
  return servicesStore.zerbitzuak.map(z => {
    const categoriaMap = {
      'ileapaintzea': { nombre: 'Ile-apaintzea', icon: 'fa-cut' },
      'kolorea': { nombre: 'Kolorea', icon: 'fa-palette' },
      'tratamenduak': { nombre: 'Tratamenduak', icon: 'fa-spa' },
      'bestelakoak': { nombre: 'Bestelakoak', icon: 'fa-star' }
    };
    const catInfo = categoriaMap[z.kategoria] || { nombre: 'Ile-apaintzea', icon: 'fa-cut' };
    
    return {
      id: z.id,
      nombre: z.izena,
      precio: parseFloat(z.prezioa),
      etxeko_prezioa: parseFloat(z.etxeko_prezioa),
      iraunaldia: parseInt(z.iraunaldia),
      categoria: catInfo.nombre,
      kategoriaValue: z.kategoria,
      icon: catInfo.icon
    };
  });
});

const isLoading = computed(() => servicesStore.isLoading);
const error = computed(() => servicesStore.error);

const serviciosFiltrados = computed(() => {
  let items = servicios.value;
  
  if (tabActivo.value !== 'denak') {
    items = items.filter(s => s.kategoriaValue === tabActivo.value);
  }

  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase();
    items = items.filter(s => 
      s.nombre.toLowerCase().includes(termino) ||
      s.categoria.toLowerCase().includes(termino)
    );
  }

  return items;
});

const editarServicio = (servicio) => {
  servicioEditando.value = { ...servicio };
};

const guardarEdicion = async () => {
  try {
    // Preparar datos para el backend
    const updateData = {
      izena: servicioEditando.value.nombre,
      prezioa: servicioEditando.value.precio,
      etxeko_prezioa: servicioEditando.value.etxeko_prezioa,
      iraunaldia: servicioEditando.value.iraunaldia,
      kategoria: servicioEditando.value.kategoriaValue
    };
    
    await servicesStore.updateZerbitzua(servicioEditando.value.id, updateData);
    
    // Recargar los servicios para obtener los datos actualizados
    await servicesStore.fetchZerbitzuak();
    
    servicioEditando.value = null;
  } catch (error) {
    console.error('Error actualizando servicio:', error);
    alert('Error al guardar los cambios: ' + error.message);
  }
};

const cancelarEdicion = () => {
  servicioEditando.value = null;
};

const abrirModalCrear = () => {
  nuevoServicio.value = {
    nombre: '',
    precio: 0,
    etxeko_prezioa: 0,
    iraunaldia: 30,
    kategoria: 'ileapaintzea'
  };
  mostrarModalCrear.value = true;
};

const crearServicio = async () => {
  try {
    const createData = {
      izena: nuevoServicio.value.nombre,
      prezioa: nuevoServicio.value.precio,
      etxeko_prezioa: nuevoServicio.value.etxeko_prezioa,
      iraunaldia: nuevoServicio.value.iraunaldia,
      kategoria: nuevoServicio.value.kategoria
    };
    
    await servicesStore.createZerbitzua(createData);
    await servicesStore.fetchZerbitzuak();
    
    mostrarModalCrear.value = false;
  } catch (error) {
    console.error('Error creando servicio:', error);
    alert('Error al crear el servicio: ' + error.message);
  }
};

const cerrarModalCrear = () => {
  mostrarModalCrear.value = false;
};
</script>

<template>
  <div class="container py-3 mb-5 mt-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Gure <span class="text-custom">Zerbitzuak</span></h2>
      <div class="d-flex gap-2 align-items-center">
        <button class="btn btn-custom btn-sm" @click="abrirModalCrear">
          <i class="fas fa-plus me-1"></i>
          <span class="d-none d-md-inline">Zerbitzu berria</span>
          <span class="d-md-none">Gehitu</span>
        </button>
        <div class="badge bg-custom-light text-custom p-2 px-3 rounded-pill">
          {{ serviciosFiltrados.length }} Zerbitzu
        </div>
      </div>
    </div>

    <!-- Desplegable para móvil -->
    <div class="d-lg-none mb-4">
      <select 
        v-model="tabActivo" 
        class="form-select category-select"
      >
        <option 
          v-for="cat in categorias" 
          :key="cat.value" 
          :value="cat.value"
        >
          {{ cat.label }}
        </option>
      </select>
    </div>

    <!-- Pestañas de Navegación para desktop -->
    <ul class="nav nav-tabs mb-4 border-bottom border-2 d-none d-lg-flex" style="border-color: #2bc1b6 !important;">
      <li class="nav-item" v-for="cat in categorias" :key="cat.value">
        <button 
          @click="tabActivo = cat.value"
          :class="['nav-link', { active: tabActivo === cat.value }]"
        >
          <i :class="['fas', cat.icon, 'me-2']"></i> {{ cat.label }}
        </button>
      </li>
    </ul>

    <!-- Buscador -->
    <div class="mb-4">
      <input 
        v-model="terminoBusqueda"
        type="text" 
        class="form-control form-control-lg" 
        placeholder="Bilatu zerbitzuen izena..."
        style="border-color: #2bc1b6; border-width: 2px;"
      >
    </div>

    <!-- Contenido de Pestañas -->
    <div class="tab-content">
      <!-- Resultados -->
      <div v-if="serviciosFiltrados.length === 0 && terminoBusqueda.trim()" class="text-center py-5">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <p class="text-muted">Ez da zerbitzurik aurkitu</p>
      </div>

      <div class="row g-4">
        <div 
          v-for="servicio in serviciosFiltrados" 
          :key="servicio.id" 
          class="col-12 col-sm-6 col-lg-3"
        >
          <div class="card h-100 border-0 shadow-sm card-product">
            <div class="card-img-top bg-light d-flex align-items-center justify-content-center py-5">
              <i :class="['fas', servicio.icon, 'fa-3x', 'text-custom', 'opacity-25']"></i>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="badge bg-light text-muted small">{{ servicio.categoria }}</span>
                <span class="text-custom fw-bold">{{ servicio.precio }}€</span>
              </div>
              <h6 class="fw-bold text-dark mb-3">{{ servicio.nombre }}</h6>
              
              <button 
                class="btn btn-edit w-100"
                @click="editarServicio(servicio)"
              >
                <i class="fas fa-edit me-2"></i>Editatu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="servicioEditando" class="modal-overlay" @click.self="cancelarEdicion">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold">Zerbitzua editatu</h5>
          <button type="button" class="btn-close" @click="cancelarEdicion"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label fw-semibold">Izena</label>
            <input 
              v-model="servicioEditando.nombre" 
              type="text" 
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Prezioa (€)</label>
            <input 
              v-model.number="servicioEditando.precio" 
              type="number" 
              step="0.01"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Etxeko Prezioa (€)</label>
            <input 
              v-model.number="servicioEditando.etxeko_prezioa" 
              type="number" 
              step="0.01"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Iraunaldia (minutuak)</label>
            <input 
              v-model.number="servicioEditando.iraunaldia" 
              type="number" 
              class="form-control"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEdicion">
            Utzi
          </button>
          <button class="btn btn-custom" @click="guardarEdicion">
            <i class="fas fa-save me-2"></i>Gorde
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Crear Servicio -->
  <div v-if="mostrarModalCrear" class="modal-overlay" @click.self="cerrarModalCrear">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="fw-bold mb-0">Zerbitzu berria</h5>
        <button class="btn-close" @click="cerrarModalCrear"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label fw-semibold">Kategoria</label>
          <select v-model="nuevoServicio.kategoria" class="form-select">
            <option value="ileapaintzea">Ile-apaintzea</option>
            <option value="kolorea">Kolorea</option>
            <option value="tratamenduak">Tratamenduak</option>
            <option value="bestelakoak">Bestelakoak</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Izena</label>
          <input 
            v-model="nuevoServicio.nombre" 
            type="text" 
            class="form-control"
            placeholder="Adib. Mozketa"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Prezioa (€)</label>
          <input 
            v-model.number="nuevoServicio.precio" 
            type="number" 
            step="0.01"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Etxeko Prezioa (€)</label>
          <input 
            v-model.number="nuevoServicio.etxeko_prezioa" 
            type="number" 
            step="0.01"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Iraunaldia (minutuak)</label>
          <input 
            v-model.number="nuevoServicio.iraunaldia" 
            type="number" 
            class="form-control"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="cerrarModalCrear">
          Utzi
        </button>
        <button class="btn btn-custom" @click="crearServicio">
          <i class="fas fa-plus me-2"></i>Sortu
        </button>
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

.btn-edit {
  background-color: #2bc1b6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-edit:hover {
  background-color: #1aa094;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(43, 193, 182, 0.3);
  color: white;
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
  max-width: 500px;
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
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-control:focus {
  border-color: #2bc1b6;
  box-shadow: 0 0 0 0.2rem rgba(43, 193, 182, 0.25);
}

.category-select {
  border: 2px solid #2bc1b6;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 500;
  color: #2bc1b6;
  background-color: white;
  width: 100%;
  max-width: 100%;
  font-size: 0.95rem;
}

.category-select:focus {
  border-color: #2bc1b6;
  box-shadow: 0 0 0 0.2rem rgba(43, 193, 182, 0.25);
  color: #2bc1b6;
}

@media (max-width: 991.98px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .category-select {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}
</style>
