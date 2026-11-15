import type {
    LoginPayload,
    LoginResponse, MeResponse,
} from '../types/auth.types'
import {useApi} from "~/compasable/useApi.ts";

export const authService = {
    login(payload: LoginPayload) {
        const api = useApi()

        return api<LoginResponse>('/auth/login', {
            method: 'POST',
            body: payload,
        })
    },
    me() {
        const api = useApi()

        return api<MeResponse>('/auth/me')
    },

    logout() {
        const api = useApi()

        return api('/auth/logout', {
            method: 'POST',
        })
    },
}