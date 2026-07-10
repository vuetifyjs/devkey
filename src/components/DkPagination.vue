<script setup lang="ts">
  import { Pagination } from '@vuetify/v0'

  defineOptions({ name: 'DkPagination' })

  const { size, itemsPerPage = 10 } = defineProps<{ size: number, itemsPerPage?: number }>()

  const page = defineModel<number>({ default: 1 })
</script>

<template>
  <Pagination.Root v-model="page" :size="size" :items-per-page="itemsPerPage" class="dk-pagination" v-slot="{ items }">
    <Pagination.Status class="dk-pagination__status" />
    <Pagination.Prev class="dk-pagination__btn">‹</Pagination.Prev>
    <template v-for="item in items" :key="`${item.type}-${item.value}`">
      <Pagination.Item
        v-if="item.type === 'page'"
        :value="item.value"
        class="dk-pagination__item"
      >
        {{ item.value }}
      </Pagination.Item>
      <Pagination.Ellipsis v-else class="dk-pagination__ellipsis">…</Pagination.Ellipsis>
    </template>
    <Pagination.Next class="dk-pagination__btn">›</Pagination.Next>
  </Pagination.Root>
</template>

<style scoped>
  .dk-pagination {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .dk-pagination__status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .dk-pagination__btn,
  .dk-pagination__item {
    min-width: 2rem;
    height: 2rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.375rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 0.8125rem;
    cursor: pointer;
  }

  .dk-pagination__item[data-selected] {
    border-color: var(--v0-theme-primary);
    color: var(--v0-theme-primary);
  }

  .dk-pagination__btn[data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .dk-pagination__ellipsis {
    padding: 0 0.25rem;
    color: var(--v0-theme-muted);
  }
</style>
