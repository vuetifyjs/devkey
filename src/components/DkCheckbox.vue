<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'

  defineOptions({ name: 'DkCheckbox' })

  const { value } = defineProps<{
    value?: string
  }>()

  const model = defineModel<boolean>()
</script>

<template>
  <Checkbox.Root v-model="model" :value="value" class="dk-checkbox">
    <Checkbox.Indicator class="dk-checkbox__indicator">
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
      </svg>
    </Checkbox.Indicator>
  </Checkbox.Root>
</template>

<style scoped>
  .dk-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.25rem;
    background: var(--v0-theme-surface);
    color: #fff;
    cursor: pointer;
    padding: 0;
  }

  .dk-checkbox[data-state='checked'],
  .dk-checkbox[aria-checked='true'],
  .dk-checkbox[data-state='mixed'] {
    background: var(--v0-theme-primary);
    border-color: var(--v0-theme-primary);
  }

  .dk-checkbox__indicator {
    display: inline-flex;
  }
</style>
