"use server"

interface Product {
    product_id: string
    minimum: string
    image: string
    name: string
    extra_info: string
    price: string
    special: boolean
    url: string
}

export async function getProduct(formData: FormData) {
    const article = formData.get("article")

    if (!article) return undefined

    const response = await fetch(`https://mini-max.com.ua/index.php?route=extension/module/live_search&filter_name=${article}`)

    if (!response.ok) return undefined
    const data = await response.json()
    const products = data.products as Product[]

    if (!products) return undefined

    return products.find(product => product.product_id === article)
}
