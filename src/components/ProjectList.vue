<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, FolderOpen, BarChart3, Pause } from 'lucide-vue-next'
import { useProjects } from '@/composables/useProjects'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ProjectCard from './ProjectCard.vue'
import TagFilter from './TagFilter.vue'
import ProjectModal from './ProjectModal.vue'
import type { Project } from '@/types/project'

const {
  filteredProjects,
  allTags,
  selectedTag,
  daysSinceActivity,
  addProject,
  updateProject,
  removeProject,
} = useProjects()

const isModalOpen = ref(false)
const projectToEdit = ref<Project | null>(null)

const totalCount = computed(() => filteredProjects.value.length)
const activeCount = computed(() => filteredProjects.value.filter((p) => p.status === 'active').length)
const pausedCount = computed(() => filteredProjects.value.filter((p) => p.status === 'paused').length)

const hasActiveFilter = computed(() => selectedTag.value !== null)

function openCreateModal() {
  projectToEdit.value = null
  isModalOpen.value = true
}

function handleEdit(id: number) {
  const project = filteredProjects.value.find((p) => p.id === id)
  if (project) {
    projectToEdit.value = project
    isModalOpen.value = true
  }
}

function handleRemove(id: number) {
  removeProject(id)
}

function handleSave(data: Omit<Project, 'id'> & { id?: number }) {
  if (data.id !== undefined) {
    updateProject(data.id, data)
  } else {
    addProject(data)
  }
}

function handleClose() {
  isModalOpen.value = false
  projectToEdit.value = null
}

function clearFilter() {
  selectedTag.value = null
}
</script>

<template>
  <DashboardLayout>
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p class="page-subtitle">Overview of your projects</p>
      </div>
    </div>

    <header class="stats-overview">
      <div class="stat-card total-card">
        <div class="stat-icon-wrapper">
          <FolderOpen :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Total Projects</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
      </div>

      <div class="stat-card active-card">
        <div class="stat-icon-wrapper active-stat">
          <BarChart3 :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Active Projects</span>
          <span class="stat-value">{{ activeCount }}</span>
        </div>
      </div>

      <div class="stat-card paused-card">
        <div class="stat-icon-wrapper paused-stat">
          <Pause :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Paused Projects</span>
          <span class="stat-value">{{ pausedCount }}</span>
        </div>
      </div>
    </header>

    <div class="toolbar">
      <TagFilter
        :tags="allTags"
        :selected-tag="selectedTag"
        @select="(tag) => (selectedTag = tag)"
      />
      <button class="new-btn" @click="openCreateModal">
        <Plus :size="18" :stroke-width="2.5" /> New project
      </button>
    </div>

    <main class="content-body">
      <TransitionGroup v-if="filteredProjects.length > 0" name="card" tag="div" class="grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          :days-since-activity="daysSinceActivity"
          @edit="handleEdit"
          @remove="handleRemove"
        />
      </TransitionGroup>

      <div v-else class="empty-state">
        <FolderOpen :size="40" class="empty-icon" />
        <p class="empty-title">No projects found</p>
        <p class="empty-desc">
          {{
            hasActiveFilter
              ? "There are no projects matching the selected filter."
              : "You haven't created any projects yet. Create your first one to get started."
          }}
        </p>
        <div class="empty-actions">
          <button v-if="hasActiveFilter" class="empty-btn-secondary" @click="clearFilter">
            Reset filter
          </button>
          <button class="empty-btn-primary" @click="openCreateModal">
            <Plus :size="16" :stroke-width="2.5" /> New project
          </button>
        </div>
      </div>
    </main>

    <ProjectModal
      :is-open="isModalOpen"
      :project-to-edit="projectToEdit"
      @close="handleClose"
      @save="handleSave"
    />
  </DashboardLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: sans-serif;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.9rem;
  font-family: sans-serif;
  color: var(--color-text-muted, #94a3b8);
  margin: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: var(--color-surface, #1a1024);
  border: 1px solid var(--color-border, #251733);
  border-radius: var(--radius-lg, 12px);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Hover subtils spécifiques aux accents sans briser la structure */
.stat-card.total-card:hover {
  border-color: rgba(255, 42, 122, 0.3);
  box-shadow: 0 8px 24px rgba(255, 42, 122, 0.05);
  transform: translateY(-2px);
}

.stat-card.active-card:hover {
  border-color: rgba(0, 255, 208, 0.3);
  box-shadow: 0 8px 24px rgba(0, 255, 208, 0.05);
  transform: translateY(-2px);
}

.stat-card.paused-card:hover {
  border-color: rgba(255, 176, 32, 0.3);
  box-shadow: 0 8px 24px rgba(255, 176, 32, 0.05);
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  background-color: rgba(37, 23, 51, 0.6);
  color: var(--color-text-muted, #94a3b8);
  padding: 0.85rem;
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(63, 39, 87, 0.3);
}

.stat-icon-wrapper.active-stat {
  color: #00ffd0;
  background-color: rgba(0, 255, 208, 0.06);
  border-color: rgba(0, 255, 208, 0.15);
}

.stat-icon-wrapper.paused-stat {
  color: #ffb020;
  background-color: rgba(255, 176, 32, 0.06);
  border-color: rgba(255, 176, 32, 0.15);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted, #94a3b8);
  white-space: nowrap;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: sans-serif;
  color: var(--color-text, #ffffff);
  line-height: 1;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0.75rem 1.25rem;
  background-color: rgba(26, 16, 36, 0.4);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--color-border, #251733);
}

.new-btn {
  background-color: var(--color-accent, #ff2a7a);
  color: #ffffff;
  border: 1px solid var(--color-accent, #ff2a7a);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: sans-serif;
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(255, 42, 122, 0.2);
  transition: all 0.2s ease;
}

.new-btn:hover {
  background-color: #e01f65;
  border-color: #e01f65;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 42, 122, 0.3);
}

.new-btn:active {
  transform: scale(0.98);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.card-enter-active,
.card-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.card-leave-active {
  position: absolute;
}

.card-move {
  transition: transform 0.25s ease;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  border: 1px solid var(--color-border, #251733);
  border-radius: var(--radius-lg, 12px);
  background-color: var(--color-surface, #1a1024);
  max-width: 440px;
  margin: 2rem auto;
}

.empty-icon {
  color: var(--color-text-muted, #94a3b8);
  margin-bottom: 1rem;
}

.empty-title {
  color: var(--color-text, #ffffff);
  font-weight: 600;
  font-family: sans-serif;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.empty-desc {
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.875rem;
  font-family: sans-serif;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.empty-btn-primary {
  background-color: var(--color-accent, #ff2a7a);
  color: #ffffff;
  border: 1px solid var(--color-accent, #ff2a7a);
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.empty-btn-primary:hover {
  background-color: #e01f65;
  border-color: #e01f65;
}

.empty-btn-secondary {
  background: transparent;
  color: var(--color-text-muted, #94a3b8);
  border: 1px solid var(--color-border, #251733);
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-btn-secondary:hover {
  color: var(--color-text, #ffffff);
  border-color: rgba(255, 42, 122, 0.4);
  background-color: #251733;
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .new-btn {
    justify-content: center;
  }

  .page-header {
    align-items: flex-start;
  }
}
</style>
