<script setup>
  import NavBar from '@/components/layout/MenuLayout.vue';
  import FooterLayout from '@/components/layout/FooterLayout.vue';
</script>

<template>
  <div class="d-flex flex-column min-vh-100"> <NavBar v-if="$route.name !== 'login' && $route.name !== 'admin'" />

    <main class="flex-grow-1" style="background-color: #f7fffe;">
      <router-view />
    </main>

    <FooterLayout v-if="$route.name !== 'login' && $route.name !== 'admin'" />
  </div>
</template>

<style scoped></style>
