# DevKey Phase A — Key Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace DevKey's `alert()`/static-data stubs with working, persisted, canonical Vuetify0 flows for creating, rotating, and revoking API keys.

**Architecture:** A `useKeys()` composable (backed by v0 `useStorage`) owns key CRUD. New thin `Dk*` wrappers expose v0 compound primitives in DevKey's house style. Wave 1 delivers the create flow + toast infra; Wave 2 delivers table interactions (bulk select, revoke, rotate, tooltip, pagination).

**Tech Stack:** Vue 3 + `<script setup lang="ts">`, `@vuetify/v0` (1.0.0-rc.6), Vite, pnpm.

## Global Constraints

- **No tests.** DevKey convention: never add test files unless explicitly asked. Each task verifies via `pnpm type-check` + manual browser check.
- **Commit types:** `chore(scope):` for feature work, `docs`/`refactor` as appropriate. NEVER `feat`/`fix` (reserved for `packages/*` across the ecosystem). DevKey history uses only `chore`/`docs`.
- **Never push.** Commit only; DevKey ships to master directly but pushing is a separate, explicit step.
- **House pattern:** thin `Dk*` wrappers over v0 **compound** components; `defineOptions({ name })`; `defineModel`; destructured `defineProps` with defaults (never `withDefaults`); scoped CSS on `--v0-theme-*` vars; state via `data-*`; `shallowRef` primitives, `ref` objects, `toRef` derived.
- **Idiomatic only:** use v0 primitives the documented way; never hand-roll logic a primitive provides (select-all math, validation, queue timing).

---

## File Structure

**New**
- `src/composables/useKeys.ts` — persisted key store (CRUD).
- `src/components/DkDialog.vue` — `Dialog` wrapper.
- `src/components/DkForm.vue` — `Form` wrapper.
- `src/components/DkSelect.vue` — `Select` wrapper.
- `src/components/DkSwitch.vue` — `Switch` wrapper.
- `src/components/DkNumberField.vue` — `NumberField` wrapper.
- `src/components/DkCheckbox.vue` — `Checkbox` leaf wrapper.
- `src/components/DkAlertDialog.vue` — `AlertDialog` wrapper.
- `src/components/DkSnackbar.vue` — `Snackbar` queue bound to `useNotifications`.
- `src/components/DkPagination.vue` — `Pagination` wrapper.
- `src/components/DkTooltip.vue` — `Tooltip` wrapper.
- `src/components/DkCreateKeyDialog.vue` — composes DkDialog + DkForm + fields.

**Modified**
- `src/plugins/devkey.ts` — register `createNotificationsPlugin`.
- `src/components/DkLayout.vue` — mount `DkSnackbar` once.
- `src/components/DkTable.vue` — selection column, row/bulk actions, tooltip, pagination.
- `src/pages/DashboardPage.vue` — use `useKeys()`, wire create dialog, real command-palette actions.

---

# WAVE 1 — Infrastructure + New Key

## Task 1: `useKeys()` persisted key store

**Files:**
- Create: `src/composables/useKeys.ts`

**Interfaces:**
- Produces: `interface ApiKey { id: string; name: string; key: string; env: 'live' | 'test'; autoRotate: boolean; expiresInDays: number; created: string; lastUsed: string }`
- Produces: `interface CreateKeyInput { name: string; env: 'live' | 'test'; autoRotate: boolean; expiresInDays: number }`
- Produces: `useKeys(): { all: Ref<ApiKey[]>; add(input: CreateKeyInput): void; remove(id: string): void; removeMany(ids: string[]): void; rotate(id: string): void }`

- [ ] **Step 1: Create the composable**

