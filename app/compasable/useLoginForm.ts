import { z } from 'zod'

const schema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const useLoginForm = () => {
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const errorMessage = ref('')
    const isLoading = ref(false)

    const validate = () => {
        const result = schema.safeParse({
            email: email.value,
            password: password.value,
        })

        if (!result.success) {
            errorMessage.value =
                result.error.issues[0]?.message ?? 'Input tidak valid'
            return false
        }

        return true
    }

    return {
        email,
        password,
        showPassword,
        errorMessage,
        isLoading,
        validate,
    }
}
