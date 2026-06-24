import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  useMockApi,
  type DashboardData,
  type KPI,
  type ActivityItem,
} from '@/composables/useMockApi'

export const useDashboardStore = defineStore('dashboard', () => {
  const api = useMockApi()

  const kpis = ref<KPI[]>([])
  const activity = ref<ActivityItem[]>([])
  const chart = ref<number[]>([])

  const isLoading = ref(false)
  const isActivityLoading = ref(false)

  const error = ref<string | null>(null)

  const hasLoaded = ref(false)

  const isEmpty = computed(() => {
    return hasLoaded.value && kpis.value.length === 0
  })

  const loadDashboard = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const data: DashboardData = await api.fetchDashboard()

      kpis.value = data.kpis
      chart.value = data.chart

      hasLoaded.value = true

      loadActivity()
    } catch {
      error.value = 'Failed to load dashboard'
    } finally {
      isLoading.value = false
    }
  }

  const loadActivity = async () => {
    isActivityLoading.value = true

    try {
      activity.value = await api.fetchRecentActivity()
    } catch {
      activity.value = []
    } finally {
      isActivityLoading.value = false
    }
  }

  const refresh = async () => {
    await loadDashboard()
  }

  const reset = () => {
    kpis.value = []
    activity.value = []
    chart.value = []

    error.value = null

    isLoading.value = false
    isActivityLoading.value = false

    hasLoaded.value = false
  }

  return {
    kpis,
    activity,
    chart,

    isLoading,
    isActivityLoading,

    error,
    hasLoaded,
    isEmpty,

    loadDashboard,
    loadActivity,
    refresh,
    reset,
  }
})