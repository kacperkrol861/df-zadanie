<template>
  <va-card class="step">

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

            <va-input
              v-model="from"
              type="date"
              label="From"
            />

            <va-input
              v-model="to"
              type="date"
              label="To"
            />

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
  store.scope = value
}

const applyDates = () => {
  store.setCustomRange(from.value, to.value)
}

const currentLabel = computed(() => {
  return options.find(o => o.value === store.scope)?.label || 'Not selected'
})
</script>

<style scoped>
.step {
  padding: 32px;
}

.title {
  font-size: 22px;
  font-weight: 600;
}

.subtitle {
  margin-top: 6px;
  margin-bottom: 24px;
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

/* OPTION CARD */
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


.label {
  font-size: 15px;
  font-weight: 600;
}

.desc {
  font-size: 13px;
  color: var(--va-text-secondary);
  margin-top: 4px;
  line-height: 1.4;
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
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>