<script setup lang="ts">
  import { Dialog } from '@vuetify/v0'

  defineOptions({ name: 'DkDialog' })

  const { title, description } = defineProps<{
    title?: string
    description?: string
  }>()

  const open = defineModel<boolean>({ default: false })

  function close () {
    open.value = false
  }
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content class="dk-dialog">
      <header v-if="title || description" class="dk-dialog__header">
        <Dialog.Title v-if="title" class="dk-dialog__title">{{ title }}</Dialog.Title>
        <Dialog.Description v-if="description" class="dk-dialog__description">
          {{ description }}
        </Dialog.Description>
      </header>

      <div class="dk-dialog__body">
        <slot :close="close" />
      </div>

      <footer v-if="$slots.actions" class="dk-dialog__actions">
        <slot name="actions" :close="close" />
      </footer>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style>
  .dk-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 440px;
    padding: 1.5rem;
    background: var(--v0-theme-surface);
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  }

  .dk-dialog__header {
    margin-bottom: 1rem;
  }

  .dk-dialog__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-theme-text);
  }

  .dk-dialog__description {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--v0-theme-muted);
  }

  .dk-dialog__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dk-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
</style>
