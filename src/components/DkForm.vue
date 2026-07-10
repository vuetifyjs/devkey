<script setup lang="ts">
  import { Form } from '@vuetify/v0'

  defineOptions({ name: 'DkForm' })

  const valid = defineModel<boolean | null>({ default: null })

  const emit = defineEmits<{
    submit: [payload: { valid: boolean }]
  }>()

  function onSubmit (payload: { valid: boolean }) {
    emit('submit', payload)
  }
</script>

<template>
  <Form v-model="valid" class="dk-form" @submit="onSubmit">
    <slot :valid="valid" />
  </Form>
</template>

<style scoped>
  .dk-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
