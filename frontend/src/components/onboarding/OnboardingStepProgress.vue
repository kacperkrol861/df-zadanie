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

        <div class="progress-wrap">

          <div class="progress-header">
            <span>{{ statusText }}</span>
            <span class="percent">{{ store.scan.progress }}%</span>
          </div>

          <va-progress-bar
            :model-value="store.scan.progress"
            size="large"
          />

          <div class="preview">

            <div class="preview-title">
              Live insights
            </div>

            <div class="cards">

              <va-card
                v-if="store.scan.progress >= 10"
                class="mini reveal"
              >
                <div class="label">Top category</div>
                <div class="value">Finance</div>
              </va-card>

              <va-card
                v-if="store.scan.progress >= 40"
                class="mini reveal"
              >
                <div class="label">Anomalies</div>
                <div class="value">1,243</div>
              </va-card>

              <va-card
                v-if="store.scan.progress >= 70"
                class="mini reveal"
              >
                <div class="label">Data quality</div>
                <div class="value">89%</div>
              </va-card>

            </div>

          </div>

          <div v-if="store.scan.status === 'completed'" class="done">

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
import { computed, onMounted } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

const store = useOnboardingStore()

onMounted(() => {
  if (store.scan.status === 'idle') {
    store.startScan()
  }
})

const statusText = computed(() => {
  switch (store.scan.status) {
    case 'idle': return 'Preparing scan...'
    case 'running': return 'Scanning data...'
    case 'completed': return 'Completed'
    case 'failed': return 'Failed'
    default: return ''
  }
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
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--va-gap-small);
  padding-bottom: var(--va-gap-medium);
  border-bottom: 1px solid var(--va-background-border);
}

.step {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0.5;
}

.step.active,
.step.done {
  opacity: 1;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 13px;
  left: calc(50% + 18px);
  width: calc(100% - 36px);
  height: 2px;
  background: var(--va-background-border);
}

.step.done:not(:last-child)::after {
  background: var(--va-success);
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
  position: relative;
  z-index: 1;
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
  margin-top: 8px;
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
  opacity: 0;
  transform: translateY(6px);
  animation: reveal 0.35s ease forwards;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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