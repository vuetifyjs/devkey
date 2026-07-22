/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

// Plugins
import { createStoragePlugin } from '@vuetify/v0'
import devkey from './devkey'
import vuetify from './vuetify'
import router from '../router'

export function registerPlugins (app: App) {
  app.use(createStoragePlugin())
  app.use(vuetify)
  app.use(router)
  devkey(app)
}
