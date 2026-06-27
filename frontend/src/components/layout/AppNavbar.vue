<template>
  <header class="navbar">

    <div class="left">
      <span class="title">{{ title }}</span>
    </div>

    <div class="right">

      <div class="theme-switch" @click="toggleTheme">

        <div class="switch">
          <div class="thumb" :class="{ dark: isDark }">
            <Icon
              :icon="isDark ? 'mdi:weather-night' : 'mdi:weather-sunny'"
              class="thumb-icon"
            />
          </div>
        </div>

      </div>

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

.theme-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.switch {
  width: 52px;
  height: 28px;
  background: var(--va-background-border);
  border-radius: 999px;
  position: relative;
  transition: 0.2s ease;
}

.thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--va-background-element);
  position: absolute;
  top: 2px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.thumb.dark {
  transform: translateX(24px);
}

.thumb-icon {
  font-size: 14px;
  color: var(--va-primary);
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