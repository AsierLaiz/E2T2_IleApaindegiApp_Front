<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Datos de clientes
const clientesData = [
  { 
    id: 1, 
    nombre: 'Aithor Etxebarria', 
    telefono: '664521398', 
    ciudad: 'Santurtzi',
    email: 'aithor.etxebarria@email.com',
    fechaRegistro: '2022-05-15',
    citas: [
      { id: 1, fecha: '2025-01-20', hora: '10:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-13', hora: '14:30', servicio: 'Ile-mozketa + Barbatzea', duracion: '45 min', estado: 'Completado' },
      { id: 3, fecha: '2025-01-06', hora: '11:00', servicio: 'Tindatzea', duracion: '60 min', estado: 'Completado' },
      { id: 4, fecha: '2024-12-30', hora: '15:15', servicio: 'Ile-estiloa', duracion: '40 min', estado: 'Completado' },
      { id: 5, fecha: '2024-12-23', hora: '10:30', servicio: 'Barbatzea', duracion: '25 min', estado: 'Completado' }
    ]
  },
  { 
    id: 2, 
    nombre: 'Marisa González', 
    telefono: '677894521', 
    ciudad: 'Getxo',
    email: 'marisa.gonzalez@email.com',
    fechaRegistro: '2023-03-22',
    citas: [
      { id: 1, fecha: '2025-01-22', hora: '09:00', servicio: 'Hidratazio tratamendua', duracion: '50 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-15', hora: '13:00', servicio: 'Ile-mozketa', duracion: '35 min', estado: 'Completado' },
      { id: 3, fecha: '2025-01-08', hora: '10:30', servicio: 'Keratina tratamendua', duracion: '90 min', estado: 'Completado' }
    ]
  },
  { 
    id: 3, 
    nombre: 'Jon Azkuna', 
    telefono: '698765432', 
    ciudad: 'Leioa',
    email: 'jon.azkuna@email.com',
    fechaRegistro: '2021-11-10',
    citas: [
      { id: 1, fecha: '2025-01-15', hora: '16:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-08', hora: '14:00', servicio: 'Barbatzea', duracion: '25 min', estado: 'Completado' },
      { id: 3, fecha: '2025-01-01', hora: '11:00', servicio: 'Ile-masajea', duracion: '40 min', estado: 'Completado' },
      { id: 4, fecha: '2024-12-25', hora: '09:30', servicio: 'Ile-mozketa + Barbatzea', duracion: '50 min', estado: 'Cancelado' }
    ]
  },
  { 
    id: 4, 
    nombre: 'Elena Ruiz', 
    telefono: '687654321', 
    ciudad: 'Santurtzi',
    email: 'elena.ruiz@email.com',
    fechaRegistro: '2023-07-14',
    citas: [
      { id: 1, fecha: '2025-01-18', hora: '12:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-11', hora: '15:30', servicio: 'Tindatzea', duracion: '60 min', estado: 'Completado' },
      { id: 3, fecha: '2025-01-04', hora: '10:00', servicio: 'Ile-masajea', duracion: '40 min', estado: 'Completado' }
    ]
  },
  { 
    id: 5, 
    nombre: 'Carlos Fernández', 
    telefono: '654321987', 
    ciudad: 'Erandio',
    email: 'carlos.fernandez@email.com',
    fechaRegistro: '2020-09-05',
    citas: [
      { id: 1, fecha: '2025-01-10', hora: '14:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-03', hora: '11:30', servicio: 'Barbatzea', duracion: '25 min', estado: 'Completado' },
      { id: 3, fecha: '2024-12-27', hora: '09:00', servicio: 'Ile-estiloa', duracion: '45 min', estado: 'Completado' },
      { id: 4, fecha: '2024-12-20', hora: '16:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' }
    ]
  },
  { 
    id: 6, 
    nombre: 'Leire Martínez', 
    telefono: '645987321', 
    ciudad: 'Getxo',
    email: 'leire.martinez@email.com',
    fechaRegistro: '2024-01-18',
    citas: [
      { id: 1, fecha: '2025-01-25', hora: '10:30', servicio: 'Ilearen kolorea aldatzea', duracion: '120 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-18', hora: '13:00', servicio: 'Ile-mozketa', duracion: '35 min', estado: 'Completado' },
      { id: 3, fecha: '2025-01-11', hora: '14:30', servicio: 'Hidratazio tratamendua', duracion: '50 min', estado: 'Completado' }
    ]
  },
  { 
    id: 7, 
    nombre: 'Mikel Ibáñez', 
    telefono: '678954123', 
    ciudad: 'Baracaldo',
    email: 'mikel.ibanez@email.com',
    fechaRegistro: '2022-08-30',
    citas: [
      { id: 1, fecha: '2025-01-16', hora: '15:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-09', hora: '12:00', servicio: 'Barbatzea', duracion: '25 min', estado: 'Completado' }
    ]
  },
  { 
    id: 8, 
    nombre: 'Ainhoa Sáenz', 
    telefono: '665432189', 
    ciudad: 'Santurtzi',
    email: 'ainhoa.saenz@email.com',
    fechaRegistro: '2023-12-05',
    citas: [
      { id: 1, fecha: '2025-01-23', hora: '11:00', servicio: 'Mecha-ak', duracion: '90 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-16', hora: '14:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' }
    ]
  },
  { 
    id: 9, 
    nombre: 'Xabier López', 
    telefono: '667123456', 
    ciudad: 'Leioa',
    email: 'xabier.lopez@email.com',
    fechaRegistro: '2022-04-12',
    citas: [
      { id: 1, fecha: '2025-01-12', hora: '10:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-05', hora: '15:30', servicio: 'Ile-mozketa + Barbatzea', duracion: '50 min', estado: 'Completado' }
    ]
  },
  { 
    id: 10, 
    nombre: 'Erika Herranz', 
    telefono: '699876543', 
    ciudad: 'Erandio',
    email: 'erika.herranz@email.com',
    fechaRegistro: '2024-05-20',
    citas: [
      { id: 1, fecha: '2025-01-17', hora: '13:00', servicio: 'Hidratazio tratamendua', duracion: '50 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-10', hora: '10:30', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' }
    ]
  },
  { 
    id: 11, 
    nombre: 'Dani Eguía', 
    telefono: '654789321', 
    ciudad: 'Getxo',
    email: 'dani.eguia@email.com',
    fechaRegistro: '2021-02-14',
    citas: [
      { id: 1, fecha: '2025-01-19', hora: '14:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-12', hora: '11:00', servicio: 'Barbatzea', duracion: '25 min', estado: 'Completado' }
    ]
  },
  { 
    id: 12, 
    nombre: 'Amaia Agirre', 
    telefono: '676543210', 
    ciudad: 'Santurtzi',
    email: 'amaia.agirre@email.com',
    fechaRegistro: '2024-02-28',
    citas: [
      { id: 1, fecha: '2025-01-24', hora: '15:30', servicio: 'Balayage', duracion: '120 min', estado: 'Completado' },
      { id: 2, fecha: '2025-01-17', hora: '10:00', servicio: 'Ile-mozketa', duracion: '30 min', estado: 'Completado' }
    ]
  }
];

const clienteId = parseInt(route.params.id);
const cliente = computed(() => 
  clientesData.find(c => c.id === clienteId)
);

const citasOrdenadas = computed(() => {
  if (!cliente.value) return [];
  return [...cliente.value.citas].sort((a, b) => 
    new Date(b.fecha) - new Date(a.fecha)
  );
});

const estadisticas = computed(() => {
  if (!cliente.value) return {};
  return {
    totalCitas: cliente.value.citas.length,
    completadas: cliente.value.citas.filter(c => c.estado === 'Completado').length,
    canceladas: cliente.value.citas.filter(c => c.estado === 'Cancelado').length
  };
});

const volver = () => {
  router.push({ name: 'bezeroak' });
};

const formatearFecha = (fecha) => {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('eu-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
</script>

<template>
  <div class="container py-3 mb-5 mt-3" v-if="cliente">
    <!-- Botón volver -->
    <button 
      @click="volver"
      class="btn btn-back mb-4"
    >
      <i class="fas fa-arrow-left me-2"></i>Atzera joan
    </button>

    <!-- Header con información del cliente -->
    <div class="row mb-4">
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header-custom">
            <i class="fas fa-user-circle fa-4x text-custom"></i>
          </div>
          <div class="card-body text-center">
            <h3 class="fw-bold text-dark mb-3">{{ cliente.nombre }}</h3>
            
            <div class="info-section mb-3">
              <small class="text-muted d-block mb-2">
                <i class="fas fa-phone text-custom me-2"></i>{{ cliente.telefono }}
              </small>
              <small class="text-muted d-block mb-2">
                <i class="fas fa-envelope text-custom me-2"></i>{{ cliente.email }}
              </small>
              <small class="text-muted d-block mb-2">
                <i class="fas fa-map-marker-alt text-custom me-2"></i>{{ cliente.ciudad }}
              </small>
              <small class="text-muted d-block">
                <i class="fas fa-calendar text-custom me-2"></i>Bezeroa {{ formatearFecha(cliente.fechaRegistro) }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8">
        <!-- Estadísticas -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-sm-6">
            <div class="stat-card">
              <div class="stat-icon bg-custom">
                <i class="fas fa-calendar-check text-white"></i>
              </div>
              <div class="stat-content">
                <h6 class="text-muted mb-1">Guztira</h6>
                <h4 class="fw-bold text-dark">{{ estadisticas.totalCitas }}</h4>
              </div>
            </div>
          </div>
          <div class="col-6 col-sm-6">
            <div class="stat-card">
              <div class="stat-icon bg-success">
                <i class="fas fa-check text-white"></i>
              </div>
              <div class="stat-content">
                <h6 class="text-muted mb-1">Osatua</h6>
                <h4 class="fw-bold text-dark">{{ estadisticas.completadas }}</h4>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="stat-card">
              <div class="stat-icon bg-danger">
                <i class="fas fa-times text-white"></i>
              </div>
              <div class="stat-content">
                <h6 class="text-muted mb-1">Utzitua</h6>
                <h4 class="fw-bold text-dark">{{ estadisticas.canceladas }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de citas -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-custom text-white p-4">
        <h5 class="mb-0">
          <i class="fas fa-history me-2"></i>Hitzorduen historian
        </h5>
      </div>
      <div class="card-body p-0">
        <div v-if="citasOrdenadas.length > 0">
          <div 
            v-for="(cita, index) in citasOrdenadas" 
            :key="cita.id"
            class="cita-item"
            :class="{ 'border-bottom': index < citasOrdenadas.length - 1 }"
          >
            <div class="row align-items-center">
              <div class="col-12 col-sm-auto mb-3 mb-sm-0">
                <div class="badge-fecha">
                  <i class="fas fa-calendar-day me-2"></i>{{ formatearFecha(cita.fecha) }}
                </div>
              </div>
              <div class="col-12 col-sm-auto">
                <small class="text-muted">
                  <i class="fas fa-clock me-1"></i>{{ cita.hora }}
                </small>
              </div>
              <div class="col-12 col-sm-auto ms-sm-auto">
                <span 
                  class="badge"
                  :class="cita.estado === 'Completado' ? 'bg-success' : 'bg-danger'"
                >
                  {{ cita.estado }}
                </span>
              </div>
            </div>
            <div class="cita-details mt-2">
              <p class="mb-1">
                <strong class="text-custom">{{ cita.servicio }}</strong>
              </p>
              <small class="text-muted">
                <i class="fas fa-hourglass-end me-1"></i>{{ cita.duracion }}
              </small>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <i class="fas fa-calendar-times fa-3x text-muted opacity-25 mb-3 d-block"></i>
          <p class="text-muted">Hitzordurik ez dago erregistratua.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Cliente no encontrado -->
  <div v-else class="container py-5 text-center">
    <i class="fas fa-user-slash fa-3x text-muted mb-3 d-block"></i>
    <h3 class="text-muted">Bezerorik ez aurkitu</h3>
    <button @click="volver" class="btn btn-custom mt-3">
      <i class="fas fa-arrow-left me-2"></i>Atzera joan
    </button>
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

.btn-back {
  background-color: transparent;
  color: #2bc1b6;
  border: 2px solid #2bc1b6;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background-color: #2bc1b6;
  color: white;
  transform: translateX(-2px);
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

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(43, 193, 182, 0.3);
  color: white;
}

.card-header-custom {
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.info-section {
  text-align: left;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content h6 {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.cita-item {
  padding: 1.5rem;
  transition: background-color 0.3s ease;
}

.cita-item:hover {
  background-color: #f8f9fa;
}

.badge-fecha {
  background-color: #e0f2f1;
  color: #2bc1b6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  display: inline-block;
  font-size: 0.9rem;
}

.cita-details {
  margin-left: 0;
  padding-left: 0;
}

@media (max-width: 991.98px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }

  .card-header-custom {
    min-height: 120px;
  }

  .cita-item {
    padding: 1rem;
  }
}
</style>
