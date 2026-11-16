import type {
    HistoryFilters,
    HistoryResponse,
} from '../types/history.types'
import {useApi} from "~/compasable/useApi.ts";

export const historyService = {
    getAll(
        filters: HistoryFilters = {},
        page = 1,
        limit = 10,
    ) {
        const api = useApi()

        return api<HistoryResponse>('/logs', {
            query: {
                ...filters,
                page,
                limit,
            },
        })
    },
}
