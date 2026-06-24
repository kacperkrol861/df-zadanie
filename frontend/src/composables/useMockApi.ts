export type SourceType = 'cloud' | 'db' | 'api'

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

    while (progress < 100) {
      await delay(200)
      progress += 8
      if (progress > 100) progress = 100
      onProgress(progress)
    }

    return { status: 'done' as const }
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
    runScan,
    fetchDashboard,
    fetchRecentActivity,
  }
}