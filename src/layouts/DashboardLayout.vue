<script setup lang="ts">
import { ref } from 'vue'
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, Folder, RefreshCw } from 'lucide-vue-next'

const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <LayoutDashboard :size="24" class="brand-icon" />
          <span v-show="!isCollapsed" class="brand-text">CoreTracker</span>
        </div>
      </div>

      <button
        class="toggle-btn"
        type="button"
        :aria-label="isCollapsed ? 'Ouvrir la sidebar' : 'Fermer la sidebar'"
        @click="toggleSidebar"
      >
        <ChevronLeft v-if="!isCollapsed" :size="20" />
        <ChevronRight v-else :size="20" />
      </button>

      <nav class="sidebar-menu">
        <a href="#" class="menu-item active" title="Dashboard">
          <LayoutDashboard :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Dashboard</span>
        </a>
        <a href="#" class="menu-item" title="Projects">
          <Folder :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Projects</span>
        </a>
        <a href="#" class="menu-item" title="Sync Status">
          <RefreshCw :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Sync Activity</span>
        </a>
      </nav>

      <nav class="sidebar-footer">
        <a href="#" class="menu-item" title="Settings">
          <Settings :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Settings</span>
        </a>
      </nav>
    </aside>

    <div class="main-content" :class="{ 'sidebar-collapsed': isCollapsed }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #0d0714;
  color: var(--color-text, #ffffff);
}

.sidebar {
  width: 250px;
  background-color: var(--color-surface, #1a1024);
  border-right: 1px solid var(--color-border, #251733);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.is-collapsed {
  width: 75px;
}

.sidebar-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1.5rem;
  height: 80px;
}

.sidebar.is-collapsed .sidebar-header {
  padding: 2rem 0;
  justify-content: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
  white-space: nowrap;
}

.brand-icon {
  color: var(--color-accent, #ff2a7a);
  flex-shrink: 0;
}

.brand-text {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text, #ffffff);
  font-family: sans-serif;
}

.toggle-btn {
  position: absolute;
  top: 84px;
  right: -11px;
  background: var(--color-surface, #1a1024);
  border: 1px solid var(--color-border, #251733);
  color: var(--color-text-muted, #94a3b8);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  padding: 0;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
}

.toggle-btn:hover {
  color: var(--color-accent, #ff2a7a);
  border-color: var(--color-accent, #ff2a7a);
  background: rgba(255, 42, 122, 0.08);
}

.toggle-btn:active {
  transform: scale(0.9);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  flex-grow: 1;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border, #251733);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: auto;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 2rem;
  color: var(--color-text-muted, #94a3b8);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.sidebar.is-collapsed .menu-item {
  padding: 1.25rem 0;
  justify-content: center;
}

.menu-icon {
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.menu-item:hover {
  color: var(--color-text, #ffffff);
}

.menu-item.active {
  color: var(--color-accent, #ff2a7a);
  font-weight: 600;
}

.menu-item.active .menu-icon {
  color: var(--color-accent, #ff2a7a);
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: transparent;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: background-color 0.2s ease;
}

.menu-item.active::before {
  background-color: var(--color-accent, #ff2a7a);
}

.main-content {
  flex-grow: 1;
  margin-left: 250px;
  padding: 2rem;
  max-width: 1400px;
  width: calc(100% - 250px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.sidebar-collapsed {
  margin-left: 75px;
  width: calc(100% - 75px);
}

@media (max-width: 768px) {
  .sidebar {
    width: 75px;
  }
  .sidebar-brand .brand-text,
  .menu-item span {
    display: none;
  }
  .toggle-btn {
    right: -11px;
  }
  .sidebar .menu-item {
    padding: 1.25rem 0;
    justify-content: center;
  }
  .main-content {
    margin-left: 75px;
    width: calc(100% - 75px);
  }
}
</style>
