<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useIkasleakStore } from '@/stores/ikasleakStore';
import { useTaldeakStore } from '@/stores/taldeakStore';
import { useOrdutegiaStore } from '@/stores/ordutegiaStore';
import { useErabiltzaileakStore } from '@/stores/erabiltzaileakStore';

const router = useRouter();
const seccionActiva = ref('ikasleak');

const ikasleakStore = useIkasleakStore();
const taldeakStore = useTaldeakStore();
const ordutegiaStore = useOrdutegiaStore();
const erabiltzaileakStore = useErabiltzaileakStore();

const secciones = [
  { id: 'ikasleak', nombre: 'Ikasleak', icon: 'fa-users', descripcion: 'Ikasleen kudeaketa' },
  { id: 'grupos', nombre: 'Taldeak', icon: 'fa-object-group', descripcion: 'Taldearen kudeaketa' },
  { id: 'horarios', nombre: 'Ordutegia', icon: 'fa-clock', descripcion: 'Ordute giaren kudeaketa' },
  { id: 'usuarios', nombre: 'Erabiltzaileak', icon: 'fa-user-shield', descripcion: 'Erabiltzaileen kudeaketa' }
];

const volver = () => {
  router.push({ name: 'profil' });
};

onMounted(async () => {
  try {
    await Promise.all([
      ikasleakStore.fetchIkasleak(),
      taldeakStore.fetchTaldeak(),
      ordutegiaStore.fetchOrdutegiak(),
      erabiltzaileakStore.fetchErabiltzaileak()
    ]);
  } catch (error) {
    console.error('Error cargando datos admin:', error);
  }
});

const normalizeRola = (rola) => {
  if (!rola) return 'A';
  if (rola === 'admin') return 'A';
  if (rola === 'user') return 'U';
  return rola;
};

const roleLabel = (rola) => {
  const normalized = normalizeRola(rola);
  const labels = {
    A: 'Admin',
    I: 'Ile-apaindegia',
    E: 'Estilista',
    H: 'Harrera',
    U: 'Erabiltzailea'
  };
  return labels[normalized] || normalized;
};

const isAdminRole = (rola) => normalizeRola(rola) === 'A';

const diasSemana = [
  { value: 0, label: 'Igandea' },
  { value: 1, label: 'Astelehena' },
  { value: 2, label: 'Asteartea' },
  { value: 3, label: 'Asteazkena' },
  { value: 4, label: 'Osteguna' },
  { value: 5, label: 'Ostirala' },
  { value: 6, label: 'Larunbata' }
];

const formatEguna = (eguna) => diasSemana.find(d => d.value === Number(eguna))?.label || eguna;

const normalizeTime = (value) => {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
};

const toTimeInput = (value) => {
  if (!value) return value;
  return value.length >= 8 ? value.slice(0, 5) : value;
};

const getFormularioBase = (tipo) => {
  switch (tipo) {
    case 'ikasleak':
      return {
        izena: '',
        abizenak: '',
        posta_elek: '',
        taldea_id: taldeakStore.taldeak?.[0]?.id ?? null
      };
    case 'grupos':
      return {
        izena: ''
      };
    case 'horarios':
      return {
        eguna: 0,
        hasiera_data: '',
        amaiera_data: '',
        hasiera_ordua: '',
        amaiera_ordua: '',
        taldea_id: taldeakStore.taldeak?.[0]?.id ?? null
      };
    case 'usuarios':
      return {
        erabiltzaile_izena: '',
        posta_elek: '',
        rola: 'A',
        password: ''
      };
    default:
      return {};
  }
};

const estadisticas = computed(() => ({
  totalIkasleak: ikasleakStore.ikasleak?.length || 0,
  totalGrupos: taldeakStore.taldeak?.length || 0,
  totalUsuarios: erabiltzaileakStore.erabiltzaileak?.length || 0,
  admins: erabiltzaileakStore.erabiltzaileak?.filter(e => isAdminRole(e.rola))?.length || 0,
  usuariosActivos: erabiltzaileakStore.erabiltzaileak?.length || 0
}));

const modalEditando = ref(null);
const itemEditando = ref(null);
const formularioEdit = ref({});
const cargandoEdit = ref(false);
const modoEdicion = ref('edit');

