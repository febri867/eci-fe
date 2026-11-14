import { ref } from 'vue'
import { authService } from '../services/auth.service'
import type { LoginPayload, AuthUser } from '../types/auth.types'

export const useAuth = () => {
    const user = ref<AuthUser | null>(null)
    const isLoading = ref(false)
    const errorMessage = ref('')
    const setErrorMessage = (message: string) => {
        errorMessage.value = message
    }

    const login = async (payload: LoginPayload) => {
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await authService.login(payload)

            user.value = response.user

            await navigateTo('/dashboard')
        } catch (error: any) {
            errorMessage.value =
                error.data?.message || 'Login gagal. Periksa email dan password.'
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        isLoading,
        errorMessage,
        setErrorMessage,
        login,
    }
}