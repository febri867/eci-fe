import type {
    LoginPayload,
    LoginResponse,
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
}