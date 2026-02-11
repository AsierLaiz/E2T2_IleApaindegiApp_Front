<script setup>
import { ref, watch, onMounted } from 'vue';
import { useBezeroakStore } from '@/stores/bezeroakStore';
import { useServicesStore } from '@/stores/serviceStore';

const props = defineProps({
  mostrar: Boolean,
  cita: Object,
  asientos: Array,
  horasDisponibles: Array,
});

const emit = defineEmits(['cerrar', 'actualizar', 'cancelar']);

const bezeroakStore = useBezeroakStore();
const servicesStore = useServicesStore();

const errorDetalle = ref('');
const editCita = ref({
  id: null,
  hora: '08:00',
  asientoId: 1,
  bezeroa: null,
  zerbitzua: null,
  duracion: 30,
});

onMounted(async () => {
  try {
    await bezeroakStore.fetchBezeroak();
    await servicesStore.fetchZerbitzuak();
  } catch (error) {
    console.error('Error cargando bezeroak/zerbitzuak:', error);
  }
});

watch(() => props.cita, (val) => {
  if (val) {
    editCita.value = {
      id: val.id,
      hora: val.hora || '08:00',
      asientoId: val.asientoId || 1,
      bezeroa: val.bezeroa_id || null, // Usar el ID del bezeroa
      zerbitzua: val.zerbitzua_ids?.[0] || null, // Usar el primer ID del servicio si existe
      duracion: val.duracion || 30
    };
    errorDetalle.value = '';
  }
});

const actualizarCita = () => {
  const { bezeroa, zerbitzua } = editCita.value;
  
  if (!bezeroa || !zerbitzua) {
    errorDetalle.value = 'Bete bezero eta zerbitzua eremuak.';
    return;
  }

  emit('actualizar', { ...editCita.value }, (error) => {
    if (error) {
      errorDetalle.value = error;
    }
  });
};

const cancelarCita = () => {
  const ok = window.confirm('Ziur zaude hitzordu hau ezabatu nahi duzula?');
  if (ok) {
    emit('cancelar');
  }
};
</script>

<template>
  <div v-if="mostrar" class="modal-backdrop-custom">
    <div class="modal-card">
      <div class="modal-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Hitzordua</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('cerrar')">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="errorDetalle" class="alert alert-warning py-2 mb-3 small">{{ errorDetalle }}</div>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label small">Bezeroa</label>
            <select v-model="editCita.bezeroa" class="form-select">
              <option :value="null" disabled>Hautatu bezeroa</option>
              <option v-for="bezeroa in bezeroakStore.bezeroak" :key="bezeroa.id" :value="bezeroa.id">
                {{ bezeroa.izena }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small">Zerbitzua</label>
            <select v-model="editCita.zerbitzua" class="form-select">
              <option :value="null" disabled>Hautatu zerbitzua</option>
              <option v-for="zerbitzua in servicesStore.zerbitzuak" :key="zerbitzua.id" :value="zerbitzua.id">
                {{ zerbitzua.izena }}
              </option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small">Ordua</label>
            <select v-model="editCita.hora" class="form-select">
              <option v-for="h in horasDisponibles" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small">Aulki / Asiento</label>
            <select v-model="editCita.asientoId" class="form-select">
              <option v-for="a in asientos" :key="a.id" :value="a.id">{{ a.nombre }}</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small">Iraupena</label>
            <select v-model="editCita.duracion" class="form-select">
              <option :value="30">30 min</option>
              <option :value="60">60 min</option>
              <option :value="90">90 min</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between align-items-center gap-2 flex-wrap">
        <button class="btn btn-outline-danger" @click="cancelarCita">
          <i class="fas fa-trash me-2"></i> Kendu hitzordua
        </button>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="$emit('cerrar')">Utzi</button>
          <button class="btn btn-custom" @click="actualizarCita">Gorde aldaketak</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 12px;
}

.modal-card {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  border-top: 4px solid #2bc1b6;
  overflow: hidden;
}

.modal-header {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(90deg, #f7fffe 0%, #ffffff 100%);
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-custom {
  background-color: #2bc1b6;
  color: #fff;
  border: none;
  box-shadow: 0 4px 10px rgba(43, 193, 182, 0.25);
}

.btn-custom:hover {
  background-color: #22a59b;
  color: #fff;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}
</style>
