export interface Project {
  id: number;
  name: string;
  stack: string[];
  status: 'active' | 'paused' | 'archived';
  lastActivity: string;
}
