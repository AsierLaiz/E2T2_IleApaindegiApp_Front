<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppointmentsStore } from '@/stores/appointmentsStore';
import ModalNuevaCita from '@/components/egutegia/ModalNuevaCita.vue';
import ModalEditarCita from '@/components/egutegia/ModalEditarCita.vue';
import CitaCard from '@/components/egutegia/CitaCard.vue';

const route = useRoute();
const router = useRouter();
const appointmentsStore = useAppointmentsStore();

// Fecha actual para comparaciones
const hoyStr = new Date().toISOString().split('T')[0];

// Estado de la fecha (se sincroniza con la URL)
const fechaVisualizacion = ref(route.params.fecha || hoyStr);

// Cargar citas al montar
onMounted(async () => {
  try {
    await appointmentsStore.fetchHitzorduak();
  } catch (error) {
    console.error('Error cargando hitzorduak:', error);
  }
});

// Formateo de fecha para el badge (YYYY-MM-DD -> YYYY/MM/DD)
const fechaFormateada = computed(() => {
  return fechaVisualizacion.value.replace(/-/g, '/');
});

// Watch para reaccionar si la URL cambia (ej: al pulsar atrás en el navegador)
watch(() => route.params.fecha, (nuevaFecha) => {
  if (nuevaFecha) fechaVisualizacion.value = nuevaFecha;
});

// Función para navegar entre días
const cambiarDia = (delta) => {
  console.log('cambiarDia llamado con delta:', delta);
  console.log('Fecha actual:', fechaVisualizacion.value);
  
  // Parsear la fecha correctamente
  const partes = fechaVisualizacion.value.split('-');
  const fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
  fecha.setDate(fecha.getDate() + delta);
  
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const nuevaFechaStr = `${año}-${mes}-${dia}`;
  
  console.log('Nueva fecha:', nuevaFechaStr);

  // Actualizar el ref local
  fechaVisualizacion.value = nuevaFechaStr;
  
  // Navegamos cambiando el parámetro de la URL con el nombre correcto
  router.push({ name: 'hitzorduak', params: { fecha: nuevaFechaStr } });
};

// --- CONFIGURACIÓN DE LA AGENDA ---
const asientos = ref([
  { id: 1, nombre: 'Aulki 1' },
  { id: 2, nombre: 'Aulki 2' },
  { id: 3, nombre: 'Aulki 3' },
  { id: 4, nombre: 'Aulki 4' },
  { id: 5, nombre: 'Aulki 5' }
]);

const generarHorarios = () => {
  const horarios = [];
  let hora = 8;
  let minutos = 0;
  while (hora < 14 || (hora === 14 && minutos <= 30)) {
    horarios.push(`${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`);
    minutos += 30;
    if (minutos >= 60) { minutos = 0; hora++; }
  }
  return horarios;
};

const horarios = ref(generarHorarios());
const mostrarModal = ref(false);
const mostrarDetalle = ref(false);
const citaSeleccionada = ref(null);
const horasDisponibles = computed(() => horarios.value.filter(h => !esDescanso(h)));

// Citas filtradas por fecha
const citas = computed(() => {
  return appointmentsStore.hitzorduak
    .filter(h => h.hitzordua_data === fechaVisualizacion.value)
    .map(h => ({
      id: h.id,
      asientoId: h.ikaslea_id || 1, // Usar ikaslea_id como asiento
      hora: h.hasiera_ordua.substring(0, 5), // HH:MM
      bezeroa: h.bezeroa?.izena || 'Cliente',
      bezeroa_id: h.bezeroa_id, // ID del bezeroa para edición
      zerbitzua: h.zerbitzuak?.map(z => z.izena).join(', ') || 'Sin servicio',
      zerbitzua_ids: h.zerbitzuak?.map(z => z.id) || [], // IDs de los servicios
      duracion: 60 // Calcular duración entre hasiera_ordua y amaiera_ordua
    }));
});

const isLoading = computed(() => appointmentsStore.isLoading);
const error = computed(() => appointmentsStore.error);

const obtenerCita = (hora, asientoId) => citas.value.find(c => c.hora === hora && c.asientoId === asientoId);
const calcularRowspan = (cita) => cita ? Math.ceil(cita.duracion / 30) : 1;

