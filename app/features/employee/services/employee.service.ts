
import type {
    Employee,
    EmployeeFilters,
    EmployeeListResponse,
} from '../types/employee.types'
import {useApi} from "~/compasable/useApi.ts";
import type { EmployeeFormData } from '../schemas/employee.schema'

export const employeeService = {
    getAll(params: EmployeeFilters & {
        page?: number
        limit?: number
    }) {
        const api = useApi()

        return api<EmployeeListResponse>('/employees', {
            query: params,
        })
    },

    getById(id: string) {
        const api = useApi()

        return api<Employee>(`/employees/${id}`)
    },

    create(payload: EmployeeFormData) {
        const api = useApi()

        return api<Employee>('/employees', {
            method: 'POST',
            body: payload,
        })
    },

    update(id: string, payload: EmployeeFormData) {
        const api = useApi()

        return api<Employee>(`/employees/${id}`, {
            method: 'PUT',
            body: payload,
        })
    },

    delete(id: string) {
        const api = useApi()

        return api(`/employees/${id}`, {
            method: 'DELETE',
        })
    },
}
