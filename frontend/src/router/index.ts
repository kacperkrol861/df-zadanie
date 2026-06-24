import { createRouter, createWebHistory } from 'vue-router'

import OnboardingView from '@/views/OnboardingView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

import DashboardView from '@/views/DashboardView.vue'
import ScansView from '@/views/ScansView.vue'
import ReportsView from '@/views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/onboarding',
    },

    {
      path: '/onboarding',
      component: OnboardingView,
    },

    {
      path: '/',
      component: AppLayout,
      children: [
        { path: 'dashboard', component: DashboardView },
        { path: 'scans', component: ScansView },
        { path: 'reports', component: ReportsView },
      ],
    },
  ],
})

export default router