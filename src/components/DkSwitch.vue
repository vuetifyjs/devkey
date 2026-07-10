<script setup lang="ts">
  import { Switch } from '@vuetify/v0'

  defineOptions({ name: 'DkSwitch' })

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="dk-switch">
    <Switch.Root v-model="model" class="dk-switch__root">
      <Switch.Track class="dk-switch__track">
        <Switch.Thumb class="dk-switch__thumb" />
      </Switch.Track>
    </Switch.Root>
    <span v-if="$slots.default" class="dk-switch__label"><slot /></span>
  </label>
</template>

<style scoped>
  .dk-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    cursor: pointer;
  }

  .dk-switch__root {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .dk-switch__track {
    display: inline-flex;
    align-items: center;
    width: 40px;
    height: 22px;
    padding: 2px;
    border-radius: 999px;
    background: var(--v0-theme-border);
    transition: background 0.15s ease;
  }

  .dk-switch__track[data-state='checked'] {
    background: var(--v0-theme-primary);
  }

  .dk-switch__thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s ease;
  }

  .dk-switch__thumb[data-state='checked'] {
    transform: translateX(18px);
  }

  .dk-switch__label {
    font-size: 0.875rem;
    color: var(--v0-theme-text);
  }
</style>
