import styles from "./InvoiceMeta.module.sass"
import React from "react"
import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"

export default function InvoiceMeta({invoice}: { invoice: InvoiceWithId }) {
    return (
        <div className={styles.meta}>
            <h2>{invoice.name} | <small>id: {invoice.id}</small></h2>
            <span>Всього позицій: {invoice.products?.length || 0}</span>
            {invoice.closedAt &&
                <small className={styles.closed}>Closed at: {new Date(invoice.closedAt).toLocaleString()}</small>}
        </div>
    )
}