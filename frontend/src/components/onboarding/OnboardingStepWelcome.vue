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

        <div class="actions">
          <va-button
            size="large"
            color="primary"
            :disabled="!store.canGoNext"
            @click="store.next()"
          >
            Continue
          </va-button>
        </div>

      </div>

    </va-card>

  </div>
</template>

<script setup lang="ts">
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

const store = useOnboardingStore()

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
  text-align: center;
}

.icon {
  font-size: 44px;
  margin-bottom: var(--va-gap-medium);
  color: var(--va-primary);
}

.title {
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  font-size: 15px;
  color: var(--va-text-secondary);
  margin: var(--va-gap-medium) 0;
}

.features {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-small);
  margin-bottom: var(--va-gap-large);
}

.feature {
  display: flex;
  justify-content: center;
  gap: var(--va-gap-small);
}

.ico {
  color: var(--va-primary);
  font-size: 18px;
}

.actions {
  display: flex;
  justify-content: center;
}
</style>