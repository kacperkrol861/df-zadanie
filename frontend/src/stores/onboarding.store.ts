import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMockApi } from '@/composables/useMockApi'

export type SourceStatus = 'idle' | 'connecting' | 'connected' | 'error'
export type ScanStatus = 'idle' | 'running' | 'done'
export type SourceType = 'cloud' | 'db' | 'api'

export type StepState = 'done' | 'active' | 'locked'

export const useOnboardingStore = defineStore('onboarding', () => {
  const api = useMockApi()

  const steps = [
    'welcome',
    'source',
    'scope',
    'scan',
    'results',
  ] as const

  const step = ref(0)

  const currentStep = computed(() => steps[step.value])

  const isFirstStep = computed(() => step.value === 0)
  const isLastStep = computed(() => step.value === steps.length - 1)

  const progress = computed(() =>
    steps.length <= 1 ? 0 : (step.value / (steps.length - 1)) * 100
  )

  const stepStatus = computed<StepState[]>(() => {
    return steps.map((_, index) => {
      if (index < step.value) return 'done'
      if (index === step.value) return 'active'
      return 'locked'
    })
  })

  const stepList = computed(() =>
    steps.map((name, index) => ({
      name,
      index,
      status: stepStatus.value[index],
      isActive: index === step.value,
      isDone: index < step.value,
      isLocked: index > step.value,
    }))
  )

const canGoNext = computed(() => {
  if (currentStep.value === 'source') return sourceStatus.value === 'connected'
  return true
})

  const canGoPrev = computed(() => false)

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

  const next = async () => {
    if (!canGoNext.value) return
    if (step.value < steps.length - 1) step.value++
  }

  const setStep = (index: number) => {
    return
  }

  const reset = () => {
    step.value = 0
    sourceType.value = null
    sourceStatus.value = 'idle'
    scope.value = 'all'
    customRange.value = { from: null, to: null }
    scan.value = { status: 'idle', progress: 0 }
  }

  const selectSource = (type: SourceType) => {
    sourceType.value = type
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
    scan.value.status = 'running'
    scan.value.progress = 0

    try {
      await api.runScan((v) => {
        scan.value.progress = v
      })

      scan.value.status = 'done'
      scan.value.progress = 100
    } catch {
      scan.value.status = 'idle'
      scan.value.progress = 0
    }
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
    progress,
    isFirstStep,
    isLastStep,

    stepStatus,
    stepList,

    sourceType,
    sourceStatus,

    scope,
    customRange,

    scan,

    next,
    canGoNext,
    canGoPrev,

    reset,

    selectSource,
    connectSource,
    startScan,

    setScope,
    setCustomRange,
  }
})