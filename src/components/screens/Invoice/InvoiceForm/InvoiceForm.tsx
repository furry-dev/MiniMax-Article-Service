"use client"

import styles from "./InvoiceForm.module.sass"
import {InvoiceWithId, ProductEntity, ProductStatus} from "@/utils/InvoiceManager/Invoice.interfaces"
import StatusBtn from "@/components/screens/Invoice/StatusBtn/StatusBtn"
import {useEffect, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"

export default function InvoiceForm({invoice}: { invoice: InvoiceWithId }) {
    const [products, setProducts] = useState<ProductEntity[]>(invoice.products || [])

    useEffect(() => {
        setProducts([
            ...(invoice.products || []),
            {article: 0, title: "", count: 1, status: "Assembly"}
        ])
    }, [invoice])

    const [invalidFields, setInvalidFields] = useState<number[]>([])

    useEffect(() => {
        const invalidIndexes: number[] = products
            .map((product, index) => (product.count < 1 ? index : -1))
            .filter(index => index !== -1)

        setInvalidFields(invalidIndexes)

        if (invalidIndexes.length > 0) return

        InvoiceManager.updateInvoiceProducts(invoice.id, products.filter(value => value.article > 0))
    }, [invoice.id, products])

    const setStatus = (index: number, status: ProductStatus) => {
        setProducts(prevProducts =>
            prevProducts.map((product, i) =>
                i === index ? {...product, status} : product
            )
        )
    }

    const handleInputChange = (index: number, field: keyof ProductEntity, value: string | number) => {
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
                    {article: 0, title: "", count: 1, status: "Assembly"}
                ]
            }

            return updatedProducts
        })
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const {name, value} = e.target as unknown as HTMLInputElement
        const [indexStr, field] = name.split("-")
        const index = parseInt(indexStr)


        if (!isNaN(index) && field) {
            handleInputChange(index, field as keyof ProductEntity, value)
        }
    }

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            const form = e.currentTarget
            const activeElement = document.activeElement

            if (activeElement && activeElement.tagName === "INPUT") {
                const inputs = Array.from(form.querySelectorAll("input"))
                const index = inputs.indexOf(activeElement as HTMLInputElement)

                if (index >= 0 && index < inputs.length - 1) {
                    inputs[index + 1].focus()
                    e.preventDefault()
                }
            }
        }
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLFormElement>) => {
        if (!(e.target instanceof HTMLInputElement)) return
        e.target.select()
        e.preventDefault()
    }

    return (
        <form
            className={styles.form}
            onChange={handleFormChange}
            onKeyDown={handleFormKeyDown}
            onFocus={handleInputFocus}
        >
            <div className={styles.meta}>
                <h2>{invoice.name} | <small>id: {invoice.id}</small></h2>
                <span>Всього позицій: {invoice.products?.length || 0}</span>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.namesTable}>
                    <colgroup>
                        <col style={{width: "90px"}}/>
                        <col style={{width: "calc(min(100vw, 500px) - 250px)"}}/>
                        <col style={{width: "60px"}}/>
                        <col style={{width: "100px"}}/>
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Артикул</th>
                            <th>Назва</th>
                            <th>к-сть</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item, index) => (
                            <tr
                                key={index}
                                className={
                                    invalidFields.includes(index)
                                        ? styles.invalid
                                        : ""
                                }
                            >
                                <td>
                                    <input
                                        type="number"
                                        name={`${index}-article`}
                                        value={item.article}
                                        min={0}
                                        step={1}
                                    />
                                </td>
                                <td className={styles.name}>
                                    {item.title}
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name={`${index}-count`}
                                        value={item.count}
                                        min={1}
                                        step={1}
                                    />
                                </td>
                                <td>
                                    <StatusBtn status={item.status} setStatus={(status) => setStatus(index, status)}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </form>
    )
}
