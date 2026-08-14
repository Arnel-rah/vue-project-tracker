<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProjectList from '@/components/ProjectList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const isLoading = ref(true)
const error = ref<string | null>(null)
const hasLoaded = ref(false)

const initializeDashboard = async () => {
  try {
    isLoading.value = true
    error.value = null

    await new Promise(resolve => setTimeout(resolve, 500))

    hasLoaded.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de chargement du tableau de bord'
    console.error('Dashboard error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  initializeDashboard()
})

defineExpose({
  isLoading,
  error,
  hasLoaded,
  initializeDashboard
})
</script>

<template>
  <div class="dashboard-root">
    <header class="dashboard-header">
      <h1 class="dashboard-title">Tableau de bord des projets</h1>
      <p class="dashboard-subtitle">Gérez vos projets et suivez leur progression</p>
    </header>

    <main class="dashboard-content">
      <div v-if="isLoading" class="dashboard-loading">
        <LoadingSpinner />
        <p>Chargement de vos projets...</p>
      </div>

      <ErrorAlert
        v-else-if="error"
        :message="error"
        @retry="initializeDashboard"
      />

      <template v-else>
        <ProjectList />
      </template>
    </main>

    <footer class="dashboard-footer">
      <p>© {{ new Date().getFullYear() }} - Gestion de projets</p>
    </footer>
  </div>
</template>

<style scoped>
.dashboard-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-primary, #f8fafc);
}

.dashboard-header {
  padding: 2rem 2rem 1.5rem;
  background: var(--bg-white, #ffffff);
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  margin-bottom: 0;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  margin: 0 0 0.5rem 0;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: var(--text-secondary, #64748b);
  margin: 0;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  color: var(--text-secondary, #64748b);
}

.dashboard-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid var(--border-color, #e2e8f0);
  color: var(--text-secondary, #64748b);
  font-size: 0.875rem;
  background: var(--bg-white, #ffffff);
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem 1rem 1rem;
  }

  .dashboard-title {
    font-size: 1.5rem;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .dashboard-footer {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard-title {
    font-size: 1.25rem;
  }

  .dashboard-subtitle {
    font-size: 0.875rem;
  }
}

@media (prefers-color-scheme: dark) {
  .dashboard-root {
    background-color: var(--bg-dark-primary, #0f172a);
  }

  .dashboard-header,
  .dashboard-footer {
    background: var(--bg-dark-secondary, #1e293b);
    border-color: var(--border-dark-color, #334155);
  }

  .dashboard-title {
    color: var(--text-dark-primary, #f1f5f9);
  }

  .dashboard-subtitle {
    color: var(--text-dark-secondary, #94a3b8);
  }
}
</style>
