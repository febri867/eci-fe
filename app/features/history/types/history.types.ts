
export interface ActivityLog {
    id: string
    action: string
    actorId: string
    entityId: string
    before?: Record<string, unknown>
    after?: Record<string, unknown>
    status: string
    attempts: number
    createdAt: string
    processedAt?: string
}

export interface HistoryFilters {
    action?: string
    actorId?: string
    startDate?: string
    endDate?: string
}

export interface HistoryResponse {
    data: ActivityLog[]
    page: number
    limit: number
    total: number
    hasMore: boolean
    summary: HistorySummary
}

export interface HistorySummary {
    total: number
    created: number
    updated: number
    deleted: number
}
