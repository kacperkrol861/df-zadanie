<template>
  <div class="wrap">

    <va-card class="card">

      <div class="icon">⚡</div>

      <h1 class="title">
        Welcome to DataFlow
      </h1>

      <p class="subtitle">
        Automate data scanning in minutes.  
        We’ll guide you step by step through setup and your first scan.
      </p>

      <div class="features">

        <div class="feature">
          <Icon icon="mdi:check-circle" class="ico" />
          <span>Connect your data source</span>
        </div>

        <div class="feature">
          <Icon icon="mdi:check-circle" class="ico" />
          <span>Configure scan scope</span>
        </div>

        <div class="feature">
          <Icon icon="mdi:check-circle" class="ico" />
          <span>View insights in dashboard</span>
        </div>

      </div>

      <va-button
        class="cta"
        size="large"
        color="primary"
        @click="next"
      >
        Start onboarding
      </va-button>

    </va-card>

  </div>
</template>

<script setup lang="ts">
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

const store = useOnboardingStore()

const next = () => {
  store.next()
}
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--va-background-secondary);
  padding: var(--va-spacing-large, 40px);
}

.card {
  width: 100%;
  max-width: 720px;
  padding: var(--va-spacing-xxl, 48px);
  text-align: center;
  border-radius: var(--va-border-radius-large, 16px);
  background: var(--va-background-element);
}

.icon {
  font-size: 44px;
  margin-bottom: var(--va-spacing-large, 24px);
  color: var(--va-primary);
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: var(--va-spacing-small, 12px);
  color: var(--va-text-primary);
}

.subtitle {
  font-size: 15px;
  line-height: 1.6;
  color: var(--va-text-secondary);
  margin-bottom: var(--va-spacing-xl, 32px);
}

.features {
  display: flex;
  flex-direction: column;
  gap: var(--va-spacing-small, 14px);
  margin-bottom: var(--va-spacing-xxl, 36px);
}

.feature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--va-spacing-small, 10px);
  font-size: 14px;
  color: var(--va-text-primary);
}

.ico {
  font-size: 20px;
  color: var(--va-primary);
}

.cta {
  width: 100%;
}
</style>