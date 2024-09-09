"use client"

import styles from "./InvoiceForm.module.sass"
import {InvoiceWithId, ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"
import React, {useEffect, useRef, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import InvoiceMeta from "@/components/forms/InvoiceForm/InvoiceMeta/InvoiceMeta"
import ProductsTable from "@/components/forms/InvoiceForm/ProductsTable/ProductsTable"

export default function InvoiceForm({invoice}: { invoice: InvoiceWithId }) {
    const [products, setProducts] = useState<ProductEntity[]>(invoice.products || [])

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
            case "KeyA":
                if (e.ctrlKey) return
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


    return (
        <form className={styles.form} ref={formRef}>
            <InvoiceMeta invoice={invoice}/>
            <div className={styles.tableContainer}>
                <ProductsTable invoice={invoice} products={products} setProducts={setProducts}
                    invalidFields={invalidFields}/>
            </div>
        </form>
    )
}

