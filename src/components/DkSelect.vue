<script setup lang="ts">
  import { Select } from '@vuetify/v0'

  defineOptions({ name: 'DkSelect' })

  interface Option {
    id: string
    label: string
    value: string
  }

  const { items, placeholder = 'Select…' } = defineProps<{
    items: Option[]
    placeholder?: string
  }>()

  const model = defineModel<string>()

  function label (value: unknown) {
    return items.find(item => item.value === value)?.label ?? value
  }
</script>

<template>
  <Select.Root v-model="model" class="dk-select">
    <Select.Activator class="dk-select__activator">
      <Select.Value v-slot="{ selectedValue }">{{ label(selectedValue) }}</Select.Value>
      <Select.Placeholder class="dk-select__placeholder">{{ placeholder }}</Select.Placeholder>
      <Select.Cue v-slot="{ isOpen }">
        <span class="dk-select__cue">{{ isOpen ? '▲' : '▼' }}</span>
      </Select.Cue>
    </Select.Activator>

    <Select.Content class="dk-select__content">
      <Select.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :value="item.value"
        v-slot="{ isSelected, attrs }"
      >
        <div v-bind="attrs" class="dk-select__item">
          {{ item.label }}
        </div>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<style>
  .dk-select__activator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 1rem;
    cursor: pointer;
    text-align: left;
  }

  .dk-select__placeholder {
    color: var(--v0-theme-muted);
  }

  .dk-select__cue {
    margin-left: auto;
    font-size: 0.625rem;
    color: var(--v0-theme-muted);
  }

  .dk-select__content {
    min-width: var(--v0-select-width, 12rem);
    padding: 0.25rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    background: var(--v0-theme-surface);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .dk-select__item {
    padding: 0.5rem 0.625rem;
    border-radius: 0.375rem;
    color: var(--v0-theme-text);
    font-size: 0.9375rem;
    cursor: pointer;
  }

  .dk-select__item:hover,
  .dk-select__item[data-selected] {
    background: var(--v0-theme-background);
  }
</style>
