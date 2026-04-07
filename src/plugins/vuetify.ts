import { createThemePlugin, V0StyleSheetThemeAdapter } from '@vuetify/v0'

export default createThemePlugin({
  default: 'dark',
  target: 'html',
  adapter: new V0StyleSheetThemeAdapter({ prefix: 'v0-theme' }),
  themes: {
    dark: {
      dark: true,
      colors: {
        'primary': '#818cf8',
        'secondary': '#fbbf24',
        'error': '#f87171',
        'info': '#38bdf8',
        'success': '#4ade80',
        'warning': '#fb923c',
        'background': '#18181b',
        'surface': '#1f1f23',
        'surface-tint': '#2a2a2a',
        'surface-variant': '#1e1e1e',
        'text': '#f1f5f9',
        'muted': '#94a3b8',
        'border': '#2e2e32',
        'divider': '#404040',
        'on-primary': '#1a1a1a',
        'on-secondary': '#1a1a1a',
        'on-error': '#1a1a1a',
        'on-info': '#1a1a1a',
        'on-success': '#1a1a1a',
        'on-warning': '#1a1a1a',
        'on-background': '#e0e0e0',
        'on-surface': '#e0e0e0',
        'on-surface-variant': '#a0a0a0',
      },
    },
  },
})
