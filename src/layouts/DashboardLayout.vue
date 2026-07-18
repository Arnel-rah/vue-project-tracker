<script setup lang="ts">
import { ref, computed } from 'vue'
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, Folder, RefreshCw } from 'lucide-vue-next'

const isCollapsed = ref(true)

const toggleLabel = computed(() => (isCollapsed.value ? 'Ouvrir' : 'Fermer'))

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

      <div class="toggle-wrapper">
        <button
          class="toggle-btn"
          type="button"
          :aria-label="toggleLabel + ' la sidebar'"
          @click="toggleSidebar"
        >
          <ChevronLeft v-if="!isCollapsed" :size="20" />
          <ChevronRight v-else :size="20" />
        </button>
        <span class="toggle-tooltip">{{ toggleLabel }}</span>
      </div>

      <nav class="sidebar-menu">
        <a href="#" class="menu-item active">
          <LayoutDashboard :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Dashboard</span>
          <span class="menu-tooltip">Dashboard</span>
        </a>
        <a href="#" class="menu-item">
          <Folder :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Projects</span>
          <span class="menu-tooltip">Projects</span>
        </a>
        <a href="#" class="menu-item">
          <RefreshCw :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Sync Activity</span>
          <span class="menu-tooltip">Sync Activity</span>
        </a>
      </nav>

      <nav class="sidebar-footer">
        <a href="#" class="menu-item">
          <Settings :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Settings</span>
          <span class="menu-tooltip">Settings</span>
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

.toggle-wrapper {
  position: absolute;
  top: 84px;
  right: -11px;
  z-index: 50;
}

.toggle-btn {
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

.toggle-tooltip {
  position: absolute;
  top: 50%;
  left: calc(100% + 10px);
  transform: translateY(-50%) translateX(-4px);
  background: #251733;
  color: var(--color-text, #ffffff);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--color-border, #3f2757);
  box-shadow: 0 6px 16px rgba(13, 7, 20, 0.5);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
  z-index: 60;
}

.toggle-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #251733;
  border-left: 1px solid var(--color-border, #3f2757);
  border-bottom: 1px solid var(--color-border, #3f2757);
  rotate: 45deg;
}

.toggle-wrapper:hover .toggle-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
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

/* Tooltip des liens du menu, visible seulement quand la sidebar est repliée */
.menu-tooltip {
  display: none;
  position: absolute;
  top: 50%;
  left: calc(100% + 10px);
  transform: translateY(-50%) translateX(-4px);
  background: #251733;
  color: var(--color-text, #ffffff);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--color-border, #3f2757);
  box-shadow: 0 6px 16px rgba(13, 7, 20, 0.5);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
  z-index: 60;
}

.menu-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #251733;
  border-left: 1px solid var(--color-border, #3f2757);
  border-bottom: 1px solid var(--color-border, #3f2757);
  rotate: 45deg;
}

.sidebar.is-collapsed .menu-item .menu-tooltip {
  display: block;
}

.sidebar.is-collapsed .menu-item:hover .menu-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.main-content {
  flex-grow: 1;
  margin-left: 75px;
  padding: 2rem;
  max-width: 1400px;
  width: calc(100% - 75px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content:not(.sidebar-collapsed) {
  margin-left: 250px;
  width: calc(100% - 250px);
}

@media (max-width: 768px) {
  .sidebar {
    width: 75px;
  }
  .sidebar-brand .brand-text,
  .menu-item span:not(.menu-tooltip) {
    display: none;
  }
  .menu-item .menu-tooltip {
    display: block;
  }
  .toggle-wrapper {
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
