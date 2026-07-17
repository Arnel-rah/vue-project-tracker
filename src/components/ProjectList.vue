<script setup lang="ts">
import { useProjects } from '@/composables/useProjects'
import ProjectCard from './ProjectCard.vue'
import TagFilter from './TagFilter.vue'

const {
  filteredProjects,
  allTags,
  selectedTag,
  daysSinceActivity,
  updateStatus,
  removeProject,
} = useProjects()

function handleEdit(id: number) {
  // TODO: brancher sur ProjectModal plus tard
  updateStatus(id, 'archived')
}

function handleRemove(id: number) {
  removeProject(id)
}
</script>

<template>
  <div>
    <TagFilter
      :tags="allTags"
      :selected-tag="selectedTag"
      @select="(tag) => (selectedTag = tag)"
    />

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
  </div>
</template>

<style scoped>
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
