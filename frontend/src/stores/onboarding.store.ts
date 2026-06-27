import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMockApi } from '@/composables/useMockApi'

export type SourceStatus = 'idle' | 'connecting' | 'connected' | 'error'

export type ScanStatus =
  | 'idle'
  | 'initializing'
  | 'running'
  | 'completed'
  | 'failed'

export type SourceType = 'cloud' | 'db' | 'api'

export const useOnboardingStore = defineStore('onboarding', () => {
  const api = useMockApi()

  const steps = ['welcome', 'source', 'scope', 'summary', 'scan'] as const
  const step = ref(0)

  const sourceType = ref<SourceType | null>(null)
  const sourceStatus = ref<SourceStatus>('idle')

  const scope = ref<'all' | 'recent' | 'custom'>('all')
  const customRange = ref<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  })

  const scan = ref({
    status: 'idle' as ScanStatus,
    progress: 0,
  })

  const currentStep = computed(() => steps[step.value])
  const isLastStep = computed(() => step.value === steps.length - 1)

  const canGoNext = computed(() => {
    if (currentStep.value === 'source') {
      return sourceStatus.value === 'connected'
    }

    if (currentStep.value === 'summary') {
      return sourceType.value !== null && scope.value !== null
    }

    return true
  })

  const goTo = (index: number) => {
    if (index >= 0 && index < steps.length) {
      step.value = index
    }
  }

  const next = () => {
    if (!canGoNext.value) return
    goTo(step.value + 1)
  }

  const prev = () => {
    goTo(step.value - 1)
  }

  const selectSource = (t: SourceType) => {
    sourceType.value = t
  }

  const connectSource = async () => {
    if (!sourceType.value) return

    sourceStatus.value = 'connecting'

    try {
      const res = await api.connectSource(sourceType.value)
      sourceStatus.value = res.status === 'connected' ? 'connected' : 'error'
    } catch {
      sourceStatus.value = 'error'
    }
  }

  const startScan = async () => {
    if (scan.value.status !== 'idle') return

    scan.value.status = 'initializing'
    scan.value.progress = 0

    await new Promise((r) => setTimeout(r, 900))

    scan.value.status = 'running'

    try {
      await api.runScan((v: number) => {
        scan.value.progress = v
      })

      scan.value.progress = 100
      scan.value.status = 'completed'
    } catch {
      scan.value.status = 'failed'
    }
  }

  const resetScan = () => {
    scan.value.status = 'idle'
    scan.value.progress = 0
  }

  const setScope = (v: 'all' | 'recent' | 'custom') => {
    scope.value = v
  }

  const setCustomRange = (from: string, to: string) => {
    customRange.value = { from, to }
  }

  return {
    steps,
    step,
    currentStep,

    sourceType,
    sourceStatus,

    scope,
    customRange,

    scan,

    isLastStep,

    canGoNext,
    next,
    prev,
    goTo,

    selectSource,
    connectSource,
    startScan,
    resetScan,
    setScope,
    setCustomRange,
  }
})