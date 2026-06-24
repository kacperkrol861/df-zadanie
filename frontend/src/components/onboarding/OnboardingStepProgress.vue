<template>
  <va-card class="step">

    <h2 class="title">Running scan</h2>

    <p class="subtitle">
      We are analyzing your data source based on selected scope.
    </p>

    <div v-if="store.scanStatus === 'idle'" class="start">
      <va-button color="primary" size="large" @click="store.startScan()">
        Start scan
      </va-button>
    </div>

    <div v-else class="progress-wrap">

      <div class="progress-header">
        <span>{{ statusText }}</span>
        <span class="percent">{{ store.progress }}%</span>
      </div>

      <va-progress-bar
        :model-value="store.progress"
        size="large"
      />

      <div v-if="store.progress > 30" class="preview">

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

      <div v-if="store.scanStatus === 'done'" class="done">

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

  </va-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'

const store = useOnboardingStore()

const statusText = computed(() => {
  switch (store.scanStatus) {
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
</script>

<style scoped>
.step {
  padding: 32px;
  background: var(--va-background-secondary);
  border-radius: 16px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.subtitle {
  margin-top: 6px;
  margin-bottom: 24px;
  color: var(--va-text-secondary);
}

.start {
  display: flex;
  justify-content: center;
  padding: 40px 0;
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

.preview {
  margin-top: 16px;
}

.preview-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--va-text-primary);
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
  color: var(--va-text-primary);
}

.done {
  margin-top: 24px;
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
  color: var(--va-text-primary);
}

.done-subtitle {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin-top: 6px;
}
</style>