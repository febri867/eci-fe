export interface Employee {
    id: string
    name: string
    position: string
    grade: string
    salary: number
    address: string
    province: string
    city: string
    district: string
    birthDate: string
    createdAt: string
    updatedAt: string
}

export interface EmployeeFilters {
    search?: string
    grade?: string
    minAge?: number
    maxAge?: number
    province?: string
    city?: string
    district?: string
}

export interface EmployeeListResponse {
    data: Employee[]
    page: number
    limit: number
    total: number
    hasMore: boolean
}