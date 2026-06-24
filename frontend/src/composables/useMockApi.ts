import type { SourceType } from '@/stores/onboarding.store'

export const useMockApi = () => {
  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const connectSource = async (type: SourceType) => {
    await delay(1200)
    await delay(900)

    const ok = Math.random() > 0.2

    return {
      status: ok ? 'connected' : 'error',
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

    return { status: 'done' }
  }

  return {
    connectSource,
    runScan,
  }
}