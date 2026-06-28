import { createRouter, createWebHistory } from 'vue-router'

import OnboardingView from '@/views/OnboardingView.vue'

import AppLayout from '@/components/layout/AppLayout.vue'

import DashboardView from '@/views/DashboardView.vue'
import ScansView from '@/views/ScansView.vue'
import ScanDetail from '@/views/ScanDetail.vue'
import ReportsView from '@/views/ReportsView.vue'
import ReportDetail from '@/views/ReportsDetail.vue'

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
        {
          path: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'scans',
          component: ScansView,
        },
        {
          path: 'scans/:id',
          component: ScanDetail,
        },
        {
          path: 'reports',
          component: ReportsView,
        },
        {
          path: 'reports/:id',
          component: ReportDetail,
        },
      ],
    },
  ],
})

export default router