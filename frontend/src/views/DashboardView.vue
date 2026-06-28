<template>
  <div class="dashboard">

    <h1 class="title">Dashboard</h1>

    <div v-if="store.isLoading">

      <div class="kpi-grid">
        <va-card v-for="n in 3" :key="n" class="kpi">
          <va-skeleton height="14px" />
          <va-skeleton height="32px" />
        </va-card>
      </div>

      <div class="charts">
        <va-card class="chart">
          <va-skeleton height="20px" />
          <va-skeleton height="140px" />
        </va-card>

        <va-card class="chart">
          <va-skeleton height="20px" />
          <va-skeleton height="140px" />
        </va-card>
      </div>

    </div>

    <div v-else-if="store.error" class="state error">
      {{ store.error }}
    </div>

    <div v-else-if="store.isEmpty" class="state">
      No data available
    </div>

    <template v-else>

      <div class="kpi-grid">
        <va-card
          v-for="kpi in store.kpis"
          :key="kpi.label"
          class="kpi"
        >
          <div class="label">{{ kpi.label }}</div>
          <div class="value">{{ kpi.value }}</div>

          <div v-if="kpi.trend !== undefined" class="trend">
            {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
          </div>
        </va-card>
      </div>

      <div class="charts">

        <va-card class="chart">
          <h3 class="section-title">Scan activity</h3>

          <div class="fake-chart">
            <div
              v-for="(value, index) in store.chart"
              :key="index"
              class="bar"
              :style="{ height: value + '%' }"
            />
          </div>
        </va-card>

        <va-card class="chart">
          <h3 class="section-title">Data quality</h3>

          <div class="donut">
            <div class="donut-center">{{ quality }}%</div>
          </div>
        </va-card>

      </div>

      <va-card class="activity">
        <h3 class="section-title">Recent activity</h3>

        <div v-if="store.isActivityLoading" class="activity-loading">
          <va-skeleton height="18px" />
          <va-skeleton height="18px" />
          <va-skeleton height="18px" />
        </div>

        <ul v-else>
          <li v-for="item in store.activity" :key="item.id">
            {{ item.title }}
          </li>
        </ul>

      </va-card>

    </template>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/app.store'

const store = useDashboardStore()

onMounted(() => {
  if (!store.hasLoaded) {
    store.loadDashboard()
  }
})

const quality = computed(() => {
  const sources = store.kpis.find(k => k.label === 'Sources')?.value
  if (!sources || typeof sources !== 'number') return 0
  return Math.min(100, 70 + sources * 5)
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-large);
  padding: var(--va-gap-large);
  background: var(--va-background-secondary);
  min-height: 100vh;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--va-gap-medium);
}

.kpi {
  padding: var(--va-gap-medium);
  border-radius: 14px;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
  transition: 0.2s ease;
}

.kpi:hover {
  transform: translateY(-2px);
  border-color: var(--va-primary);
}

.label {
  font-size: 12px;
  color: var(--va-text-secondary);
}

.value {
  margin-top: var(--va-gap-small);
  font-size: 24px;
  font-weight: 600;
  color: var(--va-text-primary);
}

.trend {
  margin-top: var(--va-gap-small);
  font-size: 12px;
  color: var(--va-primary);
}

.charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--va-gap-medium);
}

.chart {
  padding: var(--va-gap-medium);
  border-radius: 14px;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--va-text-primary);
  margin-bottom: var(--va-gap-medium);
}

.fake-chart {
  display: flex;
  align-items: flex-end;
  gap: var(--va-gap-small);
  height: 140px;
}

.bar {
  flex: 1;
  background: var(--va-primary);
  opacity: 0.75;
  border-radius: 6px 6px 0 0;
}

.donut {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 10px solid var(--va-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.donut-center {
  font-size: 18px;
  font-weight: 600;
  color: var(--va-text-primary);
}


.activity {
  padding: var(--va-gap-medium);
  border-radius: 14px;
  background: var(--va-background-element);
  border: 1px solid var(--va-background-border);
}

.activity-loading {
  display: flex;
  flex-direction: column;
  gap: var(--va-gap-small);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: var(--va-gap-small) 0;
  color: var(--va-text-secondary);
  border-bottom: 1px solid var(--va-background-border);
}

li:last-child {
  border-bottom: none;
}


.state {
  padding: var(--va-gap-large);
  text-align: center;
  color: var(--va-text-secondary);
}

.error {
  color: var(--va-danger);
}


@media (max-width: 900px) {
  .kpi-grid,
  .charts {
    grid-template-columns: 1fr;
  }
}
</style>