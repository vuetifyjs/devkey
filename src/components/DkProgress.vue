<script setup lang="ts">
  import { Progress } from '@vuetify/v0'

  defineOptions({ name: 'DkProgress' })

  const {
    max = 100,
    label,
  } = defineProps<{
    max?: number
    label?: string
  }>()

  const model = defineModel<number>({ default: 0 })
</script>

<template>
  <Progress.Root
    v-model="model"
    :max="max"
    class="dk-progress"
  >
    <div v-if="label || $slots.default" class="dk-progress__header">
      <Progress.Label v-if="label" class="dk-progress__label">{{ label }}</Progress.Label>
      <slot />
      <Progress.Value v-slot="{ percent, total }" class="dk-progress__value">
        <slot name="value" :percent="percent" :total="total" :max="max">
          {{ Math.round(percent) }}%
        </slot>
      </Progress.Value>
    </div>

    <Progress.Track class="dk-progress__track">
      <Progress.Fill class="dk-progress__fill" />
    </Progress.Track>
  </Progress.Root>
</template>

<style scoped>
  .dk-progress {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dk-progress__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .dk-progress__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--v0-theme-text);
  }

  .dk-progress__value {
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    color: var(--v0-theme-muted);
    margin-left: auto;
  }

  .dk-progress__track {
    position: relative;
    height: 0.5rem;
    border-radius: 999px;
    background: var(--v0-theme-border);
    overflow: hidden;
  }

  .dk-progress__fill {
    height: 100%;
    border-radius: 999px;
    background: var(--v0-theme-primary);
    transition: width 0.2s ease;
  }
</style>
