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
      <X :size="13" />
      Clear
    </button>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

button {
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s ease;
}

button:hover {
  background-color: #251733;
  color: var(--color-text);
  border-color: #3f2757;
}

button:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(255, 42, 122, 0.25);
}

.filter-buttons button.active {
  background-color: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
  box-shadow: 0 4px 14px rgba(255, 42, 122, 0.3);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-text-muted);
  flex-shrink: 0;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

button.active .tag-dot {
  background-color: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.7);
}

button:active {
  transform: scale(0.96);
}

.clear-btn {
  background: transparent;
  border: 1px dashed var(--color-border);
  color: var(--color-text-muted);
  padding: 0.4rem 0.9rem;
  font-size: 0.78rem;
}

.clear-btn:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: rgba(255, 42, 122, 0.08);
}
</style>
