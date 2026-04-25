<script setup lang="ts">
  defineOptions({ name: 'DkLogo' })

  const { size = 32 } = defineProps<{
    size?: number
  }>()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    role="img"
    aria-label="DevKey"
  >
    <rect x="6" y="18" width="28" height="28" rx="8" stroke="currentColor" stroke-width="5" fill="none"/>
    <circle cx="20" cy="32" r="3" fill="currentColor"/>
    <rect x="34" y="29.5" width="26" height="5" fill="currentColor"/>
    <rect x="46" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
    <rect x="55" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
  </svg>
</template>