const celdaOcupadaPorCitaAnterior = (hora, asientoId) => {
  const indiceHoraActual = horarios.value.indexOf(hora);
  // Verificar las últimas 3 horas (máximo 90 min = 3 slots)
  const maxRowspan = 3;
  for (let i = 1; i <= Math.min(maxRowspan, indiceHoraActual); i++) {
    const horaAnterior = horarios.value[indiceHoraActual - i];
    const citaAnterior = obtenerCita(horaAnterior, asientoId);
    if (citaAnterior && i < calcularRowspan(citaAnterior)) {
      return true;
    }
  }
  return false;
};

const esDescanso = (hora) => hora === '11:00';

// Handlers (Crear, Editar, Borrar)
const handleCrearCita = async (nuevaCita, callback) => {
  try {
    const citaData = {
      eserlekua: nuevaCita.asientoId, // Lugar/aula
      hitzordua_data: fechaVisualizacion.value,
      hasiera_ordua: `${nuevaCita.hora}:00`,
      amaiera_ordua: calcularHoraFin(nuevaCita.hora, nuevaCita.duracion),
      bezeroa_id: nuevaCita.bezeroa, // ID del bezeroa
      ikaslea_id: nuevaCita.asientoId,
      iruzkina: '' // Campo de comentarios vacío
    };
    
    // Crear la cita
    const citaCreada = await appointmentsStore.createHitzordua(citaData);
    
    // Si hay un servicio seleccionado, adjuntarlo a la cita
    if (nuevaCita.zerbitzua) {
      await appointmentsStore.attachService(citaCreada.id, nuevaCita.zerbitzua);
    }
    
    // Recargar todas las citas para sincronizar el estado
    await appointmentsStore.fetchHitzorduak();
    
    mostrarModal.value = false;
    callback(null);
  } catch (error) {
    callback(error.message);
  }
};

const calcularHoraFin = (horaInicio, duracion) => {
  const [hora, minuto] = horaInicio.split(':').map(Number);
  const totalMinutos = hora * 60 + minuto + duracion;
  const horaFin = Math.floor(totalMinutos / 60);
  const minutoFin = totalMinutos % 60;
  return `${horaFin.toString().padStart(2, '0')}:${minutoFin.toString().padStart(2, '0')}:00`;
};

const abrirDetalleCita = (cita) => {
  citaSeleccionada.value = { ...cita };
  mostrarDetalle.value = true;
};

const handleActualizarCita = async (editCita, callback) => {
  try {
    const citaData = {
      eserlekua: editCita.asientoId, // Lugar/aula
      hitzordua_data: fechaVisualizacion.value,
      hasiera_ordua: `${editCita.hora}:00`,
      amaiera_ordua: calcularHoraFin(editCita.hora, editCita.duracion),
      ikaslea_id: editCita.asientoId,
      iruzkina: '' // Campo de comentarios vacío
    };
    
    // Actualizar la cita
    await appointmentsStore.updateHitzordua(editCita.id, citaData);
    
    // Si hay un servicio seleccionado, adjuntarlo a la cita
    if (editCita.zerbitzua) {
      await appointmentsStore.attachService(editCita.id, editCita.zerbitzua);
    }
    
    // Recargar todas las citas para sincronizar el estado
    await appointmentsStore.fetchHitzorduak();
    
    mostrarDetalle.value = false;
    callback(null);
  } catch (error) {
    callback(error.message);
  }
};

const handleCancelarCita = async () => {
  try {
    // Eliminar del servidor
    await appointmentsStore.deleteHitzordua(citaSeleccionada.value.id);
    
    // Esperar un breve momento y luego recargar para asegurar sincronización
    setTimeout(async () => {
      await appointmentsStore.fetchHitzorduak();
    }, 500);
    
    mostrarDetalle.value = false;
  } catch (error) {
    console.error('Error cancelando cita:', error);
    alert('Error al cancelar la cita');
  }
};
</script>

