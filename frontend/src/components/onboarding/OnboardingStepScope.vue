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

      <h2 class="title">Scan scope</h2>

      <p class="subtitle">
        Define what data should be included in the scan.
      </p>

      <div class="layout">

        <div class="options">

          <div
            v-for="o in options"
            :key="o.value"
            class="option-card"
            :class="{ active: store.scope === o.value }"
            @click="select(o.value)"
          >

            <div class="radio">
              <Icon
                :icon="store.scope === o.value
                  ? 'mdi:radiobox-marked'
                  : 'mdi:radiobox-blank'"
              />
            </div>

            <div class="content">
              <div class="label">{{ o.label }}</div>
              <div class="desc">{{ o.desc }}</div>
            </div>

          </div>

          <div v-if="store.scope === 'custom'" class="date-box">

            <div class="date-title">Custom range</div>

            <div class="dates">

              <va-input v-model="from" type="date" label="From" />
              <va-input v-model="to" type="date" label="To" />

            </div>

            <va-button
              size="small"
              :disabled="!from || !to"
              @click="applyDates"
            >
              Apply range
            </va-button>

          </div>

        </div>

        <va-card class="summary">

          <div class="summary-title">
            Current selection
          </div>

          <div class="summary-value">
            {{ currentLabel }}
          </div>

          <div class="hint">
            This defines how deep the scan will go.
          </div>

          <div v-if="store.scope === 'custom' && store.customRange.from" class="range">
            <div>From: {{ store.customRange.from }}</div>
            <div>To: {{ store.customRange.to }}</div>
          </div>

        </va-card>

      </div>

      <div class="actions">

        <va-button
          color="primary"
          :disabled="!store.scope"
          @click="store.next()"
        >
          Continue
        </va-button>

      </div>

    </va-card>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

type ScopeType = 'all' | 'recent' | 'custom'

const store = useOnboardingStore()

const from = ref('')
const to = ref('')

const options: {
  value: ScopeType
  label: string
  desc: string
}[] = [
  {
    value: 'all',
    label: 'Full scan',
    desc: 'Scan all available data sources and historical records',
  },
  {
    value: 'recent',
    label: 'Recent data',
    desc: 'Only data from the last 30 days of activity',
  },
  {
    value: 'custom',
    label: 'Custom scope',
    desc: 'Manually configure date range and filters',
  },
]

const select = (value: ScopeType) => {
  store.setScope(value)
}

const applyDates = () => {
  store.setCustomRange(from.value, to.value)
}

const currentLabel = computed(() => {
  return options.find(o => o.value === store.scope)?.label || 'Not selected'
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
  justify-content: center;
  align-items: center;
  background: var(--va-background-secondary);
  padding: var(--va-gap-large);
}

.card {
  width: 100%;
  max-width: 900px;
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

.title {
  font-size: 22px;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: var(--va-text-secondary);
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--va-background-border);
  background: var(--va-background-element);
  cursor: pointer;
  transition: 0.2s ease;
}

.option-card:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.option-card.active {
  border-color: var(--va-primary);
  box-shadow: 0 0 0 2px rgba(0, 120, 255, 0.12);
}

.radio {
  font-size: 20px;
  color: var(--va-primary);
}

.content {
  flex: 1;
}

.label {
  font-weight: 600;
  font-size: 14px;
}

.desc {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 4px;
}

.date-box {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: var(--va-background-secondary);
}

.dates {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.date-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}

.summary {
  padding: 16px;
  border-radius: 14px;
  background: var(--va-background-secondary);
  height: fit-content;
  position: sticky;
  top: 16px;
}

.summary-title {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-bottom: 8px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
}

.hint {
  margin-top: 10px;
  font-size: 12px;
  color: var(--va-text-secondary);
}

.range {
  margin-top: 12px;
  font-size: 12px;
  color: var(--va-text-primary);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>