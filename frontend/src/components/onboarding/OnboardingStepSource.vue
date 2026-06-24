<template>
  <va-card class="step">

    <h2 class="title">Connect source</h2>

    <p class="subtitle">
      Choose where your data comes from.
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

        <div class="content">
          <div class="label">{{ s.label }}</div>
          <div class="desc">
            {{ getDesc(s.type) }}
          </div>
        </div>

        <div class="checkbox">
          <Icon
            v-if="store.sourceType === s.type"
            icon="mdi:check-circle"
            class="check"
          />
          <Icon
            v-else
            icon="mdi:checkbox-blank-circle-outline"
            class="empty"
          />
        </div>

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
        {{ store.sourceStatus === 'error' ? 'Retry' : 'Connect' }}
      </va-button>

      <va-button
        v-if="store.sourceStatus === 'connected'"
        color="success"
        @click="store.next()"
      >
        Continue
      </va-button>

    </div>

  </va-card>
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

const select = (type: SourceType) => {
  if (isBusy.value) return
  store.selectSource(type)
}

const isBusy = computed(() =>
  ['connecting', 'saving'].includes(store.sourceStatus)
)

const getDesc = (type: SourceType) => {
  if (type === 'cloud') return 'Google Drive, S3, Dropbox'
  if (type === 'db') return 'PostgreSQL, MySQL, MongoDB'
  return 'REST / GraphQL endpoints'
}

const statusText = computed(() => {
  switch (store.sourceStatus) {
    case 'idle':
      return 'Select source'
    case 'connecting':
      return 'Connecting...'
    case 'saving':
      return 'Saving configuration...'
    case 'connected':
      return 'Connected'
    case 'error':
      return 'Connection failed'
  }
})

const statusIcon = computed(() => {
  switch (store.sourceStatus) {
    case 'connecting':
      return 'mdi:loading'
    case 'saving':
      return 'mdi:content-save'
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
  if (['connecting', 'saving'].includes(store.sourceStatus)) return 'warning'
  return 'gray'
})
</script>

<style scoped>
.step {
  padding: 32px;
  background: var(--va-background-secondary);
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

.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.source-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--va-background-border);
  background: var(--va-background-element);
  cursor: pointer;
  transition: all 0.2s ease;
}

.source-card:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.source-card.active {
  border-color: var(--va-primary);
  box-shadow: 0 0 0 2px var(--va-primary-opacity, rgba(0, 120, 255, 0.12));
}

.source-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.icon {
  font-size: 26px;
  color: var(--va-primary);
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.label {
  font-size: 14px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.desc {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 2px;
}

.checkbox {
  flex-shrink: 0;
}

.check {
  color: var(--va-primary);
  font-size: 20px;
}

.empty {
  color: var(--va-text-secondary);
  font-size: 18px;
}

.chip {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>