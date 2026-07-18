<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, FolderOpen, BarChart3 } from 'lucide-vue-next'
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
const activeCount = computed(() => filteredProjects.value.filter(p => p.status === 'active').length)

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
</script>

<template>
  <DashboardLayout>
    <header class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon-wrapper">
          <FolderOpen :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Total Projects</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper active-stat">
          <BarChart3 :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Active Projects</span>
          <span class="stat-value">{{ activeCount }}</span>
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
      <div v-if="filteredProjects.length > 0" class="grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          :days-since-activity="daysSinceActivity"
          @edit="handleEdit"
          @remove="handleRemove"
        />
      </div>

      <div v-else class="empty-state">
        <FolderOpen :size="40" class="empty-icon" />
        <p class="empty-title">Aucun projet trouvé</p>
        <p class="empty-desc">Il n'y a aucun projet qui correspond au filtre sélectionné.</p>
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
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--color-surface, #1a1024);
  border: 1px solid var(--color-border, #251733);
  border-radius: var(--radius-lg, 12px);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrapper {
  background-color: #251733;
  color: var(--color-text-muted, #94a3b8);
  padding: 0.75rem;
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.active-stat {
  color: #00ffd0;
  background-color: rgba(0, 255, 208, 0.05);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted, #94a3b8);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text, #ffffff);
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
  gap: 1.25rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  border: 2px dashed var(--color-border, #251733);
  border-radius: var(--radius-lg, 12px);
  background-color: var(--color-surface, #1a1024);
  max-width: 420px;
  margin: 2rem auto;
}

.empty-icon {
  color: var(--color-text-muted, #94a3b8);
  margin-bottom: 1rem;
}

.empty-title {
  color: var(--color-text, #ffffff);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.empty-desc {
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .new-btn {
    justify-content: center;
  }
}
</style>
