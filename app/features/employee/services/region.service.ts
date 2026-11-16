import { useApi } from '~/compasable/useApi'
import type { Region, RegionApiResponse } from '../types/region.types'

export const regionService = {
    async getProvinces(): Promise<Region[]> {
        const api = useApi()
        const response = await api<RegionApiResponse>('/regions/provinces')

        return response.data
    },

    async getCities(provinceId: string): Promise<Region[]> {
        const api = useApi()
        const response = await api<RegionApiResponse>(
            `/regions/provinces/${provinceId}/cities`,
        )

        return response.data
    },

    async getDistricts(cityId: string): Promise<Region[]> {
        const api = useApi()
        const response = await api<RegionApiResponse>(
            `/regions/cities/${cityId}/districts`,
        )

        return response.data
    },
}