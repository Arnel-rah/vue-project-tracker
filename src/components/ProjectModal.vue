<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { X, Github, AlertCircle } from 'lucide-vue-next'
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
const githubUrl = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)
const wasSubmitted = ref(false)

const parsedStack = computed(() =>
  stackInput.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
)

const nameError = computed(() => {
  if (!wasSubmitted.value) return null
  return name.value.trim() ? null : 'Project name is required.'
})

const urlError = computed(() => {
  if (!githubUrl.value.trim()) return null
  try {
    const url = new URL(githubUrl.value.trim())
    if (!url.hostname.includes('github.com')) {
      return 'URL must point to github.com.'
    }
    return null
  } catch {
    return 'Invalid URL.'
  }
})

const isFormValid = computed(() => name.value.trim().length > 0 && !urlError.value)

watch(
  () => props.projectToEdit,
  (project) => {
    if (project) {
      name.value = project.name
      stackInput.value = project.stack.join(', ')
      status.value = project.status
      githubUrl.value = project.githubUrl || ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      wasSubmitted.value = false
      nextTick(() => nameInputRef.value?.focus())
    }
  }
)

function resetForm() {
  name.value = ''
  stackInput.value = ''
  status.value = 'active'
  githubUrl.value = ''
  wasSubmitted.value = false
}

function handleSubmit() {
  wasSubmitted.value = true
  if (!isFormValid.value) return

  emit('save', {
    id: props.projectToEdit?.id,
    name: name.value.trim(),
    stack: parsedStack.value,
    status: status.value,
    githubUrl: githubUrl.value.trim() || undefined,
    lastActivity: props.projectToEdit?.lastActivity || new Date().toISOString().slice(0, 10),
  })

  resetForm()
  emit('close')
}

function handleClose() {
  resetForm()
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Transition name="overlay-fade">
    <div v-if="isOpen" class="overlay" @click.self="handleClose">
      <Transition name="modal-pop" appear>
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h2>{{ projectToEdit ? 'Edit project' : 'New project' }}</h2>
            <button class="btn-close" type="button" @click="handleClose" aria-label="Close">
              <X :size="16" />
            </button>
          </div>

          <form novalidate @submit.prevent="handleSubmit">
            <label>
              <span class="label-text">Name</span>
              <input
                ref="nameInputRef"
                v-model="name"
                type="text"
                placeholder="e.g. My Awesome App"
                :class="{ 'has-error': nameError }"
              />
              <span v-if="nameError" class="field-error">
                <AlertCircle :size="13" /> {{ nameError }}
              </span>
            </label>

            <label>
              <span class="label-text">GitHub Repository URL</span>
              <div class="input-with-icon">
                <Github :size="16" class="field-icon" />
                <input
                  v-model="githubUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  :class="{ 'has-error': urlError }"
                />
              </div>
              <span v-if="urlError" class="field-error">
                <AlertCircle :size="13" /> {{ urlError }}
              </span>
            </label>

            <label>
              <span class="label-text">Stack (comma-separated)</span>
              <input v-model="stackInput" type="text" placeholder="Go, TypeScript, Postgres" />
              <div v-if="parsedStack.length > 0" class="stack-preview">
                <span v-for="tag in parsedStack" :key="tag" class="stack-chip">{{ tag }}</span>
              </div>
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

            <div class="modal-actions">
              <button class="btn-cancel" type="button" @click="handleClose">Cancel</button>
              <button class="btn-save" type="submit" :disabled="wasSubmitted && !isFormValid">
                Save Project
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
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

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
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
  max-height: 90vh;
  overflow-y: auto;
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
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
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

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 0.75rem;
  color: #554a6f;
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 2.25rem;
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
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus,
select:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(255, 42, 122, 0.15);
}

input.has-error {
  border-color: #ff4d6d;
}

input.has-error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 109, 0.2);
}

input::placeholder {
  color: #554a6f;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #ff4d6d;
}

.stack-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.15rem;
}

.stack-chip {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: #251733;
  border: 1px solid var(--color-border);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
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
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
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
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}

.btn-save:hover:not(:disabled) {
  background: #e01f65;
  border-color: #e01f65;
  box-shadow: 0 6px 16px rgba(255, 42, 122, 0.3);
}

.btn-save:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
