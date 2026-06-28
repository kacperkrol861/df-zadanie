import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  useMockApi,
  type ScanItem,
  type ScanLog,
  type ScanResultItem,
} from '@/composables/useMockApi'

export const useScansStore = defineStore('scans', () => {
  const api = useMockApi()

  const scans = ref<ScanItem[]>([])
  const selectedScan = ref<ScanItem | null>(null)

  const logsByScan = ref<Record<string, ScanLog[]>>({})
  const resultsByScan = ref<Record<string, ScanResultItem[]>>({})
  const previewResultsByScan = ref<Record<string, ScanResultItem[]>>({})

  const runningScanId = ref<string | null>(null)

  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() =>
    !isLoading.value && scans.value.length === 0
  )

  // -------------------------
  // HELPERS
  // -------------------------
  const ensureArrays = (id: string) => {
    if (!logsByScan.value[id]) logsByScan.value[id] = []
    if (!resultsByScan.value[id]) resultsByScan.value[id] = []
    if (!previewResultsByScan.value[id]) previewResultsByScan.value[id] = []
  }

  const pushLog = (scanId: string, message: string) => {
    ensureArrays(scanId)

    logsByScan.value[scanId].push({
      id: crypto.randomUUID(),
      scanId,
      message,
      timestamp: Date.now(),
    })
  }

  const updateScan = (scan: ScanItem) => {
    const idx = scans.value.findIndex(s => s.id === scan.id)

    if (idx !== -1) scans.value[idx] = { ...scan }
    else scans.value.unshift({ ...scan })

    if (selectedScan.value?.id === scan.id) {
      selectedScan.value = { ...scan }
    }
  }

  // -------------------------
  // LIST
  // -------------------------
  const fetchScans = async () => {
    isLoading.value = true
    try {
      scans.value = await api.fetchScans()
    } finally {
      isLoading.value = false
    }
  }

  // -------------------------
  // DETAIL (SMART HYDRATION)
  // -------------------------
  const fetchScan = async (id: string) => {
    isDetailLoading.value = true

    try {
      const scan = await api.fetchScanById(id)
      selectedScan.value = scan

      ensureArrays(id)

      // 🔥 HYDRATION RULES (KLUCZ UX)
      if (scan.status === 'queued') {
        logsByScan.value[id] = await api.fetchScanLogs(id)
        resultsByScan.value[id] = []
        previewResultsByScan.value[id] = []
      }

      if (scan.status === 'running') {
        logsByScan.value[id] = await api.fetchScanLogs(id)
        resultsByScan.value[id] = []
        previewResultsByScan.value[id] = await api.fetchRunningPreview(id)
      }

      if (scan.status === 'completed') {
        logsByScan.value[id] = await api.fetchScanLogs(id)
        resultsByScan.value[id] = await api.fetchScanResults(id)
        previewResultsByScan.value[id] = []
      }

      if (scan.status === 'failed') {
        logsByScan.value[id] = await api.fetchScanLogs(id)
        resultsByScan.value[id] = []
        previewResultsByScan.value[id] = []
      }
    } finally {
      isDetailLoading.value = false
    }
  }

  // -------------------------
  // RUN SCAN (LIVE ENGINE)
  // -------------------------
  const runScan = async (scanId: string) => {
    const base = scans.value.find(s => s.id === scanId)
    if (!base || runningScanId.value) return

    runningScanId.value = scanId

    ensureArrays(scanId)
    logsByScan.value[scanId] = []
    resultsByScan.value[scanId] = []
    previewResultsByScan.value[scanId] = []

    try {
      let progress = 0

      let liveScan: ScanItem = {
        ...base,
        status: 'running',
        progress: 0,
      }

      updateScan(liveScan)

      const steps = [
        'Initializing scan engine...',
        'Connecting to source...',
        'Loading schema...',
        'Indexing data...',
        'Running anomaly detection...',
        'Validating results...',
      ]

      for (const step of steps) {
        pushLog(scanId, step)

        await sleep(300)

        progress += Math.random() * 12

        liveScan = {
          ...liveScan,
          progress: Math.min(Math.round(progress), 90),
        }

        updateScan(liveScan)

        previewResultsByScan.value[scanId] = await api.fetchRunningPreview(scanId)
      }

      pushLog(scanId, 'Finalizing report...')

      await sleep(500)

      const finalResults = await api.fetchScanResults(scanId)

      resultsByScan.value[scanId] = finalResults
      previewResultsByScan.value[scanId] = []

      pushLog(scanId, 'Scan completed')

      updateScan({
        ...liveScan,
        status: 'completed',
        progress: 100,
      })
    } catch (e) {
      pushLog(scanId, 'Scan failed')

      updateScan({
        ...base,
        status: 'failed',
      })
    } finally {
      runningScanId.value = null
    }
  }

  // -------------------------
  // GETTERS
  // -------------------------
  const getLogs = (id: string) => logsByScan.value[id] ?? []
  const getResults = (id: string) => resultsByScan.value[id] ?? []
  const getPreviewResults = (id: string) => previewResultsByScan.value[id] ?? []

  const isScanRunning = (id: string) => runningScanId.value === id

  const reset = () => {
    scans.value = []
    selectedScan.value = null

    logsByScan.value = {}
    resultsByScan.value = {}
    previewResultsByScan.value = {}

    runningScanId.value = null

    isLoading.value = false
    isDetailLoading.value = false
    error.value = null
  }

  return {
    scans,
    selectedScan,

    isLoading,
    isDetailLoading,
    error,
    isEmpty,

    fetchScans,
    fetchScan,
    runScan,

    getLogs,
    getResults,
    getPreviewResults,
    isScanRunning,
    
    reset,
  }
})

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))