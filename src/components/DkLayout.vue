<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0'
  import { toRef } from 'vue'

  defineOptions({ name: 'DkLayout' })

  const breakpoints = useBreakpoints()
  const mobile = toRef(() => breakpoints.smAndDown.value)
</script>

<template>
  <div class="dk-layout" :data-mobile="mobile || undefined">
    <aside v-if="$slots.sidebar" class="dk-layout__sidebar">
      <slot name="sidebar" />
    </aside>

    <main class="dk-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
  .dk-layout {
    display: flex;
    min-height: 100vh;
    background: var(--v0-theme-background);
  }

  .dk-layout__sidebar {
    width: 260px;
    flex-shrink: 0;
    border-right: 1px solid var(--v0-theme-border);
    background: var(--v0-theme-surface);
    padding: 1rem;
    overflow-y: auto;
  }

  .dk-layout__main {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .dk-layout[data-mobile] {
    flex-direction: column;
  }

  .dk-layout[data-mobile] .dk-layout__sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--v0-theme-border);
  }
</style>
