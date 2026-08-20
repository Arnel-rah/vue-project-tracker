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
  </div>
</template>

<style scoped>
.dashboard-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
}
</style>
