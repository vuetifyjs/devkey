<script setup lang="ts">
  import { Dialog, Input, createFilter, useHotkey, useVirtualFocus } from '@vuetify/v0'
  import { useTemplateRef, shallowRef, computed, watch } from 'vue'

  defineOptions({ name: 'DkCommandPalette' })

  interface Command extends Record<string, unknown> {
    id: string
    label: string
    group: string
    action: () => void
  }

  const { commands } = defineProps<{
    commands: Command[]
  }>()

  const open = defineModel<boolean>({ default: false })
  const query = shallowRef('')
  const search = useTemplateRef<HTMLInputElement>('search')

  // Cmd+K to open
  useHotkey('cmd+k', () => {
    open.value = true
    query.value = ''
  })

  // Filter commands by search query
  const filter = createFilter({ keys: ['label'] })
  const { items: filtered } = filter.apply(query, () => commands)

  // Group filtered results
  const groups = computed(() => {
    const map = new Map<string, Command[]>()
    for (const cmd of filtered.value as Command[]) {
      const group = map.get(cmd.group) ?? []
      group.push(cmd)
      map.set(cmd.group, group)
    }
    return map
  })

  // Keyboard navigation through results
  const { highlightedId, onKeydown } = useVirtualFocus(
    () => (filtered.value as Command[]).map(cmd => ({ id: cmd.id })),
    { control: search },
  )

  // Scroll highlighted item into view
  watch(highlightedId, id => {
    if (!id) return
    document.getElementById(String(id))?.scrollIntoView({ block: 'nearest' })
  })

  // Enter key runs the highlighted command
  function onEnter (e: KeyboardEvent) {
    if (e.key === 'Enter' && highlightedId.value) {
      const cmd = (filtered.value as Command[]).find(c => c.id === highlightedId.value)
      if (cmd) onRun(cmd)
    }
  }

  function onRun (cmd: Command) {
    cmd.action()
    open.value = false
  }
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content class="dk-palette" @keydown="onEnter">
      <Input.Root v-model="query">
        <Input.Control renderless v-slot="{ attrs }">
          <input
            ref="search"
            v-bind="attrs"
            class="dk-palette__search"
            placeholder="Search commands..."
          >
        </Input.Control>
      </Input.Root>

      <div class="dk-palette__results">
        <div
          v-for="[group, items] in groups"
          :key="group"
        >
          <div class="dk-palette__group">
            {{ group }}
          </div>

          <div>
            <button
              v-for="cmd in items"
              :id="cmd.id"
              :key="cmd.id"
              class="dk-palette__item"
              :data-active="highlightedId === cmd.id || undefined"
              @click="onRun(cmd)"
            >
              {{ cmd.label }}
            </button>
          </div>
        </div>

        <p v-if="filtered.length === 0" class="dk-palette__empty">
          No results for "{{ query }}"
        </p>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style>
  .dk-palette {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 560px;
    background: var(--v0-theme-surface);
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .dk-palette__search {
    width: 100%;
    padding: 1rem;
    border: none;
    border-bottom: 1px solid var(--v0-theme-border);
    background: transparent;
    color: var(--v0-theme-text);
    font-size: 1rem;
    outline: none;
  }

  .dk-palette__results {
    max-height: 320px;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .dk-palette__group {
    display: block;
    width: 100%;
    padding: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--v0-theme-muted);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
  }

  .dk-palette__item {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--v0-theme-text);
    font-size: 0.9375rem;
    text-align: left;
    cursor: pointer;
  }

  .dk-palette__item:hover,
  .dk-palette__item[data-active] {
    background: var(--v0-theme-background);
  }

  .dk-palette__empty {
    padding: 2rem;
    text-align: center;
    color: var(--v0-theme-muted);
  }
</style>
