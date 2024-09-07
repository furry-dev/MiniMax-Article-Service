"use client"

import styles from "./InvoiceForm.module.sass"
import {InvoiceWithId, ProductEntity, ProductStatus} from "@/utils/InvoiceManager/Invoice.interfaces"
import StatusBtn from "@/components/screens/Invoice/StatusBtn/StatusBtn"
import React, {useEffect, useRef, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"

export default function InvoiceForm({invoice}: { invoice: InvoiceWithId }) {
    const [products, setProducts] = useState<ProductEntity[]>(invoice.products || [])

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const windowResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener("resize", windowResize)
        windowResize()

        return () => {
            window.removeEventListener("resize", windowResize)
        }
    }, [])

    useEffect(() => {
        if (!invoice.closedAt) {
            setProducts([
                ...(invoice.products || []),
                {article: 0, title: "", count: 1, status: "Assembly"}
            ])
        }
    }, [invoice])

    const formRef = useRef<HTMLFormElement | null>(null)

    useEffect(() => {
        const keyboardControl = (e: KeyboardEvent) => {
            switch (e.code) {
            case "KeyC":
                const firstInput = formRef?.current?.querySelector("input")
                if (firstInput instanceof HTMLInputElement) {
                    firstInput.focus()
                    e.preventDefault()
                }
                break
            default:
                // console.log(e.code)
            }
        }

        document.addEventListener("keydown", keyboardControl)

        return () => document.removeEventListener("keydown", keyboardControl)
    }, [])

    const [invalidFields, setInvalidFields] = useState<number[]>([])

    useEffect(() => {
        if (invoice.closedAt) return

        const invalidIndexes: number[] = products
            .map((product, index) => (product.count < 1 ? index : -1))
            .filter(index => index !== -1)

        setInvalidFields(invalidIndexes)

        if (invalidIndexes.length > 0) return

        InvoiceManager.updateInvoiceProducts(invoice.id, products.filter(value => value.article > 0))
    }, [invoice.closedAt, invoice.id, products])

    const setStatus = (index: number, status: ProductStatus) => {
        if (invoice.closedAt) return

        setProducts(prevProducts =>
            prevProducts.map((product, i) =>
                i === index ? {...product, status} : product
            )
        )
    }

    const handleInputChange = (index: number, field: keyof ProductEntity, value: string | number) => {
        if (invoice.closedAt) return

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

    const tabulationOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const activeElement = document.activeElement

        if (activeElement && activeElement.tagName === "INPUT" && formRef?.current) {
            const inputs = Array.from(formRef.current.querySelectorAll("input"))
            const index = inputs.indexOf(activeElement as HTMLInputElement)

            if (index >= 0 && index < inputs.length - 1) {
                inputs[index + 1].focus()
                e.preventDefault()
            }
        }
    }

    const handleArticleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const activeElement = document.activeElement

        if (activeElement && activeElement.tagName === "INPUT" && formRef?.current) {
            const inputs = Array.from(formRef.current.querySelectorAll("input[name$='-article']")) as HTMLInputElement[]
            const index = inputs.indexOf(activeElement as HTMLInputElement)

            if (e.key === "ArrowUp" && index > 0) {
                inputs[index - 1].focus()
                e.preventDefault()
            } else if (e.key === "ArrowDown" && index < inputs.length - 1) {
                inputs[index + 1].focus()
                e.preventDefault()
            } else if (e.key === "Enter") {
                tabulationOnEnter(e)
            } else if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                e.preventDefault()
            }
        }
    }


    const handleCountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            tabulationOnEnter(e)
        } else if (!/[0-9]/.test(e.key) && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Backspace" && e.key !== "Tab") {
            e.preventDefault()
        }
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    return (
        <form className={styles.form} ref={formRef}>
            <div className={styles.meta}>
                <h2>{invoice.name} | <small>id: {invoice.id}</small></h2>
                <span>Всього позицій: {invoice.products?.length || 0}</span>
                {invoice.closedAt &&
                    <small className={styles.closed}>Closed at: {new Date(invoice.closedAt).toLocaleString()}</small>}
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.namesTable}>
                    <colgroup>
                        <col style={{width: "90px"}}/>
                        <col
                            style={{width: `calc(${windowWidth > 880 ? "min(calc(100vw - 480px), 500px, 100vw)" : "100vw"} - 250px)`}}/>
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
                                        onKeyDown={handleArticleKeyDown}
                                        onFocus={handleInputFocus}
                                        onChange={(e) => handleInputChange(index, "article", e.target.value)}
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
                                        onKeyDown={handleCountKeyDown}
                                        onFocus={handleInputFocus}
                                        onChange={(e) => handleInputChange(index, "count", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <StatusBtn name={`${index}-status`} status={item.status}
                                        setStatus={(status) => setStatus(index, status)}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </form>
    )
}

