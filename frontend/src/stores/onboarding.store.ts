import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMockApi } from '@/composables/useMockApi'

export type SourceStatus =
  | 'idle'
  | 'connecting'
  | 'saving'
  | 'connected'
  | 'error'

export type ScanStatus = 'idle' | 'running' | 'done'
export type SourceType = 'cloud' | 'db' | 'api'

export const useOnboardingStore = defineStore('onboarding', () => {
  const api = useMockApi()

  const step = ref(0)

  const sourceType = ref<SourceType | null>(null)
  const sourceStatus = ref<SourceStatus>('idle')

  const scope = ref<'all' | 'recent' | 'custom'>('all')

  const progress = ref(0)
  const scanStatus = ref<ScanStatus>('idle')

  const customRange = ref<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  })

  const next = () => step.value++
  const prev = () => step.value--

  const selectSource = (type: SourceType) => {
    sourceType.value = type
  }

  const connectSource = async () => {
    if (!sourceType.value) return

    sourceStatus.value = 'connecting'
    sourceStatus.value = 'saving'

    const res = await api.connectSource(sourceType.value)
    sourceStatus.value = res.status as SourceStatus
  }

  const startScan = async () => {
    progress.value = 0
    scanStatus.value = 'running'

    await api.runScan((v) => {
      progress.value = v
    })

    scanStatus.value = 'done'
  }

  const setScope = (value: 'all' | 'recent' | 'custom') => {
    scope.value = value
  }

  const setCustomRange = (from: string, to: string) => {
    customRange.value = { from, to }
  }

  return {
    step,

    sourceType,
    sourceStatus,

    scope,
    customRange,

    progress,
    scanStatus,

    next,
    prev,

    selectSource,
    connectSource,
    startScan,
    setScope,
    setCustomRange,
  }
})