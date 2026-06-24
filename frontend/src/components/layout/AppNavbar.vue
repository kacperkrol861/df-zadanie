<template>
  <header class="navbar">

    <div class="left">
      <span class="title">{{ title }}</span>
    </div>

    <div class="right">

      <va-button
        size="small"
        preset="secondary"
        class="theme-toggle"
        @click="toggleTheme"
      >
        <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" />
      </va-button>

      <div class="user">
        <div class="avatar">K</div>
      </div>

    </div>

  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useColors } from 'vuestic-ui'
import { Icon } from '@iconify/vue'

const colors = useColors()

const isDark = computed(() => colors.currentPresetName.value === 'dark')

const toggleTheme = () => {
  colors.currentPresetName.value = isDark.value ? 'light' : 'dark'
}

const title = 'DataFlow'
</script>

<style scoped>
.navbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--va-gap-medium);
  border-bottom: 1px solid var(--va-background-border);
  background: var(--va-background-element);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.right {
  display: flex;
  align-items: center;
  gap: var(--va-gap-medium);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--va-primary);
  color: var(--va-text-inverted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
</style>