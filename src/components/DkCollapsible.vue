<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'

  defineOptions({ name: 'DkCollapsible' })

  // Unbound v-model keeps local open state; default true matches sidebar sections.
  const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Collapsible.Root v-model="open" class="dk-collapsible">
    <Collapsible.Activator class="dk-collapsible__trigger">
      <slot name="activator" />
      <Collapsible.Cue class="dk-collapsible__icon" as="span">
        <svg
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
      </Collapsible.Cue>
    </Collapsible.Activator>

    <Collapsible.Content class="dk-collapsible__content">
      <slot />
    </Collapsible.Content>
  </Collapsible.Root>
</template>

<style scoped>
  .dk-collapsible {
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-collapsible__trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-weight: 500;
    font: inherit;
    color: var(--v0-theme-text);
    background: transparent;
    border: none;
    text-align: left;
  }

  .dk-collapsible__icon {
    margin-left: auto;
    display: inline-flex;
    color: var(--v0-theme-muted);
    transition: transform 0.2s ease;
  }

  .dk-collapsible__icon[data-state='open'] {
    transform: rotate(180deg);
  }

  .dk-collapsible__content {
    padding: 0 1rem 0.75rem;
  }

  .dk-collapsible__content[hidden] {
    display: none;
  }
</style>
