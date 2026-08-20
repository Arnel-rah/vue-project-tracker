<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'var(--text-secondary, #3b82f6)'
})
</script>

<template>
  <div class="spinner-container" :class="`size-${size}`" role="status" aria-label="Chargement">
    <div class="spinner" :style="{ borderColor: `${color} transparent transparent transparent` }"></div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  animation: spin 0.8s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
}

.size-sm .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.size-md .spinner {
  width: 36px;
  height: 36px;
  border-width: 3px;
}

.size-lg .spinner {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
