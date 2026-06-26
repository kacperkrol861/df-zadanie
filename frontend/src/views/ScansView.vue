<template>
  <div class="scans">

    <div class="header">
      <h1 class="title">Scans</h1>

      <div class="actions">
        <div class="filters">
          <va-button size="small" preset="secondary" @click="filter = 'all'">
            All
          </va-button>

          <va-button size="small" preset="secondary" @click="filter = 'running'">
            Running
          </va-button>

          <va-button size="small" preset="secondary" @click="filter = 'completed'">
            Done
          </va-button>
        </div>

        <va-button
          size="small"
          preset="primary"
          @click="store.fetchScans"
          :loading="store.isLoading"
        >
          Refresh
        </va-button>
      </div>
    </div>

    
    <div v-if="store.isLoading" class="grid">
      <va-card v-for="n in 6" :key="n" class="card">
        <va-skeleton height="16px" />
        <va-skeleton height="24px" class="mt" />
        <va-skeleton height="12px" class="mt-sm" />
      </va-card>
    </div>

    
    <div v-else-if="store.error" class="state error">
      {{ store.error }}
    </div>

    
    <div v-else-if="store.isEmpty" class="state">
      No scans yet. Start your first scan in onboarding.
    </div>

    
    <div v-else class="grid">

      <va-card
        v-for="scan in filteredScans"
        :key="scan.id"
        class="card"
        :class="{ running: scan.status === 'running' }"
        @click="goTo(scan.id)"
      >

        <div class="top">

          <div>
            <div class="name">
              {{ scan.name }}
            </div>

            <div class="meta">
              {{ formatSource(scan.sourceType) }} • {{ formatDate(scan.createdAt) }}
            </div>

            <!-- 🔥 LIVE STATUS -->
            <div v-if="scan.status === 'running'" class="live">
              Running
            </div>
          </div>

          <va-badge
            :text="formatStatus(scan.status)"
            :color="statusColor(scan.status)"
            small
          />

        </div>

        <div class="progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: scan.progress + '%' }"
            />
          </div>

          <span class="progress-text">
            {{ scan.progress }}%
          </span>
        </div>

      </va-card>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScansStore } from '@/stores/scans.store'
import type { ScanStatus, SourceType } from '@/composables/useMockApi'

const store = useScansStore()
const router = useRouter()

const filter = ref<'all' | ScanStatus>('all')

onMounted(() => {
  store.fetchScans()
})

const sortedScans = computed(() => {
  return [...store.scans].sort((a, b) => {
    if (a.status === 'running' && b.status !== 'running') return -1
    if (a.status !== 'running' && b.status === 'running') return 1
    return b.createdAt - a.createdAt
  })
})

const filteredScans = computed(() => {
  if (filter.value === 'all') return sortedScans.value
  return sortedScans.value.filter(s => s.status === filter.value)
})

const goTo = (id: string) => {
  router.push(`/scans/${id}`)
}

const statusColor = (status: ScanStatus) => {
  switch (status) {
    case 'running': return 'primary'
    case 'completed': return 'success'
    case 'queued': return 'warning'
    case 'failed': return 'danger'
    default: return 'secondary'
  }
}

const formatStatus = (status: ScanStatus) => {
  switch (status) {
    case 'running': return 'Running'
    case 'completed': return 'Completed'
    case 'queued': return 'Queued'
    case 'failed': return 'Failed'
  }
}

const formatSource = (source: SourceType) => {
  switch (source) {
    case 'cloud': return 'Cloud'
    case 'db': return 'Database'
    case 'api': return 'API'
  }
}

const formatDate = (ts: number) => {
  return new Date(ts).toLocaleString()
}
</script>

<style scoped>
.scans {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filters {
  display: flex;
  gap: 6px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.state {
  padding: var(--va-gap-large);
  text-align: center;
  color: var(--va-text-secondary);
}

.error {
  color: var(--va-danger);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--va-gap-medium);
}

.card {
  padding: var(--va-gap-medium);
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-medium);
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
}

.card:hover {
  transform: translateY(-2px);
  background: var(--va-background-secondary);
}

.running {
  border-left: 3px solid var(--va-primary);
  animation: pulse 1.6s infinite;
  position: relative;
  overflow: hidden;
}

@keyframes pulse {
  0% { opacity: 0.85; }
  50% { opacity: 1; }
  100% { opacity: 0.85; }
}


.running::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 120%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.06),
    transparent
  );
  animation: shine 2.2s infinite;
}

@keyframes shine {
  0% { left: -150%; }
  100% { left: 150%; }
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--va-gap-medium);
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.meta {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 2px;
}

.live {
  margin-top: 6px;
  font-size: 11px;
  color: var(--va-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.live::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--va-primary);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.progress {
  display: flex;
  align-items: center;
  gap: var(--va-gap-small);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--va-background-border);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--va-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--va-text-secondary);
  min-width: 40px;
  text-align: right;
}

.mt {
  margin-top: var(--va-gap-small);
}

.mt-sm {
  margin-top: 6px;
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>