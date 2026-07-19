<script setup lang="ts">
import { Tag, X } from 'lucide-vue-next'

defineProps<{
  tags: string[]
  selectedTag: string | null
}>()

const emit = defineEmits<{
  select: [tag: string | null]
}>()
</script>

<template>
  <div class="tag-filter">
    <span class="filter-label">
      <Tag :size="14" />
      Filter
    </span>

    <div class="filter-buttons">
      <button
        type="button"
        :class="{ active: selectedTag === null }"
        @click="emit('select', null)"
      >
        All Projects
      </button>

      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        :class="{ active: selectedTag === tag }"
        @click="emit('select', tag)"
      >
        <span class="tag-dot"></span>
        {{ tag }}
      </button>
    </div>

    <button
      v-if="selectedTag !== null"
      type="button"
      class="clear-btn"
      @click="emit('select', null)"
    >
      <X :size="12" />
      Clear
    </button>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: sans-serif;
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

button {
  background-color: rgba(37, 23, 51, 0.4);
  color: var(--color-text-muted, #94a3b8);
  border: 1px solid rgba(63, 39, 87, 0.3);
  padding: 0.45rem 1rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: sans-serif;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  background-color: #251733;
  color: var(--color-text, #ffffff);
  border-color: rgba(255, 42, 122, 0.2);
}

button:focus-visible {
  outline: none;
  border-color: var(--color-accent, #ff2a7a);
}

.filter-buttons button.active {
  background-color: var(--color-accent, #ff2a7a);
  color: #ffffff;
  border-color: var(--color-accent, #ff2a7a);
  box-shadow: 0 4px 12px rgba(255, 42, 122, 0.25);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(148, 163, 184, 0.6);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

button:hover .tag-dot {
  background-color: var(--color-text, #ffffff);
}

button.active .tag-dot {
  background-color: #ffffff;
  box-shadow: 0 0 6px #ffffff;
}

button:active {
  transform: scale(0.97);
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--color-accent, #ff2a7a);
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  gap: 0.25rem;
}

.clear-btn:hover {
  background: rgba(255, 42, 122, 0.08);
  color: #ffffff;
}
</style>
