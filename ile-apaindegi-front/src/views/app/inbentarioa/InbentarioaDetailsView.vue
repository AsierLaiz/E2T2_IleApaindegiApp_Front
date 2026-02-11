<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';

const route = useRoute();
const router = useRouter();
const inventoryStore = useInventoryStore();
const producto = ref(null);
const tipo = ref('');
const modalEditar = ref(false);
const modalEditarEkipamendua = ref(false);
const modalGehituStock = ref(false);
const modalGehituKantitatea = ref(false);
const cantidadGehitu = ref(1);
const formularioEdicion = ref({
  id: null,
  izena: '',
  stock: 0,
  min_stock: 0,
  kategoriak_id: null,
  deskribapena: '',
  batch: '',
  marka: '',
  iraungitze_data: '',
  prezioa: null
});
const formularioEdicionEkipamendua = ref({
  id: null,
  tipo: '',
  izena: '',
  deskribapena: '',
  marka: '',
  kantitatea: 1
});

const categoriaPorId = computed(() => {
  const map = new Map();
  (inventoryStore.kategoriak || []).forEach(k => map.set(k.id, k.izena));
  return map;
});

onMounted(async () => {
  const id = parseInt(route.params.id);
  const tipoRuta = route.params.tipo;
  tipo.value = tipoRuta;
  
  try {
    await Promise.all([
      inventoryStore.fetchKontsumigarriak(),
      inventoryStore.fetchEkipamenduak(),
      inventoryStore.fetchKategoriak()
    ]);
    
    if (tipoRuta === 'materiala') {
      const mat = inventoryStore.kontsumigarriak.find(k => k.id === id);
      if (mat) {
        producto.value = {
          id: mat.id,
          nombre: mat.izena,
          categoria: categoriaPorId.value.get(mat.kategoriak_id) || '—',
          stock: mat.stock,
          marca: mat.marka,
          desc: mat.deskribapena || '',
          batch: mat.batch,
          min_stock: mat.min_stock,
          kategoriak_id: mat.kategoriak_id,
          iraungitze_data: mat.iraungitze_data,
          precio: mat.prezioa ? parseFloat(mat.prezioa) : 0,
          datosOriginales: mat
        };
      }
    }
    
    if (tipoRuta === 'ekipamendua') {
      const eq = inventoryStore.ekipamenduak.find(e => e.id === id);
      if (eq) {
        producto.value = {
          id: eq.id,
          nombre: eq.izena,
          tipo: eq.tipo || '—',
          marka: eq.marka || '',
          desc: eq.deskribapena || '',
          kantitatea: eq.kantitatea || 1,
          datosOriginales: eq
        };
      }
    }
  } catch (e) {
    console.error('Error cargando datos:', e);
  }
});

const abrirModalEditar = () => {
  if (producto.value && producto.value.datosOriginales && tipo.value === 'materiala') {
    formularioEdicion.value = {
      id: producto.value.id,
      izena: producto.value.nombre,
      stock: producto.value.stock || 0,
      min_stock: producto.value.min_stock || 0,
      kategoriak_id: producto.value.kategoriak_id || null,
      deskribapena: producto.value.desc || '',
      batch: producto.value.batch || '',
      marka: producto.value.marca || '',
      iraungitze_data: producto.value.iraungitze_data || '',
      prezioa: producto.value.datosOriginales.prezioa || null
    };
    modalEditar.value = true;
  }
};

const cerrarModalEditar = () => {
  console.log('Cerrando modal editar');
  modalEditar.value = false;
};

const guardarEdicion = async () => {
  console.log('Guardando edición...', formularioEdicion.value);
  try {
    await inventoryStore.updateKontsumigarria(formularioEdicion.value.id, formularioEdicion.value);
    await inventoryStore.fetchKontsumigarriak();
    
    // Actualizar producto
    const mat = inventoryStore.kontsumigarriak.find(k => k.id === formularioEdicion.value.id);
    if (mat) {
      producto.value = {
        id: mat.id,
        nombre: mat.izena,
        categoria: categoriaPorId.value.get(mat.kategoriak_id) || '—',
        stock: mat.stock,
        marca: mat.marka,
        desc: mat.deskribapena || '',
        batch: mat.batch,
        min_stock: mat.min_stock,
        kategoriak_id: mat.kategoriak_id,
        iraungitze_data: mat.iraungitze_data,
        precio: mat.prezioa ? parseFloat(mat.prezioa) : 0,
        datosOriginales: mat
      };
    }
    
    console.log('Edición guardada correctamente');
    modalEditar.value = false;
  } catch (error) {
    console.error('Error editando material:', error);
    alert('Errorea materiala editatzean: ' + error.message);
  }
};

