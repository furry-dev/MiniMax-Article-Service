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

    const now = new Date()
    const [date, setDate] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime())

    const [pageLimit, setPageLimit] = useState(20)

    useEffect(() => {
        setPageLimit(parseInt(localStorage.getItem("archive_pageLimit") || "20"))
    }, [])

    const formatDateTimeLocal = (timestamp: number) => {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")

        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const formattedDate = formatDateTimeLocal(date)

    const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(new Date(e.target.value).getTime())
    }

    const changePageLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        let limit = parseInt(e.target.value) || 0

        localStorage.setItem("archive_pageLimit", limit.toString())
        setPageLimit(limit)
    }

    return (
        <main className={styles.main}>
            <div className={`${styles.list} ${invoiceId ? styles.activeInvoice : ""}`}>
                <div className={styles.header}>
                    <h1>Архів</h1>
                    <div className={styles.inputs}>
                        <input type="number" value={pageLimit === 0 ? "" : pageLimit} onChange={changePageLimit}
                            min={5} max={100} step={5}/>
                        <input type="datetime-local" name={"closed-date"} onChange={dateChangeHandler}
                            value={formattedDate}/>
                    </div>
                </div>
                <InvoicesList type={"Archive"} closedAt={date} pageLimit={pageLimit}/>
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