<script setup>
import { ref, watch, onMounted } from 'vue';
import { useBezeroakStore } from '@/stores/bezeroakStore';
import { useServicesStore } from '@/stores/serviceStore';

const props = defineProps({
  mostrar: Boolean,
  asientos: Array,
  horasDisponibles: Array,
});

const emit = defineEmits(['cerrar', 'crear']);

const bezeroakStore = useBezeroakStore();
const servicesStore = useServicesStore();

const errorForm = ref('');
const nuevaCita = ref({
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

watch(() => props.mostrar, (val) => {
  if (val) {
    resetForm();
  }
});

const resetForm = () => {
  nuevaCita.value = {
    hora: '08:00',
    asientoId: 1,
    bezeroa: null,
    zerbitzua: null,
    duracion: 30,
  };
  errorForm.value = '';
};

const crearCita = () => {
  const { bezeroa, zerbitzua } = nuevaCita.value;
  
  if (!bezeroa || !zerbitzua) {
    errorForm.value = 'Bete bezero eta zerbitzua eremuak.';
    return;
  }

  emit('crear', { ...nuevaCita.value }, (error) => {
    if (error) {
      errorForm.value = error;
    } else {
      resetForm();
    }
  });
};

const cerrar = () => {
  resetForm();
  emit('cerrar');
};
</script>

<template>
  <div v-if="mostrar" class="modal-backdrop-custom">
    <div class="modal-card">
      <div class="modal-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Hitzordu berria</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="cerrar">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="errorForm" class="alert alert-warning py-2 mb-3 small">{{ errorForm }}</div>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label small">Bezeroa</label>
            <select v-model="nuevaCita.bezeroa" class="form-select">
              <option :value="null" disabled>Hautatu bezeroa</option>
              <option v-for="bezeroa in bezeroakStore.bezeroak" :key="bezeroa.id" :value="bezeroa.id">
                {{ bezeroa.izena }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small">Zerbitzua</label>
            <select v-model="nuevaCita.zerbitzua" class="form-select">
              <option :value="null" disabled>Hautatu zerbitzua</option>
              <option v-for="zerbitzua in servicesStore.zerbitzuak" :key="zerbitzua.id" :value="zerbitzua.id">
                {{ zerbitzua.izena }}
              </option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small">Ordua</label>
            <select v-model="nuevaCita.hora" class="form-select">
              <option v-for="h in horasDisponibles" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small">Aulki / Asiento</label>
            <select v-model="nuevaCita.asientoId" class="form-select">
              <option v-for="a in asientos" :key="a.id" :value="a.id">{{ a.nombre }}</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small">Iraupena</label>
            <select v-model="nuevaCita.duracion" class="form-select">
              <option :value="30">30 min</option>
              <option :value="60">60 min</option>
              <option :value="90">90 min</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" @click="cerrar">Utzi</button>
        <button class="btn btn-custom" @click="crearCita">Gorde</button>
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
</style>
