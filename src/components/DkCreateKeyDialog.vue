<script setup lang="ts">
  import { useNotifications } from '@vuetify/v0'
  import { reactive, shallowRef, watch } from 'vue'
  import DkDialog from './DkDialog.vue'
  import DkForm from './DkForm.vue'
  import DkInput from './DkInput.vue'
  import DkSelect from './DkSelect.vue'
  import DkSwitch from './DkSwitch.vue'
  import DkNumberField from './DkNumberField.vue'
  import { useKeys } from '../composables/useKeys'
  import type { CreateKeyInput } from '../composables/useKeys'

  defineOptions({ name: 'DkCreateKeyDialog' })

  const open = defineModel<boolean>({ default: false })

  const keys = useKeys()
  const notifications = useNotifications()

  const envItems = [
    { id: 'live', label: 'Live', value: 'live' },
    { id: 'test', label: 'Test', value: 'test' },
  ]

  function blank (): CreateKeyInput {
    return { name: '', env: 'live', autoRotate: false, expiresInDays: 90 }
  }

  const form = reactive(blank())
  const valid = shallowRef<boolean | null>(null)

  watch(open, value => {
    if (value) Object.assign(form, blank())
  })

  function onSubmit (payload: { valid: boolean }) {
    if (!payload.valid) return
    keys.add({ ...form })
    notifications.send({ subject: `API key "${form.name}" created`, severity: 'success' })
    open.value = false
  }
</script>

<template>
  <DkDialog
    v-model="open"
    title="Create API Key"
    description="Generate a new key for your application."
  >
    <DkForm v-model="valid" @submit="onSubmit">
      <DkInput v-model="form.name" label="Name" placeholder="e.g. Production" :rules="['required']" />

      <div class="dk-create__field">
        <span class="dk-create__label">Environment</span>
        <DkSelect v-model="form.env" :items="envItems" />
      </div>

      <DkNumberField v-model="form.expiresInDays" :min="1" :max="365" />

      <DkSwitch v-model="form.autoRotate">Auto-rotate on expiry</DkSwitch>

      <div class="dk-create__actions">
        <!--
          Plain buttons instead of DkButton: Button.Root always forces
          `type="button"` (it merges its own elementAttrs over $attrs and
          never exposes an `as` override), so `<DkButton type="submit">`
          can never trigger DkForm's native form submit event. The
          `dk-button` classes come from DkButton.vue's unscoped <style>
          block, so this renders visually identical to DkButton.
        -->
        <button type="button" class="dk-button" data-variant="outline" data-size="md" @click="open = false">
          Cancel
        </button>
        <button type="submit" class="dk-button" data-variant="solid" data-size="md">
          Create Key
        </button>
      </div>
    </DkForm>
  </DkDialog>
</template>

<style scoped>
  .dk-create__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .dk-create__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--v0-theme-text);
  }

  .dk-create__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
</style>
