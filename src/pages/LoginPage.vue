<script setup lang="ts">
  import { Form } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'
  import DkButton from '../components/DkButton.vue'
  import DkCard from '../components/DkCard.vue'
  import DkInput from '../components/DkInput.vue'
  import DkLogo from '../components/DkLogo.vue'

  defineOptions({ name: 'DkLoginPage' })

  const router = useRouter()
  const email = shallowRef('')
  const password = shallowRef('')
  const loading = shallowRef(false)

  async function onSubmit (submit: () => Promise<boolean>) {
    loading.value = true
    const valid = await submit()

    if (!valid) {
      loading.value = false
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/dashboard')
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="dk-login">
    <DkCard class="dk-login__card">
      <DkLogo :size="40" class="dk-login__mark" />
      <h1 class="dk-login__title">Sign in to DevKey</h1>
      <p class="dk-login__subtitle">Enter your credentials to access the dashboard</p>

      <Form class="dk-login__form" v-slot="{ submit, isValid, isValidating }">
          <DkInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            :rules="['required', 'email']"
          />

          <DkInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            :rules="['required', (v: unknown) => (v as string).length >= 8 || 'Must be at least 8 characters']"
          />

          <DkButton
            :loading="loading || isValidating"
            :disabled="isValid === false"
            variant="solid"
            size="lg"
            @click="onSubmit(submit)"
          >
            Sign In
          </DkButton>
      </Form>
    </DkCard>
  </div>
</template>

<style scoped>
  .dk-login {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: var(--v0-theme-background);
  }

  .dk-login__card {
    max-width: 420px;
    width: 100%;
    height: auto;
    padding: 2rem;
  }

  .dk-login__mark {
    color: #F6B04E;
    margin-bottom: 16px;
  }

  .dk-login__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--v0-theme-text);
  }

  .dk-login__subtitle {
    color: var(--v0-theme-muted);
    margin-bottom: 1.5rem;
  }

  .dk-login__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
</style>
