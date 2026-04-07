import {
  createBreakpointsPlugin,
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
}
