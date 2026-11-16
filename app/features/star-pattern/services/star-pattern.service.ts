import type {
    StarPatternRequest,
    StarPatternResponse,
} from '../types/star-pattern.types'
import {useApi} from "~/compasable/useApi.ts";

export const useStarPatternService = () => {
    const api = useApi()

    const generate = (payload: StarPatternRequest) => {
        return api<StarPatternResponse>('/star-pattern', {
            method: 'POST',
            body: payload,
        })
    }

    return {
        generate,
    }
}