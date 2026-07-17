import { ref, computed } from 'vue'
import type { Project, ProjectStatus } from '@/types/project'
import { seedProjects } from '@/data/seed'

export function useProjects() {
  const projects = ref<Project[]>([...seedProjects])
  const selectedTag = ref<string | null>(null)

  const filteredProjects = computed(() => {
    if (!selectedTag.value) return projects.value
    return projects.value.filter((p) => p.stack.includes(selectedTag.value!))
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    projects.value.forEach((p) => p.stack.forEach((t) => tags.add(t)))
    return Array.from(tags)
  })

  function daysSinceActivity(dateStr: string): number {
    const diff = Date.now() - new Date(dateStr).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const nextId = Math.max(0, ...projects.value.map((p) => p.id)) + 1
  function addProject(project: Omit<Project, 'id'>) {
  projects.value.push({ ...project, id: nextId })
}

  function updateStatus(id: number, status: ProjectStatus) {
    const project = projects.value.find((p) => p.id === id)
    if (project) project.status = status
  }

  function removeProject(id: number) {
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  function updateProject(id: number, updates: Omit<Project, 'id'>) {
  const index = projects.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    projects.value[index] = { ...updates, id }
  }
}

  return {
    projects,
    filteredProjects,
    allTags,
    selectedTag,
    daysSinceActivity,
    updateProject,
    addProject,
    updateStatus,
    removeProject,
  }
}
