<script setup lang="ts">
import { ref } from 'vue'
import { Plus, FolderOpen } from 'lucide-vue-next'
import { useProjects } from '@/composables/useProjects'
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
  <div class="container">
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

    <ProjectModal
      :is-open="isModalOpen"
      :project-to-edit="projectToEdit"
      @close="handleClose"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.new-btn {
  background-color: var(--color-primary, #2563eb);
  color: #ffffff;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.new-btn:hover {
  background-color: var(--color-primary-hover, #1d4ed8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.new-btn:active {
  transform: scale(0.98);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  border: 2px dashed var(--color-border, #e2e8f0);
  border-radius: var(--radius-lg, 12px);
  background-color: var(--color-bg-subtle, #f8fafc);
  max-width: 420px;
  margin: 2rem auto;
}

.empty-icon {
  color: var(--color-text-muted, #94a3b8);
  margin-bottom: 1rem;
}

.empty-title {
  color: var(--color-text, #1e293b);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.empty-desc {
  color: var(--color-text-muted, #64748b);
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
