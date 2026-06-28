<template>
  <div class="report-detail">

    <div class="topbar">
      <va-button preset="secondary" size="small" @click="router.push('/reports')">
        <Icon icon="mdi:arrow-left" class="mr-1" />
        Back
      </va-button>

      <va-button
        preset="primary"
        size="small"
        :loading="store.isGenerating"
        @click="regenerate"
      >
        <Icon icon="mdi:file-refresh-outline" class="mr-1" />
        Regenerate
      </va-button>
    </div>

    <va-card v-if="store.isDetailLoading" class="loading">
      <va-skeleton height="28px" />
      <va-skeleton height="16px" class="mt" />
      <va-skeleton height="120px" class="mt" />
    </va-card>

    <template v-else-if="report">

      <va-card class="header-card">
        <div class="header">
          <div>
            <h1 class="title">
              <Icon icon="mdi:file-document-outline" />
              {{ report.title }}
            </h1>

            <div class="meta">
              <Icon icon="mdi:calendar-outline" class="meta-icon" />
              {{ formatDate(report.createdAt) }}
            </div>
          </div>

          <va-chip :color="statusColor(report.status)" size="small">
            {{ formatStatus(report.status) }}
          </va-chip>
        </div>

        <p class="summary">
          {{ report.summary }}
        </p>
      </va-card>

      
      <section class="analytics">

        <div class="stats">
          <div class="stat">
            <div class="label">Issues</div>
            <div class="value">{{ mockStats.issues }}</div>
          </div>

          <div class="stat">
            <div class="label">Anomalies</div>
            <div class="value">{{ mockStats.anomalies }}</div>
          </div>

          <div class="stat">
            <div class="label">Data quality</div>
            <div class="value">{{ mockStats.quality }}%</div>
          </div>

          <div class="stat">
            <div class="label">Processing time</div>
            <div class="value">{{ mockStats.time }}s</div>
          </div>
        </div>

        <va-card class="chart-card">
          <div class="chart-title">
            <Icon icon="mdi:chart-line" />
            Scan activity trend
          </div>

          <svg viewBox="0 0 300 120" class="chart">
            <polyline
              :points="chartPoints"
              fill="none"
              stroke="var(--va-primary)"
              stroke-width="2"
            />
          </svg>
        </va-card>

      </section>

      <div class="grid">

        <va-card class="panel">
          <div class="panel-title">
            <Icon icon="mdi:text-box-outline" />
            Overview
          </div>

          <div class="content">
            This report summarizes scan results from <b>{{ report.scanId }}</b>.
            It highlights anomalies, inconsistencies and structural issues detected during analysis.
          </div>
        </va-card>

        <va-card class="panel">
          <div class="panel-title">
            <Icon icon="mdi:format-list-bulleted" />
            Sections
          </div>

          <div v-if="report.sections.length === 0" class="empty">
            No sections generated yet.
          </div>

          <div v-else class="sections">
            <div
              v-for="s in report.sections"
              :key="s.id"
              class="section"
            >
              <div class="section-title">{{ s.title }}</div>
              <div class="section-content">{{ s.content }}</div>
            </div>
          </div>
        </va-card>

        <va-card class="panel">
          <div class="panel-title">
            <Icon icon="mdi:chart-box-outline" />
            Details
          </div>

          <div class="status-box">
            <div class="row"><span>ID</span><b>{{ report.id }}</b></div>
            <div class="row"><span>Scan</span><b>{{ report.scanId }}</b></div>
            <div class="row"><span>Source</span><b>{{ report.source }}</b></div>
            <div class="row"><span>Status</span><b>{{ formatStatus(report.status) }}</b></div>
            <div class="row"><span>Created</span><b>{{ formatDate(report.createdAt) }}</b></div>
          </div>
        </va-card>

      </div>

    </template>

    <va-card v-else class="empty-state">
      <Icon icon="mdi:file-remove-outline" width="28" />
      Report not found
    </va-card>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReportsStore } from '@/stores/reports.store'
import { Icon } from '@iconify/vue'

const store = useReportsStore()
const router = useRouter()
const route = useRoute()

const id = route.params.id as string

onMounted(async () => {
  await store.fetchReportById(id)
})

const report = computed(() => store.selectedReport)

const regenerate = async () => {
  if (!report.value) return
  const newReport = await store.generateReport(report.value.scanId)
  await store.fetchReportById(newReport.id)
}

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString()

const formatStatus = (status: string) => {
  switch (status) {
    case 'ready': return 'Ready'
    case 'generating': return 'Generating'
    case 'draft': return 'Draft'
    default: return status
  }
}

const statusColor = (status: string) => {
  switch (status) {
    case 'ready': return 'success'
    case 'generating': return 'warning'
    case 'draft': return 'secondary'
    default: return 'primary'
  }
}

const mockStats = {
  issues: 24,
  anomalies: 7,
  quality: 86,
  time: 3.4,
}

const chartData = [
  10, 18, 9, 22, 14, 8, 16
]

const chartPoints = computed(() => {
  const max = Math.max(...chartData)
  return chartData
    .map((v, i) => {
      const x = (i / (chartData.length - 1)) * 300
      const y = 120 - (v / max) * 100
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<style scoped>
.report-detail {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-card,
.panel,
.loading,
.empty-state,
.chart-card {
  padding: var(--va-gap-large);
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
}

.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: var(--va-text-secondary);
  font-size: 12px;
}

.summary {
  margin-top: var(--va-gap-medium);
  color: var(--va-text-secondary);
  line-height: 1.7;
}

.analytics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat {
  padding: 12px;
  border: 1px solid var(--va-background-border);
  border-radius: 10px;
}

.label {
  font-size: 11px;
  color: var(--va-text-secondary);
}

.value {
  font-size: 18px;
  font-weight: 700;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 12px;
}

.chart {
  width: 100%;
  height: 120px;
}

.grid {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: var(--va-gap-medium);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: var(--va-gap-medium);
}

.content {
  color: var(--va-text-secondary);
  line-height: 1.7;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--va-background-border);
}

.section-title {
  font-weight: 600;
}

.section-content {
  color: var(--va-text-secondary);
  font-size: 12px;
  margin-top: 4px;
}

.status-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.empty,
.empty-state {
  text-align: center;
  color: var(--va-text-secondary);
}

.loading {
  min-height: 200px;
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .header {
    flex-direction: column;
    gap: 12px;
  }
}
</style>