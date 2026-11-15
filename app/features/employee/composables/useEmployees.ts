import { ref } from 'vue'
import type {
    Employee,
    EmployeeFilters,
} from '../types/employee.types'
import { employeeService } from '../services/employee.service'

export const useEmployees = () => {
    const employees = ref<Employee[]>([])
    const filters = ref<EmployeeFilters>({})

    const page = ref(1)
    const limit = 10
    const hasMore = ref(true)

    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const errorMessage = ref('')

    const loadEmployees = async (reset = false) => {
        if (reset) {
            page.value = 1
            hasMore.value = true
            employees.value = []
        }

        if (!hasMore.value || isLoading.value || isLoadingMore.value) return

        const isFirstPage = page.value === 1

        if (isFirstPage) {
            isLoading.value = true
        } else {
            isLoadingMore.value = true
        }

        errorMessage.value = ''

        try {
            const response = await employeeService.getAll({
                ...filters.value,
                page: page.value,
                limit,
            })

            employees.value = isFirstPage
                ? response.data
                : [...employees.value, ...response.data]

            hasMore.value = response.hasMore
            page.value += 1
        } catch (error: any) {
            errorMessage.value =
                error.data?.message || 'Gagal mengambil data employee'
        } finally {
            isLoading.value = false
            isLoadingMore.value = false
        }
    }

    const applyFilters = async (newFilters: EmployeeFilters) => {
        filters.value = newFilters
        await loadEmployees(true)
    }

    const loadMore = () => loadEmployees()

    return {
        employees,
        filters,
        page,
        hasMore,
        isLoading,
        isLoadingMore,
        errorMessage,
        loadEmployees,
        applyFilters,
        loadMore,
    }
}