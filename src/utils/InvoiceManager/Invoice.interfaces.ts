export type ProductStatus = "Assembly" | "Assembled" | "Delivered"

export interface ProductEntity {
    article: number
    title: string
    count: number
    status: ProductStatus,
    history?: {
        title: string,
        date: number,
    }
}

export interface InvoiceEntity {
    name: string,
    products?: ProductEntity[],
    createdAt: number,
    closedAt?: number,
}

export interface InvoiceWithId extends InvoiceEntity {
    id: string
}
