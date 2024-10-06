import styles from "./Product.module.sass"
import StatusBtn from "@/components/forms/InvoiceForm/ProductsTable/Product/StatusBtn/StatusBtn"
import React, {SetStateAction} from "react"
import {ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"
import {getProduct} from "@/utils/livesearch"
import CountInput from "@/components/forms/InvoiceForm/ProductsTable/Product/CountInput/CountInput"
import ArticleInput from "@/components/forms/InvoiceForm/ProductsTable/Product/ArticleInput/ArticleInput"

interface ProductProps {
    index: number
    closed?: boolean,
    paid?: boolean,
    item: ProductEntity
    containerRef: React.MutableRefObject<HTMLElement | null>
    setProducts: React.Dispatch<SetStateAction<ProductEntity[]>>
    invalid: boolean
}

export default function Product(
    {
        index,
        closed,
        paid,
        item,
        containerRef,
        setProducts,
        invalid
    }: ProductProps
) {
    const handleInputChange = async (index: number, field: keyof ProductEntity, value: string | number) => {
        if (paid) return

        setProducts(prevProducts => {
            let updatedProducts = prevProducts.map((product, i) =>
                i === index ? {...product, [field]: value} : product
            )

            if (field === "article" && value === "") {
                updatedProducts = updatedProducts.filter((_, i) => i !== index)
            }

            const lastProduct = updatedProducts[updatedProducts.length - 1]
            if (lastProduct.article) {
                return [
                    ...updatedProducts,
                    {article: 0, title: "", count: 1, status: "Assembly", warehouse: "shop"}
                ]
            }

            return updatedProducts
        })

        if (field === "article" && value) {
            const formData = new FormData()
            formData.set("article", value.toString())

            try {
                const productData = await getProduct(formData)
                const productTitle = productData?.name || ""

                setProducts(prevProducts =>
                    prevProducts.map((product, i) =>
                        i === index ? {...product, title: productTitle} : product
                    )
                )
            } catch (error) {
                console.error("Ошибка при получении названия продукта:", error)
            }
        }
    }

    const tabulationOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const activeElement = document.activeElement

        if (activeElement && activeElement.tagName === "INPUT" && containerRef?.current) {
            const inputs = Array.from(containerRef.current.querySelectorAll("input"))
            const index = inputs.indexOf(activeElement as HTMLInputElement)

            if (index >= 0 && index < inputs.length - 1) {
                inputs[index + 1].focus()
                e.preventDefault()
            }
        }
    }

    return (
        <tr className={`${styles.product} ${invalid ? styles.invalid : ""}`}>
            <td>
                <ArticleInput
                    tabulationOnEnter={tabulationOnEnter}
                    containerRef={containerRef}
                    name={`${index}-article`}
                    value={item.article === 0 ? "" : item.article}
                    onChange={(e) => handleInputChange(index, "article", e.target.value)}
                />
            </td>
            <td className={styles.name}>
                {item.title}
            </td>
            <td>
                <CountInput
                    tabulationOnEnter={tabulationOnEnter}
                    name={`${index}-count`}
                    value={item.count}
                    onChange={(e) => handleInputChange(index, "count", e.target.value)}/>
            </td>
            <td
                className={styles.warehouse}
                style={{backgroundColor: item.warehouse === "warehouse" ? "#1e90ff" : "#FF69B4"}}
            >
                {item.warehouse === "warehouse" ? "С" : "М"}
            </td>
            <td>
                <StatusBtn closed={closed} name={`${index}-status`} index={index} product={item}
                    setProducts={setProducts}/>
            </td>
        </tr>
    )
}