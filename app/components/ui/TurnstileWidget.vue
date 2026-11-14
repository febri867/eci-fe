<script setup lang="ts">
const emit = defineEmits<{
  verified: [token: string]
  expired: []
  error: []
}>()

const config = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)

let script: HTMLScriptElement | null = null
let widgetId: string | null = null

declare global {
  interface Window {
    turnstile?: {
      render: (
          container: HTMLElement,
          options: Record<string, unknown>
      ) => string
      remove: (id: string) => void
    }
  }
}

onMounted(async () => {
  const siteKey = config.public.turnstileSiteKey

  if (!siteKey) {
    emit('error')
    return
  }

  if (!window.turnstile) {
    script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true

    document.head.appendChild(script)

    await new Promise<void>((resolve, reject) => {
      script!.addEventListener('load', () => resolve(), { once: true })
      script!.addEventListener('error', () => reject(), { once: true })
    }).catch(() => emit('error'))
  }

  if (!window.turnstile || !container.value) return

  widgetId = window.turnstile.render(container.value, {
    sitekey: siteKey,
    callback: (token: string) => emit('verified', token),
    'expired-callback': () => emit('expired'),
    'error-callback': () => emit('error'),
    theme: 'light',
    size: 'flexible',
  })
})

onBeforeUnmount(() => {
  if (widgetId && window.turnstile) {
    window.turnstile.remove(widgetId)
  }
})
</script>

<template>
  <div ref="container" class="min-h-[65px]" />
</template>
