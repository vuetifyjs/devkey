<script setup lang="ts">
  import { Single } from '@vuetify/v0'

  defineOptions({ name: 'DkToggle' })

  const model = defineModel<string>()

  const { options } = defineProps<{
    options: Array<{ value: string, label: string }>
  }>()
</script>

<template>
  <Single.Root v-model="model" mandatory>
    <div class="dk-toggle">
      <Single.Item
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        v-slot="{ isSelected, toggle }"
      >
        <button
          class="dk-toggle__option"
          :data-active="isSelected || undefined"
          @click="toggle"
        >
          {{ option.label }}
        </button>
      </Single.Item>
    </div>
  </Single.Root>
</template>

<style scoped>
  .dk-toggle {
    display: inline-flex;
    background: var(--v0-theme-border);
    border-radius: 0.5rem;
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .dk-toggle__option {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--v0-theme-muted);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .dk-toggle__option[data-active] {
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>
