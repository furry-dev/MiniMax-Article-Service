"use client"

import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import InvoiceCard from "@/components/cards/InvoiceCard/InvoiceCard"
import styles from "./InvoicesList.module.sass"
import {useEffect, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import Link from "next/link"

const DEFAULT_PAGE_LIMIT = 20

export default function InvoicesList({type, closedAt, pageLimit}: {
    type?: "Archive" | "Opened",
    closedAt?: number,
    pageLimit?: number
}) {
    const [invoices, setInvoices] = useState<InvoiceWithId[]>([])

    useEffect(() => {
        if (type === "Archive") {
            InvoiceManager.getArchive(pageLimit || DEFAULT_PAGE_LIMIT, closedAt).then(value => setInvoices(value))
        } else {
            return InvoiceManager.subscribeToInvoices(setInvoices)
        }
    }, [closedAt, pageLimit, type])

    const loadMoreHandler = () => {
        InvoiceManager.getArchive(pageLimit || DEFAULT_PAGE_LIMIT, invoices[invoices.length - 1].closedAt).then(value => {
            setInvoices(oldInvoices => [...oldInvoices, ...value])
        })
    }

    return (
        <ul className={styles.list}>
            {invoices.map((invoice, index) => (
                <li key={index}>
                    <InvoiceCard invoice={invoice}/>
                </li>
            ))}
            {invoices.length < 1 && <span>Нічого немає...</span>}
            {type !== "Archive" && (<Link className={styles.archiveBtn} href={"/archive"}>Архів</Link>)}
            {type === "Archive" &&
                <button className={styles.loadMoreBtn} onClick={loadMoreHandler}>Завантажити ще...</button>}
        </ul>
    )
}
