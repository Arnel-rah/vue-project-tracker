import type { Project } from '@/types/project'

export const seedProjects: Project[] = [
  {
    id: 1,
    name: 'mailing',
    stack: ['Spring Boot', 'AWS S3', 'PostgreSQL'],
    status: 'active',
    lastActivity: '2026-07-14',
  },
  {
    id: 2,
    name: 'poja-api-plat',
    stack: ['Spring Boot', 'AWS Lambda', 'OpenRouter'],
    status: 'active',
    lastActivity: '2026-07-15',
  },
  {
    id: 3,
    name: 'GhostPort',
    stack: ['Go', 'gRPC', 'Bubbletea'],
    status: 'paused',
    lastActivity: '2026-06-20',
  },
  {
    id: 4,
    name: 'app-library',
    stack: ['Spring Boot', 'Hibernate', 'Flyway'],
    status: 'paused',
    lastActivity: '2026-06-10',
  },
  {
    id: 5,
    name: 'vue-project-tracker',
    stack: ['Vue 3', 'TypeScript', 'Vite'],
    status: 'active',
    lastActivity: '2026-07-16',
  },
]
