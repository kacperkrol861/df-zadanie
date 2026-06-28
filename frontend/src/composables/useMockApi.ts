export type SourceType = 'cloud' | 'db' | 'api'

export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed'

export interface KPI {
  label: string
  value: number | string
  trend?: number
}

export interface ActivityItem {
  id: string
  title: string
  type: string
  timestamp: number
}

export interface ScanItem {
  id: string
  name: string
  sourceType: SourceType
  status: ScanStatus
  progress: number
  createdAt: number
}

export interface ScanLog {
  id: string
  scanId: string
  message: string
  timestamp: number
}

export interface ScanResultItem {
  id: string
  scanId: string
  category: string
  value: number
}

export interface DashboardData {
  kpis: KPI[]
  activity: ActivityItem[]
  chart: number[]
}

export const useMockApi = () => {
  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const connectSource = async (type: SourceType) => {
    await delay(1200)
    await delay(900)

    const ok = Math.random() > 0.2

    return {
      status: ok ? 'connected' : 'error',
      type,
    }
  }

  
  const runScan = async (onProgress: (v: number) => void) => {
    let progress = 0

    const steps = [
      'Initializing scan engine...',
      'Connecting to source...',
      'Loading schema...',
      'Indexing data...',
      'Running anomaly detection...',
      'Validating results...',
      'Finalizing report...',
    ]

    for (const step of steps) {
      await delay(300)

      progress += Math.floor(Math.random() * 15) + 5
      if (progress > 100) progress = 100

      onProgress(progress)
    }

    while (progress < 100) {
      await delay(120)
      progress += 7
      if (progress > 100) progress = 100

      onProgress(progress)
    }

    return { status: 'completed' as const }
  }

  const fetchScans = async (): Promise<ScanItem[]> => {
    await delay(800)

    return [
      {
        id: 'scan_1',
        name: 'Finance dataset scan',
        sourceType: 'cloud',
        status: 'completed',
        progress: 100,
        createdAt: Date.now() - 1000 * 60 * 60 * 5,
      },
      {
        id: 'scan_2',
        name: 'CRM database scan',
        sourceType: 'db',
        status: 'running',
        progress: 66,
        createdAt: Date.now() - 1000 * 60 * 25,
      },
      {
        id: 'scan_3',
        name: 'API ingestion scan',
        sourceType: 'api',
        status: 'queued',
        progress: 0,
        createdAt: Date.now() - 1000 * 60 * 10,
      },
    ]
  }

  const fetchScanById = async (id: string): Promise<ScanItem> => {
    await delay(500)

    const map: Record<string, ScanItem> = {
      scan_1: {
        id,
        name: 'Finance dataset scan',
        sourceType: 'cloud',
        status: 'completed',
        progress: 100,
        createdAt: Date.now() - 1000 * 60 * 60 * 6,
      },

      scan_2: {
        id,
        name: 'CRM database scan',
        sourceType: 'db',
        status: 'running',
        progress: 68,
        createdAt: Date.now() - 1000 * 60 * 40,
      },

      scan_3: {
        id,
        name: 'API ingestion scan',
        sourceType: 'api',
        status: 'queued',
        progress: 0,
        createdAt: Date.now() - 1000 * 60 * 15,
      },
    }

    return map[id] ?? map.scan_1
  }

  const createScan = async (input: { name: string; sourceType: SourceType }) => {
    await delay(700)

    return {
      id: crypto.randomUUID(),
      name: input.name,
      sourceType: input.sourceType,
      status: 'queued' as ScanStatus,
      progress: 0,
      createdAt: Date.now(),
    }
  }

  const deleteScan = async (id: string) => {
    await delay(500)
    return { success: true, id }
  }


  const fetchScanLogs = async (scanId: string): Promise<ScanLog[]> => {
    await delay(600)

    const base: Record<string, ScanLog[]> = {
      scan_1: [
        {
          id: 'l1',
          scanId,
          message: 'Scan completed successfully',
          timestamp: Date.now() - 1000 * 60 * 60,
        },
        {
          id: 'l2',
          scanId,
          message: 'All validations passed',
          timestamp: Date.now() - 1000 * 60 * 90,
        },
      ],

      scan_2: [
        {
          id: 'l3',
          scanId,
          message: 'Connecting to source...',
          timestamp: Date.now() - 1000 * 60 * 5,
        },
        {
          id: 'l4',
          scanId,
          message: 'Indexing data...',
          timestamp: Date.now() - 1000 * 60 * 3,
        },
        {
          id: 'l5',
          scanId,
          message: 'Running anomaly detection...',
          timestamp: Date.now() - 1000 * 60 * 1,
        },
      ],

      scan_3: [
        {
          id: 'l6',
          scanId,
          message: 'Scan queued in job system',
          timestamp: Date.now() - 1000 * 60 * 2,
        },
      ],
    }

    return base[scanId] ?? []
  }


  const fetchScanResults = async (scanId: string): Promise<ScanResultItem[]> => {
    await delay(800)

    const base: Record<string, ScanResultItem[]> = {
      scan_1: [
        { id: 'r1', scanId, category: 'Revenue anomalies', value: 14 },
        { id: 'r2', scanId, category: 'Duplicates', value: 6 },
        { id: 'r3', scanId, category: 'Schema drift', value: 3 },
        { id: 'r4', scanId, category: 'Missing records', value: 8 },
      ],

      scan_2: [
        { id: 'r5', scanId, category: 'Latency spikes', value: 9 },
        { id: 'r6', scanId, category: 'Partial joins', value: 5 },
      ],

      scan_3: [],
    }

    return base[scanId] ?? []
  }


  const fetchRunningPreview = async (scanId: string): Promise<ScanResultItem[]> => {
    await delay(300)

    return [
      { id: 'p1', scanId, category: 'Early anomalies', value: 4 },
      { id: 'p2', scanId, category: 'Schema warnings', value: 2 },
    ]
  }

  const fetchDashboard = async (): Promise<DashboardData> => {
    await delay(900)

    return {
      kpis: [
        { label: 'Scans', value: 128, trend: 12 },
        { label: 'Errors', value: 3, trend: -2 },
        { label: 'Sources', value: 4 },
      ],
      activity: [],
      chart: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    }
  }

  const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
    await delay(1200)

    return [
      {
        id: crypto.randomUUID(),
        title: 'Cloud Drive connected',
        type: 'source_connected',
        timestamp: Date.now() - 1000 * 60 * 8,
      },
      {
        id: crypto.randomUUID(),
        title: 'Scan completed',
        type: 'scan_completed',
        timestamp: Date.now() - 1000 * 60 * 18,
      },
    ]
  }

  return {
    connectSource,
    runScan,
    fetchScans,
    fetchScanById,
    fetchScanLogs,
    fetchScanResults,
    fetchRunningPreview,
    fetchDashboard,
    fetchRecentActivity,
  }
}