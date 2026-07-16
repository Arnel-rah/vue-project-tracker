<script setup lang="ts">
import { useProjects } from '@/composables/useProjects'
import ProjectCard from '@/components/ProjectCard.vue'

const { projects, daysSinceActivity, updateStatus, removeProject } = useProjects()

function handleEdit(id: number) {
  console.log('edit project', id)
  updateStatus(id, 'archived')
}

function handleRemove(id: number) {
  removeProject(id)
}
</script>

<template>
  <main>
    <h1>Project Tracker</h1>

    <div class="grid">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :days-since-activity="daysSinceActivity"
        @edit="handleEdit"
        @remove="handleRemove"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
