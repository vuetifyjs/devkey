<script setup lang="ts">
  import { createDataTable } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'
  import DkInput from './DkInput.vue'

  defineOptions({ name: 'DkTable' })

  interface ApiKey {
    id: string
    name: string
    key: string
    created: string
    lastUsed: string
    [key: string]: unknown
  }

  const { items } = defineProps<{
    items: ApiKey[]
  }>()

  const query = shallowRef('')

  const { items: rows, pagination, search } = createDataTable({
    items: () => items,
    pagination: { itemsPerPage: 10 },
    columns: [
      { key: 'name', title: 'Name' },
      { key: 'key', title: 'API Key' },
      { key: 'created', title: 'Created' },
      { key: 'lastUsed', title: 'Last Used' },
    ],
  })

  watch(query, v => search(v))
</script>

<template>
  <div class="dk-table">
    <div class="dk-table__toolbar">
      <DkInput v-model="query" placeholder="Search keys..." />
    </div>

    <table class="dk-table__grid">
      <thead>
        <tr>
          <th>Name</th>
          <th>API Key</th>
          <th>Created</th>
          <th>Last Used</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in (rows as unknown as ApiKey[])" :key="row.id">
          <td>{{ row.name }}</td>
          <td><code>{{ row.key }}</code></td>
          <td>{{ row.created }}</td>
          <td>{{ row.lastUsed }}</td>
        </tr>
      </tbody>
    </table>

    <div class="dk-table__footer">
      <span>Page {{ pagination.page.value }} of {{ pagination.pages }}</span>
      <div class="dk-table__nav">
        <button :disabled="pagination.page.value <= 1" @click="pagination.prev()">Prev</button>
        <button :disabled="pagination.page.value >= pagination.pages" @click="pagination.next()">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .dk-table {
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .dk-table__toolbar {
    padding: 1rem;
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-table__grid {
    width: 100%;
    border-collapse: collapse;
  }

  .dk-table__grid th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
    color: var(--v0-theme-muted);
    font-weight: 600;
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-table__grid td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--v0-theme-border);
    color: var(--v0-theme-text);
  }

  .dk-table__grid code {
    font-size: 0.8125rem;
    background: var(--v0-theme-background);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .dk-table__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: var(--v0-theme-muted);
  }

  .dk-table__nav {
    display: flex;
    gap: 0.5rem;
  }

  .dk-table__nav button {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.375rem;
    background: var(--v0-theme-surface);
    cursor: pointer;
  }

  .dk-table__nav button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
