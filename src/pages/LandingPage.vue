<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'
  import {
    mdiKeyVariant,
    mdiChartLine,
    mdiAccountGroup,
    mdiSpeedometer,
    mdiWebhook,
    mdiClipboardText,
    mdiChevronRight,
    mdiRocketLaunchOutline,
    mdiFlash,
    mdiShieldCrownOutline,
  } from '@mdi/js'
  import DkButton from '../components/DkButton.vue'
  import DkCard from '../components/DkCard.vue'
  import DkLogo from '../components/DkLogo.vue'
  import DkToggle from '../components/DkToggle.vue'

  defineOptions({ name: 'DkLandingPage' })

  const router = useRouter()

  const interval = shallowRef('monthly')

  const features = [
    { title: 'API Key Management', description: 'Create, rotate, and revoke API keys with granular permissions and usage tracking.', icon: mdiKeyVariant },
    { title: 'Real-time Analytics', description: 'Monitor API usage, latency, and error rates with live dashboards and alerts.', icon: mdiChartLine },
    { title: 'Team Collaboration', description: 'Invite teammates, assign roles, and manage access across your organization.', icon: mdiAccountGroup },
    { title: 'Rate Limiting', description: 'Configure per-key rate limits with automatic throttling and quota enforcement.', icon: mdiSpeedometer },
    { title: 'Webhook Events', description: 'Subscribe to key lifecycle events and receive notifications in real-time.', icon: mdiWebhook },
    { title: 'Audit Logs', description: 'Full audit trail of every API key action for compliance and debugging.', icon: mdiClipboardText },
  ]

  const plans = [
    { name: 'Starter', icon: mdiRocketLaunchOutline, monthly: 0, yearly: 0, features: ['5 API keys', '10k requests/month', 'Community support'] },
    { name: 'Pro', icon: mdiFlash, monthly: 29, yearly: 290, features: ['Unlimited keys', '1M requests/month', 'Priority support', 'Analytics'] },
    { name: 'Enterprise', icon: mdiShieldCrownOutline, monthly: 99, yearly: 990, features: ['Unlimited everything', 'SSO & SAML', 'Dedicated support', 'SLA'] },
  ]
</script>

<template>
  <div class="dk-landing">
    <header class="dk-landing__hero">
      <div class="dk-landing__brand">
        <DkLogo :size="40" class="dk-landing__brand-mark" />
        <span class="dk-landing__brand-wordmark">DevKey</span>
      </div>
      <h1 class="dk-landing__title">API Keys,<br>Done Right</h1>
      <p class="dk-landing__subtitle">
        The developer platform for managing API keys, permissions, and usage analytics.
      </p>
      <div class="dk-landing__actions">
        <DkButton variant="solid" size="lg" @click="router.push('/dashboard')">
          Get Started
        </DkButton>
        <DkButton variant="outline" size="lg" @click="router.push('/login')">
          Sign In
        </DkButton>
      </div>
    </header>

    <section class="dk-landing__features">
      <h2 class="dk-landing__section-title">Everything you need</h2>
      <div class="dk-landing__grid">
        <DkCard v-for="feature in features" :key="feature.title">
          <svg class="dk-icon dk-landing__feature-icon" viewBox="0 0 24 24" width="20" height="20">
            <path :d="feature.icon" fill="currentColor" />
          </svg>
          <h3 class="dk-landing__feature-title">{{ feature.title }}</h3>
          <p class="dk-landing__feature-desc">{{ feature.description }}</p>
        </DkCard>
      </div>
    </section>

    <section class="dk-landing__pricing">
      <h2 class="dk-landing__section-title">Simple pricing</h2>
      <div class="dk-landing__toggle">
        <DkToggle
          v-model="interval"
          :options="[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]"
        />
      </div>
      <div class="dk-landing__plans">
        <DkCard v-for="plan in plans" :key="plan.name" class="dk-landing__plan">
          <h3 class="dk-landing__plan-name">
            <svg class="dk-icon" viewBox="0 0 24 24" width="20" height="20">
              <path :d="plan.icon" fill="currentColor" />
            </svg>
            {{ plan.name }}
          </h3>
          <p class="dk-landing__plan-price">
            ${{ interval === 'monthly' ? plan.monthly : plan.yearly }}
            <span class="dk-landing__plan-period">/ {{ interval === 'monthly' ? 'mo' : 'yr' }}</span>
          </p>
          <ul class="dk-landing__plan-features">
            <li v-for="feat in plan.features" :key="feat">{{ feat }}</li>
          </ul>
          <DkButton variant="outline" size="md" class="dk-landing__plan-btn">
            Choose {{ plan.name }}
            <svg class="dk-icon" viewBox="0 0 24 24" width="16" height="16">
              <path :d="mdiChevronRight" fill="currentColor" />
            </svg>
          </DkButton>
        </DkCard>
      </div>
    </section>

    <footer class="dk-landing__footer">
      <p class="dk-landing__copyright">DevKey &mdash; Built by Vuetify with ❤️ using Vuetify0</p>
    </footer>
  </div>
</template>

<style scoped>
  .dk-landing {
    background: var(--v0-theme-background);
    color: var(--v0-theme-text);
    flex: 1;
  }

  .dk-landing__hero {
    text-align: center;
    padding: 6rem 2rem 4rem;
  }

  .dk-landing__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .dk-landing__brand-mark {
    color: #F6B04E;
  }

  .dk-landing__brand-wordmark {
    font-family: 'Geist', system-ui, sans-serif;
    font-weight: 800;
    font-size: 28px;
    letter-spacing: -0.02em;
  }

  .dk-landing__title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
  }

  .dk-landing__subtitle {
    font-size: 1.25rem;
    color: var(--v0-theme-muted);
    max-width: 480px;
    margin: 0 auto 2rem;
  }

  .dk-landing__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .dk-landing__features {
    padding: 4rem 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .dk-landing__section-title {
    text-align: center;
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .dk-landing__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .dk-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .dk-landing__feature-icon {
    color: var(--v0-theme-primary, #6366f1);
    margin-bottom: 0.75rem;
  }

  .dk-landing__feature-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .dk-landing__feature-desc {
    font-size: 0.9375rem;
    color: var(--v0-theme-muted);
    line-height: 1.5;
  }

  .dk-landing__pricing {
    padding: 4rem 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .dk-landing__toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .dk-landing__plans {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  .dk-landing__plan {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .dk-landing__plan-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .dk-landing__plan-price {
    font-size: 2rem;
    font-weight: 700;
  }

  .dk-landing__plan-period {
    font-size: 1rem;
    font-weight: 400;
    color: var(--v0-theme-muted);
  }

  .dk-landing__plan-features {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: var(--v0-theme-muted);
    font-size: 0.9375rem;
  }

  .dk-landing__footer {
    text-align: center;
    padding: 3rem 2rem;
    border-top: 1px solid var(--v0-theme-border);
  }

  .dk-landing__copyright {
    color: var(--v0-theme-muted);
    font-size: 0.875rem;
  }
</style>

<style>
  .dk-landing__plan-btn {
    width: 100%;
    justify-content: center;
    margin-top: auto;
  }
</style>
