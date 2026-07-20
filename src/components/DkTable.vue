<script setup lang="ts">
  import { createDataTable } from '@vuetify/v0'
  import { computed, ref, shallowRef, toRef, watch } from 'vue'
  import DkAlertDialog from './DkAlertDialog.vue'
  import DkCheckbox from './DkCheckbox.vue'
  import DkInput from './DkInput.vue'
  import DkPagination from './DkPagination.vue'
  import DkTooltip from './DkTooltip.vue'
  import type { ApiKey } from '../composables/useKeys'

  defineOptions({ name: 'DkTable' })

  const {
    items,
    canRotate = true,
    canRevoke = true,
  } = defineProps<{
    items: ApiKey[]
    canRotate?: boolean
    canRevoke?: boolean
  }>()

  const emit = defineEmits<{
    rotate: [id: string]
    revoke: [ids: string[]]
  }>()

  // createDataTable's generic is constrained to Record<string, unknown>.
  // ApiKey (Task 1) is a closed interface with no index signature, so it
  // doesn't satisfy that constraint on its own. Widen locally at this call
  // boundary instead of re-adding a `[key: string]: unknown` index signature
  // to the shared ApiKey type.
  type Row = ApiKey & Record<string, unknown>

  const query = shallowRef('')

  const table = createDataTable<Row>({
    pagination: { itemsPerPage: 5 },
  })

  const { items: rows, pagination, search, selection, total } = table

  table.columns.onboard([
    { id: 'name', title: 'Name', filterable: true },
    { id: 'key', title: 'API Key', filterable: true },
    { id: 'created', title: 'Created', filterable: true },
    { id: 'lastUsed', title: 'Last Used', filterable: true },
  ])

  watch(() => items, value => {
    table.clear()
    table.onboard(value.map(item => ({ id: item.id, value: item as Row })))
  }, { immediate: true })

  watch(query, v => search(v))

  const page = computed({
    get: () => pagination.page.value,
    set: v => { pagination.page.value = v },
  })

  const selectedCount = toRef(() => selection.selectedIds.size)

  function mask (key: string): string {
    return `${key.slice(0, 10)}••••••`
  }

  // Revoke confirmation state
  const confirmOpen = shallowRef(false)
  const pendingIds = ref<string[]>([])

  function askRevoke (ids: string[]) {
    pendingIds.value = ids
    confirmOpen.value = true
  }

  function onConfirmRevoke () {
    emit('revoke', [...pendingIds.value])
    for (const id of pendingIds.value) selection.unselect(id)
    pendingIds.value = []
  }
</script>

<template>
  <div class="dk-table">
    <div class="dk-table__toolbar">
      <DkInput v-model="query" placeholder="Search keys..." />
      <button
        v-if="canRevoke && selectedCount"
        class="dk-table__bulk"
        type="button"
        @click="askRevoke([...selection.selectedIds] as string[])"
      >
        Revoke {{ selectedCount }} selected
      </button>
    </div>

    <table class="dk-table__grid">
      <thead>
        <tr>
          <th v-if="canRevoke" class="dk-table__check">
            <DkCheckbox
              :model-value="selection.isAllSelected.value"
              :indeterminate="selection.isMixed.value"
              @update:model-value="() => selection.toggleAll()"
            />
          </th>
          <th>Name</th>
          <th>API Key</th>
          <th>Created</th>
          <th>Last Used</th>
          <th v-if="canRotate || canRevoke" class="dk-table__actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-if="canRevoke" class="dk-table__check">
            <DkCheckbox
              :model-value="selection.isSelected(row.id)"
              @update:model-value="() => selection.toggle(row.id)"
            />
          </td>
          <td>{{ row.name }}</td>
          <td>
            <DkTooltip :text="row.key">
              <code>{{ mask(row.key) }}</code>
            </DkTooltip>
          </td>
          <td>{{ row.created }}</td>
          <td>{{ row.lastUsed }}</td>
          <td v-if="canRotate || canRevoke" class="dk-table__actions">
            <button v-if="canRotate" type="button" @click="emit('rotate', row.id)">Rotate</button>
            <button
              v-if="canRevoke"
              type="button"
              class="dk-table__danger"
              @click="askRevoke([row.id])"
            >
              Revoke
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="dk-table__footer">
      <span>{{ rows.length }} of {{ total }} shown</span>
      <DkPagination v-model="page" :size="pagination.size" :items-per-page="pagination.itemsPerPage" />
    </div>

    <DkAlertDialog
      v-model="confirmOpen"
      title="Revoke API key?"
      :description="pendingIds.length > 1
        ? `This permanently revokes ${pendingIds.length} keys. This cannot be undone.`
        : 'This permanently revokes the key. This cannot be undone.'"
      confirm-label="Revoke"
      @confirm="onConfirmRevoke"
    />
  </div>
</template>

<style scoped>
  .dk-table {
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .dk-table__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-table__bulk {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--v0-theme-error);
    border-radius: 0.375rem;
    background: transparent;
    color: var(--v0-theme-error);
    font-size: 0.8125rem;
    cursor: pointer;
    white-space: nowrap;
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

  .dk-table__check {
    width: 1px;
    white-space: nowrap;
  }

  .dk-table__grid code {
    font-size: 0.8125rem;
    background: var(--v0-theme-background);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .dk-table__actions {
    display: flex;
    gap: 0.5rem;
  }

  .dk-table__actions button {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.375rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 0.75rem;
    cursor: pointer;
  }

  .dk-table__danger {
    color: var(--v0-theme-error);
  }

  .dk-table__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: var(--v0-theme-muted);
  }
</style>
