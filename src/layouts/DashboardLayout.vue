<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  LayoutDashboard,
  RefreshCw,
  Settings,
} from "lucide-vue-next";
import { computed, ref } from "vue";

const isCollapsed = ref(true);

const toggleLabel = computed(() => (isCollapsed.value ? "Open" : "Close"));

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <LayoutDashboard :size="22" class="brand-icon" />
          <span v-show="!isCollapsed" class="brand-text">CoreTracker</span>
        </div>
      </div>

      <div class="toggle-wrapper">
        <button
          class="toggle-btn"
          type="button"
          :aria-label="toggleLabel + ' sidebar'"
          @click="toggleSidebar"
        >
          <ChevronLeft v-if="!isCollapsed" :size="16" />
          <ChevronRight v-else :size="16" />
        </button>
        <span class="toggle-tooltip">{{ toggleLabel }}</span>
      </div>

      <nav class="sidebar-menu">
        <RouterLink to="/" class="menu-item" active-class="active">
          <LayoutDashboard :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Dashboard</span>
          <span class="menu-tooltip">Dashboard</span>
        </RouterLink>
        <RouterLink to="/projects" class="menu-item" active-class="active">
          <Folder :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Projects</span>
          <span class="menu-tooltip">Projects</span>
        </RouterLink>
        <RouterLink to="/sync" class="menu-item" active-class="active">
          <RefreshCw :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Sync Activity</span>
          <span class="menu-tooltip">Sync Activity</span>
        </RouterLink>
      </nav>

      <nav class="sidebar-footer">
        <RouterLink to="/settings" class="menu-item" active-class="active">
          <Settings :size="20" class="menu-icon" />
          <span v-show="!isCollapsed">Settings</span>
          <span class="menu-tooltip">Settings</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="main-content" :class="{ 'sidebar-collapsed': isCollapsed }">
      <RouterView v-if="$slots.default === undefined" />
      <slot v-else></slot>
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
  width: 76px;
}
.sidebar-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  height: 80px;
}
.sidebar.is-collapsed .sidebar-header {
  padding: 0;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text, #ffffff);
  font-family: sans-serif;
  letter-spacing: -0.01em;
}
.toggle-wrapper {
  position: absolute;
  top: 26px;
  right: -13px;
  z-index: 50;
}
.toggle-btn {
  background: var(--color-surface, #1a1024);
  border: 1px solid var(--color-border, #251733);
  color: var(--color-text-muted, #94a3b8);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 8px rgba(13, 7, 20, 0.4);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.toggle-btn:hover {
  color: #ffffff;
  border-color: rgba(255, 42, 122, 0.4);
  background: #251733;
  transform: scale(1.05);
}
.toggle-btn:active {
  transform: scale(0.95);
}
.toggle-tooltip {
  position: absolute;
  top: 50%;
  left: calc(100% + 12px);
  transform: translateY(-50%) translateX(-4px);
  background: #251733;
  color: var(--color-text, #ffffff);
  font-size: 0.75rem;
  font-weight: 600;
  font-family: sans-serif;
  white-space: nowrap;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid rgba(63, 39, 87, 0.4);
  box-shadow: 0 6px 16px rgba(13, 7, 20, 0.6);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 60;
}
.toggle-tooltip::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #251733;
  border-left: 1px solid rgba(63, 39, 87, 0.4);
  border-bottom: 1px solid rgba(63, 39, 87, 0.4);
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
  gap: 0.25rem;
  padding: 0 0.75rem;
  margin-top: 0.5rem;
  flex-grow: 1;
}
.sidebar-footer {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  border-top: 1px solid var(--color-border, #251733);
  margin-top: auto;
}
.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-muted, #94a3b8);
  text-decoration: none;
  font-weight: 600;
  font-family: sans-serif;
  font-size: 0.9rem;
  border-radius: var(--radius-md, 8px);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.sidebar.is-collapsed .menu-item {
  padding: 0.75rem 0;
  justify-content: center;
}
.menu-icon {
  flex-shrink: 0;
  transition: color 0.2s ease;
}
.menu-item:hover {
  color: var(--color-text, #ffffff);
  background-color: rgba(37, 23, 51, 0.3);
}
.menu-item.active {
  color: var(--color-accent, #ff2a7a);
  background-color: rgba(255, 42, 122, 0.05);
}
.menu-item.active .menu-icon {
  color: var(--color-accent, #ff2a7a);
}
.menu-tooltip {
  display: none;
  position: absolute;
  top: 50%;
  left: calc(100% + 16px);
  transform: translateY(-50%) translateX(-4px);
  background: #251733;
  color: var(--color-text, #ffffff);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: sans-serif;
  white-space: nowrap;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid rgba(63, 39, 87, 0.4);
  box-shadow: 0 6px 16px rgba(13, 7, 20, 0.6);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 60;
}
.menu-tooltip::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #251733;
  border-left: 1px solid rgba(63, 39, 87, 0.4);
  border-bottom: 1px solid rgba(63, 39, 87, 0.4);
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
  margin-left: 76px;
  padding: 2rem;
  max-width: 1400px;
  width: calc(100% - 76px);
  transition:
    margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.main-content:not(.sidebar-collapsed) {
  margin-left: 250px;
  width: calc(100% - 250px);
}
@media (max-width: 768px) {
  .sidebar {
    width: 76px;
  }
  .sidebar-brand .brand-text,
  .menu-item span:not(.menu-tooltip) {
    display: none;
  }
  .menu-item .menu-tooltip {
    display: block;
  }
  .toggle-wrapper {
    right: -13px;
  }
  .sidebar .menu-item {
    padding: 0.75rem 0;
    justify-content: center;
  }
  .main-content {
    margin-left: 76px;
    width: calc(100% - 76px);
  }
}
</style>
