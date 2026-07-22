<script setup lang="ts">
  import { AlertDialog } from '@vuetify/v0'

  defineOptions({ name: 'DkAlertDialog' })

  const {
    title = 'Are you sure?',
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
  } = defineProps<{
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
  }>()

  const open = defineModel<boolean>({ default: false })

  const emit = defineEmits<{ confirm: [] }>()

  function onConfirm () {
    emit('confirm')
    open.value = false
  }
</script>

<template>
  <AlertDialog.Root v-model="open">
    <AlertDialog.Content class="dk-alert">
      <AlertDialog.Title class="dk-alert__title">{{ title }}</AlertDialog.Title>
      <AlertDialog.Description v-if="description" class="dk-alert__description">
        {{ description }}
      </AlertDialog.Description>
      <div class="dk-alert__actions">
        <AlertDialog.Cancel class="dk-alert__cancel">{{ cancelLabel }}</AlertDialog.Cancel>
        <AlertDialog.Action class="dk-alert__confirm" @click="onConfirm">
          {{ confirmLabel }}
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Root>
</template>

<style>
  .dk-alert {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    padding: 1.5rem;
    background: var(--v0-theme-surface);
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  }

  .dk-alert__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-theme-text);
  }

  .dk-alert__description {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--v0-theme-muted);
  }

  .dk-alert__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .dk-alert__cancel,
  .dk-alert__confirm {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid var(--v0-theme-border);
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
  }

  .dk-alert__confirm {
    border-color: var(--v0-theme-error);
    background: var(--v0-theme-error);
    color: #fff;
  }
</style>
