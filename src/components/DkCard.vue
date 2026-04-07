<script setup lang="ts">
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'DkCard' })
</script>

<template>
  <Atom as="div" class="dk-card">
    <slot />
  </Atom>
</template>

<style>
  .dk-card {
    background: var(--v0-theme-surface);
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    padding: 1.5rem;
    height: 100%;
  }
</style>
