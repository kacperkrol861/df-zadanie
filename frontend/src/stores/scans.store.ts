import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMockApi, type ScanItem, type ScanLog, type ScanResultItem } from '@/composables/useMockApi'
import { useScanRunner } from '@/composables/useScanRunner'


export const useScansStore = defineStore('scans', () => {
  const api = useMockApi()

  const scans = ref<ScanItem[]>([])
  const selectedScan = ref<ScanItem | null>(null)

  const runner = useScanRunner()
  const logs = ref<ScanLog[]>([])
  const results = ref<ScanResultItem[]>([])


  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const isLogsLoading = ref(false)
  const isResultsLoading = ref(false)

  const error = ref<string | null>(null)

  const isEmpty = computed(() => {
    return !isLoading.value && scans.value.length === 0
  })


  const fetchScans = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      scans.value = await api.fetchScans()
    } catch {
      error.value = 'Failed to load scans'
    } finally {
      isLoading.value = false
    }
  }

  
  const fetchScan = async (id: string) => {
    isDetailLoading.value = true
    error.value = null

    try {
      selectedScan.value = await api.fetchScanById(id)
    } catch {
      error.value = 'Failed to load scan'
    } finally {
      isDetailLoading.value = false
    }
  }

  const fetchLogs = async (scanId: string) => {
    isLogsLoading.value = true

    try {
      logs.value = await api.fetchScanLogs(scanId)
    } catch {
      logs.value = []
    } finally {
      isLogsLoading.value = false
    }
  }

  const fetchResults = async (scanId: string) => {
    isResultsLoading.value = true

    try {
      results.value = await api.fetchScanResults(scanId)
    } catch {
      results.value = []
    } finally {
      isResultsLoading.value = false
    }
  }

  
const updateScanInList = (scan: ScanItem) => {
  const index = scans.value.findIndex(s => s.id === scan.id)

  if (index !== -1) {
    scans.value[index] = scan
  }
}

const runScan = async () => {
  if (!selectedScan.value) return

  await runner.run({
    scan: selectedScan.value,

    onProgress: (updated) => {
      selectedScan.value = updated
      updateScanInList(updated)
    },

    onLog: (log) => {
      logs.value.unshift(log)
    },

    onFinish: (scan, resultsData) => {
      selectedScan.value = scan
      updateScanInList(scan)
      results.value = resultsData
    },
  })
}
  
  const resetSelected = () => {
    selectedScan.value = null
    logs.value = []
    results.value = []
  }

  const reset = () => {
    scans.value = []
    selectedScan.value = null
    logs.value = []
    results.value = []

    isLoading.value = false
    isDetailLoading.value = false
    isLogsLoading.value = false
    isResultsLoading.value = false

    error.value = null
  }

  return {
    
    scans,
    selectedScan,
    logs,
    results,

    
    isLoading,
    isDetailLoading,
    isLogsLoading,
    isResultsLoading,
    error,
    isEmpty,

   
    fetchScans,
    fetchScan,
    fetchLogs,
    fetchResults,
    runScan,

    resetSelected,
    reset,
  }
})