import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  useMockApi,
  type ReportItem,
} from '@/composables/useMockApi'

export const useReportsStore = defineStore('reports', () => {
  const api = useMockApi()

  const reports = ref<ReportItem[]>([])
  const selectedReport = ref<ReportItem | null>(null)

  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const isGenerating = ref(false)

  const error = ref<string | null>(null)

  const isEmpty = computed(() =>
    !isLoading.value && reports.value.length === 0
  )


  const fetchReports = async () => {
    isLoading.value = true
    error.value = null

    try {
      reports.value = await api.fetchReports()
    } finally {
      isLoading.value = false
    }
  }


  const fetchReportById = async (id: string) => {
    isDetailLoading.value = true
    error.value = null

    try {
      const report = await api.fetchReportById(id)
      selectedReport.value = report
      return report
    } finally {
      isDetailLoading.value = false
    }
  }


  const generateReport = async (scanId: string) => {
    isGenerating.value = true
    error.value = null

    try {
      const newReport = await api.generateReport(scanId)

      
      reports.value.unshift(newReport)
      selectedReport.value = newReport

      
      pollReport(newReport.id)

      return newReport
    } catch (e) {
      error.value = 'Failed to generate report'
      throw e
    } finally {
      isGenerating.value = false
    }
  }


  const pollReport = async (id: string) => {
    let tries = 0

    const interval = setInterval(async () => {
      tries++

      const updated = await api.fetchReportById(id)

      
      const idx = reports.value.findIndex(r => r.id === id)
      if (idx !== -1) reports.value[idx] = updated

     
      if (selectedReport.value?.id === id) {
        selectedReport.value = updated
      }

     
      if (updated.status === 'ready' || updated.status === 'failed' || tries > 20) {
        clearInterval(interval)
      }
    }, 800)
  }


  const getReport = (id: string) =>
    reports.value.find(r => r.id === id)

  const reset = () => {
    reports.value = []
    selectedReport.value = null

    isLoading.value = false
    isDetailLoading.value = false
    isGenerating.value = false

    error.value = null
  }

  return {
    reports,
    selectedReport,

    isLoading,
    isDetailLoading,
    isGenerating,
    error,
    isEmpty,

    fetchReports,
    fetchReportById,
    generateReport,

    getReport,
    reset,
  }
})