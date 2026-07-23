import {
  createBreakpointsPlugin,
  createNotificationsPlugin,
  createPermissionsPlugin,
  createRulesPlugin,
} from '@vuetify/v0'
import type { App } from 'vue'

export default function devkey (app: App) {
  // Exact action/subject pairs — the default adapter looks up
  // `${role}.${action}.${subject}` literally (no wildcard expansion).
  app.use(
    createPermissionsPlugin({
      permissions: {
        admin: [
          [['read', 'create', 'rotate', 'revoke'], 'keys'],
        ],
        developer: [
          [['read', 'create', 'rotate'], 'keys'],
        ],
        viewer: [
          ['read', 'keys'],
        ],
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