```ts
import { useStorage } from '@vuetify/v0'
import type { Ref } from 'vue'

export interface ApiKey {
  id: string
  name: string
  key: string
  env: 'live' | 'test'
  autoRotate: boolean
  expiresInDays: number
  created: string
  lastUsed: string
}

export interface CreateKeyInput {
  name: string
  env: 'live' | 'test'
  autoRotate: boolean
  expiresInDays: number
}

// NOTE: persisting "secret" keys to localStorage is unrealistic for a real
// product — this is a demonstration of useStorage driving CRUD, not a security
// pattern.
const SEED: ApiKey[] = [
  { id: 'seed-1', name: 'Production', key: 'dk_live_abc123', env: 'live', autoRotate: true, expiresInDays: 90, created: '2026-01-15', lastUsed: '2026-04-05' },
  { id: 'seed-2', name: 'Staging', key: 'dk_test_def456', env: 'test', autoRotate: false, expiresInDays: 30, created: '2026-02-20', lastUsed: '2026-04-04' },
  { id: 'seed-3', name: 'CI/CD', key: 'dk_live_ghi789', env: 'live', autoRotate: true, expiresInDays: 90, created: '2026-03-01', lastUsed: '2026-04-05' },
  { id: 'seed-4', name: 'Development', key: 'dk_test_jkl012', env: 'test', autoRotate: false, expiresInDays: 30, created: '2026-03-10', lastUsed: '2026-04-03' },
  { id: 'seed-5', name: 'Mobile App', key: 'dk_live_mno345', env: 'live', autoRotate: false, expiresInDays: 365, created: '2026-03-15', lastUsed: '2026-04-05' },
]

function today (): string {
  return new Date().toISOString().slice(0, 10)
}

function uid (): string {
  return `key_${Math.random().toString(36).slice(2, 10)}`
}

function generate (env: 'live' | 'test'): string {
  return `dk_${env}_${Math.random().toString(36).slice(2, 10)}`
}

export function useKeys () {
  const storage = useStorage()
  const all = storage.get<ApiKey[]>('devkey:keys', SEED) as Ref<ApiKey[]>

  function add (input: CreateKeyInput) {
    all.value = [
      {
        id: uid(),
        name: input.name,
        key: generate(input.env),
        env: input.env,
        autoRotate: input.autoRotate,
        expiresInDays: input.expiresInDays,
        created: today(),
        lastUsed: today(),
      },
      ...all.value,
    ]
  }

  function remove (id: string) {
    all.value = all.value.filter(k => k.id !== id)
  }

  function removeMany (ids: string[]) {
    const set = new Set(ids)
    all.value = all.value.filter(k => !set.has(k.id))
  }

  function rotate (id: string) {
    all.value = all.value.map(k =>
      k.id === id ? { ...k, key: generate(k.env), lastUsed: today() } : k,
    )
  }

  return { all, add, remove, removeMany, rotate }
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/composables/useKeys.ts
git commit -m "chore(keys): add persisted useKeys store"
```

---

## Task 2: Notifications plugin + `DkSnackbar`

**Files:**
- Modify: `src/plugins/devkey.ts`
- Create: `src/components/DkSnackbar.vue`
- Modify: `src/components/DkLayout.vue`

**Interfaces:**
- Produces: `useNotifications().send({ subject, severity, timeout? })` available app-wide; `DkSnackbar` renders the queue (mount once).

- [ ] **Step 1: Register the notifications plugin**

Edit `src/plugins/devkey.ts` — add the import and `app.use`:

```ts
import {
  createBreakpointsPlugin,
  createNotificationsPlugin,
  createPermissionsPlugin,
  createRulesPlugin,
} from '@vuetify/v0'
import type { App } from 'vue'

export default function devkey (app: App) {
  app.use(
    createPermissionsPlugin({
      permissions: {
        admin: [['manage', '*']],
        developer: [['read', 'keys'], ['create', 'keys']],
        viewer: [['read', 'keys']],
      },
    })
  )

  app.use(
    createRulesPlugin({
      aliases: {
        required: v => !!v || 'Required',
        email: v => /.+@.+\..+/.test(String(v)) || 'Invalid email',
      },
    })
  )

  app.use(createBreakpointsPlugin())

  app.use(createNotificationsPlugin({ timeout: 4000 }))
}
```

- [ ] **Step 2: Create `DkSnackbar.vue`**

```vue
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

  .dk-snackbar[data-severity='success'] { border-left-color: #22c55e; }
  .dk-snackbar[data-severity='error'] { border-left-color: var(--v0-theme-error); }
  .dk-snackbar[data-severity='warning'] { border-left-color: #f59e0b; }

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
```

- [ ] **Step 3: Mount `DkSnackbar` in `DkLayout.vue`**

Edit `src/components/DkLayout.vue`. Add the import and render `<DkSnackbar />` at the end of the root `<div>`:

```vue
<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0'
  import { toRef } from 'vue'
  import DkSnackbar from './DkSnackbar.vue'

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

    <DkSnackbar />
  </div>
</template>
```
(Styles unchanged from current file.)

