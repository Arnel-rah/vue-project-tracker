<script setup lang="ts">
import { ref } from 'vue'
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
  <div>
    <div class="toolbar">
      <TagFilter
        :tags="allTags"
        :selected-tag="selectedTag"
        @select="(tag) => (selectedTag = tag)"
      />
      <button @click="openCreateModal">+ New project</button>
    </div>

    <div class="grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        :days-since-activity="daysSinceActivity"
        @edit="handleEdit"
        @remove="handleRemove"
      />
    </div>

    <p v-if="filteredProjects.length === 0" class="empty">
      No projects match this filter.
    </p>

    <ProjectModal
      :is-open="isModalOpen"
      :project-to-edit="projectToEdit"
      @close="handleClose"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.empty {
  color: var(--color-text-muted);
  text-align: center;
  padding: 2rem;
}
</style>
