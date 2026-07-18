<script setup lang="ts">
import type { Project } from "@/types/project";
import {
  AlertTriangle,
  Check,
  Clock,
  Edit2,
  Github,
  Trash2,
  X,
} from "lucide-vue-next";
import { computed, ref } from "vue";

const props = defineProps<{
  project: Project;
  daysSinceActivity: (date: string) => number;
}>();

const emit = defineEmits<{
  edit: [id: number];
  remove: [id: number];
}>();

const isConfirming = ref(false);

const MAX_VISIBLE_TAGS = 4;

const statusColor = computed(() => {
  switch (props.project.status) {
    case "active":
      return "var(--color-active)";
    case "paused":
      return "var(--color-paused)";
    case "archived":
      return "var(--color-archived)";
    default:
      return "var(--color-archived)";
  }
});

const daysAgo = computed(() =>
  props.daysSinceActivity(props.project.lastActivity),
);

const visibleTags = computed(() => props.project.stack.slice(0, MAX_VISIBLE_TAGS));
const hiddenTagsCount = computed(() =>
  Math.max(0, props.project.stack.length - MAX_VISIBLE_TAGS),
);
const hiddenTagsList = computed(() =>
  props.project.stack.slice(MAX_VISIBLE_TAGS).join(", "),
);

function requestDelete() {
  isConfirming.value = true;
}

function cancelDelete() {
  isConfirming.value = false;
}

function confirmDelete() {
  emit("remove", props.project.id);
  isConfirming.value = false;
}
</script>

<template>
  <div class="card" :class="{ 'shake-border': isConfirming }">
    <div class="card-body">
      <div class="card-header">
        <div class="title-area">
          <h3 :title="project.name">{{ project.name }}</h3>
          <span class="status-badge" :style="{ '--badge-color': statusColor }">
            <span class="status-dot"></span>
            {{ project.status }}
          </span>
        </div>

        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          title="Open Repository"
        >
          <Github :size="18" />
        </a>
      </div>

      <div class="tags">
        <span v-for="tag in visibleTags" :key="tag" class="tag">
          {{ tag }}
        </span>
        <span
          v-if="hiddenTagsCount > 0"
          class="tag tag-more"
          :title="hiddenTagsList"
        >
          +{{ hiddenTagsCount }}
        </span>
      </div>

      <div class="card-footer">
        <div class="activity-wrapper">
          <Clock :size="14" class="activity-icon" />
          <p class="activity">Active {{ daysAgo }}d ago</p>
        </div>

        <div class="actions">
          <template v-if="!isConfirming">
            <button
              class="btn-action btn-edit"
              @click="emit('edit', project.id)"
              title="Edit project"
            >
              <Edit2 :size="14" />
            </button>
            <button
              class="btn-action btn-delete"
              @click="requestDelete"
              title="Delete project"
            >
              <Trash2 :size="14" />
            </button>
          </template>

          <template v-else>
            <div class="confirm-zone">
              <div class="confirm-message">
                <AlertTriangle :size="14" class="warn-icon" />
                <span>Sure?</span>
              </div>
              <div class="confirm-buttons">
                <button class="btn-confirm-yes" @click="confirmDelete">
                  <Check :size="12" />
                </button>
                <button class="btn-confirm-no" @click="cancelDelete">
                  <X :size="12" />
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
}

.card {
  position: relative;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  height: 100%;
  /* Améliore le perf de rendu quand des dizaines/centaines de cards sont montées */
  content-visibility: auto;
  contain-intrinsic-size: 0 210px;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 42, 122, 0.4);
  box-shadow: 0 12px 24px rgba(13, 7, 20, 0.6);
}

.shake-border {
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 14px rgba(255, 42, 122, 0.25);
}

.card-body {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.title-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

h3 {
  color: var(--color-text);
  font-size: 1.2rem;
  font-weight: 700;
  font-family: var(--font-mono);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--badge-color);
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--badge-color);
  box-shadow: 0 0 6px var(--badge-color);
}

.github-link {
  color: var(--color-text-muted);
  transition:
    color 0.2s ease,
    transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  flex-shrink: 0;
}

.github-link:hover {
  color: var(--color-accent);
  transform: scale(1.1);
}

/* Hauteur fixe sur 1 ligne pour que toutes les cards restent alignées dans la grille */
.tags {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  gap: 0.5rem;
  height: 1.65rem;
}

.tag {
  font-size: 0.75rem;
  font-weight: 600;
  font-family: sans-serif;
  color: #94a3b8;
  background: rgba(37, 23, 51, 0.6);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(63, 39, 87, 0.4);
  white-space: nowrap;
  flex-shrink: 0;
}

.tag-more {
  color: var(--color-accent);
  background: rgba(255, 42, 122, 0.08);
  border-color: rgba(255, 42, 122, 0.25);
  cursor: default;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(37, 23, 51, 0.5);
  padding-top: 1rem;
  margin-top: auto;
  gap: 1rem;
}

.activity-wrapper {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.activity-icon {
  color: var(--color-text-muted);
}

.activity {
  font-size: 0.8rem;
  font-family: sans-serif;
  color: var(--color-text-muted);
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.btn-action {
  background: transparent;
  color: var(--color-text-muted);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
  padding: 0;
}

.btn-edit:hover {
  color: var(--color-text);
  background: #251733;
}

.btn-delete:hover {
  color: var(--color-accent);
  background: rgba(255, 42, 122, 0.1);
}

.confirm-zone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.confirm-message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: sans-serif;
  color: var(--color-accent);
  text-transform: uppercase;
  white-space: nowrap;
}

.warn-icon {
  animation: pulse 1.5s infinite;
}

.confirm-buttons {
  display: flex;
  gap: 0.25rem;
}

.confirm-buttons button {
  background: #251733;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.confirm-buttons .btn-confirm-yes {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #ffffff;
}

.confirm-buttons .btn-confirm-yes:hover {
  background: #e01f65;
  border-color: #e01f65;
}

.confirm-buttons .btn-confirm-no:hover {
  background: #3f2757;
  color: var(--color-text);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
