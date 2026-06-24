<template>
  <div class="layout">
    <AppSidebar />

    <div class="content">
      <AppNavbar />

      <main class="page">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: var(--va-background-secondary);
}

.content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}


.page {
  flex: 1;
  padding: var(--va-gap-large);
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}
</style>