const abrirModalGehituStock = () => {
  cantidadGehitu.value = 1;
  modalGehituStock.value = true;
};

const guardarGehituStock = async () => {
  const cantidad = parseInt(cantidadGehitu.value);
  if (cantidad <= 0) {
    alert('Kopurua positiboa izan behar du');
    return;
  }
  
  try {
    const materialOriginal = inventoryStore.kontsumigarriak.find(k => k.id === producto.value.id);
    if (!materialOriginal) {
      alert('Errorea: materiala ez da aurkitu');
      return;
    }
    
    const nuevoStock = materialOriginal.stock + cantidad;
    await inventoryStore.updateKontsumigarria(producto.value.id, {
      ...materialOriginal,
      stock: nuevoStock
    });
    
    await inventoryStore.fetchKontsumigarriak();
    
    // Actualizar producto
    const mat = inventoryStore.kontsumigarriak.find(k => k.id === producto.value.id);
    if (mat) {
      producto.value.stock = mat.stock;
      producto.value.precio = mat.prezioa ? parseFloat(mat.prezioa) : 0;
      producto.value.datosOriginales = mat;
    }
    
    modalGehituStock.value = false;
  } catch (error) {
    console.error('Error gehitzen stock:', error);
    alert('Errorea stock gehitzean: ' + error.message);
  }
};

const abrirModalEditarEkipamendua = () => {
  if (producto.value && producto.value.datosOriginales && tipo.value === 'ekipamendua') {
    formularioEdicionEkipamendua.value = {
      id: producto.value.id,
      tipo: producto.value.tipo || '',
      izena: producto.value.nombre,
      deskribapena: producto.value.desc || '',
      marka: producto.value.datosOriginales.marka || '',
      kantitatea: producto.value.kantitatea || 1
    };
    modalEditarEkipamendua.value = true;
  }
};

const guardarEdicionEkipamendua = async () => {
  try {
    await inventoryStore.updateEkipamendua(formularioEdicionEkipamendua.value.id, formularioEdicionEkipamendua.value);
    await inventoryStore.fetchEkipamenduak();
    
    const eq = inventoryStore.ekipamenduak.find(e => e.id === formularioEdicionEkipamendua.value.id);
    if (eq) {
      producto.value = {
        id: eq.id,
        nombre: eq.izena,
        tipo: eq.tipo || '—',
        marka: eq.marka || '',
        desc: eq.deskribapena || '',
        kantitatea: eq.kantitatea || 1,
        datosOriginales: eq
      };
    }
    
    modalEditarEkipamendua.value = false;
  } catch (error) {
    console.error('Error editando ekipamendua:', error);
    alert('Errorea ekipamendua editatzean: ' + error.message);
  }
};

const abrirModalGehituKantitatea = () => {
  cantidadGehitu.value = 1;
  modalGehituKantitatea.value = true;
};

const guardarGehituKantitatea = async () => {
  const cantidad = parseInt(cantidadGehitu.value);
  if (cantidad <= 0) {
    alert('Kopurua positiboa izan behar du');
    return;
  }
  
  try {
    const ekipamenduaOriginal = inventoryStore.ekipamenduak.find(e => e.id === producto.value.id);
    if (!ekipamenduaOriginal) {
      alert('Errorea: ekipamendua ez da aurkitu');
      return;
    }
    
    const nuevaKantitatea = (ekipamenduaOriginal.kantitatea || 0) + cantidad;
    await inventoryStore.updateEkipamendua(producto.value.id, {
      ...ekipamenduaOriginal,
      kantitatea: nuevaKantitatea
    });
    
    await inventoryStore.fetchEkipamenduak();
    
    const eq = inventoryStore.ekipamenduak.find(e => e.id === producto.value.id);
    if (eq) {
      producto.value.kantitatea = eq.kantitatea;
      producto.value.datosOriginales = eq;
    }
    
    modalGehituKantitatea.value = false;
  } catch (error) {
    console.error('Error gehitzen kantitatea:', error);
    alert('Errorea kantitatea gehitzean: ' + error.message);
  }
};
</script>

