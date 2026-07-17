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
  background-color: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 550;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  background-color: #f1f5f9;
  color: #1e293b;
  border-color: #cbd5e1;
}

button.active {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

button:active {
  transform: scale(0.96);
}
</style>
