type SnackbarType = 'success' | 'error'

export const useSnackbar = () => {
    const message = useState<string>('message', () => '')
    const type = useState<SnackbarType>('success')
    const visible = useState<boolean>('visible', () => false)

    const show = (text: string, variant: SnackbarType = 'success') => {
        message.value = text
        type.value = variant
        visible.value = true
    }

    const hide = () => {
        visible.value = false
    }

    return {
        message,
        type,
        visible,
        show,
        hide,
    }
}