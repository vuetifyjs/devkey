<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'

  defineOptions({ name: 'DkTooltip' })

  const { text } = defineProps<{ text: string }>()
</script>

<template>
  <Tooltip.Root class="dk-tooltip">
    <Tooltip.Activator class="dk-tooltip__activator">
      <slot />
    </Tooltip.Activator>
    <Tooltip.Content class="dk-tooltip__content">{{ text }}</Tooltip.Content>
  </Tooltip.Root>
</template>

<style>
  .dk-tooltip__activator {
    border: none;
    background: transparent;
    padding: 0;
    cursor: default;
    font: inherit;
    color: inherit;
  }

  .dk-tooltip__content {
    padding: 0.375rem 0.625rem;
    border-radius: 0.375rem;
    background: var(--v0-theme-text);
    color: var(--v0-theme-surface);
    font-size: 0.75rem;
    font-family: monospace;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
</style>
