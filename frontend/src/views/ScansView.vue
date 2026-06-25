<template>
  <div class="scans">

    <div class="header">
      <h1 class="title">Scans</h1>

      <va-button
        size="small"
        preset="primary"
        @click="store.fetchScans"
        :loading="store.isLoading"
      >
        Refresh
      </va-button>
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
        v-for="scan in sortedScans"
        :key="scan.id"
        class="card"
      >

        <div class="top">

          <div>
            <div class="name">{{ scan.name }}</div>

            <div class="meta">
              {{ formatSource(scan.sourceType) }} • {{ formatDate(scan.createdAt) }}
            </div>
          </div>

          <va-badge
            :text="scan.status"
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

        <div class="footer">

          <va-button
            size="small"
            preset="secondary"
            @click="goTo(scan.id)"
          >
            View
          </va-button>

        </div>

      </va-card>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScansStore } from '@/stores/scans.store'
import type { ScanStatus, SourceType } from '@/composables/useMockApi'

const store = useScansStore()
const router = useRouter()

onMounted(() => {
  if (!store.scans.length) {
    store.fetchScans()
  }
})

const sortedScans = computed(() => {
  return [...store.scans].sort((a, b) => {
    if (a.status === 'running' && b.status !== 'running') return -1
    if (a.status !== 'running' && b.status === 'running') return 1
    return b.createdAt - a.createdAt
  })
})

const goTo = (id: string) => {
  router.push(`/scans/${id}`)
}

const statusColor = (status: ScanStatus) => {
  switch (status) {
    case 'running':
      return 'primary'
    case 'completed':
      return 'success'
    case 'queued':
      return 'warning'
    case 'failed':
      return 'danger'
    default:
      return 'secondary'
  }
}

const formatSource = (source: SourceType) => {
  switch (source) {
    case 'cloud':
      return 'Cloud'
    case 'db':
      return 'Database'
    case 'api':
      return 'API'
  }
}

const formatDate = (ts: number) => {
  return new Date(ts).toLocaleString()
}
</script>