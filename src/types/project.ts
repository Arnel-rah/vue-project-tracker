export type ProjectStatus = 'active' | 'paused' | 'archived'

export interface Project {
  id: number
  name: string
  stack: string[]
  status: ProjectStatus
  lastActivity: string
}
