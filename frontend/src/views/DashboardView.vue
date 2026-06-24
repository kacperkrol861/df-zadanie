<template>
  <div class="dashboard">

    <h1>Dashboard</h1>

    <!-- KPI SECTION -->
    <div class="kpi-grid">

      <va-card class="kpi">
        <div class="label">Scans today</div>
        <div class="value">12</div>
      </va-card>

      <va-card class="kpi">
        <div class="label">Data processed</div>
        <div class="value">1.4 TB</div>
      </va-card>

      <va-card class="kpi">
        <div class="label">Errors</div>
        <div class="value error">2</div>
      </va-card>

    </div>

    <!-- CHART (mock) -->
    <va-card class="chart">
      <h3>Scan activity</h3>

      <div class="fake-chart">
        <div v-for="n in 12" :key="n" class="bar" />
      </div>
    </va-card>

    <!-- ACTIVITY -->
    <va-card class="activity">
      <h3>Recent activity</h3>

      <ul>
        <li>✅ Scan “Cloud DB” completed</li>
        <li>🔗 Source connected (Database)</li>
        <li>📄 Report generated</li>
      </ul>
    </va-card>

  </div>
</template>

<script setup lang="ts">
// later: pinia + mock API + realtime updates
</script>

<style scoped>
.dashboard {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* KPI */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.kpi {
  padding: 16px;
}

.label {
  font-size: 12px;
  opacity: 0.7;
}

.value {
  font-size: 28px;
  font-weight: bold;
}

.error {
  color: var(--va-danger);
}

/* CHART */
.chart {
  padding: 16px;
}

.fake-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 120px;
  margin-top: 12px;
}

.bar {
  width: 10px;
  height: 60%;
  background: var(--va-primary);
  opacity: 0.7;
}

/* ACTIVITY */
.activity {
  padding: 16px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 6px 0;
}
</style>