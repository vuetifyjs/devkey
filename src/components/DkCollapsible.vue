<script setup lang="ts">
  defineOptions({ name: 'DkCollapsible' })

  const { open = false } = defineProps<{
    open?: boolean
  }>()
</script>

<template>
  <details class="dk-collapsible" :open="open">
    <summary class="dk-collapsible__trigger">
      <slot name="activator" />
      <svg
        class="dk-collapsible__icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>

    <div class="dk-collapsible__content">
      <slot />
    </div>
  </details>
</template>

<style scoped>
  .dk-collapsible {
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-collapsible__trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-weight: 500;
    color: var(--v0-theme-text);
    list-style: none;
  }

  .dk-collapsible__icon {
    margin-left: auto;
  }

  .dk-collapsible__trigger::-webkit-details-marker {
    display: none;
  }

  .dk-collapsible__icon {
    transition: transform 0.2s ease;
    color: var(--v0-theme-muted);
  }

  .dk-collapsible[open] .dk-collapsible__icon {
    transform: rotate(180deg);
  }

  .dk-collapsible__content {
    padding: 0 1rem 0.75rem;
  }
</style>
