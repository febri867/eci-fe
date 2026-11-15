import type { RegionApiResponse } from '../types/region.types'

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/v2'

export const regionService = {
    async getProvinces() {
        const response = await $fetch<RegionApiResponse>(
            `${BASE_URL}/provinces.json`,
        )
        return response.data
    },

    async getCities(provinceId: string) {
        const response = await $fetch<RegionApiResponse>(
            `${BASE_URL}/regencies/${provinceId}.json`,
        )
        return response.data
    },

    async getDistricts(cityId: string) {
        const response = await $fetch<RegionApiResponse>(
            `${BASE_URL}/districts/${cityId}.json`,
        )
        return response.data
    },
}