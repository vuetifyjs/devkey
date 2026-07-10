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
