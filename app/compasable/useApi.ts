export const useApi = () => {
    const config = useRuntimeConfig()

    const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined

    return $fetch.create({
        baseURL: config.public.apiBaseUrl as string,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...headers,
        },
    })
}