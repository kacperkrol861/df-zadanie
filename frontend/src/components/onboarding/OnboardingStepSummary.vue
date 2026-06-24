<template>
  <va-card class="step">

    <h2 class="title">Summary</h2>

    <p class="subtitle">
      Review your configuration before starting the scan.
    </p>

    <div class="grid">

      <va-card class="summary-card">

        <div class="label">Data source</div>

        <div class="value">
          {{ formattedSource }}
        </div>

      </va-card>

      <va-card class="summary-card">

        <div class="label">Scan scope</div>

        <div class="value">
          {{ formattedScope }}
        </div>

      </va-card>

      <va-card class="summary-card">

        <div class="label">Status</div>

        <div class="value status">
          Ready to start
        </div>

      </va-card>

    </div>

    <div class="hint">
      The scan will run in the background. You can track progress in real time.
    </div>

    <div class="actions">

      <va-button
        color="primary"
        size="large"
        @click="store.next()"
      >
        Start scan
      </va-button>

    </div>

  </va-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'

const store = useOnboardingStore()

const formattedSource = computed(() => {
  if (!store.sourceType) return 'Not selected'
  return store.sourceType.charAt(0).toUpperCase() + store.sourceType.slice(1)
})

const formattedScope = computed(() => {
  const map: Record<string, string> = {
    all: 'Full dataset',
    recent: 'Last 30 days',
    custom: 'Custom configuration',
  }

  return map[store.scope] || store.scope
})
</script>

<style scoped>
.step {
  padding: var(--va-spacing-xl, 32px);
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.subtitle {
  margin-top: var(--va-spacing-xs, 6px);
  margin-bottom: var(--va-spacing-lg, 24px);
  color: var(--va-text-secondary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--va-spacing-md, 16px);
}

.summary-card {
  padding: var(--va-spacing-md, 16px);
  border-radius: var(--va-border-radius-md, 12px);
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
  transition: all 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.label {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-bottom: var(--va-spacing-xs, 8px);
}

.value {
  font-size: 15px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.status {
  color: var(--va-primary);
}

.hint {
  margin-top: var(--va-spacing-lg, 20px);
  padding: var(--va-spacing-md, 14px) var(--va-spacing-md, 16px);
  border-radius: var(--va-border-radius-sm, 10px);
  background: rgba(var(--va-primary-rgb, 0, 120, 255), 0.08);
  color: var(--va-text-primary);
  font-size: 13px;
}

.actions {
  margin-top: var(--va-spacing-lg, 24px);
  display: flex;
  justify-content: flex-end;
}
</style>