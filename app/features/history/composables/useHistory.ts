import { historyService } from '../services/history.service'
import type {
    ActivityLog,
    HistoryFilters, HistorySummary,
} from '../types/history.types'

export const useHistory = () => {
    const logs = ref<ActivityLog[]>([])
    const filters = ref<HistoryFilters>({})
    const page = ref(1)
    const limit = 10
    const total = ref(0)
    const hasMore = ref(false)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const summary = ref<HistorySummary>({
        total: 0,
        created: 0,
        updated: 0,
        deleted: 0,
    })

    const loadLogs = async (reset = false) => {
        if (loading.value) return

        if (reset) {
            page.value = 1
            logs.value = []
        }

        loading.value = true
        error.value = null

        try {
            const response = await historyService.getAll(
                filters.value,
                page.value,
                limit,
            )

            logs.value = reset
                ? response.data
                : [...logs.value, ...response.data]

            total.value = response.total
            hasMore.value = response.hasMore
            summary.value = response.summary
        } catch {
            error.value = 'Failed to load activity logs'
        } finally {
            loading.value = false
        }
    }

    const applyFilters = async (newFilters: HistoryFilters) => {
        filters.value = newFilters
        await loadLogs(true)
    }

    const loadMore = async () => {
        if (!hasMore.value || loading.value) return

        page.value += 1
        await loadLogs()
    }

    return {
        logs,
        filters,
        page,
        total,
        hasMore,
        loading,
        error,
        loadLogs,
        applyFilters,
        loadMore,
        summary,
    }
}
