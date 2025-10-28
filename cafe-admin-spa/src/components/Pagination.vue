<template>
  <div class="pagination">
    <button
      :disabled="currentPage <= 1"
      @click="$emit('page-changed', currentPage - 1)"
    >
      Prev
    </button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button
      :disabled="currentPage >= totalPages"
      @click="$emit('page-changed', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  currentPage: number;
  totalPages: number;
}>();
</script>
