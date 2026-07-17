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
      All
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
  margin-bottom: 1.5rem;
}

button.active {
  background-color: var(--color-active);
  color: white;
  border-color: var(--color-active);
}
</style>