<template>
  <div class="container py-3" v-if="producto" style="margin-top: 10px; margin-bottom: 140px;">
    <button @click="router.back()" class="btn btn-danger text-decoration-none" style="margin-bottom: 80px;">
      <i class="fas fa-arrow-left me-2"></i> Itxuli
    </button>

    <div class="row g-5">
      <div class="col-lg-5">
        <div class="product-image-container bg-white shadow-sm rounded-4 d-flex align-items-center justify-content-center">
          <i :class="[tipo === 'materiala' ? 'fas fa-vial' : 'fas fa-tools', 'fa-10x text-light']"></i>
        </div>
      </div>

      <div class="col-lg-7">
        <span class="badge bg-custom-light text-custom mb-2 px-3 py-2 rounded-pill fw-bold">
          {{ tipo === 'ekipamendua' ? producto.tipo : producto.categoria }}
        </span>
        <h1 class="display-5 fw-bold mb-3">{{ producto.nombre }}</h1>
        <p class="text-muted lead mb-4">{{ producto.desc }}</p>

        <div class="card border-0 bg-light rounded-4 p-4 mb-4" v-if="tipo === 'materiala'">
          <div class="row text-center">
            <div class="col-4 border-end">
              <small class="text-muted d-block mb-1">Prezio Unit.</small>
              <span class="h4 fw-bold mb-0">{{ (producto.precio && typeof producto.precio === 'number') ? producto.precio.toFixed(2) : '0.00' }}€</span>
            </div>
            <div class="col-4 border-end">
              <small class="text-muted d-block mb-1">Marka</small>
              <span class="h4 fw-bold mb-0 text-truncate d-block px-2">{{ producto.marca }}</span>
            </div>
            <div class="col-4">
              <small class="text-muted d-block mb-1">Stock-a</small>
              <span :class="['h4 fw-bold mb-0', producto.stock < 10 ? 'text-danger' : 'text-success']">
                {{ producto.stock }}
              </span>
            </div>
          </div>
        </div>

        <div class="card border-0 bg-light rounded-4 p-4 mb-4" v-if="tipo === 'ekipamendua'">
          <div class="row text-center">
            <div class="col-4 border-end">
              <small class="text-muted d-block mb-1">Tipo (Mota)</small>
              <span class="h4 fw-bold mb-0 text-truncate d-block px-2">{{ producto.tipo }}</span>
            </div>
            <div class="col-4 border-end">
              <small class="text-muted d-block mb-1">Marka</small>
              <span class="h4 fw-bold mb-0 text-truncate d-block px-2">{{ producto.marka || '-' }}</span>
            </div>
            <div class="col-4">
              <small class="text-muted d-block mb-1">Kantitatea</small>
              <span class="h4 fw-bold mb-0">{{ producto.kantitatea }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex gap-3" v-if="tipo === 'materiala'">
          <button class="btn btn-custom btn-lg flex-grow-1 shadow-sm" @click="abrirModalGehituStock">
            <i class="fas fa-plus-circle me-2"></i> Gehitu Stock-a
          </button>
          <button class="btn btn-outline-secondary btn-lg px-4 shadow-sm" @click="abrirModalEditar">
            <i class="fas fa-edit"></i>
          </button>
        </div>

        <div class="d-flex gap-3" v-if="tipo === 'ekipamendua'">
          <button class="btn btn-custom btn-lg flex-grow-1 shadow-sm" @click="abrirModalGehituKantitatea">
            <i class="fas fa-plus-circle me-2"></i> Gehitu Kantitatea
          </button>
          <button class="btn btn-outline-secondary btn-lg px-4 shadow-sm" @click="abrirModalEditarEkipamendua">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Editar -->
  <div v-if="modalEditar" class="modal-overlay" @click="cerrarModalEditar">
    <div class="modal-content" @click.stop="">
      <div class="modal-header">
        <h5 class="fw-bold">Editatu Materiala</h5>
        <button type="button" class="btn-close" @click.stop="cerrarModalEditar" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarEdicion">
            <div class="mb-3">
              <label class="form-label fw-bold">Izena *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formularioEdicion.izena"
                required
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Kategoria</label>
              <select class="form-control" v-model.number="formularioEdicion.kategoriak_id">
                <option :value="null">Hautatu kategoria</option>
                <option v-for="kat in inventoryStore.kategoriak" :key="kat.id" :value="kat.id">
                  {{ kat.izena }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Stock *</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formularioEdicion.stock"
                min="0"
                required
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Gutxieneko Stock</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formularioEdicion.min_stock"
                min="0"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Prezioa (€)</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formularioEdicion.prezioa"
                min="0"
                step="0.01"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Marka</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formularioEdicion.marka"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Batch</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formularioEdicion.batch"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Deskribapena</label>
              <textarea 
                class="form-control" 
                v-model="formularioEdicion.deskribapena"
                rows="3"
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Iraungitze Data</label>
              <input 
                type="date" 
                class="form-control" 
                v-model="formularioEdicion.iraungitze_data"
              >
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click.stop="cerrarModalEditar">
            Itxi
          </button>
          <button type="button" class="btn btn-primary" @click.stop="guardarEdicion">
            <i class="fas fa-save me-1"></i>Gorde
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para Gehitu Stock -->
    <div v-if="modalGehituStock" class="modal-overlay" @click.self="modalGehituStock = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold">Gehitu Stock</h5>
          <button type="button" class="btn-close" @click="modalGehituStock = false"></button>
        </div>
        <div class="modal-body">
          <p class="mb-3"><strong>{{ producto?.nombre }}</strong></p>
          <p class="text-muted mb-3">Gaur dagon stock: <strong>{{ producto?.stock }} unitate</strong></p>
          
          <div class="mb-3">
            <label class="form-label fw-bold">Gehitu kopurua *</label>
            <input 
              type="number" 
              class="form-control form-control-lg" 
              v-model.number="cantidadGehitu"
              min="1"
              placeholder="Zenbat unitate gehitu nahi dituzu?"
            >
          </div>

          <div class="alert alert-info">
            <small>
              <strong>Berriko stock:</strong> {{ (producto?.stock || 0) + cantidadGehitu }} unitate
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="modalGehituStock = false">
            Utzi
          </button>
          <button class="btn btn-success" @click="guardarGehituStock">
            <i class="fas fa-check me-2"></i>Gorde
          </button>
        </div>
      </div>
    </div>

  <!-- Modal Editar Ekipamendua -->
  <div v-if="modalEditarEkipamendua" class="modal-overlay" @click="modalEditarEkipamendua = false">
    <div class="modal-content" @click.stop="">
      <div class="modal-header">
        <h5 class="fw-bold">Editatu Ekipamendua</h5>
        <button type="button" class="btn-close" @click="modalEditarEkipamendua = false"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="guardarEdicionEkipamendua">
          <div class="mb-3">
            <label class="form-label fw-bold">Tipo (Mota) *</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formularioEdicionEkipamendua.tipo"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Izena *</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formularioEdicionEkipamendua.izena"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Marka</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formularioEdicionEkipamendua.marka"
            >
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Kantitatea</label>
            <input 
              type="number" 
              class="form-control" 
              v-model.number="formularioEdicionEkipamendua.kantitatea"
              min="0"
            >
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Deskribapena</label>
            <textarea 
              class="form-control" 
              v-model="formularioEdicionEkipamendua.deskribapena"
              rows="3"
            ></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="modalEditarEkipamendua = false">
          Utzi
        </button>
        <button class="btn btn-primary" @click="guardarEdicionEkipamendua">
          <i class="fas fa-save me-2"></i>Gorde
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Gehitu Kantitatea -->
  <div v-if="modalGehituKantitatea" class="modal-overlay" @click="modalGehituKantitatea = false">
    <div class="modal-content" @click.stop="">
      <div class="modal-header">
        <h5 class="fw-bold">Gehitu Kantitatea</h5>
        <button type="button" class="btn-close" @click="modalGehituKantitatea = false"></button>
      </div>
      <div class="modal-body">
        <p class="mb-3"><strong>{{ producto?.nombre }}</strong></p>
        <p class="text-muted mb-3">Gaur dagon kantitatea: <strong>{{ producto?.kantitatea }} unitate</strong></p>
        
        <div class="mb-3">
          <label class="form-label fw-bold">Gehitu kopurua *</label>
          <input 
            type="number" 
            class="form-control form-control-lg" 
            v-model.number="cantidadGehitu"
            min="1"
            placeholder="Zenbat unitate gehitu nahi dituzu?"
          >
        </div>

        <div class="alert alert-info">
          <small>
            <strong>Berriko kantitatea:</strong> {{ (producto?.kantitatea || 0) + cantidadGehitu }} unitate
          </small>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="modalGehituKantitatea = false">
          Utzi
        </button>
        <button class="btn btn-success" @click="guardarGehituKantitatea">
          <i class="fas fa-check me-2"></i>Gorde
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

    .btn-custom {
        background-color: #2bc1b6;
        color: white;
        border: none;
    }

    .btn-custom:hover {
        background-color: #24a89e;
        color: white;
    }

    .product-image-container {
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
    }

    .card {
        transition: transform 0.2s;
    }

    .card:hover {
        transform: translateY(-2px);
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
        position: relative;
        z-index: 10000;
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
        padding: 1.5rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .modal-footer button {
        pointer-events: auto;
        cursor: pointer;
    }

    .btn-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }

    .btn-close:hover {
        color: #000;
    }
</style>
