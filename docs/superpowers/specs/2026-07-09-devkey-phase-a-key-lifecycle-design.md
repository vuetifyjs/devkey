# DevKey Expansion — Phase A: Key Lifecycle

**Date:** 2026-07-09
**Status:** Approved design, pending implementation plan
**Scope:** Phase A of the DevKey coverage-expansion roadmap (below).

## Context

DevKey is a Vuetify0 reference project — an "API key dashboard" whose real job is
to demonstrate idiomatic v0 patterns in a realistic app. Today it exercises ~5 of
40 v0 components (`Button`, `Toggle`, `Tabs`, `Collapsible`, `Input`) plus
`createDataTable`, `createFilter`, `useVirtualFocus`, `useHotkey`, and 5 plugins.
Most product surfaces are stubs: New Key / Rotate / Revoke are `alert()` calls, and
the Analytics and Settings tabs say "coming soon."

The expansion goal chosen with the user is **breadth-first coverage** organized as a
**hybrid**: map every primitive that plausibly fits the dashboard into real product
flows, and reserve a later `/components` gallery route for primitives with no honest
product home. The overriding constraint: every primitive must be used the **canonical,
documented way** — DevKey is held up as reference, so no contrived usage and no
hand-rolled logic where a v0 primitive exists.

### House pattern (the "parameters" to stay within)

- Thin `Dk*` wrapper components over v0 **compound** primitives (Root + sub-components).
- `<script setup lang="ts">`, `defineOptions({ name })`, `defineModel`, destructured
  `defineProps` with defaults (never `withDefaults`).
- Scoped CSS keyed on `--v0-theme-*` variables; state via `data-*` attributes.
- Reactivity: `shallowRef` primitives, `ref` objects, `toRef` derived.
- Precedent already in-repo: `DkCommandPalette` uses `Dialog.Root`/`Dialog.Content`
  idiomatically; `DkInput` wraps `Input` with `rules`; the rules plugin ships
  `required`/`email` aliases; the permissions plugin ships `admin`/`developer`/`viewer`.

### Full roadmap (for orientation — only Phase A is specced here)

| Phase | Theme | Primitives retired from "unused" |
|-------|-------|----------------------------------|
| **A** | Key lifecycle | Dialog, AlertDialog, Form, Select, Switch, NumberField, Checkbox, Snackbar, Pagination, Tooltip + createForm/createValidation/useRules/useNotifications/createQueue/createGroup/createPagination/usePopover/useStorage |
| B | Navigation & chrome | Treeview, Breadcrumbs, Overflow, Avatar, Popover, Splitter, Step + createNested/createBreadcrumbs/createOverflow/createStep/usePermissions |
| C | Analytics tab | Progress, Slider, Carousel, Rating, ExpansionPanel + createSlider/createVirtual/createSortable/useDragDrop/useIntersectionObserver/useResizeObserver |
| D | Settings tab | Radio, Select, Checkbox, Combobox, Image, AspectRatio, Locale + useLocale/useDate/useRtl/useStorage/createCombobox/useImage/createModel |
| E | `/components` gallery | Atom, Portal, Presence, Group, Selection, Single, Scrim, Theme + leftover system/util composables |

## Goals

- Replace every Phase A stub with a working, persisted, canonical v0 flow.
- Add reusable `Dk*` wrappers for each new primitive, matching the house pattern.
- Persist key data so create/revoke/rotate survive reload (demonstrates `useStorage`).

## Non-goals

- Phases B–E (separate spec → plan cycles).
- Migrating `DkCommandPalette` to the new `DkDialog` wrapper (out of scope; keep focused).
- A backend. All data is client-side; "secrets" are demo strings.
- New tests (per repo convention, tests are added only when explicitly requested).

## Data layer — `useKeys()`

Extract the hardcoded `apiKeys` array from `DashboardPage.vue` into a composable
`src/composables/useKeys.ts`, backed by `useStorage` (the storage plugin is already
registered). Shape:

```ts
interface ApiKey {
  id: string
  name: string
  key: string          // e.g. dk_live_… / dk_test_…
  env: 'live' | 'test'
  autoRotate: boolean
  expiresInDays: number
  created: string       // ISO date
  lastUsed: string      // ISO date
}
```

