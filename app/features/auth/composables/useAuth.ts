import { ref } from 'vue'
import { authService } from '../services/auth.service'
import type { LoginPayload, AuthUser } from '../types/auth.types'
import {useSnackbar} from "~/compasable/useSnackbar.ts";

export const useAuth = () => {
    const user = useState<AuthUser | null>('auth:user', () => null)
    const isLoading = useState<boolean>('auth:loading', () => false)
    const errorMessage = useState<string>('auth:error', () => '')
    const setErrorMessage = (message: string) => {
        errorMessage.value = message
    }
    const snackbar = useSnackbar()

    const login = async (payload: LoginPayload) => {
        isLoading.value = true
        errorMessage.value = ''
        try {
            const response = await authService.login(payload)

            user.value = response.user
            snackbar.show('Login berhasil', 'success')
            await navigateTo('/dashboard')
        } catch (error: any) {
            const message =
                error.data?.message ||
                error.response?._data?.message ||
                error.message ||
                'Login gagal. Silakan coba kembali.'

            errorMessage.value = message
            snackbar.show(message, 'error')
        } finally {
            isLoading.value = false
        }
    }

    const fetchUser = async () => {
        try {
            const response = await authService.me()
            user.value = response.user
        } catch {
            user.value = null
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
            snackbar.show('Logout berhasil', 'success')
        }
        catch {
            snackbar.show('Logout gagal', 'error')
        } finally {
            user.value = null
            await navigateTo('/login')
        }
    }

    return {
        user,
        isLoading,
        errorMessage,
        setErrorMessage,
        login,
        fetchUser,
        logout,
    }
}