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
      return "var(--color-active, #10b981)";
    case "paused":
      return "var(--color-paused, #f59e0b)";
    case "archived":
      return "var(--color-archived, #64748b)";
    default:
      return "var(--color-archived, #64748b)";
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
  <div class="card" :class="{ 'is-deleting': isConfirming }">
    <div class="card-glow" aria-hidden="true"></div>

    <div class="card-body">
      <div class="card-header">
        <div class="title-area">
          <div class="title-row">
            <h3 :title="project.name">{{ project.name }}</h3>
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="github-link"
              title="Open Repository"
              aria-label="GitHub Repository"
            >
              <Github :size="16" />
            </a>
          </div>

          <span class="status-badge" :style="{ '--badge-color': statusColor }">
            <span class="status-dot"></span>
            <span class="status-text">{{ project.status }}</span>
          </span>
        </div>
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
          <Clock :size="13" class="activity-icon" />
          <p class="activity">Active {{ daysAgo }}d ago</p>
        </div>

        <div class="actions">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="!isConfirming" class="action-buttons" key="actions">
              <button
                class="btn-action btn-edit"
                @click="emit('edit', project.id)"
                title="Edit project"
                aria-label="Edit project"
              >
                <Edit2 :size="14" />
              </button>
              <button
                class="btn-action btn-delete"
                @click="requestDelete"
                title="Delete project"
                aria-label="Delete project"
              >
                <Trash2 :size="14" />
              </button>
            </div>

            <div v-else class="confirm-zone" key="confirm">
              <div class="confirm-message">
                <AlertTriangle :size="13" class="warn-icon" />
                <span>Delete?</span>
              </div>
              <div class="confirm-buttons">
                <button
                  class="btn-confirm-yes"
                  @click="confirmDelete"
                  title="Confirm delete"
                  aria-label="Confirm delete"
                >
                  <Check :size="12" />
                </button>
                <button
                  class="btn-confirm-no"
                  @click="cancelDelete"
                  title="Cancel"
                  aria-label="Cancel"
                >
                  <X :size="12" />
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: var(--color-surface, rgba(26, 16, 36, 0.7));
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border, rgba(37, 23, 51, 0.8));
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  display: flex;
  height: 100%;
  content-visibility: auto;
  contain-intrinsic-size: 0 210px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease,
              box-shadow 0.25s ease;
}

/* Halos & Glow au survol */
.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent, #ff2a7a), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 42, 122, 0.35);
  box-shadow: 0 12px 28px rgba(13, 7, 20, 0.7), 0 0 15px rgba(255, 42, 122, 0.08);
}

.card:hover .card-glow {
  opacity: 1;
}

/* Mode confirmation de suppression */
.card.is-deleting {
  border-color: var(--color-accent, #ff2a7a) !important;
  box-shadow: 0 0 18px rgba(255, 42, 122, 0.2);
}

.card-body {
  flex: 1;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  min-width: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-area {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

h3 {
  color: var(--color-text, #ffffff);
  font-size: 1.1rem;
  font-weight: 700;
  font-family: var(--font-mono, "JetBrains Mono", "Fira Code", monospace);
  letter-spacing: -0.02em;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: fit-content;
}

.status-text {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--badge-color);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--badge-color);
  box-shadow: 0 0 8px var(--badge-color);
}

.github-link {
  color: var(--color-text-muted, #94a3b8);
  padding: 0.25rem;
  border-radius: var(--radius-sm, 6px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.github-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

/* Tags Tech Stack */
.tags {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  gap: 0.4rem;
  height: 1.65rem;
  align-items: center;
}

.tag {
  font-size: 0.725rem;
  font-weight: 600;
  color: var(--color-text-muted, #94a3b8);
  background: rgba(37, 23, 51, 0.5);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-md, 6px);
  border: 1px solid rgba(63, 39, 87, 0.4);
  white-space: nowrap;
  flex-shrink: 0;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.tag:hover {
  border-color: rgba(255, 42, 122, 0.3);
  color: #ffffff;
}

.tag-more {
  color: var(--color-accent, #ff2a7a);
  background: rgba(255, 42, 122, 0.1);
  border-color: rgba(255, 42, 122, 0.25);
  font-weight: 700;
}

/* Footer & Actions */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(37, 23, 51, 0.8);
  padding-top: 0.85rem;
  margin-top: auto;
  gap: 0.75rem;
}

.activity-wrapper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-muted, #94a3b8);
  flex-shrink: 0;
}

.activity-icon {
  opacity: 0.7;
}

.activity {
  font-size: 0.775rem;
  font-weight: 500;
  margin: 0;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 28px;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.btn-action {
  background: transparent;
  color: var(--color-text-muted, #94a3b8);
  border: 1px solid transparent;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md, 6px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.btn-edit:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.btn-delete:hover {
  color: var(--color-accent, #ff2a7a);
  background: rgba(255, 42, 122, 0.12);
  border-color: rgba(255, 42, 122, 0.2);
}

/* Zone de Confirmation */
.confirm-zone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.confirm-message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.725rem;
  font-weight: 700;
  color: var(--color-accent, #ff2a7a);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.warn-icon {
  animation: pulse 1.2s infinite ease-in-out;
}

.confirm-buttons {
  display: flex;
  gap: 0.25rem;
}

.confirm-buttons button {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.btn-confirm-yes {
  background: var(--color-accent, #ff2a7a);
  border: 1px solid var(--color-accent, #ff2a7a);
  color: #ffffff;
  box-shadow: 0 0 8px rgba(255, 42, 122, 0.4);
}

.btn-confirm-yes:hover {
  background: #e01f65;
  border-color: #e01f65;
  transform: scale(1.05);
}

.btn-confirm-no {
  background: rgba(37, 23, 51, 0.8);
  border: 1px solid rgba(63, 39, 87, 0.6);
  color: var(--color-text-muted, #94a3b8);
}

.btn-confirm-no:hover {
  background: rgba(63, 39, 87, 0.8);
  color: #ffffff;
}

/* Animations Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
