<script setup lang="ts">
import TurnstileWidget from '~/components/ui/TurnstileWidget.vue'
import {useLoginForm} from "~/compasable/useLoginForm.ts";
import {useAuth} from "~/features/auth/composables/useAuth.ts";
import {loginSchema} from "~/features/auth/schemas/login.schema.ts";

definePageMeta({
  middleware: 'guest',
})

const {
  email,
  password,
  showPassword,
} = useLoginForm()

const turnstileToken = ref('')

const {
  login,
  isLoading: isLoadingAuth,
  errorMessage,
  setErrorMessage,
} = useAuth()

const handleSubmit = async () => {

  setErrorMessage('')
  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  })

  if (!result.success) {
    setErrorMessage(result.error.issues[0]?.message || 'Input tidak valid')
    return
  }

  if (!turnstileToken.value) {
    setErrorMessage('Silakan selesaikan verifikasi keamanan')
    return
  }

  await login({
    ...result.data,
    turnstileToken: turnstileToken.value,
  })
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-10">
    <section class="w-full max-w-[440px]">

      <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,100,208,0.08)]">
        <div class="bg-[#0878d1] px-7 py-7 text-white sm:px-9">
          <h1 class="text-2xl font-bold">Login</h1>
          <p class="mt-2 text-sm text-white/85">
            Masuk ke akun Electronic City Anda.
          </p>
        </div>

        <div class="px-7 py-8 sm:px-9">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label for="email" class="mb-2 block text-sm font-semibold text-[#333333]">
                Email
              </label>
              <input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="Masukkan email"
                  class="w-full rounded-lg border border-[#d9e1ea] px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0878d1] focus:ring-2 focus:ring-[#0878d1]/15"
              >
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <label for="password" class="text-sm font-semibold text-[#333333]">
                  Password
                </label>
                <a
                    href="/forgot-password"
                    class="text-xs font-medium text-[#0878d1] transition hover:text-[#ff8a00]"
                >
                  Lupa password?
                </a>
              </div>

              <div class="flex rounded-lg border border-[#d9e1ea] transition focus-within:border-[#0878d1] focus-within:ring-2 focus-within:ring-[#0878d1]/15">
                <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="Masukkan password"
                    class="min-w-0 flex-1 rounded-lg px-4 py-3 text-sm outline-none"
                >
                <button
                    type="button"
                    class="px-4 text-xs font-semibold text-[#0878d1] transition hover:text-[#ff8a00]"
                    @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
                </button>
              </div>
            </div>

            <TurnstileWidget
                @verified="turnstileToken = $event"
                @expired="turnstileToken = ''"
                @error="turnstileToken = ''"
            />

            <p
                v-if="errorMessage"
                class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                role="alert"
            >
              {{ errorMessage }}
            </p>

            <button
                type="submit"
                :disabled="isLoadingAuth"
                class="w-full rounded-lg bg-[#0878d1] py-3.5 text-sm font-bold text-white transition hover:bg-[#0568b8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isLoadingAuth ? 'Memproses...' : 'Masuk' }}
            </button>
          </form>

          <div class="mt-7 border-t border-gray-100 pt-6 text-center">
            <p class="text-sm text-gray-500">
              Belum punya akun?
              <a
                  href="/register"
                  class="font-semibold text-[#0878d1] transition hover:text-[#ff8a00]"
              >
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-gray-400">
        © {{ new Date().getFullYear() }} Electronic City Indonesia
      </p>
    </section>
  </main>
</template>
