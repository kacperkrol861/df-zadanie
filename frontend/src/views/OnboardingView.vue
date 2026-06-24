<template>
  <div class="onboarding">

    <component :is="steps[store.step]" />

  </div>
</template>

<script setup lang="ts">
import { useOnboardingStore } from '@/stores/onboarding.store'

import OnboardingStepWelcome from '@/components/onboarding/OnboardingStepWelcome.vue'
import OnboardingStepSource from '@/components/onboarding/OnboardingStepSource.vue'
import OnboardingStepScope from '@/components/onboarding/OnboardingStepScope.vue'
import OnboardingStepSummary from '@/components/onboarding/OnboardingStepSummary.vue'
import OnboardingStepProgress from '@/components/onboarding/OnboardingStepProgress.vue'

const store = useOnboardingStore()

const steps = [
  OnboardingStepWelcome,
  OnboardingStepSource,
  OnboardingStepScope,
  OnboardingStepSummary,
  OnboardingStepProgress,
]
</script>