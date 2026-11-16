export type StarPatternType = 'triangle' | 'inverted' | 'pyramid'

export interface StarPatternRequest {
    rows: number
    pattern: StarPatternType
}

export interface StarPatternResponse {
    rows: number
    pattern: StarPatternType
    result: string
}