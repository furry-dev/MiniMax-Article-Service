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
    id: number,
    locked: boolean,
    name: string,
    products: ProductEntity[]
}