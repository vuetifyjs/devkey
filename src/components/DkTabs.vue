<script setup lang="ts">
  import { TabsRoot, TabsList, TabsItem, TabsPanel } from '@vuetify/v0'

  defineOptions({ name: 'DkTabs' })

  const model = defineModel<string>()

  const { items } = defineProps<{
    items: Array<{ value: string, label: string }>
  }>()
</script>

<template>
  <TabsRoot v-model="model" mandatory>
    <TabsList class="dk-tabs__list">
      <TabsItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        class="dk-tabs__item"
      >
        {{ item.label }}
      </TabsItem>
    </TabsList>

    <div class="dk-tabs__panels">
      <TabsPanel
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        class="dk-tabs__panel"
      >
        <slot :name="item.value" />
      </TabsPanel>
    </div>
  </TabsRoot>
</template>

<style>
  .dk-tabs__list {
    display: flex;
    border-bottom: 1px solid var(--v0-theme-border);
    gap: 0;
  }

  .dk-tabs__item {
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: var(--v0-theme-muted);
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease;
  }

  .dk-tabs__item[data-selected] {
    color: var(--v0-theme-primary);
    border-bottom-color: var(--v0-theme-primary);
  }

  .dk-tabs__panels {
    padding: 1rem 0;
  }

  .dk-tabs__panel {
    color: var(--v0-theme-text);
  }
</style>
