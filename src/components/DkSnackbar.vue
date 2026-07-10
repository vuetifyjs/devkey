<script setup lang="ts">
  import { Snackbar } from '@vuetify/v0'

  defineOptions({ name: 'DkSnackbar' })
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <div class="dk-snackbar__queue">
        <Snackbar.Root
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          class="dk-snackbar"
          :data-severity="item.severity ?? 'info'"
        >
          <Snackbar.Content class="dk-snackbar__content">{{ item.subject }}</Snackbar.Content>
          <Snackbar.Close class="dk-snackbar__close">✕</Snackbar.Close>
        </Snackbar.Root>
      </div>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>

<style>
  .dk-snackbar__queue {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
  }

  .dk-snackbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 240px;
    padding: 0.75rem 1rem;
    border: 1px solid var(--v0-theme-border);
    border-left: 3px solid var(--v0-theme-primary);
    border-radius: 0.5rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .dk-snackbar[data-severity='success'] { border-left-color: var(--v0-theme-success); }
  .dk-snackbar[data-severity='error'] { border-left-color: var(--v0-theme-error); }
  .dk-snackbar[data-severity='warning'] { border-left-color: var(--v0-theme-warning); }

  .dk-snackbar__content {
    flex: 1;
    font-size: 0.875rem;
  }

  .dk-snackbar__close {
    border: none;
    background: transparent;
    color: var(--v0-theme-muted);
    cursor: pointer;
    font-size: 0.75rem;
  }
</style>
