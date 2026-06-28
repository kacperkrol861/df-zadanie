<template>
  <div class="reports">

    <div class="header">
      <div class="left">
        <h1 class="title">
          <Icon icon="mdi:file-document-outline" class="icon" />
          Reports
        </h1>

        <div class="subtitle">
          Generated insights and scan summaries
        </div>
      </div>

      <div class="actions">

        <va-button
          preset="primary"
          size="small"
          :loading="store.isGenerating"
          @click="handleGenerate"
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Generate report
        </va-button>

        <va-button
          preset="secondary"
          size="small"
          :loading="store.isLoading"
          @click="store.fetchReports"
        >
          <Icon icon="mdi:refresh" class="mr-1" />
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

    <va-card v-else-if="store.isEmpty" class="state">
      <Icon icon="mdi:file-outline" width="28" />
      <div class="mt-sm">No reports yet. Generate your first one.</div>
    </va-card>

    
    <va-alert v-else-if="store.error" color="danger">
      {{ store.error }}
    </va-alert>

    <!-- LIST -->
    <div v-else class="grid">

      <va-card
        v-for="report in sortedReports"
        :key="report.id"
        class="card"
        @click="goTo(report.id)"
      >

        <div class="top">

          <div class="info">
            <div class="name">
              <Icon icon="mdi:file-chart-outline" class="mr-1" />
              {{ report.title }}
            </div>

            <div class="meta">
              {{ formatDate(report.createdAt) }}
            </div>
          </div>

          <va-chip
            size="small"
            :color="statusColor(report.status)"
          >
            {{ formatStatus(report.status) }}
          </va-chip>

        </div>

        <div class="footer">

          <div class="source">
            <Icon icon="mdi:database-outline" width="14" />
            {{ report.source }}
          </div>

          <div class="hint">
            Click to open
          </div>

        </div>

      </va-card>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportsStore } from '@/stores/reports.store'
import { Icon } from '@iconify/vue'

const store = useReportsStore()
const router = useRouter()

onMounted(() => {
  store.fetchReports()
})

const goTo = (id: string) => {
  router.push(`/reports/${id}`)
}


const handleGenerate = () => {
  store.generateReport('scan_2')
}


const sortedReports = computed(() =>
  [...store.reports].sort((a, b) => b.createdAt - a.createdAt)
)

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString()

const formatStatus = (status: string) => {
  switch (status) {
    case 'ready': return 'Ready'
    case 'generating': return 'Generating'
    case 'draft': return 'Draft'
    case 'failed': return 'Failed'
    default: return status
  }
}

const statusColor = (status: string) => {
  switch (status) {
    case 'ready': return 'success'
    case 'generating': return 'warning'
    case 'draft': return 'secondary'
    case 'failed': return 'danger'
    default: return 'primary'
  }
}
</script>

<style scoped>
.reports {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.icon {
  color: var(--va-primary);
}

.subtitle {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--va-gap-medium);
}

.card {
  padding: var(--va-gap-medium);
  cursor: pointer;
  transition: 0.2s ease;
  border: 1px solid var(--va-background-border);
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.name {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.meta {
  font-size: 12px;
  color: var(--va-text-secondary);
  margin-top: 4px;
}

.footer {
  margin-top: var(--va-gap-medium);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--va-text-secondary);
}

.source {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hint {
  opacity: 0.7;
}


.state {
  padding: var(--va-gap-large);
  text-align: center;
  color: var(--va-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}


@media (max-width: 1000px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    gap: 12px;
  }
}
</style>