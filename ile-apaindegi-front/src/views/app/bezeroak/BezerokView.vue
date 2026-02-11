<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBezeroakStore } from '@/stores/bezeroakStore';
import { useAppointmentsStore } from '@/stores/appointmentsStore';

const router = useRouter();
const searchQuery = ref('');

const bezeroakStore = useBezeroakStore();
const appointmentsStore = useAppointmentsStore();

onMounted(async () => {
  try {
    await Promise.all([
      bezeroakStore.fetchBezeroak(),
      appointmentsStore.fetchHitzorduak()
    ]);
  } catch (e) {
    // Manejo mínimo; la UI mostrará estados vacíos
  }
});

const citasPorBezeroa = computed(() => {
  const mapa = new Map();
  (appointmentsStore.hitzorduak || []).forEach(h => {
    const id = h.bezeroa_id;
    const fecha = h.hitzordua_data;
    if (!mapa.has(id)) mapa.set(id, { total: 0, ultima: null });
    const entry = mapa.get(id);
    entry.total += 1;
    if (!entry.ultima || (fecha && fecha > entry.ultima)) entry.ultima = fecha;
  });
  return mapa;
});

const clientesFiltrados = computed(() => {
  const lista = (bezeroakStore.bezeroak || []).map(b => ({
    id: b.id,
    nombre: `${b.izena} ${b.abizenak}`.trim(),
    telefono: b.telefonoa,
    email: b.posta_elek,
    totalCitas: citasPorBezeroa.value.get(b.id)?.total || 0,
    ultimaCita: citasPorBezeroa.value.get(b.id)?.ultima || '—'
  }));

  if (!searchQuery.value.trim()) return lista;
  const query = searchQuery.value.toLowerCase();
  return lista.filter(cliente =>
    cliente.nombre.toLowerCase().includes(query) ||
    (cliente.telefono || '').includes(query) ||
    (cliente.email || '').toLowerCase().includes(query)
  );
});

const irADetalle = (cliente) => {
  router.push({
    name: 'bezeroak-details',
    params: { id: cliente.id }
  });
};
</script>

<template>
  <div class="container py-3 mb-5 mt-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Gure <span class="text-custom">Bezeroak</span></h2>
      <div class="badge bg-custom-light text-custom p-2 px-3 rounded-pill">
        {{ clientesFiltrados.length }} Bezero
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="mb-4">
      <input 
        v-model="searchQuery"
        type="text" 
        class="form-control search-input"
        placeholder="Bilatu bezeroa (izena, telefonoa edo herria)..."
      />
    </div>

    <!-- Grid de Clientes -->
    <div class="row g-4">
      <div 
        v-for="cliente in clientesFiltrados" 
        :key="cliente.id" 
        class="col-12 col-sm-6 col-lg-4"
      >
        <div 
          class="card h-100 border-0 shadow-sm card-cliente"
          @click="irADetalle(cliente)"
        >
          <div class="card-header-custom">
            <i class="fas fa-user-circle fa-2x text-custom"></i>
          </div>
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-2">{{ cliente.nombre }}</h6>
            
            <div class="info-item mb-2">
              <small class="text-muted">
                <i class="fas fa-phone text-custom me-2"></i>{{ cliente.telefono }}
              </small>
            </div>
            
            <div class="info-item mb-3">
              <small class="text-muted">
                <i class="fas fa-envelope text-custom me-2"></i>{{ cliente.email }}
              </small>
            </div>

            <div class="d-flex gap-2 mb-3">
              <span class="badge bg-custom-light text-custom">
                <i class="fas fa-calendar me-1"></i>{{ cliente.totalCitas }} cita
              </span>
              <span class="badge bg-light text-muted text-secondary">
                <i class="fas fa-clock me-1"></i>{{ cliente.ultimaCita }}
              </span>
            </div>

            <button 
              class="btn btn-edit w-100"
              @click.stop="irADetalle(cliente)"
            >
              <i class="fas fa-arrow-right me-2"></i>Fitxara joan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <div v-if="clientesFiltrados.length === 0" class="text-center py-5">
      <i class="fas fa-search fa-3x text-muted opacity-25 mb-3 d-block"></i>
      <p class="text-muted">Ez da bezerorik aurkitu zure bilaketarekin.</p>
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

.search-input {
  border: 2px solid #2bc1b6;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1aa094;
  box-shadow: 0 0 0 0.2rem rgba(43, 193, 182, 0.25);
  outline: none;
}

.card-cliente {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
}

.card-cliente:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.card-header-custom {
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.card-body {
  padding: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  line-height: 1.4;
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

@media (max-width: 991.98px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .search-input {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
}
</style>
