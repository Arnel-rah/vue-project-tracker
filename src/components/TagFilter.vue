<script setup lang="ts">
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
    <button
      :class="{ active: selectedTag === null }"
      @click="emit('select', null)"
    >
      All Projects
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      :class="{ active: selectedTag === tag }"
      @click="emit('select', tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<style scoped>
.tag-filter {
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  background-color: #251733;
  color: var(--color-text);
  border-color: #3f2757;
}

button.active {
  background-color: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
  box-shadow: 0 4px 14px rgba(255, 42, 122, 0.3);
}

button:active {
  transform: scale(0.96);
}
</style>
