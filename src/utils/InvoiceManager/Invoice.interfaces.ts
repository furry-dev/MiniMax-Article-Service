export type ProductStatus = "Assembly" | "Assembled" | "Delivered"

export interface ProductEntity {
    article: number
    title: string
    count: number
    status: ProductStatus,
    history?: {
        title: string,
        date: string,
    }
}

export interface InvoiceEntity {
    name: string,
    products?: ProductEntity[],
    createdAt: string,
    closedAt?: string,
}

export interface InvoiceWithId extends InvoiceEntity {
    id: string
}