API surface: `all` (reactive list), `add(input)`, `remove(id)`, `removeMany(ids)`,
`rotate(id)` (regenerates the `key` string, bumps `lastUsed`). Seeded with the current
five demo rows on first run. Key generation is a local helper (`dk_${env}_${random}`).

> Note: persisting "secrets" to `localStorage` is unrealistic for a real product but
> acceptable for a demo; it is the honest way to show `useStorage` driving CRUD.

## New `Dk*` wrappers (verified compound structures)

Each wraps the documented compound API. Structures below are confirmed against the
current v0 source via Vuetify MCP.

- **`DkDialog.vue`** — `Dialog.Root` (`v-model` open) › `Dialog.Content` › `Dialog.Title`,
  `Dialog.Description`, body slot, `Dialog.Close`. Optional `Dialog.Activator` via slot.
  Backdrop via `Scrim`. Slots: `activator`, `title`, default (body), `actions`.
- **`DkForm.vue`** — wraps `Form` with `v-model` (`boolean | null` validity) and
  `@submit` emitting `{ valid }`. Renders a `<form>`; children are validation-aware
  fields that auto-register through the form's context.
- **`DkSelect.vue`** — `Select.Root` (`v-model`) › `Select.Activator` (`Select.Value`
  slot exposing `selectedValue` + `Select.Placeholder` + `Select.Cue`) › `Select.Content`
  › `Select.Item` (`:id` + `:value`, `v-slot="{ isSelected, attrs }"`). Prop: `items`.
- **`DkSwitch.vue`** — `Switch.Root` (`v-model`) › `Switch.Track` › `Switch.Thumb`,
  wrapped in a `<label>` with slotted text.
- **`DkNumberField.vue`** — `NumberField.Root` (`v-model`, `:min`/`:max`/`:step`) ›
  `NumberField.Decrement`, `NumberField.Control`, `NumberField.Increment`, optional
  `NumberField.Description`/`NumberField.Error`.
- **`DkCheckbox.vue`** — `Checkbox.Root` (`v-model`, or `:value` inside a group) ›
  `Checkbox.Indicator`. A `select-all` variant uses `Checkbox.SelectAll` +
  `Checkbox.Indicator` with the `isMixed` slot prop for the tri-state header.
- **`DkAlertDialog.vue`** — `AlertDialog.Root` › `AlertDialog.Content` › `AlertDialog.Title`,
  `AlertDialog.Description`, `AlertDialog.Cancel`, `AlertDialog.Action` (confirm).
  `v-model` open + `@confirm` emit. Slots: `title`, default, `confirm-label`.
- **`DkSnackbar.vue`** — `Snackbar.Portal` › `Snackbar.Queue` (`v-slot="{ items }"`,
  bound to `useNotifications` by namespace) › `Snackbar.Root :id` › `Snackbar.Content`
  (`{{ item.subject }}`) + `Snackbar.Close`. Severity → styling via `data-severity`.
  Mounted **once** in `DkLayout`.
- **`DkPagination.vue`** — `Pagination.Root` (`v-model` page, `:size`) › `Pagination.First`,
  `Pagination.Prev`, `Pagination.Item`/`Pagination.Ellipsis` (from the items slot),
  `Pagination.Next`, `Pagination.Last`, `Pagination.Status` (sr-only).
- **`DkTooltip.vue`** — `Tooltip.Root` › `Tooltip.Activator` (default slot) ›
  `Tooltip.Content` (`text` prop / slot).

## Feature wiring

### New Key (Dialog + Form)
`DkDialog` triggered by the existing "New Key" button, containing a `DkForm`:
- `DkInput` — name, `rules: ['required']` (existing alias).
- `DkSelect` — environment: `live` / `test`.
- `DkSwitch` — auto-rotate.
- `DkNumberField` — expiry days (`min 1`, `max 365`, default 90).

On `@submit` with `valid === true`: `keys.add(form)`, close dialog,
`notifications.send({ subject: 'API key created', severity: 'success' })`. Invalid
submit keeps the dialog open and surfaces per-field errors (already handled by `DkInput`).

