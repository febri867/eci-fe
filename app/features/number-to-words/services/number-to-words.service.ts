import type {
    NumberToWordsRequest,
    NumberToWordsResponse,
} from '../types/number-to-words.types'
import {useApi} from "~/compasable/useApi.ts";

export const useNumberToWordsService = () => {
    const api = useApi()

    const convert = (payload: NumberToWordsRequest) => {
        return api<NumberToWordsResponse>('/number-to-words', {
            method: 'POST',
            body: payload,
        })
    }

    return {
        convert,
    }
}