const abrirModalEdit = (tipo, item) => {
  modoEdicion.value = 'edit';
  modalEditando.value = tipo;
  itemEditando.value = { ...item };
  formularioEdit.value = { ...item };
  
  if (tipo === 'ikasleak') {
    // Asegurar que taldea_id esté presente
    if (!formularioEdit.value.taldea_id && item.taldea?.id) {
      formularioEdit.value.taldea_id = item.taldea.id;
    } else if (!formularioEdit.value.taldea_id && item.taldeak?.id) {
      formularioEdit.value.taldea_id = item.taldeak.id;
    }
    if (!formularioEdit.value.posta_elek && formularioEdit.value.email) {
      formularioEdit.value.posta_elek = formularioEdit.value.email;
    }
  }
  
  if (tipo === 'horarios') {
    if (!formularioEdit.value.taldea_id && item.taldea?.id) {
      formularioEdit.value.taldea_id = item.taldea.id;
    }
    formularioEdit.value.hasiera_ordua = toTimeInput(formularioEdit.value.hasiera_ordua);
    formularioEdit.value.amaiera_ordua = toTimeInput(formularioEdit.value.amaiera_ordua);
  }

  if (tipo === 'usuarios') {
    if (!formularioEdit.value.posta_elek && formularioEdit.value.email) {
      formularioEdit.value.posta_elek = formularioEdit.value.email;
    }
    formularioEdit.value.rola = normalizeRola(formularioEdit.value.rola);
  }
};

const abrirModalCrear = (tipo) => {
  modoEdicion.value = 'create';
  modalEditando.value = tipo;
  itemEditando.value = null;
  formularioEdit.value = getFormularioBase(tipo);

  if ((tipo === 'ikasleak' || tipo === 'horarios') && !formularioEdit.value.taldea_id) {
    formularioEdit.value.taldea_id = taldeakStore.taldeak?.[0]?.id ?? null;
  }
};

const cerrarModalEdit = () => {
  modalEditando.value = null;
  itemEditando.value = null;
  formularioEdit.value = {};
  modoEdicion.value = 'edit';
};

const guardarEdicion = async () => {
  if (!modalEditando.value) return;

  if (modoEdicion.value === 'edit' && !itemEditando.value?.id) return;

  if (modalEditando.value === 'usuarios' && modoEdicion.value === 'create' && !formularioEdit.value.password) {
    alert('Pasahitza beharrezkoa da erabiltzailea sortzeko.');
    return;
  }

  cargandoEdit.value = true;
  try {
    const payload = { ...formularioEdit.value };

    if (modalEditando.value === 'horarios') {
      payload.hasiera_ordua = normalizeTime(payload.hasiera_ordua);
      payload.amaiera_ordua = normalizeTime(payload.amaiera_ordua);
    }

    if (modalEditando.value === 'usuarios') {
      payload.rola = normalizeRola(payload.rola);
    }

    if (modoEdicion.value === 'create') {
      switch (modalEditando.value) {
        case 'ikasleak':
          await ikasleakStore.createIkaslea({
            izena: payload.izena,
            abizenak: payload.abizenak,
            posta_elek: payload.posta_elek ?? null,
            taldea_id: payload.taldea_id
          });
          await ikasleakStore.fetchIkasleak();
          break;
        case 'grupos':
          await taldeakStore.createTaldea({
            izena: payload.izena
          });
          await taldeakStore.fetchTaldeak();
          break;
        case 'horarios':
          await ordutegiaStore.createOrdutegia({
            eguna: payload.eguna,
            hasiera_data: payload.hasiera_data,
            amaiera_data: payload.amaiera_data,
            hasiera_ordua: payload.hasiera_ordua,
            amaiera_ordua: payload.amaiera_ordua,
            taldea_id: payload.taldea_id
          });
          await ordutegiaStore.fetchOrdutegiak();
          break;
        case 'usuarios':
          await erabiltzaileakStore.createErabiltzailea({
            erabiltzaile_izena: payload.erabiltzaile_izena,
            posta_elek: payload.posta_elek,
            rola: payload.rola,
            password: payload.password
          });
          await erabiltzaileakStore.fetchErabiltzaileak();
          break;
      }
    } else {
      switch (modalEditando.value) {
        case 'ikasleak':
          await ikasleakStore.updateIkaslea(itemEditando.value.id, {
            izena: payload.izena,
            abizenak: payload.abizenak,
            posta_elek: payload.posta_elek ?? null,
            taldea_id: payload.taldea_id
          });
          await ikasleakStore.fetchIkasleak();
          break;
        case 'grupos':
          await taldeakStore.updateTaldea(itemEditando.value.id, {
            izena: payload.izena
          });
          await taldeakStore.fetchTaldeak();
          break;
        case 'horarios':
          await ordutegiaStore.updateOrdutegia(itemEditando.value.id, {
            eguna: payload.eguna,
            hasiera_data: payload.hasiera_data,
            amaiera_data: payload.amaiera_data,
            hasiera_ordua: payload.hasiera_ordua,
            amaiera_ordua: payload.amaiera_ordua,
            taldea_id: payload.taldea_id
          });
          await ordutegiaStore.fetchOrdutegiak();
          break;
        case 'usuarios':
          await erabiltzaileakStore.updateErabiltzailea(itemEditando.value.id, {
            erabiltzaile_izena: payload.erabiltzaile_izena,
            posta_elek: payload.posta_elek,
            rola: payload.rola
          });
          await erabiltzaileakStore.fetchErabiltzaileak();
          break;
      }
    }

    cerrarModalEdit();
  } catch (error) {
    alert('Errorea gordetzean: ' + error.message);
  } finally {
    cargandoEdit.value = false;
  }
};

