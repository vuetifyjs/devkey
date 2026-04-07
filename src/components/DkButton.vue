<script setup lang="ts">
  import { Button } from '@vuetify/v0'

  defineOptions({ name: 'DkButton' })

  const { variant = 'solid', size = 'md', loading = false, disabled = false } = defineProps<{
    variant?: 'solid' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
  }>()
</script>

<template>
  <Button.Root
    class="dk-button"
    :loading="loading"
    :disabled="disabled"
    :data-variant="variant"
    :data-size="size"
  >
    <Button.Content>
      <slot />
    </Button.Content>

    <Button.Loading>
      <svg class="dk-button__spinner" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-dasharray="32"
          stroke-linecap="round"
        />
      </svg>
    </Button.Loading>
  </Button.Root>
</template>

<style>
  .dk-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .dk-button[data-variant="solid"] {
    background: var(--v0-theme-primary);
    color: var(--v0-theme-on-primary);
    border: none;
  }

  .dk-button[data-variant="outline"] {
    background: transparent;
    color: var(--v0-theme-primary);
    border: 1px solid var(--v0-theme-primary);
  }

  .dk-button[data-variant="ghost"] {
    background: transparent;
    color: var(--v0-theme-text);
    border: none;
  }

  .dk-button[data-size="sm"] {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .dk-button[data-size="md"] {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .dk-button[data-size="lg"] {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  .dk-button[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dk-button[data-loading] {
    pointer-events: none;
    cursor: default;
  }

  .dk-button__spinner {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 1em;
    height: 1em;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
