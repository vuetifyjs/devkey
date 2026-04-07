<script setup lang="ts">
  import { shallowRef } from 'vue'
  import {
    mdiChartBar,
    mdiKey,
    mdiClockOutline,
    mdiAlertCircleOutline,
    mdiViewDashboard,
    mdiCog,
    mdiAccount,
    mdiMagnify,
    mdiPlus,
  } from '@mdi/js'
  import DkLayout from '../components/DkLayout.vue'
  import DkCollapsible from '../components/DkCollapsible.vue'
  import DkCard from '../components/DkCard.vue'
  import DkTabs from '../components/DkTabs.vue'
  import DkTable from '../components/DkTable.vue'
  import DkCommandPalette from '../components/DkCommandPalette.vue'

  defineOptions({ name: 'DkDashboardPage' })

  const tab = shallowRef('keys')

  const stats = [
    { label: 'Total Requests', value: '1.2M', icon: mdiChartBar },
    { label: 'Active Keys', value: '24', icon: mdiKey },
    { label: 'Avg Latency', value: '45ms', icon: mdiClockOutline },
    { label: 'Error Rate', value: '0.3%', icon: mdiAlertCircleOutline },
  ]

  const apiKeys = [
    { id: '1', name: 'Production', key: 'dk_live_abc123', created: '2026-01-15', lastUsed: '2026-04-05' },
    { id: '2', name: 'Staging', key: 'dk_test_def456', created: '2026-02-20', lastUsed: '2026-04-04' },
    { id: '3', name: 'CI/CD', key: 'dk_live_ghi789', created: '2026-03-01', lastUsed: '2026-04-05' },
    { id: '4', name: 'Development', key: 'dk_test_jkl012', created: '2026-03-10', lastUsed: '2026-04-03' },
    { id: '5', name: 'Mobile App', key: 'dk_live_mno345', created: '2026-03-15', lastUsed: '2026-04-05' },
  ]

  const sidebarSections = [
    { label: 'Overview', icon: mdiViewDashboard, items: ['All Keys', 'Create New', 'Rotate'] },
    { label: 'Management', icon: mdiCog, items: ['Overview', 'Usage', 'Errors'] },
    { label: 'Account', icon: mdiAccount, items: ['Team', 'Billing', 'Security'] },
  ]

  function onNewKey () {
    alert('Creating new API key...')
  }

  const paletteOpen = shallowRef(false)

  const commands = [
    { id: 'new-key', label: 'Create New API Key', group: 'Actions', action: () => alert('Creating new API key...') },
    { id: 'rotate', label: 'Rotate All Keys', group: 'Actions', action: () => alert('Rotating all API keys...') },
    { id: 'revoke', label: 'Revoke a Key', group: 'Actions', action: () => alert('Select a key to revoke.') },
    { id: 'analytics', label: 'View Analytics', group: 'Navigation', action: () => { tab.value = 'analytics' } },
    { id: 'keys', label: 'View API Keys', group: 'Navigation', action: () => { tab.value = 'keys' } },
    { id: 'settings', label: 'Open Settings', group: 'Navigation', action: () => { tab.value = 'settings' } },
    { id: 'docs', label: 'Open Documentation', group: 'Links', action: () => window.open('https://0.vuetifyjs.com', '_blank') },
    { id: 'github', label: 'View on GitHub', group: 'Links', action: () => window.open('https://github.com/vuetifyjs/0', '_blank') },
  ]
</script>

<template>
  <DkLayout>
    <template #sidebar>
      <div class="dk-sidebar">
        <h2 class="dk-sidebar__title">DevKey</h2>
        <nav class="dk-sidebar__nav">
          <DkCollapsible
            v-for="section in sidebarSections"
            :key="section.label"
            open
          >
            <template #activator>
              <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
                <path :d="section.icon" fill="currentColor" />
              </svg>
              {{ section.label }}
            </template>
            <ul class="dk-sidebar__list">
              <li
                v-for="item in section.items"
                :key="item"
                class="dk-sidebar__item"
              >
                {{ item }}
              </li>
            </ul>
          </DkCollapsible>
        </nav>
      </div>
    </template>

    <div class="dk-dashboard">
      <header class="dk-dashboard__header">
        <h1 class="dk-dashboard__title">Dashboard</h1>
        <div class="dk-dashboard__actions">
          <button class="dk-dashboard__new-key" type="button" @click="onNewKey">
            <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
              <path :d="mdiPlus" fill="currentColor" />
            </svg>
            New Key
          </button>
          <button class="dk-dashboard__new-key" type="button" @click="paletteOpen = true">
            <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
              <path :d="mdiMagnify" fill="currentColor" />
            </svg>
            Cmd+K
          </button>
        </div>
      </header>

      <div class="dk-dashboard__stats">
        <DkCard v-for="stat in stats" :key="stat.label" class="dk-dashboard__stat">
          <div class="dk-dashboard__stat-header">
            <svg class="dk-icon" viewBox="0 0 24 24" width="20" height="20">
              <path :d="stat.icon" fill="currentColor" />
            </svg>
            <p class="dk-dashboard__stat-label">{{ stat.label }}</p>
          </div>
          <p class="dk-dashboard__stat-value">{{ stat.value }}</p>
        </DkCard>
      </div>

      <DkTabs
        v-model="tab"
        :items="[
          { value: 'keys', label: 'API Keys' },
          { value: 'analytics', label: 'Analytics' },
          { value: 'settings', label: 'Settings' },
        ]"
      >
        <template #keys>
          <DkTable :items="apiKeys" />
        </template>
        <template #analytics>
          <DkCard>
            <h3 class="dk-dashboard__tab-title">Analytics</h3>
            <p class="dk-dashboard__tab-desc">Usage analytics and charts coming soon.</p>
          </DkCard>
        </template>
        <template #settings>
          <DkCard>
            <h3 class="dk-dashboard__tab-title">Settings</h3>
            <p class="dk-dashboard__tab-desc">Team and billing settings coming soon.</p>
          </DkCard>
        </template>
      </DkTabs>

      <DkCommandPalette v-model="paletteOpen" :commands="commands" />
    </div>
  </DkLayout>
</template>

<style scoped>
  .dk-sidebar__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--v0-theme-text);
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
  }

  .dk-sidebar__nav {
    display: flex;
    flex-direction: column;
  }

  .dk-sidebar__list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .dk-sidebar__item {
    padding: 0.375rem 1rem 0.375rem calc(1rem + 8px);
    border-radius: 0.375rem;
    color: var(--v0-theme-muted);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .dk-sidebar__item:hover {
    background: var(--v0-theme-background);
    color: var(--v0-theme-text);
  }

  .dk-dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .dk-dashboard__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dk-dashboard__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--v0-theme-text);
  }

  .dk-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .dk-dashboard__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .dk-dashboard__new-key {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--v0-theme-border);
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--v0-theme-text);
    background: var(--v0-theme-surface);
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .dk-dashboard__new-key:hover {
    background: var(--v0-theme-background);
  }

  .dk-dashboard__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .dk-dashboard__stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .dk-dashboard__stat-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--v0-theme-muted);
  }

  .dk-dashboard__stat-label {
    font-size: 0.8125rem;
    color: var(--v0-theme-muted);
    font-weight: 500;
  }

  .dk-dashboard__stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--v0-theme-text);
  }

  .dk-dashboard__tab-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-theme-text);
    margin-bottom: 0.5rem;
  }

  .dk-dashboard__tab-desc {
    color: var(--v0-theme-muted);
  }
</style>
