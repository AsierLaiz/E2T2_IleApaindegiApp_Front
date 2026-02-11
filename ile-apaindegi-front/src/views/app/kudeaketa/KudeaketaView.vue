<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useIkasleakStore } from '@/stores/ikasleakStore';

const inventoryStore = useInventoryStore();
const ikasleakStore = useIkasleakStore();

const tabActivo = ref('ekipamendua');
const searchQuery = ref('');
const modalActivo = ref(false);
const modalCoger = ref(false);
const itemSeleccionado = ref(null);
const usuarioActual = ref('Usuario Actual'); // En producción vendría de la sesión
const cantidadCoger = ref(1);
const alumnoSeleccionado = ref(null);
const busquedaAlumno = ref('');
const historialPrestamos = ref([]);

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await Promise.all([
      ikasleakStore.fetchIkasleak(),
      inventoryStore.fetchEkipamenduak(),
      inventoryStore.fetchKontsumigarriak()
    ]);
    // Cargar historial de préstamos
    historialPrestamos.value = await inventoryStore.fetchIkasleakKontsumigarriak();
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
});

// Computed para obtener alumnos formateados
const alumnos = computed(() => ikasleakStore.ikasleakFormatted);

const alumnosFiltrados = computed(() => {
  if (!busquedaAlumno.value.trim()) {
    return alumnos.value;
  }
  const query = busquedaAlumno.value.toLowerCase();
  return alumnos.value.filter(alumno => 
    alumno.nombre.toLowerCase().includes(query) ||
    alumno.grupo.toLowerCase().includes(query)
  );
});

// Computed para equipamiento desde el store
const ekipamendua = computed(() => {
  // Agrupar ekipamenduak por tipo (izena)
  // Como la BD actual no tiene soporte para múltiples unidades,
  // por ahora mostramos los equipamientos tal como vienen
  return inventoryStore.ekipamenduak.map(equipo => ({
    id: equipo.id,
    tipo: equipo.izena,
    totalUnidades: 1, // Por defecto 1 hasta que se implemente el sistema de unidades
    unidades: [
      { id: 1, numero: 1, enUso: false, usuario: null, desde: null }
    ],
    historial: []
  }));
});

// Computed para materiales desde el store
const materialak = computed(() => {
  return inventoryStore.kontsumigarriak.map(material => {
    // Obtener los préstamos para este material
    const prestamosDelMaterial = historialPrestamos.value
      .filter(p => p.kontsumigarria_id === material.id)
      .map(p => {
        return {
          usuario: p.ikaslea ? `${p.ikaslea.izena} ${p.ikaslea.abizenak}` : 'Desconocido',
          fecha: p.erabiltzeko_data,
          hora: p.erabiltzeko_ordua ? p.erabiltzeko_ordua.substring(0, 5) : '',
          cantidad: p.erabilitako_kopurua
        };
      })
      .sort((a, b) => new Date(b.fecha + ' ' + b.hora) - new Date(a.fecha + ' ' + a.hora));
    
    return {
      id: material.id,
      nombre: material.izena,
      tipo: material.kategoria?.izena || 'Sin categoría',
      stock: material.stock,
      prestamos: prestamosDelMaterial
    };
  });
});

const itemsFiltrados = computed(() => {
  const items = tabActivo.value === 'ekipamendua' ? ekipamendua.value : materialak.value;
  
  if (!searchQuery.value.trim()) {
    return items;
  }
  
  const query = searchQuery.value.toLowerCase();
  return items.filter(item => {
    if (tabActivo.value === 'ekipamendua') {
      return item.tipo.toLowerCase().includes(query);
    } else {
      return item.nombre.toLowerCase().includes(query) || item.tipo.toLowerCase().includes(query);
    }
  });
});

const getUnidadesDisponibles = (equipo) => {
  return equipo.unidades.filter(u => !u.enUso).length;
};

