<template>
  <aside class="sidebar">

    <div class="brand">
      <div class="logo">DF</div>
      <div class="name">DataFlow</div>
    </div>

    <nav class="nav">

      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="link"
        :class="{ active: route.path === item.to }"
      >
        <Icon :icon="item.icon" class="icon" />
        <span>{{ item.label }}</span>
      </RouterLink>

    </nav>

  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard-outline' },
  { to: '/scans', label: 'Scans', icon: 'mdi:radar' },
  { to: '/reports', label: 'Reports', icon: 'mdi:file-chart-outline' },
]
</script>

<style scoped>
.sidebar {
  background: var(--va-background-element);
  border-right: 1px solid var(--va-background-border);

  padding: var(--va-gap-large);
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--va-gap-small);
  padding: var(--va-gap-small) 0;
}

.logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;

  background: var(--va-primary);
  color: var(--va-text-inverted);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-small);
}

.link {
  display: flex;
  align-items: center;
  gap: var(--va-gap-small);

  padding: var(--va-gap-small) var(--va-gap-medium);
  border-radius: 10px;

  color: var(--va-text-secondary);
  text-decoration: none;

  transition: all 0.2s ease;
}

.link:hover {
  background: var(--va-background-secondary);
  color: var(--va-text-primary);
}

.link.active {
  background: var(--va-background-secondary);
  color: var(--va-primary);
}

.icon {
  font-size: 18px;
}
</style>