<script setup lang="ts">
import { Tag, X } from 'lucide-vue-next'

interface Props {
  tags: string[]
  selectedTag: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', tag: string | null): void
}>()

const handleSelect = (tag: string | null) => {
  emit('select', tag)
}
</script>

<template>
  <nav class="tag-filter" aria-label="Filtres par tag">
    <span class="filter-label" id="filter-label">
      <Tag :size="14" aria-hidden="true" />
      <span>Filter</span>
    </span>

    <div class="filter-buttons" role="group" aria-labelledby="filter-label">
      <button
        type="button"
        class="filter-btn"
        :class="{ active: selectedTag === null }"
        :aria-pressed="selectedTag === null"
        @click="handleSelect(null)"
      >
        All Projects
      </button>

      <button
        v-for="tag in props.tags"
        :key="tag"
        type="button"
        class="filter-btn"
        :class="{ active: selectedTag === tag }"
        :aria-pressed="selectedTag === tag"
        @click="handleSelect(tag)"
      >
        <span class="tag-dot" aria-hidden="true"></span>
        <span>{{ tag }}</span>
      </button>
    </div>

    <button
      v-if="selectedTag !== null"
      type="button"
      class="clear-btn"
      aria-label="Effacer le filtre"
      @click="handleSelect(null)"
    >
      <X :size="12" aria-hidden="true" />
      <span>Clear</span>
    </button>
  </nav>
</template>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: center;
}

.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: system-ui, -apple-system, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted, #94a3b8);
  flex-shrink: 0;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
}

.filter-btn,
.clear-btn {
  font-family: system-ui, -apple-system, sans-serif;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-btn {
  background-color: rgba(37, 23, 51, 0.4);
  color: var(--color-text-muted, #94a3b8);
  border: 1px solid rgba(63, 39, 87, 0.3);
  padding: 0.45rem 0.875rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.85rem;
  white-space: nowrap;
  gap: 0.5rem;
}

.filter-btn:hover {
  background-color: #251733;
  color: var(--color-text, #ffffff);
  border-color: rgba(255, 42, 122, 0.3);
}

.filter-btn.active {
  background-color: var(--color-accent, #ff2a7a);
  color: #ffffff;
  border-color: var(--color-accent, #ff2a7a);
  box-shadow: 0 4px 12px rgba(255, 42, 122, 0.25);
}

.filter-btn:focus-visible,
.clear-btn:focus-visible {
  outline: 2px solid var(--color-accent, #ff2a7a);
  outline-offset: 2px;
}

.filter-btn:active,
.clear-btn:active {
  transform: scale(0.96);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(148, 163, 184, 0.6);
  flex-shrink: 0;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-btn:hover .tag-dot {
  background-color: var(--color-text, #ffffff);
}

.filter-btn.active .tag-dot {
  background-color: #ffffff;
  box-shadow: 0 0 6px #ffffff;
}

.clear-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md, 8px);
  color: var(--color-accent, #ff2a7a);
  padding: 0.4rem 0.625rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  gap: 0.25rem;
}

.clear-btn:hover {
  background: rgba(255, 42, 122, 0.1);
  color: #ffffff;
}
</style>
