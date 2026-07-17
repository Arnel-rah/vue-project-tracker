<script setup lang="ts">
import ProjectList from '@/components/ProjectList.vue'
</script>

<template>
  <main class="dashboard-root">
    <header class="dashboard-header">
      <h1>Project Tracker</h1>
    </header>
    <section class="dashboard-content">
      <ProjectList />
    </section>
  </main>
</template>

<style scoped>
.dashboard-root {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-content {
  width: 100%;
}

@media (max-width: 640px) {
  .dashboard-root {
    padding: 1rem;
  }
}
</style>