- [ ] **Step 4: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 5: Manual check**

Run `pnpm dev`. In the browser console on the dashboard, run `window.__vue_app__` is not needed — instead temporarily add a button or use the command palette after Task 7. For now confirm no runtime errors on load and the snackbar container mounts (empty). 

- [ ] **Step 6: Commit**

```bash
git add src/plugins/devkey.ts src/components/DkSnackbar.vue src/components/DkLayout.vue
git commit -m "chore(components): add notifications plugin and DkSnackbar"
```

---

## Task 3: `DkDialog` wrapper

**Files:**
- Create: `src/components/DkDialog.vue`

**Interfaces:**
- Produces: `<DkDialog v-model="open" title="…" description="…">` with default (body) slot and `actions` slot (receives `{ close }`).

- [ ] **Step 1: Create `DkDialog.vue`**

```vue
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
```

- [ ] **Step 2: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DkDialog.vue
git commit -m "chore(components): add DkDialog wrapper"
```

---

## Task 4: Form field wrappers (`DkForm`, `DkSelect`, `DkSwitch`, `DkNumberField`)

**Files:**
- Create: `src/components/DkForm.vue`
- Create: `src/components/DkSelect.vue`
- Create: `src/components/DkSwitch.vue`
- Create: `src/components/DkNumberField.vue`

**Interfaces:**
- Produces: `<DkForm v-model="valid" @submit="onSubmit">` (submit payload `{ valid: boolean }`, default slot receives `{ valid }`).
- Produces: `<DkSelect v-model="value" :items="[{ id, label, value }]" placeholder="…" />`.
- Produces: `<DkSwitch v-model="bool">label</DkSwitch>`.
- Produces: `<DkNumberField v-model="num" :min :max :step />`.

- [ ] **Step 1: Create `DkForm.vue`**

```vue
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
```

- [ ] **Step 2: Create `DkSelect.vue`**

```vue
<script setup lang="ts">
  import { Select } from '@vuetify/v0'

  defineOptions({ name: 'DkSelect' })

  interface Option {
    id: string
    label: string
    value: string
  }

  const { items, placeholder = 'Select…' } = defineProps<{
    items: Option[]
    placeholder?: string
  }>()

  const model = defineModel<string>()
</script>

<template>
  <Select.Root v-model="model" class="dk-select">
    <Select.Activator class="dk-select__activator">
      <Select.Value v-slot="{ selectedValue }">{{ selectedValue }}</Select.Value>
      <Select.Placeholder class="dk-select__placeholder">{{ placeholder }}</Select.Placeholder>
      <Select.Cue v-slot="{ isOpen }">
        <span class="dk-select__cue">{{ isOpen ? '▲' : '▼' }}</span>
      </Select.Cue>
    </Select.Activator>

    <Select.Content class="dk-select__content">
      <Select.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :value="item.value"
        v-slot="{ isSelected, attrs }"
      >
        <div v-bind="attrs" class="dk-select__item" :data-selected="isSelected || undefined">
          {{ item.label }}
        </div>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<style>
  .dk-select__activator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 1rem;
    cursor: pointer;
    text-align: left;
  }

  .dk-select__placeholder {
    color: var(--v0-theme-muted);
  }

  .dk-select__cue {
    margin-left: auto;
    font-size: 0.625rem;
    color: var(--v0-theme-muted);
  }

  .dk-select__content {
    min-width: var(--v0-select-width, 12rem);
    padding: 0.25rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    background: var(--v0-theme-surface);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .dk-select__item {
    padding: 0.5rem 0.625rem;
    border-radius: 0.375rem;
    color: var(--v0-theme-text);
    font-size: 0.9375rem;
    cursor: pointer;
  }

  .dk-select__item:hover,
  .dk-select__item[data-selected] {
    background: var(--v0-theme-background);
  }
</style>
```

- [ ] **Step 3: Create `DkSwitch.vue`**

```vue
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

<style>
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
```

- [ ] **Step 4: Create `DkNumberField.vue`**

```vue
<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'

  defineOptions({ name: 'DkNumberField' })

  const { min, max, step = 1 } = defineProps<{
    min?: number
    max?: number
    step?: number
  }>()

  const model = defineModel<number | null>({ default: null })
</script>

<template>
  <NumberField.Root
    v-model="model"
    :min="min"
    :max="max"
    :step="step"
    class="dk-number"
  >
    <NumberField.Decrement class="dk-number__btn">−</NumberField.Decrement>
    <NumberField.Control class="dk-number__control" />
    <NumberField.Increment class="dk-number__btn">+</NumberField.Increment>
  </NumberField.Root>
</template>

<style>
  .dk-number {
    display: inline-flex;
    align-items: stretch;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--v0-theme-surface);
  }

  .dk-number__btn {
    width: 2.25rem;
    border: none;
    background: var(--v0-theme-background);
    color: var(--v0-theme-text);
    font-size: 1rem;
    cursor: pointer;
  }

  .dk-number__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .dk-number__control {
    width: 4rem;
    border: none;
    background: transparent;
    color: var(--v0-theme-text);
    text-align: center;
    font-size: 1rem;
    outline: none;
  }
