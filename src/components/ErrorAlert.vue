<script setup lang="ts">
interface Props {
  title?: string
  message: string
}

withDefaults(defineProps<Props>(), {
  title: 'Une erreur est survenue'
})

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="error-alert" role="alert">
    <div class="error-icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>

    <div class="error-body">
      <h3 v-if="title" class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
    </div>

    <button type="button" class="retry-button" @click="emit('retry')">
      Réessayer
    </button>
  </div>
</template>

<style scoped>
.error-alert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background-color: var(--bg-error, #fef2f2);
  border: 1px solid var(--border-error, #fecaca);
  border-radius: 0.5rem;
  color: var(--text-error, #991b1b);
  margin: 1rem 0;
}

.error-icon {
  display: flex;
  align-items: center;
  color: #dc2626;
  flex-shrink: 0;
}

.error-body {
  flex: 1;
}

.error-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.error-message {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
}

.retry-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #dc2626;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  flex-shrink: 0;
}

.retry-button:hover {
  background-color: #b91c1c;
}

.retry-button:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .error-alert {
    flex-direction: column;
    align-items: flex-start;
  }

  .retry-button {
    width: 100%;
  }
}

@media (prefers-color-scheme: dark) {
  .error-alert {
    background-color: rgba(127, 29, 29, 0.25);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }

  .error-icon {
    color: #f87171;
  }

  .retry-button {
    background-color: #dc2626;
  }

  .retry-button:hover {
    background-color: #ef4444;
  }
}
</style>
