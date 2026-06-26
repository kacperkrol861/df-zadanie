<template>
  <div class="scan-detail">

    <va-button
      preset="secondary"
      size="small"
      @click="router.push('/scans')"
    >
      Back
    </va-button>

    <!-- LOADING -->
    <div v-if="store.isDetailLoading" class="loading">
      <va-skeleton height="24px" />
      <va-skeleton height="120px" />
    </div>

    <template v-else-if="scan">

      
      <va-card class="overview">

        <div class="overview-header">

          <div>
            <h1 class="title">{{ scan.name }}</h1>

            <div class="meta">
              {{ formatSource(scan.sourceType) }} • {{ formatDate(scan.createdAt) }}
            </div>
          </div>

          <va-badge
            :text="formatStatus(scan.status)"
            :color="statusColor(scan.status)"
          />

        </div>

        <div class="progress-section">

          <div class="progress-label">Progress</div>

          <va-progress-bar :model-value="scan.progress" />

          <div class="progress-value">
            {{ scan.progress }}%
          </div>

        </div>

        <div class="actions">
          <va-button
            v-if="scan.status !== 'running'"
            preset="primary"
            @click="store.runScan()"
          >
            Run scan
          </va-button>
        </div>

      </va-card>

      
      <div class="stats">

        <va-card class="stat">
          <div class="stat-label">Status</div>
          <div class="stat-value">{{ formatStatus(scan.status) }}</div>
        </va-card>

        <va-card class="stat">
          <div class="stat-label">Findings</div>
          <div class="stat-value">{{ store.results.length }}</div>
        </va-card>

        <va-card class="stat">
          <div class="stat-label">Events</div>
          <div class="stat-value">{{ store.logs.length }}</div>
        </va-card>

      </div>

      
      <div class="content-grid">

        
        <va-card class="panel">
          <h3 class="section-title">Activity</h3>

          <ul class="list">
            <li v-for="log in store.logs" :key="log.id">
              <span>{{ log.message }}</span>
              <small>{{ formatTime(log.timestamp) }}</small>
            </li>
          </ul>
        </va-card>

       
        <va-card class="panel">
          <h3 class="section-title">Findings</h3>

          <ul class="list">
            <li v-for="r in store.results" :key="r.id">
              <span>{{ r.category }}</span>
              <strong>{{ r.value }}</strong>
            </li>
          </ul>
        </va-card>

       
        <va-card class="panel">
          <h3 class="section-title">Insights</h3>

          <div class="insights">
            <div v-for="i in insights" :key="i.label" class="insight">
              <span class="label">{{ i.label }}</span>

              <div class="bar">
                <div class="fill" :style="{ width: i.value + '%' }" />
              </div>

              <span class="value">{{ i.value }}%</span>
            </div>
          </div>

        </va-card>

      </div>

    </template>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScansStore } from '@/stores/scans.store'

const store = useScansStore()
const router = useRouter()
const route = useRoute()

const scanId = route.params.id as string

onMounted(async () => {
  await store.fetchScan(scanId)
  store.fetchLogs(scanId)
  store.fetchResults(scanId)
})

const scan = computed(() => store.selectedScan)

const insights = computed(() =>
  store.results.map(r => ({
    label: r.category,
    value: Math.min(100, r.value * 8),
  }))
)

const formatStatus = (s: string) => {
  switch (s) {
    case 'running': return 'Running'
    case 'completed': return 'Completed'
    case 'queued': return 'Queued'
    case 'failed': return 'Failed'
  }
}

const statusColor = (s: string) => {
  switch (s) {
    case 'running': return 'primary'
    case 'completed': return 'success'
    case 'queued': return 'warning'
    case 'failed': return 'danger'
  }
}

const formatSource = (s: string) => {
  switch (s) {
    case 'cloud': return 'Cloud'
    case 'db': return 'Database'
    case 'api': return 'API'
  }
}

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString()

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString()
</script>

<style scoped>
.scan-detail {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}


.overview {
  padding: var(--va-gap-large);
}

.overview-header {
  display: flex;
  justify-content: space-between;
}

/* TEXT */
.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.meta {
  font-size: 12px;
  color: var(--va-text-secondary);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--va-gap-medium);
}

.stat {
  padding: var(--va-gap-medium);
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
}


.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--va-gap-medium);
}

.panel {
  padding: var(--va-gap-medium);
}


.list {
  list-style: none;
  padding: 0;
}

.list li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--va-background-border);
}

.insights {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.insight {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  gap: 10px;
  align-items: center;
}

.bar {
  height: 6px;
  background: var(--va-background-border);
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--va-primary);
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>