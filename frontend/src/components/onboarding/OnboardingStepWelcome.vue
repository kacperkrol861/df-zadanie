<template>
  <div class="wrap">

    <va-card class="card">

      <div class="stepper">

        <template
          v-for="(s, i) in store.steps"
          :key="s"
        >

          <div
            class="step"
            :class="{
              active: store.step === i,
              done: store.step > i
            }"
          >
            <div class="dot">
              <Icon
                v-if="store.step > i"
                icon="mdi:check"
              />
              <span v-else>
                {{ i + 1 }}
              </span>
            </div>

            <div class="label">
              {{ formatStep(s) }}
            </div>
          </div>

          <div
            v-if="i < store.steps.length - 1"
            class="connector"
            :class="{
              done: store.step > i
            }"
          />

        </template>

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
    case 'summary': return 'Summary'
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

.stepper {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding-bottom: var(--va-gap-medium);
  border-bottom: 1px solid var(--va-background-border);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--va-gap-small);
  min-width: 80px;
  flex-shrink: 0;
  opacity: 0.5;
  transition: 0.2s ease;
}

.step.active,
.step.done {
  opacity: 1;
}

.connector {
  position: relative;
  flex: 1;
  height: 2px;
  margin-top: 14px;
  background: var(--va-background-border);
  overflow: hidden;
}

.connector.done::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--va-primary);
}

.dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--va-background-border);
  font-size: 12px;
  transition: 0.2s ease;
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
  text-align: center;
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