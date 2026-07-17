<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project, ProjectStatus } from '@/types/project'

const props = defineProps<{
  isOpen: boolean
  projectToEdit?: Project | null
}>()

const emit = defineEmits<{
  close: []
  save: [project: Omit<Project, 'id'> & { id?: number }]
}>()

const name = ref('')
const stackInput = ref('')
const status = ref<ProjectStatus>('active')
const lastActivity = ref(new Date().toISOString().slice(0, 10))

watch(
  () => props.projectToEdit,
  (project) => {
    if (project) {
      name.value = project.name
      stackInput.value = project.stack.join(', ')
      status.value = project.status
      lastActivity.value = project.lastActivity
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  name.value = ''
  stackInput.value = ''
  status.value = 'active'
  lastActivity.value = new Date().toISOString().slice(0, 10)
}

function handleSubmit() {
  if (!name.value.trim()) return

  const stack = stackInput.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  emit('save', {
    id: props.projectToEdit?.id,
    name: name.value.trim(),
    stack,
    status: status.value,
    lastActivity: lastActivity.value,
  })

  resetForm()
  emit('close')
}

function handleClose() {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="overlay" @click.self="handleClose">
    <div class="modal">
      <h2>{{ projectToEdit ? 'Edit project' : 'New project' }}</h2>

      <form @submit.prevent="handleSubmit">
        <label>
          Name
          <input v-model="name" type="text" required />
        </label>

        <label>
          Stack (comma-separated)
          <input v-model="stackInput" type="text" placeholder="Go, gRPC, Bubbletea" />
        </label>

        <label>
          Status
          <select v-model="status">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label>
          Last activity
          <input v-model="lastActivity" type="date" />
        </label>

        <div class="modal-actions">
          <button type="button" @click="handleClose">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

input,
select {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: inherit;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