const getUnidadesEnUso = (equipo) => {
  return equipo.unidades.filter(u => u.enUso).length;
};

const verDetalles = (item) => {
  itemSeleccionado.value = item;
  modalActivo.value = true;
};

const cerrarModal = () => {
  modalActivo.value = false;
  modalCoger.value = false;
  itemSeleccionado.value = null;
  alumnoSeleccionado.value = null;
  busquedaAlumno.value = '';
  cantidadCoger.value = 1;
};

const abrirModalCoger = (item) => {
  itemSeleccionado.value = item;
  alumnoSeleccionado.value = null;
  busquedaAlumno.value = '';
  cantidadCoger.value = 1;
  modalCoger.value = true;
};

const seleccionarAlumno = (alumno) => {
  alumnoSeleccionado.value = alumno;
};

const cogerEquipo = (equipo) => {
  if (!alumnoSeleccionado.value) {
    alert('Mesedez, hautatu ikasle bat');
    return;
  }
  
  const unidadLibre = equipo.unidades.find(u => !u.enUso);
  if (unidadLibre) {
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);
    
    unidadLibre.enUso = true;
    unidadLibre.usuario = alumnoSeleccionado.value.nombre;
    unidadLibre.desde = `${fecha} ${hora}`;
    
    cerrarModal();
  }
};

const devolverEquipo = (equipo, unidadId) => {
  const unidad = equipo.unidades.find(u => u.id === unidadId);
  if (unidad && unidad.enUso) {
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);
    
    // Agregar al historial
    equipo.historial.unshift({
      usuario: unidad.usuario,
      desde: unidad.desde,
      hasta: `${fecha} ${hora}`,
      unidad: unidad.numero
    });
    
    // Liberar la unidad
    unidad.enUso = false;
    unidad.usuario = null;
    unidad.desde = null;
  }
};

const cogerMaterial = async (material, cantidad) => {
  if (!alumnoSeleccionado.value) {
    alert('Mesedez, hautatu ikasle bat');
    return;
  }
  
  if (material.stock >= cantidad && cantidad > 0) {
    try {
      // Encontrar el kontsumigarria original del store
      const materialOriginal = inventoryStore.kontsumigarriak.find(k => k.id === material.id);
      
      if (!materialOriginal) {
        alert('Errorea: materiala ez da aurkitu');
        return;
      }
      
      // Actualizar el stock en el backend
      const nuevoStock = materialOriginal.stock - parseInt(cantidad);
      await inventoryStore.updateKontsumigarria(material.id, {
        ...materialOriginal,
        stock: nuevoStock
      });
      
      // Registrar el préstamo en ikasleak_kontsumigarriak
      const ahora = new Date();
      const fecha = ahora.toISOString().split('T')[0];
      const hora = ahora.toTimeString().split(' ')[0];
      
      await inventoryStore.createIkasleaKontsumigarria({
        ikaslea_id: alumnoSeleccionado.value.id,
        kontsumigarria_id: material.id,
        erabilitako_kopurua: parseInt(cantidad),
        erabiltzeko_data: fecha,
        erabiltzeko_ordua: hora
      });
      
      // Recargar los datos
      await inventoryStore.fetchKontsumigarriak();
      // Recargar el historial
      historialPrestamos.value = await inventoryStore.fetchIkasleakKontsumigarriak();
      
      cerrarModal();
    } catch (error) {
      console.error('Error cogiendo material:', error);
      alert('Errorea materiala hartzerakoan: ' + error.message);
    }
  } else {
    alert('Stock-a ez da nahikoa edo kopurua ez da zuzena');
  }
};

const formatearFechaHora = (fechaHora) => {
  const [fecha, hora] = fechaHora.split(' ');
  return { fecha, hora };
};
</script>

