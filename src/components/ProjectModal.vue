<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
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
      <div class="modal-header">
        <h2>{{ projectToEdit ? 'Edit project' : 'New project' }}</h2>
        <button class="btn-close" type="button" @click="handleClose">
          <X :size="16" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <label>
          <span class="label-text">Name</span>
          <input v-model="name" type="text" required placeholder="e.g. My Awesome App" />
        </label>

        <label>
          <span class="label-text">Stack (comma-separated)</span>
          <input v-model="stackInput" type="text" placeholder="Go, TypeScript, Postgres" />
        </label>

        <label>
          <span class="label-text">Status</span>
          <div class="select-wrapper">
            <select v-model="status">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </label>

        <label>
          <span class="label-text">Last activity</span>
          <input v-model="lastActivity" type="date" />
        </label>

        <div class="modal-actions">
          <button class="btn-cancel" type="button" @click="handleClose">Cancel</button>
          <button class="btn-save" type="submit">Save Project</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 7, 20, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  color: var(--color-text);
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.btn-close:hover {
  background: #251733;
  color: var(--color-text);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-text {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

input,
select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  background-color: #0d0714;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.15s ease;
}

input:focus,
select:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(255, 42, 122, 0.15);
}

input::placeholder {
  color: #554a6f;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

button {
  font-weight: 600;
  border-radius: var(--radius-md);
  padding: 0.625rem 1.25rem;
}

.btn-cancel {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.btn-cancel:hover {
  background: #251733;
  color: var(--color-text);
  border-color: #3f2757;
}

.btn-save {
  background: var(--color-accent);
  color: #ffffff;
  border: 1px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(255, 42, 122, 0.2);
}

.btn-save:hover {
  background: #e01f65;
  border-color: #e01f65;
  box-shadow: 0 6px 16px rgba(255, 42, 122, 0.3);
}

.btn-save:active {
  transform: scale(0.98);
}
</style>
