<script setup>

// Info de prueba
const trabajador = { nombre: 'Juan' };
const estadisticas = [
  { titulo: 'Aipamenak Gaur', valor: '12', icono: 'fa-calendar-check', color: 'text-primary' },
  { titulo: 'Zain', valor: '3', icono: 'fa-clock', color: 'text-warning' },
  { titulo: 'Amaituta', valor: '9', icono: 'fa-check-circle', color: 'text-success' }
];
</script>

<template>
  <div class="container py-4" style="margin-bottom: 120px; margin-top: 20px;">
    <header class="mb-5">
      <h2 class="fw-bold">Egun on, <span class="text-custom">{{ trabajador.nombre }}</span>! 👋</h2>
      <p class="text-muted">Hau da zure egunaren laburpena</p>
    </header>

    <div class="row g-4" style="margin-bottom: 100px;">
      <div v-for="stat in estadisticas" :key="stat.titulo" class="col-12 col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 p-3">
          <div class="d-flex align-items-center">
            <div :class="['icon-box rounded-3 me-3', stat.color]">
              <i :class="['fas lg-icon', stat.icono]"></i>
            </div>
            <div>
              <p class="text-muted mb-0 small text-uppercase fw-bold">{{ stat.titulo }}</p>
              <h3 class="fw-bold mb-0">{{ stat.valor }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-5">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Hurrengo Bezeroak</h5>
            <router-link to="/egutegia/hitzorduak" class="btn btn-sm btn-agenda">Ikusi agenda osoa</router-link>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-middle">
                <thead class="text-muted small">
                  <tr>
                    <th>ORDUA</th>
                    <th>BEZEROA</th>
                    <th>ZERBITZUA</th>
                    <th>EGOERA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="badge bg-light text-dark">10:30</span></td>
                    <td class="fw-bold">Jon Alberdi</td>
                    <td>Ilea Moztu</td>
                    <td><span class="badge rounded-pill bg-info-subtle text-info px-3">Zain</span></td>
                  </tr>
                  <tr>
                    <td><span class="badge bg-light text-dark">11:15</span></td>
                    <td class="fw-bold">Ane Miren</td>
                    <td>Tintea ipini</td>
                    <td><span class="badge rounded-pill bg-warning-subtle text-warning px-3">Prestatzen</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 h-100 bg-custom text-white">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Ekintza azkarrak</h5>
            <div class="d-grid gap-3">
              <router-link to="#" class="btn btn-white-outline d-flex align-items-center justify-content-between">
                <span>Hitzordu Berria</span>
                <i class="fas fa-plus"></i>
              </router-link>
              <router-link to="/inbentarioa" class="btn btn-white-outline d-flex align-items-center justify-content-between">
                <span>Ekipamendua / Stock-a</span>
                <i class="fas fa-box"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .btn-agenda {
        background-color: #2bc1b6;
        color: white;
    }

    .btn-agenda:hover {
        background-color: #239c94;
        color: white;
    }

    .text-custom {
        color: #2bc1b6;
    }

    .bg-custom {
        background-color: #2bc1b6;
    }

    .icon-box {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f9fa;
    }

    .lg-icon {
    font-size: 1.5rem;
    }

    .table thead th {
        border: none;
        font-weight: 600;
    }

    .table tbody td {
        padding: 1rem 0.5rem;
    }

    .btn-white-outline {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        transition: all 0.3s ease;
        text-align: left;
    }

    .btn-white-outline:hover {
        background: white;
        color: #2bc1b6;
    }

    .bg-info-subtle { 
        background-color: #e0f7fa !important; 
    }

    .bg-warning-subtle { 
        background-color: #fff8e1 !important; 
    }

    @media (max-width: 991.98px) {
        header { 
            text-align: center; 
        }
    }
</style>