<script setup>
const props = defineProps({
  cita: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);
</script>

<template>
  <div class="cita-card" @click="$emit('click', cita)">
    <div class="cita-text">
      <div class="cita-bezeroa">{{ cita.bezeroa }}</div>
      <div class="cita-zerbitzua">{{ cita.zerbitzua }}</div>
    </div>
    <div class="cita-duracion">
      <i class="fas fa-clock me-1"></i>{{ cita.duracion }} min
    </div>
  </div>
</template>

<style scoped>
.cita-card {
  background: linear-gradient(135deg, #2bc1b6 0%, #1fa89c 100%);
  color: white;
  padding: 6px 8px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.cita-bezeroa {
  font-weight: 600;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cita-zerbitzua {
  font-size: 0.68rem;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cita-duracion {
  font-size: 0.65rem;
  opacity: 0.85;
  white-space: nowrap;
  flex-shrink: 0;
}

.cita-duracion i {
  font-size: 0.6rem;
}

.cita-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
</style>
