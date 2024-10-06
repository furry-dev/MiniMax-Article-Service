export type ProductStatus = "Assembly" | "Assembled" | "Delivered"
export type InvoiceType = "wholesale" | "retail"
export type WarehouseType = "warehouse" | "shop"

export interface ProductEntity {
    article: number
    title: string
    count: number
    warehouse: WarehouseType
    status: ProductStatus
    history?: {
        title: string
        date: number
    }
}

export interface InvoiceEntity {
    name: string
    invoiceType: InvoiceType
    products?: ProductEntity[]
    createdAt: number
    paidAt?: number
    closedAt?: number
    createBy: string
}

export interface InvoiceWithId extends InvoiceEntity {
    id: string
}

export function isInvoiceType(invoiceType: any): invoiceType is InvoiceType {
    return ["wholesale", "retail"].includes(invoiceType)
}
