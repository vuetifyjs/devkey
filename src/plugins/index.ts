/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

// Plugins
import devkey from './devkey'
import vuetify from './vuetify'
import router from '../router'

export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(router)
  devkey(app)
}
