"use client"

import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import InvoiceCard from "@/components/cards/InvoiceCard/InvoiceCard"
import styles from "./InvoicesList.module.sass"
import {useEffect, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import Link from "next/link"


export default function InvoicesList({type}: { type?: "Archive" | "Opened" }) {
    const [invoices, setInvoices] = useState<InvoiceWithId[]>([])

    useEffect(() => {
        if (type === "Archive") {
            InvoiceManager.getArchive().then(value => setInvoices(value))
        } else {
            return InvoiceManager.subscribeToInvoices(setInvoices)
        }
    }, [type])

    return (
        <ul className={styles.list}>
            {invoices.map((invoice, index) => (
                <li key={index}>
                    <InvoiceCard invoice={invoice}/>
                </li>
            ))}
            {type !== "Archive" && (<Link className={styles.archiveBtn} href={"/archive"}>Архів</Link>)}
        </ul>
    )
}