<template>
  <div class="container py-4 px-4 agenda-container">
    <div class="mb-4">
      <div class="mb-3">
        <h2 class="fw-bold">Hitzordu <span class="text-custom">Agenda</span></h2>
        <p class="text-muted mb-0">Egunaren hitzordu guztiak</p>
      </div>

      <div class="d-flex gap-2 align-items-center flex-wrap">
        <button class="btn btn-outline-secondary shadow-sm" @click="cambiarDia(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="badge bg-custom-light text-custom p-2 px-3 fs-6 fw-bold border border-custom-soft">
          <span v-if="fechaVisualizacion === hoyStr" class="d-none d-md-inline">Gaur - </span>
          {{ fechaFormateada }}
        </div>

        <button class="btn btn-outline-secondary shadow-sm" @click="cambiarDia(1)">
          <i class="fas fa-chevron-right"></i>
        </button>

        <button class="btn btn-custom ms-auto shadow-sm" @click="mostrarModal = true">
          <i class="fas fa-plus"></i>
          <span class="d-none d-md-inline ms-2">Hitzordu berria</span>
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-bordered mb-0 agenda-table">
          <thead>
            <tr>
              <th class="hora-column sticky-column bg-light text-center">ORDUA</th>
              <th v-for="asiento in asientos" :key="asiento.id" class="text-center bg-custom text-white">
                <i class="fas fa-chair me-2"></i>{{ asiento.nombre }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hora in horarios" :key="hora" :class="{ 'descanso-row': esDescanso(hora) }">
              <td class="hora-column sticky-column bg-light fw-bold text-center">
                {{ hora }}
                <span v-if="esDescanso(hora)" class="badge bg-warning ms-1 small px-1">Atsedena</span>
              </td>
              <template v-for="asiento in asientos" :key="`${hora}-${asiento.id}`">
                <td v-if="!celdaOcupadaPorCitaAnterior(hora, asiento.id)"
                  :rowspan="obtenerCita(hora, asiento.id) ? calcularRowspan(obtenerCita(hora, asiento.id)) : 1"
                  :class="['cita-cell', { 'descanso-cell': esDescanso(hora) }]">
                  <CitaCard v-if="!esDescanso(hora) && obtenerCita(hora, asiento.id)"
                    :cita="obtenerCita(hora, asiento.id)" @click="abrirDetalleCita" />
                  <div v-else-if="esDescanso(hora)" class="text-center text-muted opacity-50">
                    <i class="fas fa-coffee"></i>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-4 d-flex gap-4 align-items-center flex-wrap">
      <div class="d-flex align-items-center gap-2">
        <div class="legend-box cita-ocupada"></div>
        <small class="text-muted fw-bold">Hitzordua</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="legend-box border bg-white"></div>
        <small class="text-muted fw-bold">Libre</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="legend-box bg-warning-subtle border-warning-subtle"></div>
        <small class="text-muted fw-bold">Atsedena</small>
      </div>
    </div>

    <ModalNuevaCita :mostrar="mostrarModal" :asientos="asientos" :horas-disponibles="horasDisponibles"
      @cerrar="mostrarModal = false" @crear="handleCrearCita" />
    <ModalEditarCita :mostrar="mostrarDetalle" :cita="citaSeleccionada" :asientos="asientos"
      :horas-disponibles="horasDisponibles" @cerrar="mostrarDetalle = false" @actualizar="handleActualizarCita"
      @cancelar="handleCancelarCita" />
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

.border-custom-soft {
  border-color: #b2dfdb !important;
}

.agenda-container {
  margin-bottom: 120px;
}

.agenda-table th,
.agenda-table td {
  height: 60px;
  border: 1px solid #eee;
  vertical-align: middle;
  padding: 6px;
}

.agenda-table th:not(.hora-column),
.agenda-table td:not(.hora-column) {
  width: 140px;
  max-width: 140px;
}

.hora-column {
  width: 80px;
  min-width: 80px;
  font-size: 0.85rem;
}

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 5;
}

.cita-cell {
  position: relative;
  transition: 0.2s;
}

.cita-cell:hover:not(.descanso-cell) {
  background-color: #fcfdfd;
}

.descanso-row {
  background-color: #fffdf7;
}

.descanso-cell {
  background-color: #fff3cd !important;
  cursor: not-allowed;
}

.btn-custom {
  background-color: #2bc1b6;
  color: white;
  border: none;
  cursor: pointer;
  pointer-events: auto;
}

.btn-custom:hover {
  background-color: #24a89e;
  color: white;
}

.btn-outline-secondary {
  cursor: pointer;
  pointer-events: auto;
}

.legend-box {
  width: 24px;
  height: 16px;
  border-radius: 4px;
}

.cita-ocupada {
  background: linear-gradient(135deg, #2bc1b6 0%, #1fa89c 100%);
}

@media (max-width: 768px) {
  .agenda-table {
    min-width: 750px;
  }

  .hora-column {
    width: 80px;
  }
}
</style>