### Revoke (AlertDialog)
Each table row gets a Revoke action opening `DkAlertDialog`. `@confirm` →
`keys.remove(id)` → `notifications.send({ subject: 'API key revoked', severity: 'info' })`.

### Rotate
Row action → `keys.rotate(id)` → success toast. No confirmation (non-destructive).

### Table interactions (`DkTable` changes)
`DkTable` already runs `createDataTable` with `pagination: { itemsPerPage: 10 }` and a
hand-rolled Prev/Next footer. Changes:
- **Selection column** — `Checkbox.Group` (`v-model` selected ids) with a
  `Checkbox.SelectAll` header (tri-state) and a `DkCheckbox` per row. Reuses v0's
  `createGroup` tri-state; do not hand-roll select-all math.
- **Bulk actions bar** — appears when ≥1 selected: bulk Revoke → `DkAlertDialog` →
  `keys.removeMany(ids)` → toast.
- **Row actions** — Rotate + Revoke per row.
- **Tooltip** — masked key cell wrapped in `DkTooltip` revealing the full value.
- **Pagination** — replace the hand-rolled footer with `DkPagination` bound to
  `table.pagination` (`page` model + page count as `size`).

### Notifications infra
Add `createNotificationsPlugin({ timeout: 4000 })` in `src/plugins/devkey.ts`. Consumers
call `useNotifications().send(...)`. `DkSnackbar` renders the queue once in `DkLayout`.

## Files

**New**
- `src/composables/useKeys.ts`
- `src/components/DkDialog.vue`
- `src/components/DkForm.vue`
- `src/components/DkSelect.vue`
- `src/components/DkSwitch.vue`
- `src/components/DkNumberField.vue`
- `src/components/DkCheckbox.vue`
- `src/components/DkAlertDialog.vue`
- `src/components/DkSnackbar.vue`
- `src/components/DkPagination.vue`
- `src/components/DkTooltip.vue`
- `src/components/DkCreateKeyDialog.vue` (composes DkDialog + DkForm + fields)

**Modified**
- `src/plugins/devkey.ts` — register `createNotificationsPlugin`.
- `src/components/DkLayout.vue` — mount `DkSnackbar`.
- `src/components/DkTable.vue` — selection column, bulk bar, row actions, `DkTooltip`,
  `DkPagination`.
- `src/pages/DashboardPage.vue` — use `useKeys()`, wire `DkCreateKeyDialog`, replace
  `alert()` command-palette actions with real calls + toasts.

## Coverage delta

Components: `Dialog` is already used inline in the command palette; Phase A adds a
reusable `DkDialog` wrapper plus 9 net-new components (`AlertDialog`, `Form`, `Select`,
`Switch`, `NumberField`, `Checkbox`, `Snackbar`, `Pagination`, `Tooltip`) — taking the
demonstrated set from ≈6 to 15 of 40.
Composables/plugins: +createForm, +createValidation (via fields), +useNotifications,
+createQueue, +createGroup, +useStorage, +usePopover (Select/Tooltip anchoring).

## Sequencing (for the implementation plan)

Two waves to keep increments small and verifiable:
1. **Infra + New Key** — `useKeys`, notifications plugin, `DkSnackbar` in layout,
   `DkDialog`/`DkForm`/`DkSelect`/`DkSwitch`/`DkNumberField`, `DkCreateKeyDialog`,
   dashboard wiring for create + toasts.
2. **Table interactions** — `DkCheckbox`, `DkAlertDialog`, `DkTooltip`, `DkPagination`,
   `DkTable` refactor, revoke/rotate/bulk flows.

## Verification

- `pnpm type-check` clean after each wave.
- Manual: create a key (valid + invalid submit), rotate, revoke (single + bulk),
  reload to confirm persistence, hover key for tooltip, paginate, confirm toasts appear
  and auto-dismiss (and pause on hover per Snackbar.Queue WCAG behavior).
- DevKey ships directly to master (no PR) per ecosystem convention; each wave is a
  separate commit.
