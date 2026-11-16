
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { StarPatternType } from '~/features/star-pattern/types/star-pattern.types'
import { useStarPatternService } from '~/features/star-pattern/services/star-pattern.service.ts'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const service = useStarPatternService()

const rows = ref(5)
const pattern = ref<StarPatternType>('triangle')
const result = ref('')
const loading = ref(false)
const error = ref('')

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }

  navigateTo('/dashboard')
}

const generate = async () => {
  loading.value = true
  error.value = ''
  result.value = ''

  try {
    const response = await service.generate({
      rows: rows.value,
      pattern: pattern.value,
    })

    result.value = response.result
  } catch {
    error.value = 'Failed to generate pattern. Please try again.'
  } finally {
    loading.value = false
  }
}

const copyResult = async () => {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)
  } catch {
    error.value = 'Unable to copy result.'
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
              type="button"
              class="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              @click="goBack"
          >
            <span>←</span>
            Back
          </button>

          <h1 class="text-2xl font-bold text-slate-900">
            Star Pattern Generator
          </h1>

          <p class="mt-1 text-sm text-slate-500">
            Generate different star patterns by selecting a pattern and number of rows.
          </p>
        </div>

        <NuxtLink
            to="/dashboard"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Dashboard
        </NuxtLink>
      </div>

      <div class="max-w-2xl space-y-5">
        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <form class="space-y-5" @submit.prevent="generate">
            <div>
              <label
                  for="rows"
                  class="mb-2 block text-sm font-medium text-slate-700"
              >
                Number of Rows
              </label>

              <input
                  id="rows"
                  v-model.number="rows"
                  type="number"
                  min="1"
                  max="50"
                  required
                  class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />

              <p class="mt-1 text-xs text-slate-500">
                Choose between 1 and 50 rows.
              </p>
            </div>

            <div>
              <label
                  for="pattern"
                  class="mb-2 block text-sm font-medium text-slate-700"
              >
                Pattern Type
              </label>

              <div class="relative">
                <select
                    id="pattern"
                    v-model="pattern"
                    class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="triangle">Triangle</option>
                  <option value="inverted">Inverted Triangle</option>
                  <option value="pyramid">Pyramid</option>
                </select>

                <span
                    class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500"
                >
                  ▼
                </span>
              </div>
            </div>

            <p v-if="error" class="text-sm text-red-600">
              {{ error }}
            </p>

            <button
                type="submit"
                :disabled="loading || rows < 1 || rows > 50"
                class="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ loading ? 'Generating...' : 'Generate Pattern' }}
            </button>
          </form>
        </section>

        <section
            v-if="result"
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-slate-900">
                Generated Result
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                {{ pattern }} · {{ rows }} rows
              </p>
            </div>

            <button
                type="button"
                class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                @click="copyResult"
            >
              Copy
            </button>
          </div>

          <pre class="mt-5 overflow-x-auto rounded-lg bg-slate-950 p-5 font-mono text-sm leading-7 text-green-400">{{ result }}</pre>
        </section>
      </div>
    </div>
  </main>
</template>
