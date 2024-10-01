export type RevaluationType = "sticker" | "tag"

export interface RevaluationListEntity {
    article: number
    title: string
    count: number
    type: RevaluationType
}

export interface RevaluationEntity {
    name: string,
    revaluationList?: RevaluationListEntity[],
    createdAt: number,
    closedAt?: number,
    createdBy: string,
    closedBy?: string,
}

export interface RevaluationWithId extends RevaluationEntity {
    id: string
}
