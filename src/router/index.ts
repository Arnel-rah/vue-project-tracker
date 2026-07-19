import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '@/components/ProjectList.vue'

const PlaceholderComponent = (title: string) => ({
  template: `<div style="padding: 1rem;"><h2>${title} View Template</h2><p>Infrastructure pipeline ongoing...</p></div>`
})

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: ProjectList,
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectList,
  },
  {
    path: '/sync',
    name: 'sync',
    component: PlaceholderComponent('Sync Activity'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: PlaceholderComponent('Settings'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
