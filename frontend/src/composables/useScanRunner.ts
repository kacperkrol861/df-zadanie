import { ref } from 'vue'
import type { ScanItem, ScanLog, ScanResultItem } from '@/composables/useMockApi'

export const useScanRunner = () => {
  const isRunning = ref(false)

  const run = async (params: {
    scan: ScanItem
    onProgress: (scan: ScanItem) => void
    onLog: (log: ScanLog) => void
    onFinish: (scan: ScanItem, results: ScanResultItem[]) => void
  }) => {
    const { scan, onProgress, onLog, onFinish } = params

    isRunning.value = true

    let progress = scan.progress

    const sleep = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms))

    const pushLog = (message: string) => {
      onLog({
        id: crypto.randomUUID(),
        scanId: scan.id,
        message,
        timestamp: Date.now(),
      })
    }

    pushLog('Scan initialized')
    await sleep(600)

    pushLog('Connecting to source...')
    await sleep(700)

    const steps = [
      'Fetching metadata...',
      'Analyzing structure...',
      'Processing records...',
      'Detecting anomalies...',
      'Finalizing results...',
    ]

    for (const step of steps) {
      pushLog(step)

      for (let i = 0; i < 12; i++) {
        progress += 2

        onProgress({
          ...scan,
          status: 'running',
          progress: Math.min(progress, 95),
        })

        await sleep(120)
      }
    }

    pushLog('Generating results...')

    await sleep(800)

    const finishedScan: ScanItem = {
      ...scan,
      status: 'completed',
      progress: 100,
    }

    const results: ScanResultItem[] = [
      { id: 'r1', scanId: scan.id, category: 'Revenue anomalies', value: 14 },
      { id: 'r2', scanId: scan.id, category: 'Missing records', value: 6 },
      { id: 'r3', scanId: scan.id, category: 'Duplicates', value: 11 },
      { id: 'r4', scanId: scan.id, category: 'Schema drift', value: 3 },
    ]

    pushLog('Scan completed')

    onFinish(finishedScan, results)

    isRunning.value = false
  }

  return {
    isRunning,
    run,
  }
}