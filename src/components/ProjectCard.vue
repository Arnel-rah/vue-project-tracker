<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
  daysSinceActivity: (date: string) => number
}>()

const emit = defineEmits<{
  edit: [id: number]
  remove: [id: number]
}>()

const statusColor = computed(() => {
  switch (props.project.status) {
    case 'active':
      return '#22c55e'
    case 'paused':
      return '#f59e0b'
    case 'archived':
      return '#6b7280'
    default:
      return '#6b7280'
  }
})

const daysAgo = computed(() => props.daysSinceActivity(props.project.lastActivity))
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ project.name }}</h3>
      <span class="status-dot" :style="{ backgroundColor: statusColor }" />
    </div>

    <div class="tags">
      <span v-for="tag in project.stack" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>

    <p class="activity">Last activity: {{ daysAgo }} day(s) ago</p>

    <div class="actions">
      <button @click="emit('edit', project.id)">Edit</button>
      <button @click="emit('remove', project.id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  font-size: 0.75rem;
  background: #f3f4f6;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.activity {
  font-size: 0.8rem;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