<template>
  <div class="container py-3 mb-5 mt-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Material eta <span class="text-custom">Ekipamenduaren</span> Kudeaketa</h2>
      <div class="badge bg-custom-light text-custom p-2 px-3 rounded-pill">
        {{ itemsFiltrados.length }} {{ tabActivo === 'ekipamendua' ? 'Ekipamendu' : 'Material' }}
      </div>
    </div>

    <!-- Pestañas -->
    <ul class="nav nav-tabs mb-4 border-bottom border-2" style="border-color: #2bc1b6 !important;">
      <li class="nav-item">
        <button 
          @click="tabActivo = 'ekipamendua'"
          :class="['nav-link', { active: tabActivo === 'ekipamendua' }]"
        >
          <i class="fas fa-tools me-2"></i> Ekipamendua
        </button>
      </li>
      <li class="nav-item">
        <button 
          @click="tabActivo = 'materialak'"
          :class="['nav-link', { active: tabActivo === 'materialak' }]"
        >
          <i class="fas fa-box me-2"></i> Materialak
        </button>
      </li>
    </ul>

    <!-- Barra de búsqueda -->
    <div class="mb-4">
      <input 
        v-model="searchQuery"
        type="text" 
        class="form-control search-input"
        placeholder="Bilatu izena edo mota..."
      />
    </div>

    <!-- Grid de Ekipamendua -->
    <div v-if="tabActivo === 'ekipamendua'" class="row g-4">
      <div 
        v-for="equipo in itemsFiltrados" 
        :key="equipo.id" 
        class="col-12 col-sm-6 col-lg-4"
      >
        <div class="card h-100 border-0 shadow-sm card-item">
          <div class="card-header-custom" 
            :class="getUnidadesDisponibles(equipo) > 0 ? 'bg-success-gradient' : 'bg-danger-gradient'">
            <i class="fas fa-tools fa-2x" 
              :class="getUnidadesDisponibles(equipo) > 0 ? 'text-success' : 'text-danger'"></i>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h6 class="fw-bold text-dark mb-0">{{ equipo.tipo }}</h6>
            </div>
            
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="badge bg-success">Libre: {{ getUnidadesDisponibles(equipo) }}</span>
                <span class="badge bg-warning">Erabiltzen: {{ getUnidadesEnUso(equipo) }}</span>
                <span class="badge bg-custom-light text-custom">Total: {{ equipo.totalUnidades }}</span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="d-grid gap-2">
              <button 
                class="btn btn-success btn-sm"
                @click="abrirModalCoger(equipo)"
                :disabled="getUnidadesDisponibles(equipo) === 0"
              >
                <i class="fas fa-hand-paper me-2"></i>Hartu
              </button>
              <button 
                class="btn btn-edit btn-sm"
                @click="verDetalles(equipo)"
              >
                <i class="fas fa-eye me-2"></i>Xehetasunak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Materialak -->
    <div v-if="tabActivo === 'materialak'" class="row g-4">
      <div 
        v-for="material in itemsFiltrados" 
        :key="material.id" 
        class="col-12 col-sm-6 col-lg-4"
      >
        <div class="card h-100 border-0 shadow-sm card-item">
          <div class="card-header-custom bg-info-gradient">
            <i class="fas fa-box fa-2x text-info"></i>
          </div>
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-2">{{ material.nombre }}</h6>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
              <small class="text-muted">
                <i class="fas fa-tag text-custom me-1"></i>{{ material.tipo }}
              </small>
              <span class="badge bg-custom-light text-custom">
                Stock: {{ material.stock }}
              </span>
            </div>

            <!-- Último préstamo -->
            <div v-if="material.prestamos.length > 0" class="mb-3">
              <p class="small fw-bold text-custom mb-1">Azken mailegua:</p>
              <p class="small text-muted mb-0">
                <i class="fas fa-user me-1"></i>{{ material.prestamos[0].usuario }}
              </p>
              <p class="small text-muted mb-0">
                <i class="fas fa-calendar me-1"></i>{{ material.prestamos[0].fecha }} - {{ material.prestamos[0].hora }}
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="d-grid gap-2">
              <button 
                class="btn btn-success btn-sm"
                @click="abrirModalCoger(material)"
                :disabled="material.stock === 0"
              >
                <i class="fas fa-hand-paper me-2"></i>Hartu
              </button>
              <button 
                class="btn btn-edit btn-sm"
                @click="verDetalles(material)"
              >
                <i class="fas fa-eye me-2"></i>Historial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <div v-if="itemsFiltrados.length === 0" class="text-center py-5">
      <i class="fas fa-search fa-3x text-muted opacity-25 mb-3 d-block"></i>
      <p class="text-muted">Ez da elementurik aurkitu zure bilaketarekin.</p>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="modalActivo" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold">{{ tabActivo === 'ekipamendua' ? itemSeleccionado?.tipo : itemSeleccionado?.nombre }}</h5>
          <button type="button" class="btn-close" @click="cerrarModal"></button>
        </div>
        <div class="modal-body">
          <!-- Detalles de Ekipamendua -->
          <div v-if="tabActivo === 'ekipamendua'">
            <h6 class="fw-bold mb-3">Unidades en uso:</h6>
            <div v-if="getUnidadesEnUso(itemSeleccionado) > 0">
              <div 
                v-for="unidad in itemSeleccionado.unidades.filter(u => u.enUso)" 
                :key="unidad.id"
                class="uso-item mb-2"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <p class="mb-1">
                      <span class="badge bg-warning me-2">Unidad #{{ unidad.numero }}</span>
                      <strong>{{ unidad.usuario }}</strong>
                    </p>
                    <p class="small text-muted mb-0">
                      <i class="fas fa-clock me-1"></i>Desde: {{ unidad.desde }}
                    </p>
                  </div>
                  <button 
                    class="btn btn-danger btn-sm"
                    @click="devolverEquipo(itemSeleccionado, unidad.id)"
                  >
                    <i class="fas fa-undo me-1"></i>Itzuli
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-3">
              <p class="text-muted">Ez dago unidaderik erabiltzen.</p>
            </div>

            <hr class="my-4">

            <h6 class="fw-bold mb-3">Historial:</h6>
            <div v-if="itemSeleccionado.historial.length > 0">
              <div 
                v-for="(uso, index) in itemSeleccionado.historial" 
                :key="index"
                class="prestamo-item mb-2"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <p class="mb-1">
                      <span class="badge bg-secondary me-2">Unidad #{{ uso.unidad }}</span>
                      <strong>{{ uso.usuario }}</strong>
                    </p>
                    <p class="small text-muted mb-0">
                      <i class="fas fa-calendar me-1"></i>{{ uso.desde }} → {{ uso.hasta }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-3">
              <p class="text-muted">Ez dago historikoa.</p>
            </div>
          </div>

          <!-- Detalles de Material -->
          <div v-if="tabActivo === 'materialak'">
            <div class="mb-3">
              <span class="badge bg-custom-light text-custom fs-6 p-2">Stock: {{ itemSeleccionado?.stock }} unitate</span>
            </div>

            <h6 class="fw-bold mb-3">Maileguen historial:</h6>
            <div v-if="itemSeleccionado?.prestamos && itemSeleccionado.prestamos.length > 0">
              <div 
                v-for="(prestamo, index) in itemSeleccionado?.prestamos" 
                :key="index"
                class="prestamo-item mb-2"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <p class="mb-1"><i class="fas fa-user text-custom me-2"></i><strong>{{ prestamo.usuario }}</strong></p>
                    <p class="small text-muted mb-0">
                      <i class="fas fa-calendar me-1"></i>{{ prestamo.fecha }} - {{ prestamo.hora }}
                    </p>
                  </div>
                  <span class="badge bg-light text-dark">{{ prestamo.cantidad }} unitate</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-3">
              <p class="text-muted">Oraindik ez dago mailegatu materialik.</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Itxi
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para Coger -->
    <div v-if="modalCoger" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold">{{ tabActivo === 'ekipamendua' ? itemSeleccionado?.tipo : itemSeleccionado?.nombre }}</h5>
          <button type="button" class="btn-close" @click="cerrarModal"></button>
        </div>
        <div class="modal-body">
          <!-- Selector de Alumno -->
          <div class="mb-4">
            <label class="form-label fw-bold">Ikaslea aukeratu *</label>
            <input 
              type="text" 
              class="form-control mb-2" 
              v-model="busquedaAlumno"
              placeholder="Bilatu ikaslea (izena edo taldea)..."
            >
            
            <!-- Alumno seleccionado -->
            <div v-if="alumnoSeleccionado" class="alert alert-success d-flex justify-content-between align-items-center p-2 mb-2">
              <div>
                <strong>{{ alumnoSeleccionado.nombre }}</strong>
                <small class="d-block text-muted">{{ alumnoSeleccionado.grupo }}</small>
              </div>
              <button class="btn btn-sm btn-outline-danger" @click="alumnoSeleccionado = null">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Lista de alumnos -->
            <div v-if="!alumnoSeleccionado" class="lista-alumnos">
              <div 
                v-for="alumno in alumnosFiltrados.slice(0, 5)" 
                :key="alumno.id"
                class="alumno-item"
                @click="seleccionarAlumno(alumno)"
              >
                <div>
                  <strong>{{ alumno.nombre }}</strong>
                  <small class="d-block text-muted">{{ alumno.grupo }}</small>
                </div>
                <i class="fas fa-chevron-right text-muted"></i>
              </div>
              <div v-if="alumnosFiltrados.length === 0" class="text-center py-3 text-muted">
                Ez da ikaslerik aurkitu
              </div>
            </div>
          </div>

          <hr>

          <!-- Coger Ekipamendua -->
          <div v-if="tabActivo === 'ekipamendua'">
            <p>Unidad libre eskuragarri: <strong>{{ getUnidadesDisponibles(itemSeleccionado) }}</strong></p>
            <p class="text-muted small">Jarraitu eta automatikoki unitate bat hartuko duzu.</p>
          </div>

          <!-- Coger Material -->
          <div v-if="tabActivo === 'materialak'">
            <div class="mb-3">
              <label class="form-label fw-bold">Kopurua</label>
              <input 
                type="number" 
                class="form-control" 
                v-model="cantidadCoger"
                :max="itemSeleccionado?.stock"
                min="1"
                placeholder="Zenbat unitate hartu nahi dituzu?"
              >
              <small class="text-muted">Stock eskuragarria: {{ itemSeleccionado?.stock }}</small>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Utzi
          </button>
          <button 
            class="btn btn-success" 
            @click="tabActivo === 'ekipamendua' ? cogerEquipo(itemSeleccionado) : cogerMaterial(itemSeleccionado, cantidadCoger)"
            :disabled="!alumnoSeleccionado"
          >
            <i class="fas fa-check me-2"></i>Hartu
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

.card-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
}

.card-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.card-header-custom {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.bg-warning-gradient {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
}

.bg-success-gradient {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.bg-info-gradient {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
}

.bg-danger-gradient {
  background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%);
}

.current-use {
  background-color: #fff3cd;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #ffc107;
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

.btn-success {
  background-color: #28a745;
  color: white;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #218838;
  color: white;
}

.btn-success:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background-color: #c82333;
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
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.uso-item,
.prestamo-item {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.alert {
  border-radius: 12px;
  padding: 1rem;
}

.lista-alumnos {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.alumno-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.alumno-item:last-child {
  border-bottom: none;
}

.alumno-item:hover {
  background-color: #e0f2f1;
  color: #2bc1b6;
}

.alumno-item:hover i {
  color: #2bc1b6 !important;
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

  .modal-content {
    width: 95%;
  }
  
  .lista-alumnos {
    max-height: 200px;
  }
}
</style>
