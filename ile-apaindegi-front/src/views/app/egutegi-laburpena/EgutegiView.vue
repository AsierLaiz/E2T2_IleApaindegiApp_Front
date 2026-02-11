<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppointmentsStore } from '@/stores/appointmentsStore';

const router = useRouter();
const appointmentsStore = useAppointmentsStore();
const hoy = new Date();
const mesActual = ref(hoy.getMonth());
const añoActual = ref(hoy.getFullYear());

onMounted(async () => {
    try {
        await appointmentsStore.fetchHitzorduak();
    } catch (e) {}
});

// Watch para detectar cambios en hitzorduak y recargar
watch(() => appointmentsStore.hitzorduak, async () => {
    console.log('Hitzorduak cambiaron, actualizando calendario');
    // El computed diasEnMes se recalculará automáticamente porque depende de appointmentsStore.hitzorduak
}, { deep: true });

// EVENTOS locales de calendario
const eventosCalendario = ref([]);

const nombresMeses = ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
const diasSemana = ["Al", "Ar", "Az", "Og", "Or", "La", "Ig"];

const diasEnMes = computed(() => {
    const dias = [];
    const primerDiaMes = new Date(añoActual.value, mesActual.value, 1).getDay();
    const ultimoDiaMes = new Date(añoActual.value, mesActual.value + 1, 0).getDate();
    const offset = primerDiaMes === 0 ? 6 : primerDiaMes - 1;

    for (let i = 0; i < offset; i++) dias.push({ dia: null });

    for (let d = 1; d <= ultimoDiaMes; d++) {
        const fechaStr = `${añoActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const numCitas = (appointmentsStore.hitzorduak || []).filter(h => h.hitzordua_data === fechaStr).length;
        const evs = eventosCalendario.value.filter(e => e.fecha === fechaStr);
        dias.push({ dia: d, fecha: fechaStr, numCitas, eventos: evs });
    }
    return dias;
});

const irAAgendaDia = (diaObj) => {
    if (!diaObj || !diaObj.dia) return;
    router.push({
        name: 'hitzorduak',
        params: { fecha: diaObj.fecha }
    });
};

const showModal = ref(false);
const diaSeleccionado = ref(null);
const nuevoEvento = ref({ titulo: '' });

const abrirModalEvento = (diaObj, event) => {
    event.stopPropagation();
    diaSeleccionado.value = diaObj;
    showModal.value = true;
};

const guardarEvento = () => {
    eventosCalendario.value.push({
        id: Date.now(),
        fecha: diaSeleccionado.value.fecha,
        titulo: nuevoEvento.value.titulo
    });
    showModal.value = false;
    nuevoEvento.value.titulo = '';
};

const borrarEvento = (id, event) => {
    event.stopPropagation();
    eventosCalendario.value = eventosCalendario.value.filter(e => e.id !== id);
};

const cambiarMes = (dir) => {
    mesActual.value += dir;
    if (mesActual.value < 0) { mesActual.value = 11; añoActual.value--; }
    if (mesActual.value > 11) { mesActual.value = 0; añoActual.value++; }
};
</script>

<template>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded-4 shadow-sm border">
            <h3 class="fw-bold mb-0 text-dark">{{ nombresMeses[mesActual] }} <span class="text-custom">{{ añoActual
                    }}</span></h3>
            <div class="btn-group shadow-sm">
                <button @click="cambiarMes(-1)" class="btn btn-white border-end"><i
                        class="fas fa-chevron-left text-custom"></i></button>
                <button @click="cambiarMes(1)" class="btn btn-white"><i
                        class="fas fa-chevron-right text-custom"></i></button>
            </div>
        </div>

        <div class="calendar-responsive-wrapper rounded-4 shadow-sm border">
            <div class="calendar-content">
                <div class="calendar-header-grid">
                    <div v-for="d in diasSemana" :key="d"
                        class="text-center py-2 small fw-bold text-muted bg-light border-bottom">
                        {{ d }}
                    </div>
                </div>

                <div class="calendar-body-grid">
                    <div v-for="(item, index) in diasEnMes" :key="index" class="calendar-day"
                        :class="{ 'empty': !item.dia }" @click="irAAgendaDia(item)">

                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="day-num"
                                :class="{ 'is-today': item.dia === hoy.getDate() && mesActual === hoy.getMonth() && añoActual === hoy.getFullYear() }">
                                {{ item.dia }}
                            </span>

                            <div class="d-flex gap-1" @click.stop>
                                <span v-if="item.numCitas > 0" class="badge-citas">
                                    <i class="fas fa-clock"></i> {{ item.numCitas }}
                                </span>
                                <button v-if="item.dia" class="btn-quick-add" @click="abrirModalEvento(item, $event)">
                                    <i class="fas fa-plus-circle"></i>
                                </button>
                            </div>
                        </div>

                        <div class="events-list" @click.stop>
                            <div v-for="ev in item.eventos" :key="ev.id" class="event-pill">
                                <span class="event-text">{{ ev.titulo }}</span>
                                <button class="btn-delete-event" @click="borrarEvento(ev.id, $event)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center text-muted d-md-none mt-2 small">
            <i class="fas fa-arrows-left-right me-1"></i> Irristatu alboetara gehiago ikusteko
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-box animate__animated animate__zoomIn">
                <h5 class="fw-bold mb-3">Ekitaldia Gehitu</h5>
                <p class="text-muted small mb-4">Fecha: {{ diaSeleccionado?.fecha }}</p>
                <form @submit.prevent="guardarEvento">
                    <div class="mb-4">
                        <label class="form-label small fw-bold">Ekitaldiaren izena</label>
                        <input v-model="nuevoEvento.titulo" type="text" class="form-control rounded-3"
                            placeholder="Ej: Bilera" required autofocus>
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-custom text-white fw-bold py-2 shadow-sm">Gorde</button>
                        <button type="button" @click="showModal = false" class="btn btn-light py-2">Utzi</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* WRAPPER PARA SCROLL EN MÓVIL */
.calendar-responsive-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    background: #eee;
}

/* Personalización barra scroll */
.calendar-responsive-wrapper::-webkit-scrollbar {
    height: 6px;
}

.calendar-responsive-wrapper::-webkit-scrollbar-thumb {
    background: #2bc1b6;
    border-radius: 10px;
}

.calendar-content {
    min-width: 100%;
    /* PC: ocupa todo */
}

@media (max-width: 768px) {
    .calendar-content {
        min-width: 800px;
        /* Móvil: forzamos ancho para scroll */
    }
}

/* GRIDS */
.calendar-header-grid,
.calendar-body-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.calendar-body-grid {
    gap: 1px;
    background: #eee;
}

.calendar-day {
    background: white;
    min-height: 115px;
    padding: 10px;
    cursor: pointer;
    transition: 0.2s;
}

.calendar-day:hover:not(.empty) {
    background: #f0fdfc;
}

/* ELEMENTOS */
.text-custom {
    color: #2bc1b6;
}

.btn-custom {
    background-color: #2bc1b6;
    border: none;
}

.btn-custom:hover {
    background-color: #24a89e;
}

.btn-white {
    background: white;
    border: none;
}

.day-num {
    font-weight: 700;
    color: #555;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.is-today {
    background: #2bc1b6;
    color: white;
    border-radius: 50%;
}

.badge-citas {
    font-size: 0.7rem;
    background: #fff3cd;
    color: #856404;
    padding: 2px 6px;
    border-radius: 20px;
    font-weight: bold;
    border: 1px solid #ffeeba;
}

.btn-quick-add {
    background: none;
    border: none;
    color: #2bc1b6;
    font-size: 1.1rem;
    opacity: 0.4;
    transition: 0.2s;
}

.calendar-day:hover .btn-quick-add {
    opacity: 1;
}

.event-pill {
    background: #2bc1b6;
    color: white;
    font-size: 0.65rem;
    padding: 3px 6px;
    border-radius: 4px;
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.event-pill.event-cita {
    background: #4db8d6;
    border-left: 3px solid #2bc1b6;
}

.event-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
}

.btn-delete-event {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.7rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-box {
    background: white;
    padding: 30px;
    border-radius: 20px;
    width: 90%;
    max-width: 380px;
}
</style>