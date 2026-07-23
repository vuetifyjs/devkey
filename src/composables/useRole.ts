import { useStorage } from '@vuetify/v0'
import type { Ref } from 'vue'

export type Role = 'admin' | 'developer' | 'viewer'

export const ROLES: { id: Role, label: string, value: Role }[] = [
  { id: 'admin', label: 'Admin', value: 'admin' },
  { id: 'developer', label: 'Developer', value: 'developer' },
  { id: 'viewer', label: 'Viewer', value: 'viewer' },
]

/** Persisted demo role for usePermissions checks. Default admin so lifecycle actions work out of the box. */
export function useRole () {
  const storage = useStorage()
  const role = storage.get<Role>('devkey:role', 'admin') as Ref<Role>

  return { role }
}
