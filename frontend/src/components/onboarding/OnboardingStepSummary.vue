<template>
  <div class="wrap">

    <va-card class="card">

      <div class="stepper">
        <div
          v-for="(s, i) in store.steps"
          :key="s"
          class="step"
          :class="{
            active: store.step === i,
            done: store.step > i
          }"
        >
          <div class="dot">
            <Icon v-if="store.step > i" icon="mdi:check" />
            <span v-else>{{ i + 1 }}</span>
          </div>

          <div class="label">
            {{ formatStep(s) }}
          </div>
        </div>
      </div>

      <div class="content">

        <h2 class="title">Summary</h2>

        <p class="subtitle">
          Review your configuration before starting the scan.
        </p>

        <div class="grid">

          <div class="summary-card">
            <div class="label">Data source</div>
            <div class="value">{{ formattedSource }}</div>
          </div>

          <div class="summary-card">
            <div class="label">Scan scope</div>
            <div class="value">{{ formattedScope }}</div>
          </div>

          <div class="summary-card">
            <div class="label">Status</div>
            <div class="value status">
              {{ loading ? 'Preparing scan...' : 'Ready to start' }}
            </div>
          </div>

        </div>

        <div class="hint">
          The scan will run in the background. You can track progress in real time.
        </div>

        <div class="actions">

          <va-button
            color="primary"
            size="large"
            :loading="loading"
            :disabled="!canStart"
            @click="start"
          >
            Start scan
          </va-button>

        </div>

      </div>

    </va-card>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

const store = useOnboardingStore()

const loading = ref(false)

const canStart = computed(() =>
  !!store.sourceType &&
  !!store.scope &&
  store.scan.status === 'idle'
)

const start = async () => {
  loading.value = true

  await new Promise(r => setTimeout(r, 800))

  store.next()
  await store.startScan()

  loading.value = false
}

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

const formatStep = (s: string) => {
  switch (s) {
    case 'welcome': return 'Welcome'
    case 'source': return 'Source'
    case 'scope': return 'Scope'
    case 'scan': return 'Scan'
    case 'summary': return 'Summary'
    default: return s
  }
}
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--va-background-secondary);
  padding: var(--va-gap-large);
}

.card {
  width: 100%;
  max-width: 820px;
  padding: var(--va-gap-large);
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}

.stepper {
  display: flex;
  justify-content: space-between;
  gap: var(--va-gap-small);
  padding-bottom: var(--va-gap-medium);
  border-bottom: 1px solid var(--va-background-border);
}

.step {
  display: flex;
  align-items: center;
  gap: var(--va-gap-small);
  opacity: 0.5;
}

.step.active,
.step.done {
  opacity: 1;
}

.dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--va-background-border);
  font-size: 12px;
}

.step.active .dot {
  background: var(--va-primary);
  color: white;
}

.step.done .dot {
  background: var(--va-success);
  color: white;
}

.label {
  font-size: 12px;
  color: var(--va-text-primary);
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.subtitle {
  font-size: 14px;
  color: var(--va-text-secondary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--va-gap-small);
}

.summary-card {
  padding: var(--va-gap-medium);
  border-radius: 14px;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
  transition: 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.label {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-bottom: 6px;
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
  padding: var(--va-gap-small);
  border-radius: 10px;
  background: rgba(0, 120, 255, 0.08);
  font-size: 13px;
  color: var(--va-text-primary);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>