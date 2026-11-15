export const useLoginForm = () => {
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)

    return {
        email,
        password,
        showPassword,
    }
}