const eliminarItem = async (tipo, id, nombre) => {
  if (!confirm(`Ziur al zaude ${nombre} ezabatu nahi duzula?`)) return;

  try {
    switch (tipo) {
      case 'ikasleak':
        await ikasleakStore.deleteIkaslea(id);
        await ikasleakStore.fetchIkasleak();
        break;
      case 'grupos':
        await taldeakStore.deleteTaldea(id);
        await taldeakStore.fetchTaldeak();
        break;
      case 'horarios':
        await ordutegiaStore.deleteOrdutegia(id);
        await ordutegiaStore.fetchOrdutegiak();
        break;
      case 'usuarios':
        await erabiltzaileakStore.deleteErabiltzailea(id);
        await erabiltzaileakStore.fetchErabiltzaileak();
        break;
    }
  } catch (error) {
    alert('Errorea ezabatzean: ' + error.message);
  }
};
</script>

<template>
  <div class="admin-container">
    <!-- Header Admin -->
    <div class="admin-header">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center py-4">
          <div>
            <button @click="volver" class="btn btn-outline-light btn-sm mb-2">
              <i class="fas fa-arrow-left me-2"></i>Atzera
            </button>
            <h1 class="text-white fw-bold mb-0">
              <i class="fas fa-shield-alt me-2"></i>Admin Panela
            </h1>
          </div>
          <div class="text-end">
            <small class="text-light d-block">Sistema Administratzailea</small>
            <small class="text-danger fw-bold">Sarrera Mugatua</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="admin-content">
      <div class="container-fluid py-4">
        <!-- Estadísticas rápidas -->
        <div class="row g-3 mb-5">
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="stat-card">
              <div class="stat-icon bg-danger">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-body">
                <p class="stat-label">Ikasleak</p>
                <h3 class="stat-value">{{ estadisticas.totalIkasleak }}</h3>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="stat-card">
              <div class="stat-icon bg-danger">
                <i class="fas fa-object-group"></i>
              </div>
              <div class="stat-body">
                <p class="stat-label">Taldeak</p>
                <h3 class="stat-value">{{ estadisticas.totalGrupos }}</h3>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="stat-card">
              <div class="stat-icon bg-danger">
                <i class="fas fa-user-shield"></i>
              </div>
              <div class="stat-body">
                <p class="stat-label">Erabiltzaileak</p>
                <h3 class="stat-value">{{ estadisticas.totalUsuarios }}</h3>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="stat-card">
              <div class="stat-icon bg-danger">
                <i class="fas fa-user-lock"></i>
              </div>
              <div class="stat-body">
                <p class="stat-label">Admins</p>
                <h3 class="stat-value">{{ estadisticas.admins }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Secciones de gestión -->
        <div class="row g-4">
          <!-- Panel lateral de navegación -->
          <div class="col-12 col-lg-3 mb-4 mb-lg-0">
            <div class="nav-panel">
              <h6 class="text-danger fw-bold mb-3">KUDEAKETA ATALAK</h6>
              <div class="nav-list">
                <button
                  v-for="seccion in secciones"
                  :key="seccion.id"
                  @click="seccionActiva = seccion.id"
                  :class="['nav-item', { 'active': seccionActiva === seccion.id }]"
                >
                  <i :class="['fas', seccion.icon, 'me-2']"></i>
                  {{ seccion.nombre }}
                </button>
              </div>
            </div>
          </div>

          <!-- Contenido principal -->
          <div class="col-12 col-lg-9">
            <!-- Ikasleak -->
            <div v-if="seccionActiva === 'ikasleak'" class="content-section">
              <div class="section-header">
                <h4 class="fw-bold">Ikasleen Kudeaketa</h4>
                <button class="btn btn-danger btn-sm" @click="abrirModalCrear('ikasleak')">
                  <i class="fas fa-plus me-2"></i>Ikasle Berria
                </button>
              </div>
              <div class="section-content">
                <div v-if="ikasleakStore.isLoading" class="text-center py-5">
                  <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">Kargatzen...</span>
                  </div>
                </div>
                <div v-else-if="ikasleakStore.ikasleak.length === 0" class="text-center py-5">
                  <p class="text-muted">Ez dago ikaslerik</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Izena</th>
                        <th>Abizenak</th>
                        <th>Email</th>
                        <th>Taldea</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="ikaslea in ikasleakStore.ikasleak" :key="ikaslea.id">
                        <td>{{ ikaslea.id }}</td>
                        <td>{{ ikaslea.izena }}</td>
                        <td>{{ ikaslea.abizenak }}</td>
                        <td>{{ ikaslea.posta_elek || ikaslea.email || '-' }}</td>
                        <td><span class="badge bg-danger">{{ ikaslea.taldea?.izena || ikaslea.taldeak?.izena || '-' }}</span></td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" title="Editatu" @click="abrirModalEdit('ikasleak', ikaslea)">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" title="Ezabatu" @click="eliminarItem('ikasleak', ikaslea.id, ikaslea.izena)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Grupos -->
            <div v-if="seccionActiva === 'grupos'" class="content-section">
              <div class="section-header">
                <h4 class="fw-bold">Taldearen Kudeaketa</h4>
                <button class="btn btn-danger btn-sm" @click="abrirModalCrear('grupos')">
                  <i class="fas fa-plus me-2"></i>Talde Berria
                </button>
              </div>
              <div class="section-content">
                <div v-if="taldeakStore.isLoading" class="text-center py-5">
                  <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">Kargatzen...</span>
                  </div>
                </div>
                <div v-else-if="taldeakStore.taldeak.length === 0" class="text-center py-5">
                  <p class="text-muted">Ez dago talderik</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Izena</th>
                        <th>Ikasleak</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="taldea in taldeakStore.taldeak" :key="taldea.id">
                        <td>{{ taldea.id }}</td>
                        <td>{{ taldea.izena }}</td>
                        <td><span class="badge bg-danger">{{ taldea.ikasleak?.length || 0 }}</span></td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" title="Editatu" @click="abrirModalEdit('grupos', taldea)">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" title="Ezabatu" @click="eliminarItem('grupos', taldea.id, taldea.izena)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Horarios -->
            <div v-if="seccionActiva === 'horarios'" class="content-section">
              <div class="section-header">
                <h4 class="fw-bold">Ordutegiaren Kudeaketa</h4>
                <button class="btn btn-danger btn-sm" @click="abrirModalCrear('horarios')">
                  <i class="fas fa-plus me-2"></i>Ordutegi Berria
                </button>
              </div>
              <div class="section-content">
                <div v-if="ordutegiaStore.isLoading" class="text-center py-5">
                  <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">Kargatzen...</span>
                  </div>
                </div>
                <div v-else-if="ordutegiaStore.ordutegiak.length === 0" class="text-center py-5">
                  <p class="text-muted">Ez dago ordutegiarik</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Taldea</th>
                        <th>Eguna</th>
                        <th>Hasiera</th>
                        <th>Amaiera</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="ordutegia in ordutegiaStore.ordutegiak" :key="ordutegia.id">
                        <td>{{ ordutegia.id }}</td>
                        <td><span class="badge bg-danger">{{ ordutegia.taldea?.izena || '-' }}</span></td>
                        <td>{{ formatEguna(ordutegia.eguna) }}</td>
                        <td>{{ ordutegia.hasiera_data }} {{ ordutegia.hasiera_ordua }}</td>
                        <td>{{ ordutegia.amaiera_data }} {{ ordutegia.amaiera_ordua }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" title="Editatu" @click="abrirModalEdit('horarios', ordutegia)">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" title="Ezabatu" @click="eliminarItem('horarios', ordutegia.id, ordutegia.astea)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Usuarios -->
            <div v-if="seccionActiva === 'usuarios'" class="content-section">
              <div class="section-header">
                <h4 class="fw-bold">Erabiltzaileen Kudeaketa</h4>
                <button class="btn btn-danger btn-sm" @click="abrirModalCrear('usuarios')">
                  <i class="fas fa-plus me-2"></i>Erabiltzaile Berria
                </button>
              </div>
              <div class="section-content">
                <div v-if="erabiltzaileakStore.isLoading" class="text-center py-5">
                  <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">Kargatzen...</span>
                  </div>
                </div>
                <div v-else-if="erabiltzaileakStore.erabiltzaileak.length === 0" class="text-center py-5">
                  <p class="text-muted">Ez dago erabiltzailerik</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Izena</th>
                        <th>Email</th>
                        <th>Rola</th>
                        <th>Egoera</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="erabiltzailea in erabiltzaileakStore.erabiltzaileak" :key="erabiltzailea.id">
                        <td>{{ erabiltzailea.id }}</td>
                        <td>{{ erabiltzailea.erabiltzaile_izena }}</td>
                        <td>{{ erabiltzailea.posta_elek || erabiltzailea.email || '-' }}</td>
                        <td><span class="badge" :class="isAdminRole(erabiltzailea.rola) ? 'bg-danger' : 'bg-secondary'">{{ roleLabel(erabiltzailea.rola) }}</span></td>
                        <td><span class="badge bg-success">Aktibo</span></td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" title="Editatu" @click="abrirModalEdit('usuarios', erabiltzailea)">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" title="Ezabatu" @click="eliminarItem('usuarios', erabiltzailea.id, erabiltzailea.erabiltzaile_izena)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="modalEditando" class="modal d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background-color: #2a2a2a; border: 1px solid #dc143c;">
          <div class="modal-header" style="border-bottom: 2px solid #dc143c;">
            <h5 class="modal-title text-white fw-bold">{{ modoEdicion === 'create' ? 'Sortu' : 'Editatu' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModalEdit()"></button>
          </div>
          <div class="modal-body">
            <div v-if="modalEditando === 'ikasleak'" class="row g-3">
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Izena</label>
                <input v-model="formularioEdit.izena" type="text" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Abizenak</label>
                <input v-model="formularioEdit.abizenak" type="text" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Email</label>
                <input v-model="formularioEdit.posta_elek" type="email" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Taldea</label>
                <select v-model="formularioEdit.taldea_id" class="form-select bg-dark text-white border-danger">
                  <option v-for="taldea in taldeakStore.taldeak" :key="taldea.id" :value="taldea.id">
                    {{ taldea.izena }}
                  </option>
                </select>
              </div>
            </div>
            <div v-else-if="modalEditando === 'grupos'" class="row g-3">
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Izena</label>
                <input v-model="formularioEdit.izena" type="text" class="form-control bg-dark text-white border-danger">
              </div>
            </div>
            <div v-else-if="modalEditando === 'horarios'" class="row g-3">
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Taldea</label>
                <select v-model="formularioEdit.taldea_id" class="form-select bg-dark text-white border-danger">
                  <option v-for="taldea in taldeakStore.taldeak" :key="taldea.id" :value="taldea.id">
                    {{ taldea.izena }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Eguna</label>
                <select v-model="formularioEdit.eguna" class="form-select bg-dark text-white border-danger">
                  <option v-for="dia in diasSemana" :key="dia.value" :value="dia.value">
                    {{ dia.label }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-danger fw-bold">Hasiera data</label>
                <input v-model="formularioEdit.hasiera_data" type="date" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-danger fw-bold">Amaiera data</label>
                <input v-model="formularioEdit.amaiera_data" type="date" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-danger fw-bold">Hasiera ordua</label>
                <input v-model="formularioEdit.hasiera_ordua" type="time" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-danger fw-bold">Amaiera ordua</label>
                <input v-model="formularioEdit.amaiera_ordua" type="time" class="form-control bg-dark text-white border-danger">
              </div>
            </div>
            <div v-else-if="modalEditando === 'usuarios'" class="row g-3">
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Erabiltzaile Izena</label>
                <input v-model="formularioEdit.erabiltzaile_izena" type="text" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Email</label>
                <input v-model="formularioEdit.posta_elek" type="email" class="form-control bg-dark text-white border-danger">
              </div>
              <div class="col-12">
                <label class="form-label text-danger fw-bold">Rola</label>
                <select v-model="formularioEdit.rola" class="form-select bg-dark text-white border-danger">
                  <option value="A">Admin</option>
                  <option value="I">Ile-apaindegia</option>
                  <option value="E">Estilista</option>
                  <option value="H">Harrera</option>
                  <option value="U">Erabiltzailea</option>
                </select>
              </div>
              <div v-if="modoEdicion === 'create'" class="col-12">
                <label class="form-label text-danger fw-bold">Pasahitza</label>
                <input v-model="formularioEdit.password" type="password" class="form-control bg-dark text-white border-danger">
              </div>
            </div>
          </div>
          <div class="modal-footer" style="border-top: 1px solid #dc143c;">
            <button type="button" class="btn btn-secondary" @click="cerrarModalEdit()">Itxi</button>
            <button type="button" class="btn btn-danger" @click="guardarEdicion" :disabled="cargandoEdit">
              <span v-if="!cargandoEdit">
                <i class="fas me-2" :class="modoEdicion === 'create' ? 'fa-plus' : 'fa-save'"></i>
                {{ modoEdicion === 'create' ? 'Sortu' : 'Gorde' }}
              </span>
              <span v-else><i class="fas fa-spinner fa-spin me-2"></i>Gordetzen...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
}

.admin-header {
  background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%);
  border-bottom: 3px solid #ff0000;
}

.admin-header h1 {
  font-size: 2.5rem;
}

.admin-header small {
  font-size: 0.9rem;
}

.admin-content {
  background-color: #1a1a1a;
  padding-bottom: 50px;
}

/* Estadísticas */
.stat-card {
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  background-color: #333;
  border-color: #dc143c;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(220, 20, 60, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.bg-danger {
  background-color: #dc143c;
}

.stat-body {
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

/* Panel de navegación */
.nav-panel {
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 20px;
}

.nav-panel h6 {
  color: #dc143c;
  font-size: 0.85rem;
  border-bottom: 2px solid #dc143c;
  padding-bottom: 1rem;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  background-color: transparent;
  color: #aaa;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.95rem;
  border: none;
}

.nav-item:hover {
  background-color: rgba(220, 20, 60, 0.1);
  color: #dc143c;
  border-left: 3px solid #dc143c;
  padding-left: calc(1rem - 3px);
}

.nav-item.active {
  background-color: rgba(220, 20, 60, 0.2);
  color: #dc143c;
  border-left: 3px solid #dc143c;
  padding-left: calc(1rem - 3px);
  font-weight: 600;
}

/* Sección de contenido */
.content-section {
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  background-color: #1a1a1a;
  border-bottom: 2px solid #dc143c;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h4 {
  color: #fff;
  margin: 0;
}

.section-content {
  padding: 2rem;
}

.placeholder-box {
  background-color: #1a1a1a;
  border: 2px dashed #dc143c;
  border-radius: 10px;
  padding: 3rem 2rem;
  text-align: center;
  margin-top: 1.5rem;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #1a1a1a;
  color: #dc143c;
  font-weight: 600;
  border-bottom: 2px solid #dc143c;
  text-transform: uppercase;
  font-size: 0.85rem;
  padding: 1rem;
}

.table tbody tr {
  border-bottom: 1px solid #333;
  transition: all 0.3s ease;
}

.table tbody tr:hover {
  background-color: #333;
  box-shadow: inset 0 0 10px rgba(220, 20, 60, 0.1);
}

.table td {
  padding: 1rem;
  color: #aaa;
  vertical-align: middle;
}

.table .btn-outline-danger {
  color: #dc143c;
  border-color: #dc143c;
  margin-right: 0.25rem;
}

.table .btn-outline-danger:hover {
  background-color: #dc143c;
  color: white;
  border-color: #dc143c;
}

.btn-danger {
  background-color: #dc143c;
  border-color: #dc143c;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background-color: #ff0000;
  border-color: #ff0000;
  box-shadow: 0 4px 12px rgba(220, 20, 60, 0.3);
  color: white;
}

.btn-outline-light {
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

.text-danger {
  color: #dc143c !important;
}

.text-muted {
  color: #aaa !important;
}

.opacity-25 {
  opacity: 0.25;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

@media (max-width: 991.98px) {
  .nav-panel {
    position: static;
    margin-bottom: 1.5rem;
  }

  .nav-list {
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .nav-item {
    flex: 1;
    min-width: 100px;
  }

  .admin-header h1 {
    font-size: 1.75rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-header button {
    width: 100%;
  }
}
</style>
