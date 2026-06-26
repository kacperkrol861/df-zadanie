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

        <h2 class="title">Connect source</h2>

        <p class="subtitle">
          Choose where your data comes from and connect it to continue setup.
        </p>

        
        <div class="stack">

          <div
            v-for="s in sources"
            :key="s.type"
            class="source-card"
            :class="{
              active: store.sourceType === s.type,
              disabled: isBusy
            }"
            @click="select(s.type)"
          >

            <Icon :icon="s.icon" class="icon" />

            <div class="text">
              <div class="label">{{ s.label }}</div>
              <div class="desc">{{ getDesc(s.type) }}</div>
            </div>

            <Icon
              v-if="store.sourceType === s.type"
              icon="mdi:check-circle"
              class="check"
            />

          </div>

        </div>

        
        <va-chip class="chip" :color="color">

          <Icon :icon="statusIcon" class="chip-icon" />

          <span class="chip-text">
            {{ statusText }}
          </span>

        </va-chip>

        
        <div class="actions">

          <va-button
            v-if="store.sourceStatus === 'idle' || store.sourceStatus === 'error'"
            :disabled="!store.sourceType || isBusy"
            @click="store.connectSource()"
          >
            {{ store.sourceStatus === 'error' ? 'Retry connection' : 'Connect' }}
          </va-button>

          <va-button
            v-if="store.sourceStatus === 'connected'"
            color="success"
            @click="store.next()"
            :disabled="!store.canGoNext"
          >
            Continue
          </va-button>

        </div>

      </div>

    </va-card>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { Icon } from '@iconify/vue'

type SourceType = 'cloud' | 'db' | 'api'

const store = useOnboardingStore()

const sources: { type: SourceType; label: string; icon: string }[] = [
  { type: 'cloud', label: 'Cloud Drive', icon: 'mdi:cloud-outline' },
  { type: 'db', label: 'Database', icon: 'mdi:database' },
  { type: 'api', label: 'API', icon: 'mdi:api' },
]

const isBusy = computed(() => store.sourceStatus === 'connecting')

const select = (type: SourceType) => {
  if (isBusy.value) return
  store.selectSource(type)
}

const getDesc = (type: SourceType) => {
  if (type === 'cloud') return 'Google Drive, S3, Dropbox'
  if (type === 'db') return 'PostgreSQL, MySQL, MongoDB'
  return 'REST / GraphQL endpoints'
}

const statusText = computed(() => {
  switch (store.sourceStatus) {
    case 'idle':
      return 'Select a data source'
    case 'connecting':
      return 'Connecting to source...'
    case 'connected':
      return 'Source connected'
    case 'error':
      return 'Connection failed'
  }
})

const statusIcon = computed(() => {
  switch (store.sourceStatus) {
    case 'connecting':
      return 'mdi:loading'
    case 'connected':
      return 'mdi:check-circle'
    case 'error':
      return 'mdi:alert-circle'
    default:
      return 'mdi:information-outline'
  }
})

const color = computed(() => {
  if (store.sourceStatus === 'connected') return 'success'
  if (store.sourceStatus === 'error') return 'danger'
  if (store.sourceStatus === 'connecting') return 'warning'
  return 'gray'
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


.stack {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-small);
}

.source-card {
  display: flex;
  align-items: center;
  gap: var(--va-gap-small);
  padding: var(--va-gap-medium);
  border-radius: 14px;
  border: 1px solid var(--va-background-border);
  background: var(--va-background-element);
  cursor: pointer;
  transition: 0.2s ease;
}

.source-card:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.source-card.active {
  border-color: var(--va-primary);
  box-shadow: 0 0 0 2px rgba(0, 120, 255, 0.12);
}

.source-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.icon {
  font-size: 24px;
  color: var(--va-primary);
}

.text {
  flex: 1;
}

.label {
  font-weight: 600;
  font-size: 14px;
}

.desc {
  font-size: 12px;
  color: var(--va-text-secondary);
}

.check {
  color: var(--va-success);
  font-size: 20px;
}


.chip {
  margin-top: var(--va-gap-small);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}


.actions {
  display: flex;
  justify-content: flex-end;
}
</style>