<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'

  defineOptions({ name: 'DkNumberField' })

  const { min, max, step = 1 } = defineProps<{
    min?: number
    max?: number
    step?: number
  }>()

  const model = defineModel<number | null>({ default: null })
</script>

<template>
  <NumberField.Root
    v-model="model"
    :min="min"
    :max="max"
    :step="step"
    class="dk-number"
  >
    <NumberField.Decrement class="dk-number__btn">−</NumberField.Decrement>
    <NumberField.Control class="dk-number__control" />
    <NumberField.Increment class="dk-number__btn">+</NumberField.Increment>
  </NumberField.Root>
</template>

<style scoped>
  .dk-number {
    display: inline-flex;
    align-items: stretch;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--v0-theme-surface);
  }

  .dk-number__btn {
    width: 2.25rem;
    border: none;
    background: var(--v0-theme-background);
    color: var(--v0-theme-text);
    font-size: 1rem;
    cursor: pointer;
  }

  .dk-number__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .dk-number__control {
    width: 4rem;
    border: none;
    background: transparent;
    color: var(--v0-theme-text);
    text-align: center;
    font-size: 1rem;
    outline: none;
  }
</style>
