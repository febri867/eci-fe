export interface Region {
    id: string
    name: string
}

export interface RegionApiResponse {
    data: Region[]
    meta: {
        level: number
    }
}