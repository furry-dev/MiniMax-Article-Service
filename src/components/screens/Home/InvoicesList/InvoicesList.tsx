"use client"

import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import InvoiceCard from "@/components/screens/Home/InvoicesList/InvoiceCard/InvoiceCard"
import styles from "./InvoicesList.module.sass"
import {useEffect, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"


export default function InvoicesList() {
    const [invoices, setInvoices] = useState<InvoiceWithId[]>([])

    useEffect(() => {
        return InvoiceManager.subscribeToInvoices(setInvoices)
    }, [])

    return (
        <ul className={styles.list}>
            {invoices.map((invoice, index) => (
                <li key={index}>
                    <InvoiceCard invoice={invoice}/>
                </li>
            ))}
        </ul>
    )
}