<script setup lang="ts">
import { ref, computed } from 'vue'
import { Edit2, Trash2, Clock, AlertTriangle, Check, X } from 'lucide-vue-next'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
  daysSinceActivity: (date: string) => number
}>()

const emit = defineEmits<{
  edit: [id: number]
  remove: [id: number]
}>()

const isConfirming = ref(false)

const statusColor = computed(() => {
  switch (props.project.status) {
    case 'active':
      return 'var(--color-active)'
    case 'paused':
      return 'var(--color-paused)'
    case 'archived':
      return 'var(--color-archived)'
    default:
      return 'var(--color-archived)'
  }
})

const daysAgo = computed(() => props.daysSinceActivity(props.project.lastActivity))

function requestDelete() {
  isConfirming.value = true
}

function cancelDelete() {
  isConfirming.value = false
}

function confirmDelete() {
  emit('remove', props.project.id)
  isConfirming.value = false
}
</script>

<template>
  <div class="card" :class="{ 'shake-border': isConfirming }">
    <div class="card-header">
      <h3>{{ project.name }}</h3>
      <span
        class="status-badge"
        :style="{ '--badge-color': statusColor }"
      >
        {{ project.status }}
      </span>
    </div>

    <div class="tags">
      <span v-for="tag in project.stack" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>

    <div class="activity-wrapper">
      <Clock :size="14" class="activity-icon" />
      <p class="activity">Active {{ daysAgo }}d ago</p>
    </div>

    <div class="actions">
      <template v-if="!isConfirming">
        <button class="btn-edit" @click="emit('edit', project.id)">
          <Edit2 :size="14" /> Edit
        </button>
        <button class="btn-delete" @click="requestDelete">
          <Trash2 :size="14" /> Delete
        </button>
      </template>

      <template v-else>
        <div class="confirm-zone">
          <div class="confirm-message">
            <AlertTriangle :size="14" class="warn-icon" />
            <span>Are you sure?</span>
          </div>
          <div class="confirm-buttons">
            <button class="btn-confirm-yes" @click="confirmDelete">
              <Check :size="14" /> Yes
            </button>
            <button class="btn-confirm-no" @click="cancelDelete">
              <X :size="14" /> No
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: #3f2757;
  box-shadow: 0 8px 24px rgba(13, 7, 20, 0.5);
}

.shake-border {
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 12px rgba(255, 42, 122, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

h3 {
  color: var(--color-text);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--badge-color);
  border: 1px solid var(--badge-color);
  white-space: nowrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: #251733;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
}

.activity-wrapper {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: auto;
}

.activity-icon {
  color: var(--color-text-muted);
}

.activity {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid var(--color-border);
  padding-top: 0.85rem;
  min-height: 2.6rem;
}

button {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.75rem;
}

.btn-edit {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.btn-edit:hover {
  color: var(--color-text);
  background: #251733;
  border-color: #3f2757;
}

.btn-delete {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid transparent;
}

.btn-delete:hover {
  color: var(--color-accent);
  background: rgba(255, 42, 122, 0.1);
  border-color: rgba(255, 42, 122, 0.2);
}

.confirm-zone {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.confirm-message {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.warn-icon {
  animation: pulse 1.5s infinite;
}

.confirm-buttons {
  display: flex;
  gap: 0.375rem;
}

.confirm-buttons button {
  flex: none;
  padding: 0.35rem 0.75rem;
}

.btn-confirm-yes {
  background: var(--color-accent);
  color: #ffffff;
  border: 1px solid var(--color-accent);
}

.btn-confirm-yes:hover {
  background: #e01f65;
  border-color: #e01f65;
}

.btn-confirm-no {
  background: #251733;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-confirm-no:hover {
  background: #3f2757;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