</style>
```

- [ ] **Step 5: Type-check**

Run: `pnpm type-check`
Expected: no errors. If `data-state` attribute names differ for Switch, adjust CSS selectors after visual check (Task 6) — do not change the component logic.

- [ ] **Step 6: Commit**

```bash
git add src/components/DkForm.vue src/components/DkSelect.vue src/components/DkSwitch.vue src/components/DkNumberField.vue
git commit -m "chore(components): add DkForm, DkSelect, DkSwitch, DkNumberField wrappers"
```

---

## Task 5: `DkCreateKeyDialog` + dashboard create wiring

**Files:**
- Create: `src/components/DkCreateKeyDialog.vue`
- Modify: `src/pages/DashboardPage.vue`

**Interfaces:**
- Consumes: `useKeys().add` (Task 1), `DkDialog` (Task 3), `DkForm`/`DkSelect`/`DkSwitch`/`DkNumberField` (Task 4), `DkInput` (existing), `useNotifications` (Task 2).
- Produces: `<DkCreateKeyDialog v-model="open" @created="…" />`.

- [ ] **Step 1: Create `DkCreateKeyDialog.vue`**

```vue
<script setup lang="ts">
  import { useNotifications } from '@vuetify/v0'
  import { reactive, shallowRef } from 'vue'
  import DkDialog from './DkDialog.vue'
  import DkForm from './DkForm.vue'
  import DkInput from './DkInput.vue'
  import DkSelect from './DkSelect.vue'
  import DkSwitch from './DkSwitch.vue'
  import DkNumberField from './DkNumberField.vue'
  import DkButton from './DkButton.vue'
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

  function onSubmit (payload: { valid: boolean }) {
    if (!payload.valid) return
    keys.add({ ...form })
    notifications.send({ subject: `API key "${form.name}" created`, severity: 'success' })
    Object.assign(form, blank())
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
        <DkButton type="button" @click="open = false">Cancel</DkButton>
        <DkButton type="submit">Create Key</DkButton>
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
```

> Note: `DkButton` prop/slot API is assumed to accept native `type`. If `DkButton` does not forward `type`, use plain `<button>` elements styled with `.dk-dashboard__new-key` class instead — check `src/components/DkButton.vue` before implementing this step.

- [ ] **Step 2: Wire into `DashboardPage.vue`**

In `src/pages/DashboardPage.vue`:
1. Add imports: `import DkCreateKeyDialog from '../components/DkCreateKeyDialog.vue'` and `import { useKeys } from '../composables/useKeys'`.
2. Replace the hardcoded `apiKeys` array with `const keys = useKeys()`.
3. Replace `function onNewKey () { alert(...) }` with `const createOpen = shallowRef(false)` and `function onNewKey () { createOpen.value = true }`.
4. Pass keys to the table: `<DkTable :items="keys.all.value" />` (Wave 2 extends DkTable; for now it still accepts `items`).
5. Render the dialog inside `.dk-dashboard`: `<DkCreateKeyDialog v-model="createOpen" />`.

```vue
// script additions
import DkCreateKeyDialog from '../components/DkCreateKeyDialog.vue'
import { useKeys } from '../composables/useKeys'

const keys = useKeys()
const createOpen = shallowRef(false)

function onNewKey () {
  createOpen.value = true
}
```

```vue
// template: replace <DkTable :items="apiKeys" /> with
<DkTable :items="keys.all.value" />

// add near <DkCommandPalette ... />
<DkCreateKeyDialog v-model="createOpen" />
```

- [ ] **Step 3: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run `pnpm dev`. On the dashboard: click **New Key** → dialog opens. Submit empty → "Required" error on Name, dialog stays open. Fill Name, pick Test env, set expiry, toggle auto-rotate, submit → dialog closes, success toast appears bottom-right and auto-dismisses (~4s), new row appears at top of the table. Reload page → new key persists.

- [ ] **Step 5: Commit**

```bash
git add src/components/DkCreateKeyDialog.vue src/pages/DashboardPage.vue
git commit -m "chore(dashboard): wire real create-key dialog with validation and toast"
```

---

## Task 6: Real command-palette actions

**Files:**
- Modify: `src/pages/DashboardPage.vue`

**Interfaces:**
- Consumes: `keys` (Task 5), `useNotifications` (Task 2), `createOpen` (Task 5).

- [ ] **Step 1: Replace `alert()` command actions**

In `src/pages/DashboardPage.vue`, add `import { useNotifications } from '@vuetify/v0'` and `const notifications = useNotifications()`. Rewrite the `commands` array actions:

```ts
const commands = [
  { id: 'new-key', label: 'Create New API Key', group: 'Actions', action: () => { createOpen.value = true } },
  { id: 'rotate', label: 'Rotate All Keys', group: 'Actions', action: () => {
    for (const k of keys.all.value) keys.rotate(k.id)
    notifications.send({ subject: 'All keys rotated', severity: 'success' })
  } },
  { id: 'analytics', label: 'View Analytics', group: 'Navigation', action: () => { tab.value = 'analytics' } },
  { id: 'keys', label: 'View API Keys', group: 'Navigation', action: () => { tab.value = 'keys' } },
  { id: 'settings', label: 'Open Settings', group: 'Navigation', action: () => { tab.value = 'settings' } },
  { id: 'docs', label: 'Open Documentation', group: 'Links', action: () => window.open('https://0.vuetifyjs.com', '_blank') },
  { id: 'github', label: 'View on GitHub', group: 'Links', action: () => window.open('https://github.com/vuetifyjs/0', '_blank') },
]
```
(Remove the `revoke` command — revocation is per-row in Wave 2.)

- [ ] **Step 2: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 3: Manual check**

`pnpm dev`. Press Cmd+K → "Create New API Key" opens the dialog; "Rotate All Keys" changes every `key` value and fires a toast; navigation commands switch tabs.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DashboardPage.vue
git commit -m "chore(dashboard): replace alert stubs with real command-palette actions"
```

---

# WAVE 2 — Table Interactions

## Task 7: Leaf wrappers (`DkCheckbox`, `DkAlertDialog`, `DkTooltip`, `DkPagination`)

**Files:**
- Create: `src/components/DkCheckbox.vue`
- Create: `src/components/DkAlertDialog.vue`
- Create: `src/components/DkTooltip.vue`
- Create: `src/components/DkPagination.vue`

**Interfaces:**
- Produces: `<DkCheckbox v-model="bool" />` (standalone) or `<DkCheckbox :value="id" />` inside a `Checkbox.Group`.
- Produces: `<DkAlertDialog v-model="open" title description confirm-label @confirm />`.
- Produces: `<DkTooltip text="…"><activator/></DkTooltip>`.
- Produces: `<DkPagination v-model="page" :size="pages" />`.

- [ ] **Step 1: Create `DkCheckbox.vue`**

```vue
<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'

  defineOptions({ name: 'DkCheckbox' })

  const { value } = defineProps<{
    value?: string
  }>()

  const model = defineModel<boolean>()
</script>

<template>
  <Checkbox.Root v-model="model" :value="value" class="dk-checkbox">
    <Checkbox.Indicator class="dk-checkbox__indicator">
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
      </svg>
    </Checkbox.Indicator>
  </Checkbox.Root>
</template>

<style>
  .dk-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.25rem;
    background: var(--v0-theme-surface);
    color: #fff;
    cursor: pointer;
    padding: 0;
  }

  .dk-checkbox[data-state='checked'],
  .dk-checkbox[aria-checked='true'],
  .dk-checkbox[data-state='mixed'] {
    background: var(--v0-theme-primary);
    border-color: var(--v0-theme-primary);
  }

  .dk-checkbox__indicator {
    display: inline-flex;
  }
</style>
```

- [ ] **Step 2: Create `DkAlertDialog.vue`**

```vue
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
```

- [ ] **Step 3: Create `DkTooltip.vue`**

```vue
<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'

  defineOptions({ name: 'DkTooltip' })

  const { text } = defineProps<{ text: string }>()
</script>

<template>
  <Tooltip.Root class="dk-tooltip">
    <Tooltip.Activator class="dk-tooltip__activator">
      <slot />
    </Tooltip.Activator>
    <Tooltip.Content class="dk-tooltip__content">{{ text }}</Tooltip.Content>
  </Tooltip.Root>
</template>

<style>
  .dk-tooltip__activator {
    border: none;
    background: transparent;
    padding: 0;
    cursor: default;
    font: inherit;
    color: inherit;
  }

  .dk-tooltip__content {
    padding: 0.375rem 0.625rem;
    border-radius: 0.375rem;
    background: var(--v0-theme-text);
    color: var(--v0-theme-surface);
    font-size: 0.75rem;
    font-family: monospace;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
</style>
```

- [ ] **Step 4: Create `DkPagination.vue`**

```vue
<script setup lang="ts">
  import { Pagination } from '@vuetify/v0'

  defineOptions({ name: 'DkPagination' })

  const { size } = defineProps<{ size: number }>()

  const page = defineModel<number>({ default: 1 })
</script>

<template>
  <Pagination.Root v-model="page" :size="size" class="dk-pagination" v-slot="{ items }">
    <Pagination.Status class="dk-pagination__status" />
    <Pagination.Prev class="dk-pagination__btn">‹</Pagination.Prev>
    <template v-for="item in items" :key="`${item.type}-${item.value}`">
      <Pagination.Item
        v-if="item.type === 'page'"
        :value="item.value"
        class="dk-pagination__item"
      >
        {{ item.value }}
      </Pagination.Item>
      <Pagination.Ellipsis v-else class="dk-pagination__ellipsis">…</Pagination.Ellipsis>
    </template>
    <Pagination.Next class="dk-pagination__btn">›</Pagination.Next>
  </Pagination.Root>
</template>

<style>
  .dk-pagination {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .dk-pagination__status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .dk-pagination__btn,
  .dk-pagination__item {
    min-width: 2rem;
    height: 2rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.375rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 0.8125rem;
    cursor: pointer;
  }

  .dk-pagination__item[data-selected] {
    border-color: var(--v0-theme-primary);
    color: var(--v0-theme-primary);
  }

  .dk-pagination__btn[data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .dk-pagination__ellipsis {
    padding: 0 0.25rem;
    color: var(--v0-theme-muted);
  }
</style>
```

- [ ] **Step 5: Type-check**

Run: `pnpm type-check`
Expected: no errors. If the Pagination Root slot prop is not named `items`, or item objects lack `.type`/`.value`, adjust the template to the actual slot contract — verify with `get_vuetify0_component_guide` name=`Pagination` before changing.

- [ ] **Step 6: Commit**

```bash
git add src/components/DkCheckbox.vue src/components/DkAlertDialog.vue src/components/DkTooltip.vue src/components/DkPagination.vue
git commit -m "chore(components): add DkCheckbox, DkAlertDialog, DkTooltip, DkPagination wrappers"
```

---

## Task 8: `DkTable` — selection, row/bulk actions, tooltip, pagination

**Files:**
- Modify: `src/components/DkTable.vue`

**Interfaces:**
- Consumes: `ApiKey` type (Task 1 — import for prop typing), `DkCheckbox`, `DkAlertDialog`, `DkTooltip`, `DkPagination` (Task 7), `Checkbox` (`Group`/`SelectAll`), `useNotifications` (Task 2).
- Emits: `rotate: [id: string]`, `revoke: [ids: string[]]` — the parent (DashboardPage) performs the mutation so the store stays the single writer.

- [ ] **Step 1: Rewrite `DkTable.vue`**

```vue
<script setup lang="ts">
  import { Checkbox, createDataTable } from '@vuetify/v0'
  import { shallowRef, ref, computed, watch } from 'vue'
  import DkInput from './DkInput.vue'
  import DkCheckbox from './DkCheckbox.vue'
  import DkAlertDialog from './DkAlertDialog.vue'
  import DkTooltip from './DkTooltip.vue'
  import DkPagination from './DkPagination.vue'
  import type { ApiKey } from '../composables/useKeys'

  defineOptions({ name: 'DkTable' })

  const { items } = defineProps<{
    items: ApiKey[]
  }>()

  const emit = defineEmits<{
    rotate: [id: string]
    revoke: [ids: string[]]
  }>()

  const query = shallowRef('')
  const selected = ref<string[]>([])

  const table = createDataTable<ApiKey>({
    pagination: { itemsPerPage: 5 },
  })

  const { items: rows, pagination, search } = table

  table.columns.onboard([
    { id: 'name', title: 'Name', filterable: true },
    { id: 'key', title: 'API Key', filterable: true },
    { id: 'created', title: 'Created', filterable: true },
    { id: 'lastUsed', title: 'Last Used', filterable: true },
  ])

  watch(() => items, value => {
    table.clear()
    table.onboard(value.map(item => ({ id: item.id, value: item })))
    selected.value = selected.value.filter(id => value.some(k => k.id === id))
  }, { immediate: true })

  watch(query, v => search(v))

  const page = computed({
    get: () => pagination.page.value,
    set: v => { pagination.page.value = v },
  })

  const rowIds = computed(() => (rows.value as ApiKey[]).map(r => r.id))

  function mask (key: string): string {
    return `${key.slice(0, 10)}••••••`
  }

  // Revoke confirmation state
  const confirmOpen = shallowRef(false)
  const pendingIds = ref<string[]>([])

  function askRevoke (ids: string[]) {
    pendingIds.value = ids
    confirmOpen.value = true
  }

  function onConfirmRevoke () {
    emit('revoke', [...pendingIds.value])
    selected.value = selected.value.filter(id => !pendingIds.value.includes(id))
    pendingIds.value = []
  }
</script>

<template>
  <div class="dk-table">
    <div class="dk-table__toolbar">
      <DkInput v-model="query" placeholder="Search keys..." />
      <button
        v-if="selected.length"
        class="dk-table__bulk"
        type="button"
        @click="askRevoke(selected)"
      >
        Revoke {{ selected.length }} selected
      </button>
    </div>

    <Checkbox.Group v-model="selected">
      <table class="dk-table__grid">
        <thead>
          <tr>
            <th class="dk-table__check">
              <Checkbox.SelectAll class="dk-checkbox">
                <Checkbox.Indicator v-slot="{ isMixed }" class="dk-checkbox__indicator">
                  <span v-if="isMixed">−</span>
                  <svg v-else viewBox="0 0 24 24" width="14" height="14">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.SelectAll>
            </th>
            <th>Name</th>
            <th>API Key</th>
            <th>Created</th>
            <th>Last Used</th>
            <th class="dk-table__actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in (rows as ApiKey[])" :key="row.id">
            <td class="dk-table__check">
              <DkCheckbox :value="row.id" />
            </td>
            <td>{{ row.name }}</td>
            <td>
              <DkTooltip :text="row.key">
                <code>{{ mask(row.key) }}</code>
              </DkTooltip>
            </td>
            <td>{{ row.created }}</td>
            <td>{{ row.lastUsed }}</td>
            <td class="dk-table__actions">
              <button type="button" @click="emit('rotate', row.id)">Rotate</button>
              <button type="button" class="dk-table__danger" @click="askRevoke([row.id])">Revoke</button>
            </td>
          </tr>
        </tbody>
      </table>
    </Checkbox.Group>

    <div class="dk-table__footer">
      <span>{{ rowIds.length }} of {{ items.length }} shown</span>
      <DkPagination v-model="page" :size="pagination.pages" />
    </div>

    <DkAlertDialog
      v-model="confirmOpen"
      title="Revoke API key?"
      :description="pendingIds.length > 1
        ? `This permanently revokes ${pendingIds.length} keys. This cannot be undone.`
        : 'This permanently revokes the key. This cannot be undone.'"
      confirm-label="Revoke"
      @confirm="onConfirmRevoke"
    />
  </div>
</template>

<style scoped>
  .dk-table {
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .dk-table__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-table__bulk {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--v0-theme-error);
    border-radius: 0.375rem;
    background: transparent;
    color: var(--v0-theme-error);
    font-size: 0.8125rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .dk-table__grid {
    width: 100%;
    border-collapse: collapse;
  }

  .dk-table__grid th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
    color: var(--v0-theme-muted);
    font-weight: 600;
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-table__grid td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--v0-theme-border);
    color: var(--v0-theme-text);
  }

  .dk-table__check {
    width: 1px;
    white-space: nowrap;
  }

  .dk-table__grid code {
    font-size: 0.8125rem;
    background: var(--v0-theme-background);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .dk-table__actions {
    display: flex;
    gap: 0.5rem;
  }

  .dk-table__actions button {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.375rem;
    background: var(--v0-theme-surface);
    color: var(--v0-theme-text);
    font-size: 0.75rem;
    cursor: pointer;
  }

  .dk-table__danger {
    color: var(--v0-theme-error);
  }

  .dk-table__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: var(--v0-theme-muted);
  }
</style>
```

> Note: `pagination.pages` and `pagination.page` come from `createDataTable`'s pagination context (already used by the current file). If `pages` is a ref, use `pagination.pages.value` for `:size`. Confirm against the existing usage (`pagination.page.value`, `pagination.pages`) — the current file reads `pagination.pages` without `.value`, so keep that form.

- [ ] **Step 2: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DkTable.vue
git commit -m "chore(components): add selection, row/bulk actions, tooltip, pagination to DkTable"
```

---

## Task 9: Dashboard wiring for rotate/revoke + final verification

**Files:**
- Modify: `src/pages/DashboardPage.vue`

**Interfaces:**
- Consumes: `DkTable` emits `rotate`/`revoke` (Task 8), `keys.rotate`/`keys.removeMany` (Task 1), `useNotifications` (Task 2).

- [ ] **Step 1: Handle table events**

In `src/pages/DashboardPage.vue`, bind the new `DkTable` emits and mutate the store (store stays the single writer):

```vue
<DkTable
  :items="keys.all.value"
  @rotate="onRotate"
  @revoke="onRevoke"
/>
```

```ts
function onRotate (id: string) {
  keys.rotate(id)
  notifications.send({ subject: 'API key rotated', severity: 'success' })
}

function onRevoke (ids: string[]) {
  keys.removeMany(ids)
  notifications.send({
    subject: ids.length > 1 ? `${ids.length} keys revoked` : 'API key revoked',
    severity: 'info',
  })
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm type-check`
Expected: no errors.

- [ ] **Step 3: Full manual verification pass**

Run `pnpm dev` and confirm:
- [ ] Create a key (valid) → toast + new top row + persists on reload.
- [ ] Submit create form empty → "Required" on Name, dialog stays open.
- [ ] Hover a masked key → tooltip shows full value.
- [ ] Row **Rotate** → key value changes, success toast.
- [ ] Row **Revoke** → AlertDialog → confirm → row gone, info toast, persists on reload.
- [ ] Select-all header checkbox → all visible rows checked; partial selection shows mixed (−) state.
- [ ] Select 2+ rows → bulk "Revoke N selected" → AlertDialog → confirm → rows gone.
- [ ] Pagination (itemsPerPage 5) → page buttons navigate; prev/next disable at ends.
- [ ] Cmd+K "Rotate All Keys" → all key values change + toast.
- [ ] Toasts auto-dismiss ~4s and pause while hovered.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DashboardPage.vue
git commit -m "chore(dashboard): wire rotate and revoke handlers with toasts"
```

---

## Self-Review Notes (author)

- **Spec coverage:** Dialog (T3), Form/Select/Switch/NumberField (T4), Input (existing, reused T5), Snackbar/useNotifications (T2), AlertDialog/Checkbox/Tooltip/Pagination (T7), useStorage/useKeys (T1), createGroup via Checkbox.Group + SelectAll (T8), createDataTable pagination reused (T8). All Phase A primitives covered.
- **Single writer:** DkTable emits; DashboardPage mutates `useKeys`. Avoids two components writing the store.
- **Known verification points flagged inline (not placeholders):** Switch `data-state` selector names, `DkButton` `type` forwarding, Pagination Root slot contract, `pagination.pages` ref-vs-value. Each has an explicit fallback instruction — resolve against the running app / MCP guide, do not guess silently.
- **Deferred to later phases:** Analytics/Settings tabs, sidebar nav, `/components` gallery (Phases B–E).
