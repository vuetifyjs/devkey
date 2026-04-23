<script setup lang="ts">
  import { mdiGithub, mdiHome, mdiLogin, mdiViewDashboard } from '@mdi/js'

  defineOptions({ name: 'App' })
</script>

<template>
  <nav class="dk-nav">
    <router-link class="dk-nav__link" to="/">
      <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
        <path :d="mdiHome" fill="currentColor" />
      </svg>
      Home
    </router-link>
    <router-link class="dk-nav__link" to="/login">
      <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
        <path :d="mdiLogin" fill="currentColor" />
      </svg>
      Login
    </router-link>
    <router-link class="dk-nav__link" to="/dashboard">
      <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
        <path :d="mdiViewDashboard" fill="currentColor" />
      </svg>
      Dashboard
    </router-link>
    <a
      class="dk-nav__link dk-nav__link--github"
      href="https://github.com/vuetifyjs/devkey"
      target="_blank"
      rel="noopener"
    >
      <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
        <path :d="mdiGithub" fill="currentColor" />
      </svg>
      GitHub
    </a>
  </nav>

  <router-view />
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #app {
    height: 100%;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--v0-theme-background);
    color: var(--v0-theme-text);
  }

  #app {
    display: flex;
    flex-direction: column;
  }

  .dk-nav {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--v0-theme-surface);
    border-bottom: 1px solid var(--v0-theme-border);
  }

  .dk-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .dk-nav__link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    color: var(--v0-theme-muted);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: color 0.15s ease;
    text-decoration: none;
  }

  .dk-nav__link:hover {
    color: var(--v0-theme-text);
  }

  .dk-nav__link.router-link-active {
    color: var(--v0-theme-primary);
  }

  .dk-nav__link--github {
    margin-left: auto;
  }
</style>
