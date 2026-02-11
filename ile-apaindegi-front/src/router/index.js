import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/app/HomeView.vue'
import InbentarioaView from '@/views/app/inbentarioa/InbentarioaView.vue'
import InbentarioaDetailsView from '@/views/app/inbentarioa/InbentarioaDetailsView.vue'
import HitzorduakView from '@/views/app/egutegia/HitzorduakView.vue'
import ZerbitzuakView from '@/views/app/zerbitzuak/ZerbitzuakView.vue'
import BezerokView from '@/views/app/bezeroak/BezerokView.vue'
import BezerokDetailsView from '@/views/app/bezeroak/BezerokDetailsView.vue'
import AdminPanelView from '@/views/app/admin/AdminPanelView.vue'
import KudeaketaView from '@/views/app/kudeaketa/KudeaketaView.vue'

import { createRouter, createWebHistory } from 'vue-router'
import PerfilView from '@/views/app/PerfilView.vue'
import EgutegiView from '@/views/app/egutegi-laburpena/EgutegiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/inbentarioa',
      name: 'inbentarioa',
      component: InbentarioaView
    },
    {
      path: '/inbentarioa/:tipo/:id',
      name: 'inbentarioa-details',
      component: InbentarioaDetailsView
    },
    {
      path: '/profila',
      name: 'profil',
      component: PerfilView
    },
    {
      path: '/egutegia/:fecha',
      name: 'hitzorduak',
      component: HitzorduakView
    },
    {
      path: '/zerbitzuak',
      name: 'zerbitzuak',
      component: ZerbitzuakView
    },
    {
      path: '/bezeroak',
      name: 'bezeroak',
      component: BezerokView
    },
    {
      path: '/bezeroak/:id',
      name: 'bezeroak-details',
      component: BezerokDetailsView
    },
    {
      path: '/egutegia',
      name: 'egutegia',
      component: EgutegiView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanelView
    },
    {
      path: '/kudeaketa',
      name: 'kudeaketa',
      component: KudeaketaView
    },
  ],
})

export default router
