"use client"

import React, {useEffect, useState} from "react"
import InvoicesList from "@/components/lists/InvoicesList/InvoicesList"
import styles from "./Archive.module.sass"
import InvoiceForm from "@/components/forms/InvoiceForm/InvoiceForm"
import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"

function Archive({invoiceId}: { invoiceId?: string }) {
    const [invoice, setInvoice] = useState<InvoiceWithId | null>(null)

    useEffect(() => {
        if (invoiceId) {
            InvoiceManager.getInvoiceById(invoiceId).then(value => {
                if (value) setInvoice(value)
            })
        }
    }, [invoiceId])

    return (
        <main className={styles.main}>
            <div className={`${styles.list} ${invoiceId ? styles.activeInvoice : ""}`}>
                <h1>Архів</h1>
                <InvoicesList type={"Archive"}/>
            </div>
            {invoiceId && (
                <div className={styles.form}>
                    {invoice && <InvoiceForm invoice={invoice}/>}
                </div>
            )}
        </main>
    )
}

export default Archive