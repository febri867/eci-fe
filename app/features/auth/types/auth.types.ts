export interface LoginPayload {
    email: string
    password: string
    turnstileToken: string
}

export interface AuthUser {
    id: string
    name: string
    email: string
}

export interface LoginResponse {
    user: AuthUser
}