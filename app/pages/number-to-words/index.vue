
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNumberToWordsService } from '~/features/number-to-words/services/number-to-words.service.ts'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const service = useNumberToWordsService()

const amount = ref('')
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

const formatNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits).toLocaleString('id-ID') : ''
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  amount.value = formatNumber(target.value)
}

const convert = async () => {
  const number = Number(amount.value.replace(/\D/g, ''))

  if (!amount.value || !Number.isSafeInteger(number)) {
    error.value = 'Please enter a valid number'
    return
  }

  loading.value = true
  error.value = ''
  result.value = ''

  try {
    const response = await service.convert({ number })
    result.value = response.text
  } catch {
    error.value = 'Failed to convert number. Please try again.'
  } finally {
    loading.value = false
  }
}

const copyResult = async () => {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)
  } catch {
    error.value = 'Unable to copy result'
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
            Number to Words
          </h1>

          <p class="mt-1 text-sm text-slate-500">
            Convert numeric values into Indonesian words.
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
          <form class="space-y-5" @submit.prevent="convert">
            <div>
              <label
                  for="amount"
                  class="mb-2 block text-sm font-medium text-slate-700"
              >
                Enter Amount (IDR)
              </label>

              <input
                  id="amount"
                  :value="amount"
                  type="text"
                  inputmode="numeric"
                  placeholder="Example: 1.500.000"
                  class="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                  @input="handleInput"
              />
            </div>

            <p v-if="error" class="text-sm text-red-600">
              {{ error }}
            </p>

            <button
                type="submit"
                :disabled="loading || !amount"
                class="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ loading ? 'Converting...' : 'Convert to Words' }}
            </button>
          </form>
        </section>

        <section
            v-if="result"
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <p class="text-sm font-medium text-slate-500">
            Conversion Result
          </p>

          <p class="mt-3 text-lg font-semibold text-slate-900">
            {{ result }}
          </p>

          <button
              type="button"
              class="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="copyResult"
          >
            Copy Result
          </button>
        </section>
      </div>
    </div>
  </main>
</template>
