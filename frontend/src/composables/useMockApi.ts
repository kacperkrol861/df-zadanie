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

  
  // SOURCES
  

  const connectSource = async (type: SourceType) => {
    await delay(1200)
    await delay(900)

    const ok = Math.random() > 0.2

    return {
      status: ok ? 'connected' : 'error',
      type,
    }
  }

  
  // SCANS
  

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
        progress: 62,
        createdAt: Date.now() - 1000 * 60 * 30,
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
    await delay(600)

    return {
      id,
      name: 'Finance dataset scan',
      sourceType: 'cloud',
      status: 'running',
      progress: 68,
      createdAt: Date.now() - 1000 * 60 * 40,
    }
  }

  const createScan = async (input: {
    name: string
    sourceType: SourceType
  }): Promise<ScanItem> => {
    await delay(800)

    return {
      id: crypto.randomUUID(),
      name: input.name,
      sourceType: input.sourceType,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
    }
  }

  const deleteScan = async (id: string) => {
    await delay(500)
    return { success: true, id }
  }

  const runScan = async (onProgress: (v: number) => void) => {
    let progress = 0

    while (progress < 100) {
      await delay(200)
      progress += 8
      if (progress > 100) progress = 100
      onProgress(progress)
    }

    return { status: 'done' as const }
  }

  const updateScanProgress = async (
    onProgress: (v: number) => void
  ) => {
    let progress = 0

    while (progress < 100) {
      await delay(250)
      progress += Math.floor(Math.random() * 12)

      if (progress > 100) progress = 100

      onProgress(progress)
    }

    return { status: 'completed' as const }
  }

  const fetchScanLogs = async (scanId: string): Promise<ScanLog[]> => {
    await delay(900)

    return [
      {
        id: 'l1',
        scanId,
        message: 'Initializing scan engine...',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
      {
        id: 'l2',
        scanId,
        message: 'Fetching source metadata...',
        timestamp: Date.now() - 1000 * 60 * 4,
      },
      {
        id: 'l3',
        scanId,
        message: 'Processing records...',
        timestamp: Date.now() - 1000 * 60 * 2,
      },
    ]
  }

  const fetchScanResults = async (
    scanId: string
  ): Promise<ScanResultItem[]> => {
    await delay(1100)

    return [
      { id: 'r1', scanId, category: 'Revenue anomalies', value: 12 },
      { id: 'r2', scanId, category: 'Missing records', value: 4 },
      { id: 'r3', scanId, category: 'Duplicates', value: 9 },
      { id: 'r4', scanId, category: 'Schema drift', value: 2 },
    ]
  }

  
  // DASHBOARD
 

  const fetchDashboard = async (): Promise<DashboardData> => {
    await delay(900)

    return {
      kpis: [
        { label: 'Scans', value: 128, trend: 12 },
        { label: 'Errors', value: 3, trend: -2 },
        { label: 'Sources', value: 4 },
      ],
      activity: [],
      chart: Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 100)
      ),
    }
  }

  const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
    await delay(1400)

    return [
      {
        id: crypto.randomUUID(),
        title: 'Cloud Drive connected',
        type: 'source_connected',
        timestamp: Date.now() - 1000 * 60 * 8,
      },
      {
        id: crypto.randomUUID(),
        title: 'Scan “Finance dataset” completed',
        type: 'scan_completed',
        timestamp: Date.now() - 1000 * 60 * 18,
      },
      {
        id: crypto.randomUUID(),
        title: 'Report generated',
        type: 'report_generated',
        timestamp: Date.now() - 1000 * 60 * 42,
      },
      {
        id: crypto.randomUUID(),
        title: 'New scan started',
        type: 'scan_started',
        timestamp: Date.now() - 1000 * 60 * 70,
      },
    ]
  }

  return {
    connectSource,

    // scans core
    fetchScans,
    fetchScanById,
    createScan,
    deleteScan,

    // runtime
    runScan,
    updateScanProgress,

    // logs/results
    fetchScanLogs,
    fetchScanResults,

    // dashboard
    fetchDashboard,
    fetchRecentActivity,
  }
}