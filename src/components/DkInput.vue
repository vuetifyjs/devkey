<script setup lang="ts">
  import { Input } from '@vuetify/v0'
  import type { RuleInput } from '@vuetify/v0'

  defineOptions({ name: 'DkInput' })

  const { label, description, type = 'text', placeholder, rules } = defineProps<{
    label?: string
    description?: string
    type?: string
    placeholder?: string
    rules?: RuleInput[]
  }>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <Input.Root
    v-model="model"
    :label="label"
    :type="type"
    :rules="rules"
    v-slot="{ isValid }"
  >
    <div class="dk-input" :data-error="isValid === false || undefined">
      <label v-if="label" class="dk-input__label">
        {{ label }}
      </label>

      <Input.Control
        class="dk-input__control"
        :placeholder="placeholder"
      />

      <Input.Description v-if="description && isValid !== false" class="dk-input__description">
        {{ description }}
      </Input.Description>

      <Input.Error v-slot="{ errors: messages }">
        <span
          v-if="messages.length"
          class="dk-input__error"
        >
          {{ messages[0] }}
        </span>
      </Input.Error>
    </div>
  </Input.Root>
</template>

<style scoped>
  .dk-input {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .dk-input__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--v0-theme-text);
  }

  .dk-input__control {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .dk-input__control:focus {
    border-color: var(--v0-theme-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-theme-primary) 20%, transparent);
  }

  .dk-input[data-error] .dk-input__control {
    border-color: var(--v0-theme-error);
  }

  .dk-input__description {
    font-size: 0.8125rem;
    color: var(--v0-theme-muted);
  }

  .dk-input__error {
    font-size: 0.8125rem;
    color: var(--v0-theme-error);
  }
</style>
