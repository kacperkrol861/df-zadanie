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

        <h2 class="title">Running scan</h2>

        <p class="subtitle">
          We are analyzing your data source based on selected scope.
        </p>

        <div v-if="store.scan.status === 'idle'" class="start">
          <va-button color="primary" size="large" @click="store.startScan()">
            Start scan
          </va-button>
        </div>

        <div v-else class="progress-wrap">

          <div class="progress-header">
            <span>{{ statusText }}</span>
            <span class="percent">{{ store.scan.progress }}%</span>
          </div>

          <va-progress-bar
            :model-value="store.scan.progress"
            size="large"
          />

          <div v-if="store.scan.progress > 30" class="preview">

            <div class="preview-title">
              Live insights
            </div>

            <div class="cards">

              <va-card class="mini">
                <div class="label">Top category</div>
                <div class="value">Finance</div>
              </va-card>

              <va-card class="mini">
                <div class="label">Anomalies</div>
                <div class="value">1,243</div>
              </va-card>

              <va-card class="mini">
                <div class="label">Data quality</div>
                <div class="value">89%</div>
              </va-card>

            </div>

          </div>

          <div v-if="store.scan.status === 'done'" class="done">

            <va-card class="done-card">
              <div class="done-title">Scan completed</div>
              <div class="done-subtitle">
                Your data is ready to explore in the dashboard.
              </div>
            </va-card>

            <va-button
              color="success"
              size="large"
              @click="$router.push('/dashboard')"
            >
              Go to dashboard
            </va-button>

          </div>

        </div>

      </div>

    </va-card>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

const store = useOnboardingStore()

const statusText = computed(() => {
  switch (store.scan.status) {
    case 'idle':
      return 'Ready to start'
    case 'running':
      return 'Scanning data...'
    case 'done':
      return 'Completed'
    default:
      return ''
  }
})

const formatStep = (s: string) => {
  switch (s) {
    case 'welcome': return 'Welcome'
    case 'source': return 'Source'
    case 'scope': return 'Scope'
    case 'scan': return 'Scan'
    case 'results': return 'Results'
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

/* SAME STEPPER AS WELCOME */
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

/* CONTENT */
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

/* START */
.start {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

/* PROGRESS */
.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--va-text-secondary);
}

.percent {
  font-weight: 600;
  color: var(--va-text-primary);
}

/* PREVIEW */
.preview-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mini {
  padding: 12px;
  text-align: center;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
}

.label {
  font-size: 12px;
  color: var(--va-text-secondary);
}

.value {
  font-size: 16px;
  font-weight: 600;
  margin-top: 6px;
}

/* DONE */
.done {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.done-card {
  padding: 20px;
  text-align: center;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
}

.done-title {
  font-size: 18px;
  font-weight: 600;
}

.done-subtitle {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin-top: 6px;
}
</style>